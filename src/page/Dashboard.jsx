import React from "react";
import DashboardAdmin from "./DashboardAdmin";
import DashboardUser from "./DashboardUser";

function Dashboard() {
  localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  return <div>{role === "admin" ? <DashboardAdmin /> : <DashboardUser />}</div>;
}

export default Dashboard;
