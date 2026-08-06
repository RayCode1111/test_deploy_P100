// frontend/src/App.jsx
// KHUNG ỨNG DỤNG: thanh điều hướng + định tuyến trang.
// Các trang MVP2 (Dự báo, Cảnh báo) và MVP3 (Duyệt HITL) sẽ thêm vào đây,
// không phải sửa lại cấu trúc.
import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import ImportSelectPage from "./pages/ImportSelectPage";
import AuthButtons from "./components/AuthButtons";
import ChatWidget from "./components/ChatWidget";
import { USE_MOCK } from "./api/client";
import { color, size, radius, space, font, layout } from "./styles/tokens";
import { useBreakpoint, pick } from "./hooks/useBreakpoint";

// Các mục điều hướng. `soon: true` = chưa làm, hiện mờ để cả nhóm thấy lộ trình.
const NAV = [
  { to: "/dashboard", label: "Hấp thụ" },
  { to: "/import",    label: "Nạp dữ liệu" },
  { to: "/forecasts", label: "Dự báo",      soon: true },
  { to: "/alerts",    label: "Cảnh báo",    soon: true },
  { to: "/proposals", label: "Duyệt đề xuất", soon: true },
];

export default function App() {
  // Người dùng đăng nhập — MVP3 sẽ lấy từ GET /api/auth/me.
  // Hiện để null = chưa đăng nhập, hiển thị nút Đăng nhập / Đăng ký.
  const [user, setUser] = React.useState(null);

  return (
    <BrowserRouter>
      <div style={S.app}>
        <TopBar user={user} onLogout={() => setUser(null)} />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/import" element={<ImportSelectPage />} />
            <Route path="/import/upload" element={<UploadPage />} />
            <Route path="*" element={<NotReady />} />
          </Routes>
        </main>

        {/* Nút chat nổi góc phải dưới — nối vào AI agent thật (/api/v1/chat) */}
        <ChatWidget />
      </div>
    </BrowserRouter>
  );
}

function TopBar({ user, onLogout }) {
  const { bp, isMobile } = useBreakpoint();
  const navigate = useNavigate();
  return (
    <header style={S.bar}>
      <div style={{ ...S.barInner, padding: `0 ${pick(bp, layout.gutter)}px`, gap: isMobile ? space(3) : space(8) }}>
        <div style={S.brand}>
          <span style={S.mark} aria-hidden="true" />
          {!isMobile && <span style={S.brandName}>AbsorptionForecast</span>}
        </div>

        <nav style={S.nav}>
          {NAV.map((n) =>
            n.soon ? (
              <span key={n.to} style={{ ...S.link, ...S.linkSoon }} title="Sẽ có ở MVP tiếp theo">
                {n.label}
              </span>
            ) : (
              <NavLink
                key={n.to}
                to={n.to}
                style={({ isActive }) => ({ ...S.link, ...(isActive ? S.linkActive : null) })}
              >
                {n.label}
              </NavLink>
            )
          )}
        </nav>

        <div style={S.right}>
          {USE_MOCK && !isMobile && (
            <span style={S.mockTag} title="Đang chạy trên dữ liệu giả — đổi USE_MOCK trong api/client.js khi backend sẵn sàng">
              dữ liệu giả
            </span>
          )}
          <AuthButtons
            user={user}
            onLogin={() => navigate("/login")}
            onRegister={() => navigate("/register")}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
}

function NotReady() {
  return (
    <div style={S.notReady}>
      <h2 style={{ fontSize: size.h2, color: color.ink, margin: 0 }}>Màn hình này chưa dựng</h2>
      <p style={{ fontSize: size.small, color: color.muted, marginTop: space(2) }}>
        Sẽ được bổ sung theo lộ trình MVP 2 và MVP 3.
      </p>
    </div>
  );
}

const S = {
  app: { minHeight: "100vh", background: color.canvas, fontFamily: font.sans, color: color.body },
  bar: { background: color.surface, borderBottom: `1px solid ${color.border}`, position: "sticky", top: 0, zIndex: 10 },
  barInner: {
    maxWidth: layout.maxWidth, margin: "0 auto", // padding đặt inline theo breakpoint
    height: 64, display: "flex", alignItems: "center", gap: space(8),
  },
  brand: { display: "flex", alignItems: "center", gap: space(2), flex: "none" },
  mark: {
    width: 12, height: 12, borderRadius: 2, background: color.accent,
    display: "inline-block", transform: "rotate(45deg)",
  },
  brandName: { fontSize: size.h2, fontWeight: 700, color: color.ink, letterSpacing: "-.01em" },
  nav: { display: "flex", gap: space(1), alignItems: "center", overflowX: "auto", scrollbarWidth: "none" },
  link: {
    fontSize: size.small, color: color.body, textDecoration: "none",
    padding: `${space(2)}px ${space(3)}px`, borderRadius: radius.sm, fontWeight: 500,
  },
  linkActive: { background: color.accentSoft, color: color.accent, fontWeight: 600 },
  linkSoon: { color: color.muted, opacity: 0.5, cursor: "default" },
  right: { marginLeft: "auto", display: "flex", alignItems: "center", gap: space(3), flex: "none" },
  mockTag: { fontSize: size.tiny, color: color.warn,
    background: color.warnSoft, border: `1px solid ${color.warn}33`,
    padding: "3px 9px", borderRadius: radius.pill, fontWeight: 600,
  },
  notReady: { maxWidth: layout.maxWidth, margin: "0 auto", padding: `${space(20)}px ${space(6)}px`, textAlign: "center" },
};