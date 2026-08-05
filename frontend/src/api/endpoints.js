// frontend/src/api/endpoints.js
// ---------------------------------------------------------------------------
// MỘT nơi duy nhất khai báo mọi lời gọi API, khớp SRS mục 6.
// Backend đổi đường dẫn / tên field -> chỉ sửa Ở ĐÂY, không lục từng component.
//
// Chặng này chỉ khai MVP 1. MVP 2 (forecast/alerts) và MVP 3 (auth/HITL)
// sẽ bổ sung sau, không phải viết lại.
// ---------------------------------------------------------------------------
import { api } from "./client";

// ---------- MVP 1: Data → Dashboard ----------

export const health = () => api.get("/health");

/** Danh sách phân khu / loại căn.
 *  -> [{ id, area_name, unit_type, bedrooms, area_sqm, total_units, units_remaining }] */
export const listAreas = () => api.get("/areas");

/** Chuỗi tốc độ hấp thụ theo thời gian của 1 phân khu.
 *  -> [{ stat_date, units_sold, velocity_7d, velocity_30d }] */
export function getAbsorption({ areaId, from, to, granularity = "day" }) {
  const q = new URLSearchParams({ area_id: areaId, from, to, granularity });
  return api.get(`/absorption?${q}`);
}

/** Tổng hợp toàn dự án cho các thẻ số liệu.
 *  -> { units_remaining, units_sold, avg_velocity_30d, updated_at } */
export const getAbsorptionSummary = () => api.get("/absorption/summary");

/** Lịch sử upload file.
 *  -> [{ id, filename, status, rows_ok, rows_failed, uploaded_at }] */
export const listFiles = () => api.get("/files");

/** Upload Excel/CSV (multipart). file: File từ <input type="file">. */
export function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  return api.post("/files/upload", fd);
}

/** Trạng thái parse của 1 file -> { status, rows_ok, rows_failed } */
export const fileStatus = (id) => api.get(`/files/${id}/status`);

/** Lỗi validate theo dòng -> [{ row_number, column_name, message }] */
export const fileErrors = (id) => api.get(`/files/${id}/errors`);

// ---------- AI Agent chat (backend ĐÃ có sẵn) ----------
/** Gửi câu hỏi tới AI agent.
 *  POST /api/v1/chat  body { message }  ->  { response, analysis }
 *  forceReal: true vì endpoint này backend đã chạy thật, không cần mock. */
export const chatWithAgent = (message) =>
  api.post("/v1/chat", { message }, { forceReal: true });