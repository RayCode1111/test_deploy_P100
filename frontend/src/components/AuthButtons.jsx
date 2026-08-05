// frontend/src/components/AuthButtons.jsx
// Nút Đăng nhập / Đăng ký ở góc phải thanh điều hướng.
//
// TRẠNG THÁI HIỆN TẠI: xác thực thật thuộc MVP3 (SRS §5.4) — backend chưa có
// /api/auth/*. Ở đây dựng sẵn giao diện + chỗ nối, khi API xong chỉ cần thay
// phần onClick bằng điều hướng tới trang /login.
//
// Khi đã đăng nhập, thanh này chuyển thành tên + vai trò + nút đăng xuất.
import React from "react";
import { color, size, radius, space } from "../styles/tokens";
import { useBreakpoint } from "../hooks/useBreakpoint";

const ROLE_LABEL = {
  sales_staff: "Nhân viên KD",
  sales_manager: "Quản lý KD",
  executive: "Ban điều hành",
};

export default function AuthButtons({ user, onLogin, onRegister, onLogout }) {
  const { isMobile } = useBreakpoint();

  // --- Đã đăng nhập ---
  if (user) {
    return (
      <div style={S.wrap}>
        <div style={S.user}>
          <span style={S.avatar} aria-hidden="true">
            {(user.full_name || "?").trim().charAt(0).toUpperCase()}
          </span>
          {!isMobile && (
            <span style={S.userText}>
              <span style={S.userName}>{user.full_name}</span>
              <span style={S.userRole}>{ROLE_LABEL[user.role] || user.role}</span>
            </span>
          )}
        </div>
        <button onClick={onLogout} style={S.ghost}>
          Đăng xuất
        </button>
      </div>
    );
  }

  // --- Chưa đăng nhập ---
  return (
    <div style={S.wrap}>
      <button onClick={onLogin} style={S.ghost}>
        Đăng nhập
      </button>
      <button onClick={onRegister} style={S.primary}>
        Đăng ký
      </button>
    </div>
  );
}

const S = {
  wrap: { display: "flex", alignItems: "center", gap: space(2), flex: "none" },
  ghost: {
    background: "transparent",
    border: "none",
    color: color.body,
    fontSize: size.small,
    fontWeight: 500,
    padding: `${space(2)}px ${space(3)}px`,
    borderRadius: radius.sm,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  primary: {
    background: color.accent,
    border: `1px solid ${color.accent}`,
    color: "#fff",
    fontSize: size.small,
    fontWeight: 600,
    padding: `${space(2)}px ${space(4)}px`,
    borderRadius: radius.sm,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  user: { display: "flex", alignItems: "center", gap: space(2) },
  avatar: {
    width: 28, height: 28, borderRadius: "50%",
    background: color.accentSoft, color: color.accent,
    display: "grid", placeItems: "center",
    fontSize: size.tiny, fontWeight: 700, flex: "none",
  },
  userText: { display: "flex", flexDirection: "column", lineHeight: 1.25 },
  userName: { fontSize: size.tiny, fontWeight: 600, color: color.ink },
  userRole: { fontSize: 10, color: color.muted },
};