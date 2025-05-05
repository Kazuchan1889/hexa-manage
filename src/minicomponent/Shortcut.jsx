import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Shortcut() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("Access Token not found");
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log("Invalid token format");
      return;
    }

    try {
      const payloadBase64 = parts[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      console.log("Decoded Access Token Payload:", payloadDecoded);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };
  return (
    <div className="mt-2">
      <h1 className="text-xl font-bold text-center text-white mb-4">Quick Access</h1>
      <div className={`mt-2 flex justify-center gap-8 flex-wrap ${isMobile ? 'grid grid-cols-2' : 'flex'}`}>
        {[
          { path: "/liveattendance", label: "Live Attendance" },
          { path: "/reimburst", label: "Request Reimbursement" },
          { path: "/Form", label: "Request Time Off" },
          { path: "/UserSummary", label: "Summary" },
          { path: "/Key", label: "Acticity tracker" },
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

      {/* Button to log access token */}
      <div className="mt-6 flex justify-center">
        {/* <button
          onClick={handleLogAccessToken}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
        >
          Log Access Token
        </button> */}
      </div>
      </div>
  );
}

export default Shortcut;
