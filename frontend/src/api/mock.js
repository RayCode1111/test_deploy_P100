// frontend/src/api/mock.js
// ---------------------------------------------------------------------------
// BACKEND GIẢ (mock) — trả về dữ liệu ĐÚNG SCHEMA của SRS.
// Khi backend thật xong: mở client.js, đổi USE_MOCK = false.
//
// CHẶNG 3 bổ sung: upload file + giả lập quá trình parse chuyển trạng thái
// pending -> parsing -> done/failed theo thời gian thật, để bạn kiểm thử được
// luồng polling 3 giây của UploadPage.
// ---------------------------------------------------------------------------

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// ---- Dữ liệu phân khu mẫu: 1 bán chạy / 1 bán chậm / 1 nhiễu
const AREAS = [
  { id: "a1", area_name: "Phân khu A", unit_type: "2PN", bedrooms: 2, area_sqm: 61, total_units: 120, units_remaining: 34 },
  { id: "a2", area_name: "Phân khu A", unit_type: "3PN", bedrooms: 3, area_sqm: 86, total_units: 80,  units_remaining: 61 },
  { id: "a3", area_name: "Phân khu C", unit_type: "Studio", bedrooms: 1, area_sqm: 31, total_units: 50, units_remaining: 44 },
];

function makeSeries(areaId, days = 90) {
  const base = { a1: 4.2, a2: 0.6, a3: 2.1 }[areaId] ?? 2;
  const out = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const wobble = Math.sin(i / 7) * base * 0.25 + (Math.random() - 0.5) * base * 0.2;
    const v7 = Math.max(0, +(base + wobble).toFixed(2));
    out.push({
      stat_date: d.toISOString().slice(0, 10),
      units_sold: Math.max(0, Math.round(v7 / 7 + (Math.random() < 0.3 ? 0 : 0.5))),
      velocity_7d: v7,
      velocity_30d: +(base + wobble * 0.4).toFixed(2),
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// KHO FILE UPLOAD (giữ trong bộ nhớ trình duyệt, mất khi F5 — đủ để thử luồng)
// ---------------------------------------------------------------------------
let fileSeq = 100;
const FILES = [
  {
    id: "f1", filename: "ban_hang_thang_6.xlsx", status: "done",
    rows_ok: 1240, rows_failed: 0,
    uploaded_at: new Date(Date.now() - 86400000).toISOString(),
    _startedAt: 0,
  },
];

// Lỗi validate mẫu — khớp ValidationService trong SRS §5.2
const SAMPLE_ERRORS = [
  { row_number: 14,  column_name: "sold_date",   error_code: "INVALID_DATE",   message: "Sai định dạng ngày, cần YYYY-MM-DD" },
  { row_number: 27,  column_name: "units_sold",  error_code: "NEGATIVE_VALUE", message: "Số căn bán không được âm" },
  { row_number: 58,  column_name: "area_name",   error_code: "UNKNOWN_AREA",   message: "Phân khu không tồn tại trong hệ thống" },
  { row_number: 102, column_name: "units_sold",  error_code: "MISSING_FIELD",  message: "Thiếu giá trị bắt buộc" },
  { row_number: 133, column_name: "sold_date",   error_code: "DUPLICATE_ROW",  message: "Trùng khoá (phân khu, ngày) với dòng 131" },
];

/** Giả lập tiến trình parse: 0–2s pending, 2–6s parsing, sau 6s done. */
function computeFileState(f) {
  if (!f._startedAt) return f;                    // file cũ, đã xong sẵn
  const elapsed = Date.now() - f._startedAt;
  if (elapsed < 2000) return { ...f, status: "pending",  rows_ok: 0, rows_failed: 0 };
  if (elapsed < 6000) {
    const pct = (elapsed - 2000) / 4000;
    return { ...f, status: "parsing", rows_ok: Math.round(1315 * pct), rows_failed: Math.round(5 * pct) };
  }
  return { ...f, status: "done", rows_ok: 1310, rows_failed: 5 };
}

// ---------------------------------------------------------------------------
const routes = [
  { match: (p) => p === "/areas", handler: () => AREAS },

  {
    match: (p) => p.startsWith("/absorption/summary"),
    handler: () => ({
      units_remaining: AREAS.reduce((s, a) => s + a.units_remaining, 0),
      units_sold: AREAS.reduce((s, a) => s + (a.total_units - a.units_remaining), 0),
      avg_velocity_30d: 2.3,
      updated_at: new Date().toISOString(),
    }),
  },

  {
    match: (p) => p.startsWith("/absorption"),
    handler: (path) => {
      const areaId = new URLSearchParams(path.split("?")[1] || "").get("area_id") || "a1";
      return makeSeries(areaId);
    },
  },

  // --- Upload ---
  {
    match: (p) => p === "/files/upload",
    method: "POST",
    handler: (_path, { body }) => {
      const file = body instanceof FormData ? body.get("file") : null;
      const name = file?.name || "khong_ro.xlsx";

      // Chặn trùng bằng tên (backend thật dùng checksum SHA-256)
      if (FILES.some((f) => f.filename === name)) {
        const err = new Error("File này đã được nạp trước đó (trùng checksum)");
        err.status = 409;
        throw err;
      }
      const rec = {
        id: `f${++fileSeq}`,
        filename: name,
        status: "pending",
        rows_ok: 0,
        rows_failed: 0,
        uploaded_at: new Date().toISOString(),
        _startedAt: Date.now(),
      };
      FILES.unshift(rec);
      return { file_id: rec.id, status: rec.status };
    },
  },

  {
    match: (p) => /^\/files\/[^/]+\/status$/.test(p),
    handler: (path) => {
      const id = path.split("/")[2];
      const f = FILES.find((x) => x.id === id);
      if (!f) { const e = new Error("Không tìm thấy file"); e.status = 404; throw e; }
      const s = computeFileState(f);
      return { status: s.status, rows_ok: s.rows_ok, rows_failed: s.rows_failed };
    },
  },

  {
    match: (p) => /^\/files\/[^/]+\/errors$/.test(p),
    handler: (path) => {
      const id = path.split("/")[2];
      const f = FILES.find((x) => x.id === id);
      if (!f) return [];
      const s = computeFileState(f);
      return s.rows_failed > 0 ? SAMPLE_ERRORS : [];
    },
  },

  {
    match: (p) => p === "/files",
    handler: () => FILES.map(computeFileState).map(({ _startedAt, ...rest }) => rest),
  },
];

export async function mockFetch(path, { method = "GET", body } = {}) {
  await delay();
  const route = routes.find(
    (r) => r.match(path) && (!r.method || r.method === method)
  );
  if (!route) {
    const err = new Error(`[mock] Chưa khai báo route: ${method} ${path}`);
    err.status = 404;
    throw err;
  }
  return route.handler(path, { method, body });
}