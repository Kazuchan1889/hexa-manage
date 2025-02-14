import React from "react";
// import DashboardAdmin from "./DashboardAdmin";
import DashboardUserSide from "./DashboardUserSide";
import DashboardAdminSide from "./DashboardAdminSide";

function Dashboard() {
  localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  return <div>{role === "admin" ? <DashboardAdminSide /> : <DashboardUserSide  />}</div>;
}

export default Dashboard;
