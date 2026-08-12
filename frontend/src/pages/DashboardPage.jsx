// frontend/src/pages/DashboardPage.jsx
// Trang /dashboard — Dashboard hấp thụ độc lập, có bộ chọn dự án.
// Chỉ là lớp mỏng; nội dung nằm trong <AbsorptionDashboard/> (tái dùng cho S03).
import React from "react";
import AbsorptionDashboard from "../components/dashboard/AbsorptionDashboard";

export default function DashboardPage() {
  return <AbsorptionDashboard showProjectSelector showHeader />;
}
