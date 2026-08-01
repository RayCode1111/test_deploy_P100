"""
chotot_scraper.py
-----------------
Thu thập tin rao bán bất động sản từ API công khai của Nhà Tốt (Chợ Tốt)
và lưu SNAPSHOT theo từng ngày, để về sau dựng chuỗi thời gian tồn kho /
tốc độ hấp thụ theo phân khu x loại căn.

Chạy MỖI NGÀY (cron/Task Scheduler). Mỗi lần chạy = 1 ảnh chụp thị trường.
Theo dõi ad_id xuất hiện/biến mất giữa các ngày -> suy ra bán / tồn kho.

CÁCH DÙNG:
    python chotot_scraper.py --region 13000 --cg 1010 --max-pages 30

  --region : mã tỉnh/thành (13000 = Hà Nội, 12000 = TP.HCM). Tự kiểm bằng F12.
  --cg     : mã danh mục con (căn hộ/chung cư ~ 1010). Tự kiểm bằng F12.
  --max-pages: chặn trên số trang mỗi lần chạy (kiểm soát chi phí/thời gian).

LƯU Ý ĐẠO ĐỨC & PHÁP LÝ:
  - Kiểm tra robots.txt và Điều khoản sử dụng của trang trước khi chạy.
  - Đặt delay lịch sự (mặc định 1.5s), KHÔNG chạy song song nhiều luồng.
  - KHÔNG lưu số điện thoại / thông tin liên hệ cá nhân của người bán.
  - Dùng cho mục đích học thuật; ghi rõ nguồn nếu công bố.
"""

import argparse
import json
import logging
import random
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

import pandas as pd
import requests

# ----------------------------------------------------------------------------
# Cấu hình mặc định
# ----------------------------------------------------------------------------
BASE_URL = "https://gateway.chotot.com/v1/public/ad-listing"
PAGE_SIZE = 20            # số tin mỗi trang (limit)
DELAY_SECONDS = 1.5       # nghỉ giữa các request (lịch sự với server)
MAX_RETRIES = 4           # số lần thử lại khi lỗi mạng
TIMEOUT = 20              # timeout mỗi request (giây)

# Múi giờ VN để đóng dấu ngày snapshot cho đúng
VN_TZ = timezone(timedelta(hours=7))

# Các trường ta GIỮ LẠI (bỏ qua số điện thoại/liên hệ cá nhân)
KEEP_FIELDS = [
    "ad_id", "list_id", "list_time", "subject",
    "price", "price_string",
    "size", "rooms", "toilets", "floors", "direction", "property_type",
    "category", "category_name",
    "area", "area_name", "region", "region_name", "ward", "ward_name",
    "type", "company_ad",
]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[logging.StreamHandler()],
)
log = logging.getLogger("chotot")


# ----------------------------------------------------------------------------
# Tầng lấy dữ liệu (network) — có retry + backoff
# ----------------------------------------------------------------------------
def make_session() -> requests.Session:
    """Một session dùng lại kết nối + header trông giống trình duyệt thật."""
    s = requests.Session()
    s.headers.update({
        "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/124.0 Safari/537.36"),
        "Accept": "application/json",
    })
    return s


def fetch_page(session, region, cg, offset):
    """Gọi 1 trang API. Trả về dict JSON, hoặc raise sau khi hết lần thử."""
    params = {
        "region_v2": region,
        "cg": cg,
        "o": offset,        # offset phân trang
        "limit": PAGE_SIZE,
        "st": "s",          # tin bán
        "f": "p",
    }
    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            r = session.get(BASE_URL, params=params, timeout=TIMEOUT)
            if r.status_code == 200:
                return r.json()
            # 429 = bị giới hạn tốc độ -> lùi lâu hơn
            wait = (2 ** attempt) + random.uniform(0, 1)
            log.warning("HTTP %s tại offset %s, thử lại sau %.1fs (lần %d)",
                        r.status_code, offset, wait, attempt)
            time.sleep(wait)
        except requests.RequestException as e:
            last_err = e
            wait = (2 ** attempt) + random.uniform(0, 1)
            log.warning("Lỗi mạng: %s — thử lại sau %.1fs (lần %d)",
                        e, wait, attempt)
            time.sleep(wait)
    raise RuntimeError(f"Thất bại tại offset {offset}: {last_err}")


# ----------------------------------------------------------------------------
# Tầng chuẩn hoá — biến JSON thô thành dòng dữ liệu sạch
# ----------------------------------------------------------------------------
def normalize_ad(ad: dict, snapshot_date: str) -> dict:
    """Lấy các trường cần, thêm dấu thời gian snapshot. Giữ raw để không mất data."""
    row = {k: ad.get(k) for k in KEEP_FIELDS}
    row["snapshot_date"] = snapshot_date
    # đổi list_time (epoch ms) sang ngày đăng cho dễ đọc
    lt = ad.get("list_time")
    if isinstance(lt, (int, float)):
        list_dt = datetime.fromtimestamp(lt / 1000, VN_TZ)
        row["list_date"] = list_dt.strftime("%Y-%m-%d")
        # days_on_market: tin này đã nằm trên sàn bao nhiêu ngày tính tới lúc cào
        # -> đặc trưng (feature) quan trọng để train mô hình
        snap_dt = datetime.strptime(snapshot_date, "%Y-%m-%d").replace(tzinfo=VN_TZ)
        row["days_on_market"] = max((snap_dt.date() - list_dt.date()).days, 0)
    else:
        row["list_date"] = None
        row["days_on_market"] = None
    return row


# ----------------------------------------------------------------------------
# Điều phối — cào toàn bộ, lưu snapshot + run-log (phục vụ audit/chi phí)
# ----------------------------------------------------------------------------
def scrape(region, cg, max_pages, out_dir, session=None):
    session = session or make_session()
    now = datetime.now(VN_TZ)
    snapshot_date = now.strftime("%Y-%m-%d")

    rows, seen_ids = [], set()
    total_reported = None
    pages_done = 0
    error = None

    try:
        for page in range(max_pages):
            offset = page * PAGE_SIZE
            data = fetch_page(session, region, cg, offset)
            if total_reported is None:
                total_reported = data.get("total")
                log.info("Tổng tin server báo có: %s", total_reported)

            ads = data.get("ads", [])
            if not ads:
                log.info("Hết tin ở trang %d — dừng.", page)
                break

            for ad in ads:
                aid = ad.get("ad_id")
                if aid in seen_ids:      # tránh trùng trong cùng một lần cào
                    continue
                seen_ids.add(aid)
                rows.append(normalize_ad(ad, snapshot_date))

            pages_done += 1
            log.info("Trang %d: +%d tin (cộng dồn %d)", page, len(ads), len(rows))
            time.sleep(DELAY_SECONDS)   # lịch sự
    except Exception as e:              # noqa: BLE001 - ghi lỗi rồi vẫn lưu phần đã có
        error = str(e)
        log.error("Dừng sớm do lỗi: %s", error)

    # --- Lưu snapshot ---
    out_dir = Path(out_dir)
    snap_dir = out_dir / "data"
    snap_dir.mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame(rows)
    out_file = snap_dir / f"chotot_{region}_{cg}_{snapshot_date}.parquet"
    if not df.empty:
        df.to_parquet(out_file, index=False)
    log.info("Đã lưu %d dòng -> %s", len(df), out_file)

    # --- Ghi run-log (đây chính là "AI/Data Log" phục vụ audit + kiểm soát chi phí) ---
    log_dir = out_dir / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    run_log = {
        "run_at": now.isoformat(),
        "snapshot_date": snapshot_date,
        "region": region, "cg": cg,
        "pages_fetched": pages_done,
        "ads_collected": len(df),
        "total_reported_by_server": total_reported,
        "delay_seconds": DELAY_SECONDS,
        "status": "error" if error else "ok",
        "error": error,
        "output_file": str(out_file) if not df.empty else None,
    }
    with open(log_dir / "run_log.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps(run_log, ensure_ascii=False) + "\n")
    log.info("Run-log: %s", run_log)
    return df, run_log


def main():
    p = argparse.ArgumentParser(description="Scraper BĐS Nhà Tốt (Chợ Tốt)")
    p.add_argument("--region", default="13000", help="mã tỉnh/thành (F12 để lấy)")
    p.add_argument("--cg", default="1010", help="mã danh mục con (F12 để lấy)")
    p.add_argument("--max-pages", type=int, default=30, help="chặn trên số trang")
    p.add_argument("--out", default=".", help="thư mục lưu (mặc định: hiện tại)")
    args = p.parse_args()
    scrape(args.region, args.cg, args.max_pages, args.out)


if __name__ == "__main__":
    main()
