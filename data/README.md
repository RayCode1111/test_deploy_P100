# Thu thập dữ liệu BĐS Nhà Tốt (Chợ Tốt) → chuỗi hấp thụ

Pipeline 2 bước cho đồ án dự báo tốc độ hấp thụ:

1. `chotot_scraper.py` — chạy **mỗi ngày**, lưu 1 snapshot tin đang bán.
2. `build_absorption.py` — gộp các snapshot → tồn kho & tốc độ hấp thụ theo thời gian.

## Cài đặt
```bash
pip install requests pandas pyarrow
```

## Bước 0 — Lấy mã `region` và `cg` (làm 1 lần)
1. Mở https://www.nhatot.com, vào đúng trang lọc bạn cần (VD: căn hộ ở Hà Nội).
2. F12 → tab **Network** → lọc **Fetch/XHR** → tải lại trang.
3. Tìm request tới `gateway.chotot.com/v1/public/ad-listing`.
4. Đọc query string: `region_v2=...` (tỉnh/thành) và `cg=...` (danh mục con).
   Ghi lại 2 số này. (Tham khảo: 13000≈Hà Nội, 12000≈TP.HCM, cg 1010≈căn hộ/chung cư —
   NHƯNG hãy tự xác nhận bằng F12 vì mã có thể đổi.)

## Bước 1 — Cào snapshot hằng ngày
```bash
python chotot_scraper.py --region 13000 --cg 1010 --max-pages 30 --out .
```
Tạo ra:
- `data/chotot_<region>_<cg>_<YYYY-MM-DD>.parquet` — snapshot ngày đó
- `logs/run_log.jsonl` — nhật ký mỗi lần chạy (số trang, số tin, lỗi, thời gian)
  → dùng cho audit + kiểm soát chi phí.

### Cho chạy tự động mỗi ngày
- **macOS/Linux (cron)** — chạy 6h sáng hằng ngày:
  ```
  0 6 * * *  cd /duong/dan/chotot && /usr/bin/python3 chotot_scraper.py --region 13000 --cg 1010 >> logs/cron.log 2>&1
  ```
- **Windows**: Task Scheduler → Create Task → trigger Daily → action chạy `python chotot_scraper.py ...`

> Bắt đầu chạy CÀNG SỚM CÀNG TỐT để tích đủ vài tuần dữ liệu trước khi demo.

## Bước 2 — Dựng chuỗi hấp thụ (sau khi có ≥2 ngày snapshot)
```bash
python build_absorption.py --data ./data --group area_name
```
Tạo `absorption_timeseries.csv` với các cột: `date, segment, inventory, sold_proxy,
new_listings, absorption_rate`. Đây là input cho mô hình dự báo (Prophet…).

Đổi `--group` sang `property_type` hoặc `region_name` để cắt theo chiều khác.

## Bước 3 — Bảng vòng đời từng tin (dataset để TRAIN mô hình)
```bash
python build_listing_lifecycle.py --data ./data --out listings_lifecycle.csv
```
Mỗi dòng = 1 tin, kèm:
- `list_date` — ngày đăng (từ API)
- `first_seen` / `last_seen` — ngày đầu/cuối ta cào thấy
- `days_on_market` — số ngày tin nằm trên sàn (tính từ ngày đăng)
- `is_gone` — đã biến mất chưa (proxy ĐÃ BÁN)
- `days_to_sell` — **nhãn để train**: bán sau bao nhiêu ngày (chỉ có ở tin đã biến mất)
- `is_censored` — tin còn trên sàn, chưa biết bán lúc nào

### ⚠ Bẫy thống kê: censoring
Tin **chưa** biến mất chỉ cho biết nó sống *ít nhất* X ngày, chưa biết tổng.
Nếu bỏ hết tin censored để train → mô hình **lệch về phía tin bán nhanh**
(vì tin bán chậm bị loại nhiều hơn). Xử lý đúng:
- dùng **survival analysis** (Kaplan-Meier, Cox PH — thư viện `lifelines`), hoặc
- ít nhất ghi rõ giới hạn này trong phần độ tin cậy dữ liệu.

## Ghi chú độ tin cậy dữ liệu (mentor sẽ hỏi)
- `sold_proxy` = tin biến mất. Biến mất **không chắc chắn** là đã bán — có thể
  gỡ tin, hết hạn, hoặc sửa/đăng lại (đổi ad_id). Đây là proxy có nhiễu.
- Cải thiện: theo dõi thêm; coi tin biến mất rồi xuất hiện lại là "đăng lại"
  chứ không phải bán; đối chiếu với số liệu vĩ mô (Bộ Xây dựng/VARS) để hiệu chỉnh.
- Snapshot mỗi ngày 1 lần nên độ phân giải là NGÀY; tin lên–xuống trong ngày sẽ bị bỏ sót.

## Đạo đức & pháp lý
- Kiểm tra `robots.txt` và Điều khoản sử dụng trước khi chạy.
- Giữ delay lịch sự, không đa luồng, cache lại.
- KHÔNG lưu số điện thoại/thông tin liên hệ cá nhân người bán.
- Dùng cho mục đích học thuật; ghi rõ nguồn nếu công bố.
