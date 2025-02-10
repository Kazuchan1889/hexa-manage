import React from "react";
// import DashboardAdmin from "./DashboardAdmin";
import DashboardUser from "./DashboardUser";
import DashboardAdminSide from "./DashboardAdminSide";

function Dashboard() {
  localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  return <div>{role === "admin" ? <DashboardAdminSide /> : <DashboardUser  />}</div>;
}

export default Dashboard;
