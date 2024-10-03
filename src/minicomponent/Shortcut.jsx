import React from "react";
import { Link } from "react-router-dom"; // Import Link

function Shortcut() {
    return (
        <div className="mt-6 mb-2">
            <h1 className="text-sm">Shortcut</h1>
            <div className="flex flex-row mt-4 gap-6">
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <Link className="text-sm" to="/liveattendance">Live Attendance</Link>
                </div>
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <Link className="text-sm" to="/reimburst">Request Reimbursement</Link>
                </div>
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <Link className="text-sm" to="/cuti">Request Time Off</Link>
                </div>
            </div>
        </div>
    )
}

export default Shortcut;
