import React from "react";
import LiveAttendance from "./LiveAttendance";
import LiveAttendanceL from "./LiveAttendanceL";

function AttendanceDashboard() {
  // Mendapatkan nama hari saat ini
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const isWeekend = today === "saturday" || today === "Sunday";

  return (
    <div>
      {isWeekend ? <LiveAttendanceL /> : <LiveAttendance />}
    </div>
  );
}

export default AttendanceDashboard;
