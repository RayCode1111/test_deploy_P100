// frontend/src/pages/DashboardPage.jsx
// TRANG "THÔNG MINH": lo lấy dữ liệu + giữ state, rồi truyền xuống component.
// Component chỉ vẽ. Tách như vậy để dễ test và dễ đổi nguồn dữ liệu.
//
// SRS §5.2 real-time (MVP1): polling GET /api/absorption mỗi 30 giây khi tab
// đang active, DỪNG khi tab ẩn, kèm nút làm mới thủ công.
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { listAreas, getAbsorption, getAbsorptionSummary } from "../api/endpoints";
import SummaryCards from "../components/SummaryCards";
import AreaSelector from "../components/AreaSelector";
import AbsorptionChart from "../components/AbsorptionChart";
import { color, size, radius, space, layout } from "../styles/tokens";
import { useBreakpoint, pick } from "../hooks/useBreakpoint";

const POLL_MS = 30_000;
const iso = (d) => d.toISOString().slice(0, 10);
const today = () => iso(new Date());
const daysAgo = (n) => iso(new Date(Date.now() - n * 86400000));

export default function DashboardPage() {
  const { bp, isNarrow } = useBreakpoint();
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState(null);
  const [series, setSeries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // 1) Nạp danh sách phân khu — chạy 1 lần khi vào trang
  useEffect(() => {
    listAreas()
      .then((list) => {
        setAreas(list || []);
        if (list?.length) setAreaId(list[0].id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingAreas(false));
  }, []);

  // 2) Nạp dữ liệu dashboard — dùng lại cho polling và nút làm mới
  const load = useCallback(async () => {
    if (!areaId) return;
    try {
      const [s, sum] = await Promise.all([
        getAbsorption({ areaId, from: daysAgo(90), to: today(), granularity: "day" }),
        getAbsorptionSummary(),
      ]);
      setSeries(s || []);
      setSummary(sum || null);
      setLastSync(new Date());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingData(false);
    }
  }, [areaId]);

  // 3) Gọi lần đầu + lập lịch polling 30s (bỏ qua khi tab ẩn)
  useEffect(() => {
    if (!areaId) return;
    setLoadingData(true);
    load();
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [areaId, load]);

  const activeArea = useMemo(
    () => areas.find((a) => a.id === areaId),
    [areas, areaId]
  );
  const areaLabel = activeArea ? `${activeArea.area_name} · ${activeArea.unit_type}` : "";

  return (
    <div style={{ ...S.wrap, padding: `${space(7)}px ${pick(bp, layout.gutter)}px ${space(16)}px` }}>
      <div style={{ ...S.headRow, flexDirection: isNarrow ? "column" : "row", alignItems: isNarrow ? "flex-start" : "flex-end", gap: isNarrow ? space(3) : 0 }}>
        <div>
          <h1 style={S.h1}>Dashboard hấp thụ</h1>
          <p style={S.sub}>Theo dõi tốc độ bán theo phân khu và loại căn</p>
        </div>
        <button onClick={load} style={S.refresh}>
          Làm mới
          {lastSync && (
            <span style={S.syncTime}>
              {lastSync.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </button>
      </div>

      {error && (
        <div style={S.error}>
          Không tải được dữ liệu: {error}
          <button onClick={load} style={S.retry}>Thử lại</button>
        </div>
      )}

      <div style={S.block}>
        <AreaSelector
          areas={areas}
          value={areaId}
          onChange={setAreaId}
          loading={loadingAreas}
        />
      </div>

      <div style={S.block}>
        <SummaryCards summary={summary} loading={loadingData && !summary} />
      </div>

      <AbsorptionChart
        series={series}
        loading={loadingData && !series.length}
        areaLabel={areaLabel}
      />
    </div>
  );
}

const S = {
  wrap: { maxWidth: layout.maxWidth, margin: "0 auto", padding: `${space(7)}px ${layout.gutter}px ${space(16)}px` },
  headRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: space(6) },
  h1: { fontSize: size.h1, fontWeight: 700, color: color.ink, margin: 0, letterSpacing: "-.01em" },
  sub: { fontSize: size.small, color: color.muted, margin: "4px 0 0" },
  refresh: {
    display: "inline-flex", alignItems: "center", gap: space(2),
    background: color.surface, border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm, padding: `${space(2)}px ${space(3)}px`,
    fontSize: size.small, color: color.body, cursor: "pointer", fontFamily: "inherit",
  },
  syncTime: { fontSize: size.tiny, color: color.muted },
  block: { marginBottom: space(5) },
  error: {
    display: "flex", alignItems: "center", gap: space(3),
    background: color.dangerSoft, border: `1px solid ${color.danger}33`,
    color: color.danger, borderRadius: radius.sm,
    padding: `${space(3)}px ${space(4)}px`, fontSize: size.small, marginBottom: space(5),
  },
  retry: {
    marginLeft: "auto", background: "transparent", border: `1px solid ${color.danger}`,
    color: color.danger, borderRadius: radius.sm, padding: "3px 10px",
    fontSize: size.tiny, cursor: "pointer", fontFamily: "inherit",
  },
};