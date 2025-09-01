import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardWidgets from "../../components/dashboard/DashboardWidgets";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardWidgets />
    </DashboardLayout>
  );
}
