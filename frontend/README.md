# Frontend — AbsorptionForecast AI Agent

React 18 + Vite 6 + React Router + Recharts.
Giao diện cho ban kinh doanh theo dõi tốc độ hấp thụ, nạp dữ liệu, và (sắp tới)
xem dự báo & duyệt đề xuất.

**Trạng thái:** MVP1 hoàn thành. Đang chạy trên mock, sẵn sàng nối backend thật.

---

## 1. Chạy nhanh

```bash
docker compose up -d          # từ thư mục gốc repo
# http://localhost:5173       -> frontend
# http://localhost:8000/docs  -> Swagger (đối chiếu field ở đây)
```

Sau khi cài thư viện mới:
```bash
docker compose up -d --build frontend
```

Vite đã proxy `/api` và `/ws` sang `api:8000` (xem `vite.config.js`).
Trong code **chỉ dùng đường dẫn tương đối** `/api/...`, không hardcode host.

---

## 2. Đã làm gì (MVP1)

| Màn | Route | User Story | Thành phần |
|---|---|---|---|
| Dashboard hấp thụ | `/dashboard` | US-003 | `AreaSelector`, `SummaryCards`, `AbsorptionChart` |
| Nạp dữ liệu | `/upload` | — | `UploadDropzone`, `FileStatusTable`, `ValidationErrorPanel` |
| Chat AI (toàn cục) | — | — | `ChatWidget` → gọi **API thật** `/api/v1/chat` |
| Đăng nhập/Đăng ký | — | — | `AuthButtons` (giao diện; auth thật ở MVP3) |

Đã có: responsive (mobile → desktop), polling theo SRS, xử lý lỗi, trạng thái tải.

**Chưa làm:** MVP2 (forecast, cảnh báo, WebSocket) · MVP3 (auth thật, HITL, RBAC).

---

## 3. ⚠️ QUAN TRỌNG CHO BACKEND — Hợp đồng API

Frontend đang gọi các endpoint dưới đây với **đúng tên field này**.
Nếu backend đặt tên khác, báo lại để sửa `src/api/endpoints.js` (một chỗ duy nhất).

### 3.1 Đang dùng (MVP1)

```
GET  /api/areas
→ [{ id, area_name, unit_type, bedrooms, area_sqm, total_units, units_remaining }]

GET  /api/absorption?area_id=&from=&to=&granularity=day
→ [{ stat_date, units_sold, velocity_7d, velocity_30d }]

GET  /api/absorption/summary
→ { units_remaining, units_sold, avg_velocity_30d, updated_at }

POST /api/files/upload        (multipart, field name = "file")
→ { file_id, status }
→ 409 nếu trùng checksum

GET  /api/files
→ [{ id, filename, status, rows_ok, rows_failed, uploaded_at }]
     status ∈ pending | parsing | done | failed

GET  /api/files/{id}/status
→ { status, rows_ok, rows_failed }

GET  /api/files/{id}/errors
→ [{ row_number, column_name, error_code, message }]
```

### 3.2 Đã nối sẵn, dùng API thật

```
POST /api/v1/chat   body { message }  → { response, analysis }
```
`ChatWidget` gọi endpoint này bằng cờ `forceReal` — hoạt động ngay cả khi phần
còn lại đang chạy mock.

### 3.3 Sẽ cần ở MVP2 / MVP3

Đã khai báo sẵn trong `endpoints.js`, chờ backend:

```
POST /api/forecasts/run              → 409 nếu đã chạy trong ngày
GET  /api/forecasts?area_id=
→ { velocity_forecast, ci_lower, ci_upper, sellout_date, confidence_label }
GET  /api/forecasts/{id}             → + points: [{ ds, yhat, yhat_lower, yhat_upper }]
GET  /api/forecasts/{id}/explanation → { content_vi, key_factors, assumptions, model_name }
GET  /api/forecasts/metrics          → [{ area_id, mape }]
GET  /api/alerts?area_id=&severity=
GET  /api/suggestions
GET  /api/settings/alert-threshold · PUT
POST /api/auth/login · refresh · logout · GET /api/auth/me
GET  /api/proposals · GET /api/proposals/{id}
POST /api/proposals/{id}/approve · /reject   (reject BẮT BUỘC có reason)
GET  /api/audit-logs
WS   /ws/forecast-jobs · /ws/proposals
```

### 3.4 Vài điểm cần thống nhất

| Vấn đề | Frontend đang giả định |
|---|---|
| `sellout_date` khi velocity ≈ 0 | Có thể `null` → UI hiện "Chưa xác định" |
| Định dạng ngày | ISO `YYYY-MM-DD` |
| Cấu trúc lỗi | Đọc được cả `{detail}` lẫn `{message}` |
| Upload trùng file | HTTP 409 |
| Access token | Trả trong body, frontend giữ **trong bộ nhớ** (không localStorage) — NFR-S11 |

---

## 4. Cách bật backend thật

Frontend đang chạy trên mock (`src/api/mock.js`). Có 2 cách chuyển:

**Cách 1 — bật toàn bộ** (khi backend xong hết MVP1):
```js
// src/api/client.js
export const USE_MOCK = false;
```

**Cách 2 — bật từng endpoint** (khuyến nghị, dùng khi backend xong dần):
```js
// src/api/endpoints.js
export const listAreas = () => api.get("/areas", { forceReal: true });
```

Khi `USE_MOCK = true`, thanh điều hướng hiện nhãn vàng **"dữ liệu giả"** — nhãn
này tự biến mất khi tắt mock, dùng để tránh nhầm lẫn lúc demo.

---

## 5. Cấu trúc thư mục

```
src/
├── App.jsx                  khung app: thanh nav + router
├── api/
│   ├── client.js            fetch dùng chung · USE_MOCK · forceReal · ApiError
│   ├── endpoints.js         ★ khai báo mọi endpoint — SỬA Ở ĐÂY khi API đổi
│   └── mock.js              backend giả (schema khớp SRS)
├── styles/tokens.js         ★ màu, cỡ chữ, khoảng cách, layout — SỬA Ở ĐÂY khi đổi UI
├── hooks/useBreakpoint.js   responsive (inline style không dùng được @media)
├── components/              mảnh giao diện, CHỈ nhận props và vẽ
└── pages/                   trang, lo lấy dữ liệu + state
```

**Quy ước kiến trúc** (giữ giúp khi đóng góp code):
- Component **không tự fetch** — chỉ page mới gọi API
- Không viết thẳng mã màu / cỡ chữ — lấy từ `tokens.js`
- Không hardcode host — luôn `/api/...`

---

## 6. Thêm màn hình mới — 5 bước

1. Thêm hàm vào `src/api/endpoints.js`
2. Thêm route giả vào `src/api/mock.js`
3. Viết component trong `src/components/` (chỉ nhận props)
4. Viết page trong `src/pages/` (lấy dữ liệu + state)
5. Gắn `<Route>` và mục nav trong `src/App.jsx`

---

## 7. Ràng buộc UI bắt buộc (theo SRS)

Người làm MVP2/MVP3 lưu ý:

- **FR-007** — mọi dự báo phải hiển thị **khoảng tin cậy 90%**. Không bao giờ vẽ
  đường dự báo trần.
- **FR-008** — badge cảnh báo khi `confidence_label === "low"`.
- **FR-015** — từ chối đề xuất **bắt buộc nhập lý do**.
- **NFR-S2** — ẩn nút theo vai trò chỉ để gọn UI, **không phải bảo mật**. Backend
  phải chặn thật.
- Giả định của dự báo (`assumptions`) phải hiển thị rõ cho người duyệt.

---

## 8. Kiểm tra trước khi push

```bash
make build-frontend        # CI chạy lệnh này, phải xanh
```
- Mở Console (F12) — không có lỗi đỏ
- Thử ở **1366px** và **375px** (F12 → Ctrl+Shift+M)

> Repo chưa cài test runner cho frontend. Nếu bổ sung, khuyến nghị Vitest +
> React Testing Library.

---

## 9. Liên hệ

**Frontend:** Đặng Tiến Thành — US-003 (xong), US-004 (MVP2), US-011 (MVP3).

Cần từ backend: xác nhận tên field mục 3, thông báo khi endpoint nào sẵn sàng.
Cần từ MLOps/QA: `mape` theo phân khu, `confidence_label`, ngưỡng "dữ liệu không đủ"
— để hiển thị chỉ báo độ tin cậy ở MVP2.

Tài liệu kiến trúc chi tiết: `docs/FRONTEND_MVP1_GUIDE.md`
