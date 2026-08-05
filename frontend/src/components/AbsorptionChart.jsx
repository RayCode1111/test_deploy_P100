// frontend/src/components/AbsorptionChart.jsx
// SRS §5.2: "line chart tốc độ hấp thụ theo thời gian (Recharts), chuyển đổi ngày/tuần".
//
// Lưu ý theo SRS §7.1 (unit test): phải xử lý "ngày không có giao dịch" —
// vẫn vẽ điểm 0, đường không đứt gãy.
import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { color, size, radius, shadow, space, font, layout } from "../styles/tokens";
import { useBreakpoint, pick } from "../hooks/useBreakpoint";

const MODES = [
  { key: "velocity_7d",  label: "7 ngày",  desc: "Trung bình trượt 7 ngày" },
  { key: "velocity_30d", label: "30 ngày", desc: "Trung bình trượt 30 ngày" },
];

export default function AbsorptionChart({ series = [], loading, areaLabel }) {
  const [mode, setMode] = useState("velocity_7d");
  const { bp, isNarrow } = useBreakpoint();

  const data = useMemo(
    () =>
      series.map((p) => ({
        date: p.stat_date,
        value: p[mode] ?? 0,          // ngày trống -> 0, không để undefined
        sold: p.units_sold ?? 0,
      })),
    [series, mode]
  );

  // Số liệu tóm tắt để đọc nhanh, không phải nhìn chart đoán
  const latest = data.length ? data[data.length - 1].value : null;
  const first = data.length ? data[0].value : null;
  const trend = latest !== null && first ? latest - first : null;

  return (
    <section style={S.card}>
      <header style={{ ...S.head, flexDirection: isNarrow ? "column" : "row" }}>
        <div>
          <h2 style={S.title}>Tốc độ hấp thụ theo thời gian</h2>
          <p style={S.sub}>
            {areaLabel ? `${areaLabel} · ` : ""}
            {MODES.find((m) => m.key === mode)?.desc} · đơn vị: căn/tuần
          </p>
        </div>
        <div style={S.toggle}>
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              style={{ ...S.tab, ...(mode === m.key ? S.tabActive : null) }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div style={S.state}>Đang tải biểu đồ…</div>
      ) : !data.length ? (
        <div style={S.state}>
          Chưa có dữ liệu cho phân khu này. Nạp file bán hàng để bắt đầu theo dõi.
        </div>
      ) : (
        <>
          <div style={S.readout}>
            <span style={S.readoutValue}>{latest?.toFixed(2)}</span>
            <span style={S.readoutUnit}>căn/tuần hiện tại</span>
            {trend !== null && (
              <span style={{ ...S.trend, color: trend >= 0 ? color.ok : color.danger }}>
                {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(2)} so với đầu kỳ
              </span>
            )}
          </div>

          <ResponsiveContainer width="100%" height={pick(bp, layout.chartHeight)}>
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="gradAbs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color.accent} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={color.accent} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={color.border} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: size.tiny, fill: color.muted }}
                tickFormatter={shortDate}
                minTickGap={isNarrow ? 60 : 40}
                axisLine={{ stroke: color.border }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: size.tiny, fill: color.muted }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip content={<CustomTip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color.accent}
                strokeWidth={2}
                fill="url(#gradAbs)"
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </section>
  );
}

function shortDate(d) {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${day}/${m}`;
}

function CustomTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div style={S.tip}>
      <div style={S.tipDate}>{label}</div>
      <div style={S.tipRow}>
        <span>Tốc độ</span>
        <b>{p.value.toFixed(2)} căn/tuần</b>
      </div>
      <div style={S.tipRow}>
        <span>Bán trong ngày</span>
        <b>{p.sold} căn</b>
      </div>
    </div>
  );
}

const S = {
  card: {
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    padding: space(5),
    boxShadow: shadow,
  },
  head: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: space(4) },
  title: { fontSize: size.h2, fontWeight: 700, color: color.ink, margin: 0 },
  sub: { fontSize: size.tiny, color: color.muted, margin: "3px 0 0" },
  toggle: { display: "flex", gap: 4, background: color.canvas, padding: 3, borderRadius: radius.sm, flex: "none" },
  tab: {
    border: "none", background: "transparent", color: color.body,
    fontSize: size.tiny, fontWeight: 600, padding: "5px 12px",
    borderRadius: radius.sm - 2, cursor: "pointer", fontFamily: "inherit",
  },
  tabActive: { background: color.surface, color: color.ink, boxShadow: shadow },
  readout: { display: "flex", alignItems: "baseline", gap: space(2), margin: `${space(4)}px 0 ${space(1)}px` },
  readoutValue: { fontSize: 28, fontWeight: 700, color: color.ink, fontVariantNumeric: "tabular-nums" },
  readoutUnit: { fontSize: size.tiny, color: color.muted },
  trend: { fontSize: size.tiny, fontWeight: 600, marginLeft: space(2) },
  state: {
    padding: `${space(12)}px 0`, textAlign: "center",
    color: color.muted, fontSize: size.small,
  },
  tip: {
    background: color.surface, border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm, padding: `${space(2)}px ${space(3)}px`,
    boxShadow: "0 4px 14px rgba(16,24,32,.10)", fontSize: size.tiny, minWidth: 168,
  },
  tipDate: { color: color.muted, marginBottom: 4, fontFamily: font.mono },
  tipRow: { display: "flex", justifyContent: "space-between", gap: space(4), color: color.body, lineHeight: 1.7 },
};