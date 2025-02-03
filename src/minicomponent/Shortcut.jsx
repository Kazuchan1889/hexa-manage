import React from "react";
import { Link } from "react-router-dom";

function Shortcut() {
  return (
    <div className="mt-6 mb-2">
      <h1 className="text-xl font-bold text-center text-white mb-4">Quick Access</h1>
      <div className="flex justify-center gap-8 mt-2 flex-wrap">
        {[
          { path: "/liveattendance", label: "Live Attendance" },
          { path: "/reimburst", label: "Request Reimbursement" },
          { path: "/Form", label: "Request Time Off" },
          { path: "/UserSummary", label: "Summary" },
        ].map((item, index) => (
          <div
            key={index}
            className="w-40 h-12 flex items-center justify-center border bg-white text-[#204682] drop-shadow-xl rounded-full text-center hover:border-black p-2"
          >
            <Link className="text-sm font-medium break-words whitespace-normal" to={item.path}>
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shortcut;
