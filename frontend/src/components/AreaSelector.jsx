// frontend/src/components/AreaSelector.jsx
// SRS §5.2: "chọn 1 hoặc nhiều phân khu / loại căn để lọc dashboard".
// MVP1 làm chọn 1 (đơn giản, đủ dùng); mở rộng đa chọn sau.
//
// Dùng chip thay vì <select> vì ở quy mô pilot chỉ 2–3 phân khu — cho người
// dùng thấy hết lựa chọn cùng lúc, bấm 1 lần thay vì mở menu.
import React from "react";
import { color, size, radius, space } from "../styles/tokens";

export default function AreaSelector({ areas = [], value, onChange, loading }) {
  if (loading) return <div style={{ ...S.chip, ...S.skeleton }}>Đang tải phân khu…</div>;
  if (!areas.length) return <div style={S.empty}>Chưa có phân khu nào. Hãy nạp dữ liệu trước.</div>;

  return (
    <div style={S.row} role="group" aria-label="Chọn phân khu">
      {areas.map((a) => {
        const active = a.id === value;
        return (
          <button
            key={a.id}
            onClick={() => onChange(a.id)}
            aria-pressed={active}
            style={{ ...S.chip, ...(active ? S.chipActive : null) }}
          >
            <span style={S.name}>
              {a.area_name} · {a.unit_type}
            </span>
            <span style={{ ...S.count, color: active ? "rgba(255,255,255,.75)" : color.muted }}>
              còn {a.units_remaining}/{a.total_units}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const S = {
  row: { display: "flex", gap: space(2), flexWrap: "wrap" },
  chip: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    padding: `${space(2)}px ${space(3)}px`,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "background .12s, border-color .12s",
  },
  chipActive: {
    background: color.accent,
    borderColor: color.accent,
    color: "#fff",
  },
  name: { fontSize: size.small, fontWeight: 600 },
  count: { fontSize: size.tiny },
  skeleton: { opacity: 0.5, color: color.muted },
  empty: { fontSize: size.small, color: color.muted },
};