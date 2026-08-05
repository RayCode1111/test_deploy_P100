// frontend/src/styles/tokens.js
// ---------------------------------------------------------------------------
// HỆ THỐNG THIẾT KẾ dùng chung. Mọi component lấy màu/cỡ chữ từ đây, KHÔNG tự
// bịa mã màu. Nhờ vậy toàn app trông nhất quán, và đổi màu chỉ sửa 1 chỗ.
//
// Định hướng: dashboard nghiệp vụ cho ban kinh doanh — cần đọc nhanh, tin cậy,
// không màu mè. Nền xám rất nhạt, thẻ trắng, một màu nhấn xanh mực cho dữ liệu;
// màu cảnh báo chỉ dùng cho trạng thái, không dùng để trang trí.
// ---------------------------------------------------------------------------

export const color = {
  // nền & bề mặt
  canvas:   "#f4f6f8",   // nền trang
  surface:  "#ffffff",   // thẻ, bảng
  border:   "#e3e7eb",
  borderStrong: "#cfd5db",

  // chữ
  ink:      "#1e242b",   // tiêu đề, số liệu
  body:     "#4a535d",   // chữ thường
  muted:    "#7b848e",   // nhãn phụ, đơn vị

  // nhấn (dữ liệu)
  accent:   "#1f5fa8",   // đường biểu đồ chính
  accentSoft: "#e8f0fa",

  // trạng thái nghiệp vụ
  danger:   "#b6412c",   // sắp cạn hàng
  dangerSoft: "#fbeae6",
  warn:     "#a8720f",   // độ tin cậy thấp
  warnSoft: "#fdf4e3",
  ok:       "#256b4a",   // ổn định
  okSoft:   "#e7f3ec",
};

export const font = {
  // Dùng font hệ thống: nhanh, không cần tải, hiển thị tiếng Việt tốt
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

export const size = {
  // Thang cỡ chữ. Đổi ở đây là cả app đổi theo — không sửa rải rác từng file.
  // Đã tăng một nấc so với bản đầu để dễ đọc trên màn lớn và khi trình chiếu demo.
  display: 36,   // số liệu lớn (139, 111, 4.25…)
  h1: 26,        // tiêu đề trang: "Dashboard hấp thụ"
  h2: 18,        // tiêu đề khối: "Tốc độ hấp thụ theo thời gian"
  body: 15,      // chữ thường
  small: 14,     // nhãn, nút, menu điều hướng
  tiny: 12.5,    // chú thích, đơn vị
};

export const radius = { sm: 6, md: 10, lg: 14, pill: 999 };

// Bề rộng khung nội dung. Đặt ở đây để đổi 1 chỗ là cả app đổi theo.
// maxWidth là giới hạn TRÊN — màn nhỏ hơn thì tự co, không tràn.
// gutter & chartHeight đổi theo cỡ màn (dùng cùng hook useBreakpoint).
export const layout = {
  maxWidth: 1400,

  // lề trái/phải theo cỡ màn
  gutter: { mobile: 16, tablet: 24, laptop: 28, desktop: 32 },

  // chiều cao biểu đồ theo cỡ màn — laptop 13" không bị chart chiếm hết màn
  chartHeight: { mobile: 220, tablet: 280, laptop: 320, desktop: 380 },
};

export const space = (n) => n * 4; // space(3) = 12px

// Bóng rất nhẹ — đủ tách thẻ khỏi nền, không "nổi" quá
export const shadow = "0 1px 2px rgba(16,24,32,.04), 0 1px 8px rgba(16,24,32,.03)";