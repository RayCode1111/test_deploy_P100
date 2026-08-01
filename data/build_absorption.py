"""
build_absorption.py
-------------------
Biến các SNAPSHOT hằng ngày (do chotot_scraper.py tạo) thành chuỗi thời gian:
  - inventory   : số tin đang rao (tồn kho) theo phân khu x ngày
  - disappeared : số tin biến mất so với ngày trước = PROXY "đã bán"
  - absorption  : tỉ lệ biến mất / tồn kho hôm trước

Ý tưởng cốt lõi (đây là phần "thông minh"):
  Một ad_id có mặt hôm qua nhưng KHÔNG có mặt hôm nay  ->  nhiều khả năng đã bán.
  CẢNH BÁO: biến mất != chắc chắn bán (có thể gỡ/hết hạn/sửa tin).
  Đây là proxy có nhiễu -> phải ghi vào phần "độ tin cậy dữ liệu".

CÁCH DÙNG:
    python build_absorption.py --data ./data --group area_name
"""
import argparse
from pathlib import Path
import pandas as pd


def load_snapshots(data_dir: str) -> pd.DataFrame:
    files = sorted(Path(data_dir).glob("chotot_*_*.parquet"))
    if not files:
        raise SystemExit(f"Không thấy snapshot nào trong {data_dir}")
    frames = [pd.read_parquet(f) for f in files]
    df = pd.concat(frames, ignore_index=True)
    df["snapshot_date"] = pd.to_datetime(df["snapshot_date"])
    return df


def build(df: pd.DataFrame, group_col: str) -> pd.DataFrame:
    """Tính tồn kho + số tin biến mất (proxy bán) theo group_col x ngày."""
    dates = sorted(df["snapshot_date"].unique())
    # tập ad_id đang active theo (group, ngày)
    active = {
        d: df[df["snapshot_date"] == d].groupby(group_col)["ad_id"].apply(set)
        for d in dates
    }
    records = []
    for i, d in enumerate(dates):
        for grp, ids_today in active[d].items():
            inv = len(ids_today)
            disappeared = new = None
            if i > 0:
                prev = active[dates[i - 1]].get(grp, set())
                disappeared = len(prev - ids_today)   # có hôm qua, mất hôm nay -> bán
                new = len(ids_today - prev)            # tin mới lên sàn
            records.append({
                "date": pd.Timestamp(d).strftime("%Y-%m-%d"),
                "segment": grp,
                "inventory": inv,
                "sold_proxy": disappeared,
                "new_listings": new,
            })
    out = pd.DataFrame(records)
    # tốc độ hấp thụ = tin biến mất / tồn kho ngày trước
    out["prev_inventory"] = out.groupby("segment")["inventory"].shift(1)
    out["absorption_rate"] = (out["sold_proxy"] / out["prev_inventory"]).round(3)
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--data", default="./data")
    p.add_argument("--group", default="area_name",
                   help="cột phân khu: area_name / region_name / property_type")
    p.add_argument("--out", default="./absorption_timeseries.csv")
    args = p.parse_args()

    df = load_snapshots(args.data)
    ts = build(df, args.group)
    ts.to_csv(args.out, index=False)
    print(f"Đã tạo chuỗi hấp thụ: {len(ts)} dòng -> {args.out}")
    print(ts.to_string(index=False))


if __name__ == "__main__":
    main()
