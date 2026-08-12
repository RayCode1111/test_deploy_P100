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

// ---------- Chọn ngữ cảnh nạp dữ liệu: Dự án → Phân khu ----------
/** Danh sách dự án của chủ đầu tư.
 *  -> [{ id, name, location, zone_count, total_units, sold_pct, status }] */
export const listProjects = () => api.get("/projects");

/** Các phân khu trong 1 dự án.
 *  -> [{ id, name, total_units, units_remaining, status }] */
export const listProjectZones = (projectId) => api.get(`/projects/${projectId}/zones`);

// ---------- Absorption Dashboard (MVP1) ----------
/** KPI tổng hợp -> { total_units, units_sold, remaining_units, absorption_rate, avg_velocity, updated_at } */
export const getDashboardSummary = ({ projectId, areaId, from, to } = {}) => {
  const q = new URLSearchParams();
  if (projectId) q.set("project_id", projectId);
  if (areaId) q.set("area_id", areaId);
  if (from) q.set("from", from);
  if (to) q.set("to", to);
  return api.get(`/dashboard/summary?${q}`);
};

/** Chuỗi trend 3 series -> [{ date, units_sold, cumulative_sold, absorption_rate }] */
export const getDashboardTrend = ({ projectId, areaId, from, to } = {}) => {
  const q = new URLSearchParams();
  if (projectId) q.set("project_id", projectId);
  if (areaId) q.set("area_id", areaId);
  if (from) q.set("from", from);
  if (to) q.set("to", to);
  return api.get(`/dashboard/trend?${q}`);
};

/** So sánh + bảng chi tiết area -> [{ id, name, total_units, sold, remaining, absorption_rate, velocity, latest_data, status }] */
export const getDashboardAreas = ({ projectId } = {}) =>
  api.get(`/dashboard/areas${projectId ? `?project_id=${projectId}` : ""}`);

/** Chất lượng dữ liệu -> { latest_data, source, date_range, error_records, status, warnings } */
export const getDataQuality = ({ projectId } = {}) =>
  api.get(`/dashboard/data-quality${projectId ? `?project_id=${projectId}` : ""}`);

// ---------- Chi tiết dự án + Xếp hạng khả năng bán ----------
/** Thông tin 1 dự án -> { id, name, location, zone_count, total_units, sold_pct, status, launch_date } */
export const getProject = (projectId) => api.get(`/projects/${projectId}`);

/** Xếp hạng khả năng bán từng căn trong 1 phân khu (bài toán lõi).
 *  -> [{ unit_code, unit_type, area_sqm, score, band }]  band ∈ high|medium|low
 *  AI: thay bằng model thật; frontend chỉ hiển thị score + band. */
export const getUnitRanking = (areaId) => api.get(`/areas/${areaId}/ranking`);