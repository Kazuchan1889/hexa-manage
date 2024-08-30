import React from "react";

function Shortcut() {
    return (
        <div className="mt-6 mb-2">
            <h1 className="text-sm">Shortcut</h1>
            <div className="flex flex-row mt-4 gap-6">
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <a className="text-sm" href="/LiveAttendance">Live Attendance</a>
                </div>
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <a className="text-sm" href="/reimburst">Request Reimbursement</a>
                </div>
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <a className="text-sm" href="/cuti">Request Time Off</a>
                </div>
            </div>
        </div>
    )
}
export default Shortcut;