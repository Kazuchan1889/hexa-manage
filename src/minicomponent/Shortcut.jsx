import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import Modal from "@mui/material/Modal"; // Import Modal dari Material-UI
import LaporanKegiatanForm from "../page/Formlaporan"; // Import LaporanKegiatanForm

function Shortcut() {
    const [open, setOpen] = useState(false); // State untuk mengontrol modal

    const handleOpen = () => {
        setOpen(true); // Buka modal
    };

    const handleClose = () => {
        setOpen(false); // Tutup modal
    };

    return (
        <div className="mt-6 mb-2">
            <h1 className="text-sm">Shortcut</h1>
            <div className="flex flex-row mt-2 gap-6">
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <Link className="text-sm" to="/liveattendance">Live Attendance</Link>
                </div>
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <Link className="text-sm" to="/reimburst">Request Reimbursement</Link>
                </div>
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <Link className="text-sm" to="/Form">Request Time Off</Link>
                </div>
                <div className="flex border border-white rounded-full px-4 py-2 text-center hover:border-black">
                    <Link className="text-sm" to="/UserSummary">Summary</Link>
                </div>
            </div>

          
        </div>
    );
}

export default Shortcut;
