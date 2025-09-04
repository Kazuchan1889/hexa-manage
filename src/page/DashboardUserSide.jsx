import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, IconButton, Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import NavbarUser from "../feature/MobileNav";
import Sidebar from "../feature/Sidebar";
import Headb from "../feature/Headbar";
import ChartDataKaryawan from "../feature/ChartDataKaryawan";
import ChartDataKehadiran from "../feature/ChartDataKehadiran";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import ChartDataGender from "../feature/ChartDataGender";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import AnnouncementList from "../minicomponent/ViewAnnounce";
import Announcment from "../minicomponent/Announcment";
import CheckinDashboard from "../minicomponent/CheckinDashboard";
import Shortcut from "../minicomponent/Shortcut";
import ip from "../ip";
import UserIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from "react-redux";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import StatusApproval from "./StatusApproval";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const getIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return payload.id;
};

function DashboardUserSide() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [isTambahFormOpen, setTambahFormOpen] = useState(false);
    const [scheduleItems, setScheduleItems] = useState([]);
    const [absensiItems, setAbsensiItems] = useState([]);
    const [selectedChart, setSelectedChart] = useState("kehadiranUser");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchScheduleItems = async () => {
            try {
                const id = getIdFromToken();
                if (!id) {
                    console.error('ID not found in token');
                    return;
                }
                const response = await axios.get(`${ip}/api/schedjul/scheduler/assigned/karyawan/${id}`, {
                    headers: { Authorization: localStorage.getItem("accessToken") },
                });
                setScheduleItems(response.data);
            } catch (error) {
                console.error("Error fetching schedule items:", error);
            }
        };

        const fetchAbsensiItems = async () => {
            try {
                const response = await axios.post(
                    `${ip}/api/absensi/get/data/dated`,
                    {
                        date: new Date().toISOString().split("T")[0],
                        search: "",
                    },
                    {
                        headers: { Authorization: localStorage.getItem("accessToken") },
                    }
                );
                setAbsensiItems(response.data);
            } catch (error) {
                console.error("Error fetching absensi items:", error);
            }
        };

        fetchScheduleItems();
        fetchAbsensiItems();
    }, [dispatch]);

    const getNameFromToken = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log("Token tidak ditemukan");
            return "User";
        }

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));

            const payload = JSON.parse(jsonPayload);
            return payload.nama || "User";
        } catch (error) {
            console.error("Error decoding token:", error);
            return "User";
        }
    };

    const handleChartChange = (event) => {
        setSelectedChart(event.target.value);
    };

    const handleReadMore = () => {
        navigate('/Cal');
    };

    const renderCharts = () => {
        if (isMobile) {
            return (
                <div className="w-full">
                    <div className="flex justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
                        <div className="w-full flex flex-col">
                            <div className="flex justify-end mb-2">
                                <FormControl variant="outlined" size="small" style={{ width: '150px' }}>
                                    <InputLabel id="chart-select-label">Select Chart</InputLabel>
                                    <Select
                                        labelId="chart-select-label"
                                        value={selectedChart}
                                        onChange={handleChartChange}
                                        label="Select Chart"
                                    >
                                        <MenuItem value="kehadiranUser">Kehadiran User</MenuItem>
                                        <MenuItem value="kehadiran">Kehadiran</MenuItem>
                                        <MenuItem value="gender">Gender</MenuItem>
                                        <MenuItem value="karyawan">Karyawan</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="flex justify-center items-center h-full">
                                {selectedChart === "kehadiranUser" && <ChartDataKehadiranUser />}
                                {selectedChart === "kehadiran" && <ChartDataKehadiran />}
                                {selectedChart === "gender" && <ChartDataGender />}
                                {selectedChart === "karyawan" && <ChartDataKaryawan />}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-4 gap-4 w-full">
                <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
                    <ChartDataKehadiranUser />
                </div>
                <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
                    <ChartDataKehadiran />
                </div>
                <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
                    <ChartDataGender />
                </div>
                <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
                    <ChartDataKaryawan />
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen w-screen bg-[#E4E4E4] overflow-hidden">
            {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
            <div className="flex flex-col flex-1 overflow-auto">
                <Headb />
                <div className="flex flex-col justify-center bg-[#11284E] px-4 pb-4 h-54">
                    <div className="text-white font-bold text-xl">Good Morning, {getNameFromToken()}!</div>
                    <span className="text-white text-sm">Time to Check In, Don't Forget!</span>
                    {isMobile ? (
                        <div>
                            <div className="flex flex-col items-center justify-center drop-shadow-lg bg-white px-5 lg:px-10 my-5 rounded-3xl w-[100%] lg:w-[40%] h-[17rem]">
                                <CheckinDashboard />
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center gap-4">
                            <div className="flex justify-between items-center drop-shadow-lg bg-white px-5 lg:px-0 my-5 rounded-3xl w-[100%] lg:w-[40%] h-[17rem]">
                                <StatusApproval />
                            </div>
                            <div className="flex flex-col items-center justify-center drop-shadow-lg bg-white px-5 lg:px-10 my-5 rounded-3xl w-[100%] lg:w-[40%] h-[17rem]">
                                <CheckinDashboard />
                            </div>
                        </div>
                    )}
                </div>
                {renderCharts()}
            </div>
        </div>
    );
}

export default DashboardUserSide;
