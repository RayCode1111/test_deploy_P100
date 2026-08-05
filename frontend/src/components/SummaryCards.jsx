// frontend/src/components/SummaryCards.jsx
// SRS §5.2: "tồn kho còn lại, đã bán, tốc độ trung bình 30 ngày, mốc cập nhật".
// Component "ngu": chỉ nhận props và vẽ, KHÔNG tự gọi API.
import React from "react";
import { color, size, radius, shadow, space } from "../styles/tokens";

export default function SummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <div style={S.grid}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ ...S.card, ...S.skeleton }} />
        ))}
      </div>
    );
  }
  if (!summary) return null;

  const { units_remaining, units_sold, avg_velocity_30d, updated_at } = summary;
  const total = (units_remaining ?? 0) + (units_sold ?? 0);
  const soldPct = total ? Math.round(((units_sold ?? 0) / total) * 100) : null;

  return (
    <div style={S.grid}>
      <Card label="Tồn kho còn lại" value={fmt(units_remaining)} unit="căn" />
      <Card
        label="Đã bán"
        value={fmt(units_sold)}
        unit="căn"
        note={soldPct !== null ? `${soldPct}% tổng rổ hàng` : null}
      />
      <Card label="Tốc độ 30 ngày" value={fmt(avg_velocity_30d)} unit="căn/tuần" />
      <Card label="Cập nhật lúc" value={fmtTime(updated_at)} unit="daily batch 02:00" small />
    </div>
  );
}

function Card({ label, value, unit, note, small }) {
  return (
    <div style={S.card}>
      <div style={S.label}>{label}</div>
      <div style={{ ...S.value, fontSize: small ? size.h1 : size.display }}>{value}</div>
      <div style={S.unit}>{note || unit}</div>
    </div>
  );
}

const fmt = (v) => (v === null || v === undefined ? "—" : v);
function fmtTime(t) {
  if (!t) return "—";
  return new Date(t).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

const S = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: space(3),
  },
  card: {
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    padding: `${space(4)}px ${space(4)}px`,
    boxShadow: shadow,
  },
  skeleton: { height: 96, opacity: 0.55 },
  label: {
    fontSize: size.tiny,
    color: color.muted,
    textTransform: "uppercase",
    letterSpacing: ".07em",
    fontWeight: 600,
  },
  value: {
    fontWeight: 700,
    color: color.ink,
    lineHeight: 1.15,
    margin: `${space(2)}px 0 ${space(1)}px`,
    fontVariantNumeric: "tabular-nums", // số thẳng cột, không nhảy
  },
  unit: { fontSize: size.tiny, color: color.muted },
};