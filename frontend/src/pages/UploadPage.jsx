// frontend/src/pages/UploadPage.jsx
// TRANG "THÔNG MINH" cho luồng nạp dữ liệu.
//
// SRS §5.2 real-time: polling GET /api/files/{id}/status mỗi 3 GIÂY,
// dừng khi status = done/failed hoặc sau 2 PHÚT timeout.
import React, { useEffect, useRef, useState, useCallback } from "react";
import { uploadFile, fileStatus, fileErrors, listFiles } from "../api/endpoints";
import UploadDropzone from "../components/UploadDropzone";
import FileStatusTable from "../components/FileStatusTable";
import ValidationErrorPanel from "../components/ValidationErrorPanel";
import { color, size, radius, space, layout } from "../styles/tokens";
import { useBreakpoint, pick } from "../hooks/useBreakpoint";

const POLL_MS = 3_000;
const TIMEOUT_MS = 120_000;

export default function UploadPage() {
  const { bp } = useBreakpoint();
  const [files, setFiles] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);       // { type, text }
  const [tracking, setTracking] = useState(null);   // { fileId, status, rows_ok, rows_failed }

  const [errorPanel, setErrorPanel] = useState(null); // file đang xem lỗi
  const [errorRows, setErrorRows] = useState([]);
  const [loadingErrors, setLoadingErrors] = useState(false);

  const pollRef = useRef(null);
  const startRef = useRef(null);

  const refreshList = useCallback(() => {
    listFiles()
      .then((l) => setFiles(l || []))
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => { refreshList(); }, [refreshList]);

  // Dọn timer khi rời trang — tránh rò rỉ bộ nhớ
  useEffect(() => () => clearInterval(pollRef.current), []);

  function stopPolling() {
    clearInterval(pollRef.current);
    pollRef.current = null;
  }

  function startPolling(fileId) {
    stopPolling();
    startRef.current = Date.now();

    const tick = async () => {
      // Hết 2 phút mà chưa xong -> dừng, báo người dùng
      if (Date.now() - startRef.current > TIMEOUT_MS) {
        stopPolling();
        setNotice({ type: "warn", text: "Quá 2 phút chưa có kết quả. Kiểm tra lại ở bảng lịch sử bên dưới." });
        return;
      }
      try {
        const st = await fileStatus(fileId);
        setTracking({ fileId, ...st });
        if (st.status === "done" || st.status === "failed") {
          stopPolling();
          refreshList();
          setNotice(
            st.status === "done"
              ? {
                  type: st.rows_failed > 0 ? "warn" : "ok",
                  text:
                    st.rows_failed > 0
                      ? `Đã nạp ${st.rows_ok} dòng, ${st.rows_failed} dòng lỗi cần sửa.`
                      : `Đã nạp thành công ${st.rows_ok} dòng.`,
                }
              : { type: "error", text: "Xử lý file thất bại. Kiểm tra định dạng và thử lại." }
          );
        }
      } catch (e) {
        stopPolling();
        setNotice({ type: "error", text: `Không lấy được trạng thái: ${e.message}` });
      }
    };

    tick();
    pollRef.current = setInterval(tick, POLL_MS);
  }

  async function handleFile(file) {
    setBusy(true);
    setNotice(null);
    setTracking(null);
    try {
      const res = await uploadFile(file);
      setNotice({ type: "ok", text: `Đã tải lên "${file.name}". Đang đọc dữ liệu…` });
      refreshList();
      startPolling(res.file_id);
    } catch (e) {
      setNotice({
        type: "error",
        text: e.status === 409 ? "File này đã được nạp trước đó." : `Tải lên thất bại: ${e.message}`,
      });
    } finally {
      setBusy(false);
    }
  }

  async function openErrors(file) {
    setErrorPanel(file);
    setLoadingErrors(true);
    try {
      setErrorRows(await fileErrors(file.id));
    } catch {
      setErrorRows([]);
    } finally {
      setLoadingErrors(false);
    }
  }

  return (
    <div style={{ ...S.wrap, padding: `${space(7)}px ${pick(bp, layout.gutter)}px ${space(16)}px` }}>
      <header style={S.head}>
        <h1 style={S.h1}>Nạp dữ liệu</h1>
        <p style={S.sub}>
          Tải file bán hàng &amp; tồn kho theo template. Hệ thống kiểm tra từng dòng
          trước khi ghi vào cơ sở dữ liệu.
        </p>
      </header>

      <div style={S.block}>
        <UploadDropzone onFile={handleFile} busy={busy} />
      </div>

      {notice && (
        <div style={{ ...S.notice, ...noticeStyle(notice.type) }}>{notice.text}</div>
      )}

      {tracking && tracking.status === "parsing" && (
        <div style={S.progress}>
          <div style={S.progressHead}>
            <span>Đang đọc dữ liệu…</span>
            <span style={S.progressNum}>
              {tracking.rows_ok} dòng hợp lệ
              {tracking.rows_failed > 0 && ` · ${tracking.rows_failed} lỗi`}
            </span>
          </div>
          <div style={S.barTrack}>
            <div style={S.barFill} />
          </div>
        </div>
      )}

      <h2 style={S.h2}>Lịch sử nạp</h2>
      <FileStatusTable files={files} loading={loadingList} onViewErrors={openErrors} />

      {errorPanel && (
        <ValidationErrorPanel
          file={errorPanel}
          errors={errorRows}
          loading={loadingErrors}
          onClose={() => setErrorPanel(null)}
        />
      )}
    </div>
  );
}

function noticeStyle(type) {
  if (type === "ok") return { background: color.okSoft, color: color.ok, borderColor: `${color.ok}33` };
  if (type === "warn") return { background: color.warnSoft, color: color.warn, borderColor: `${color.warn}33` };
  return { background: color.dangerSoft, color: color.danger, borderColor: `${color.danger}33` };
}

const S = {
  wrap: { maxWidth: layout.maxWidth, margin: "0 auto", padding: `${space(7)}px ${layout.gutter}px ${space(16)}px` },
  head: { marginBottom: space(6) },
  h1: { fontSize: size.h1, fontWeight: 700, color: color.ink, margin: 0, letterSpacing: "-.01em" },
  sub: { fontSize: size.small, color: color.muted, margin: "4px 0 0", maxWidth: "64ch" },
  h2: { fontSize: size.h2, fontWeight: 700, color: color.ink, margin: `${space(8)}px 0 ${space(3)}px` },
  block: { marginBottom: space(4) },
  notice: {
    border: "1px solid", borderRadius: radius.sm,
    padding: `${space(3)}px ${space(4)}px`, fontSize: size.small, marginBottom: space(4),
  },
  progress: {
    background: color.surface, border: `1px solid ${color.border}`,
    borderRadius: radius.md, padding: space(4), marginBottom: space(4),
  },
  progressHead: {
    display: "flex", justifyContent: "space-between",
    fontSize: size.small, color: color.body, marginBottom: space(2),
  },
  progressNum: { color: color.muted, fontSize: size.tiny },
  barTrack: { height: 6, background: color.canvas, borderRadius: radius.pill, overflow: "hidden" },
  barFill: {
    height: "100%", width: "45%", background: color.accent, borderRadius: radius.pill,
    animation: "none", // tiến độ thật lấy từ rows_ok; giữ đơn giản ở MVP1
  },
};