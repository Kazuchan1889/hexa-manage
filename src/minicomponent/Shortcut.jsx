import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Shortcut() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mt-2">
      <h1 className="text-xl font-bold text-center text-white mb-4">Quick Access</h1>
      <div className={`mt-2 flex justify-center gap-8 flex-wrap ${isMobile ? 'grid grid-cols-2' : 'flex'}`}>
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
