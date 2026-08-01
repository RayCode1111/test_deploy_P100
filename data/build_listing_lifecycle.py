"""
build_listing_lifecycle.py
--------------------------
Dựng bảng VÒNG ĐỜI của từng tin rao từ các snapshot hằng ngày.
Đây là DATASET ĐỂ TRAIN MÔ HÌNH dự báo "bao lâu thì bán được".

Khác gì build_absorption.py?
  - build_absorption.py  -> tổng hợp theo phân khu x ngày (chuỗi thời gian, cho Prophet)
  - file này             -> mỗi dòng = 1 tin, kèm nhãn "bán sau bao nhiêu ngày"
                            (cho mô hình hồi quy / survival analysis)

Cột đầu ra quan trọng:
  list_date        : ngày đăng tin (từ API)
  first_seen       : ngày đầu tiên ta cào thấy tin này
  last_seen        : ngày cuối cùng còn thấy
  days_on_market   : last_seen - list_date  (tuổi tin tính từ lúc đăng)
  days_observed    : last_seen - first_seen (ta quan sát được bao lâu)
  is_gone          : tin đã biến mất chưa (True = proxy ĐÃ BÁN, dùng làm nhãn)
  is_censored      : True nếu tin vẫn còn -> chưa biết bán lúc nào (dữ liệu bị kiểm duyệt)

LƯU Ý THỐNG KÊ (quan trọng khi train):
  Tin CHƯA biến mất = "censored" - ta chỉ biết nó sống ÍT NHẤT X ngày, chưa biết tổng.
  Nếu bỏ hết tin censored đi sẽ làm mô hình ước lượng LỆCH (thiên về tin bán nhanh).
  Cách đúng: dùng survival analysis (Kaplan-Meier / Cox), hoặc ít nhất
  ghi rõ giới hạn này trong báo cáo.

CÁCH DÙNG:
    python build_listing_lifecycle.py --data ./data --out listings_lifecycle.csv
"""
import argparse
from pathlib import Path
import pandas as pd


def load_snapshots(data_dir: str) -> pd.DataFrame:
    files = sorted(Path(data_dir).glob("chotot_*_*.parquet"))
    if not files:
        raise SystemExit(f"Không thấy snapshot nào trong {data_dir}")
    df = pd.concat([pd.read_parquet(f) for f in files], ignore_index=True)
    df["snapshot_date"] = pd.to_datetime(df["snapshot_date"])
    if "list_date" in df.columns:
        df["list_date"] = pd.to_datetime(df["list_date"], errors="coerce")
    return df


def build_lifecycle(df: pd.DataFrame) -> pd.DataFrame:
    last_crawl = df["snapshot_date"].max()

    # gộp theo từng tin: lần đầu / lần cuối nhìn thấy + thuộc tính tin
    agg = {
        "snapshot_date": ["min", "max", "count"],
        "list_date": "first",
        "subject": "first",
        "price": "first",
        "size": "first",
        "rooms": "first",
        "area_name": "first",
        "region_name": "first",
        "property_type": "first",
    }
    agg = {k: v for k, v in agg.items() if k in df.columns}
    g = df.groupby("ad_id").agg(agg)
    g.columns = ["_".join(c).rstrip("_") if isinstance(c, tuple) else c
                 for c in g.columns]
    g = g.rename(columns={
        "snapshot_date_min": "first_seen",
        "snapshot_date_max": "last_seen",
        "snapshot_date_count": "times_seen",
    })
    g = g.rename(columns={c: c.replace("_first", "") for c in g.columns
                          if c.endswith("_first")})
    g = g.reset_index()

    # tin còn xuất hiện ở lần cào cuối cùng => VẪN CÒN (censored)
    g["is_gone"] = g["last_seen"] < last_crawl
    g["is_censored"] = ~g["is_gone"]

    # số ngày quan sát được
    g["days_observed"] = (g["last_seen"] - g["first_seen"]).dt.days

    # tuổi tin tính từ ngày đăng (dùng làm nhãn thời gian bán)
    if "list_date" in g.columns:
        g["days_on_market"] = (g["last_seen"] - g["list_date"]).dt.days
        g.loc[g["days_on_market"] < 0, "days_on_market"] = None
    # nhãn cho mô hình: chỉ tin đã biến mất mới có "thời gian tới khi bán"
    g["days_to_sell"] = g["days_on_market"].where(g["is_gone"])

    for c in ["first_seen", "last_seen", "list_date"]:
        if c in g.columns:
            g[c] = g[c].dt.strftime("%Y-%m-%d")
    return g


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--data", default="./data")
    p.add_argument("--out", default="./listings_lifecycle.csv")
    args = p.parse_args()

    df = load_snapshots(args.data)
    life = build_lifecycle(df)
    life.to_csv(args.out, index=False)

    n_gone = int(life["is_gone"].sum())
    n_cens = int(life["is_censored"].sum())
    print(f"Tổng số tin theo dõi : {len(life)}")
    print(f"  đã biến mất (proxy bán): {n_gone}")
    print(f"  còn trên sàn (censored): {n_cens}")
    if n_gone:
        print(f"  days_to_sell trung vị  : {life['days_to_sell'].median()} ngày")
    print(f"Đã lưu -> {args.out}")


if __name__ == "__main__":
    main()
