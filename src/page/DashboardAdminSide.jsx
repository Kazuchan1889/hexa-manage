import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, IconButton } from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Swal from "sweetalert2";
import NavbarUser from "../feature/NavbarUser";
import ChartDataKaryawan from "../feature/ChartDataKaryawan";
import ChartDataKehadiran from "../feature/ChartDataKehadiran";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import ChartDataLama from "../feature/ChartDataLama";
import { useNavigate } from 'react-router-dom';
import ChartDataGender from "../feature/ChartDataGender";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import AnnouncementList from "../minicomponent/ViewAnnounce";
import Announcment from "../minicomponent/Announcment";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ip from "../ip";
import UserIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckinDashboard from "../minicomponent/CheckinDashboard";
import Sidebar from "../feature/Sidebar";
import Headb from "../feature/Headbar";
import Shortcut from "../minicomponent/Shortcut";
import ChartDataGenderKaryawan from "../feature/ChartDataGenderKaryawan";

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

function DashboardAdminSide() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [isTambahFormOpen, setTambahFormOpen] = useState(false);
    const [isBubbleOpen, setIsBubbleOpen] = useState(false);
    const [scheduleItems, setScheduleItems] = useState([]);
    const [absensiItems, setAbsensiItems] = useState([]);
    const [selectedChart, setSelectedChart] = useState("kehadiranUser");
    const checkOperation = localStorage.getItem("operation");
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.loading.isLoading);

    // State untuk loading individual
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [loadingAbsensi, setLoadingAbsensi] = useState(false);
    const [loadingAnnouncement, setLoadingAnnouncement] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchScheduleItems = async () => {
            setLoadingSchedule(true); // Mulai loading untuk jadwal
            try {
                const id = getIdFromToken("accessToken");
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
            } finally {
                setLoadingSchedule(false); // Akhiri loading untuk jadwal
            }
        };


        const fetchAbsensiItems = async () => {
            setLoadingAbsensi(true); // Mulai loading untuk absensi
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
            } finally {
                setLoadingAbsensi(false); // Akhiri loading untuk absensi
            }
        };

        fetchScheduleItems();
        fetchAbsensiItems();
    }, [dispatch]);

    const handleSubmit = () => {
        Swal.fire({
            icon: "success",
            title: "Announcement added successfully!",
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            window.location.reload();
        });
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(new Date(dateString));
    };

    const handleChartChange = (event) => {
        setSelectedChart(event.target.value);
    };
    const navigate = useNavigate();
    const handleReadMore = () => {
        navigate('/Cal'); // Arahkan ke halaman /Calen
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
        <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
            <Sidebar isMobile={isMobile} />
            <div className="flex flex-col flex-1 overflow-auto">
                <Headb />
                <div className="flex flex-col justify-center bg-[#11284E] px-4 pb-4 h-54">
                    <div className="text-white font-bold text-xl">Good Morning, {name}!</div>
                    <span className="text-white text-sm">Time to Check In, Don't Forget!</span>
                    <Shortcut />
                </div>

                <div className="flex flex-row justify-center p-4 gap-4">
                    <div className="w-1/4 drop-shadow-md bg-white py-6 rounded-lg">
                        < ChartDataKehadiranUser />
                    </div>
                    <div className="w-1/4 drop-shadow-md bg-white py-6 rounded-lg">
                        < ChartDataKehadiran />
                    </div>
                    <div className="w-1/4 drop-shadow-md bg-white py-6 rounded-lg">
                        < ChartDataGender />
                    </div>
                    <div className="w-1/4 drop-shadow-md bg-white py-6 rounded-lg">
                        < ChartDataKaryawan />
                    </div>
                </div>
                {/* absensi hari ini */}
                <div className="flex flex-row justify-between px-4 pb-4 gap-4">
                    <div className="drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem] w-1/4">
                        <span className="text-[#204682] text-lg text-center font-bold">
                            Today's Absence
                        </span>
                        <div className="max-h-[18rem] mt-2 overflow-y-auto">
                            {loadingAbsensi ? (
                                <Loading />
                            ) : (
                                <ul className="space-y-3">
                                    {absensiItems.length === 0 ? (
                                        <p className="text-gray-500 text-center">Tidak ada data absensi hari ini.</p>
                                    ) : (
                                        absensiItems.map((item, index) => (
                                            <li key={index} className="flex items-between p-3 border rounded-lg">
                                                {/* Foto User */}
                                                {item.photo ? (
                                                    <div className="my-auto">
                                                        <img
                                                            src={item.photo.startsWith("data:image/") ? item.photo : `data:image/jpeg;base64,${item.photo}`}
                                                            className="w-8 h-8 rounded-full object-cover items-center justify-center"
                                                            alt="Absensi Photo"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">
                                                        <UserIcon style={{ fontSize: 30, color: 'black' }} />
                                                    </div>
                                                )}

                                                {/* Nama & Status */}
                                                <div className="flex flex-col mx-auto">
                                                    <span className="font-semibold">{item.nama}</span>
                                                    <span className="text-xs text-gray-600">{item.status}</span>
                                                </div>

                                                {/* Status Icon */}
                                                <div className="my-auto justify-end">
                                                    {item.status === 'tanpa alasan' && <ErrorIcon className="text-red-500" />}
                                                    {item.status === 'terlambat' && <WarningIcon className="text-yellow-500" />}
                                                    {['masuk', 'libur', 'izin', 'cuti'].includes(item.status) && <CheckCircleIcon className="text-green-500" />}
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
                        <span className="text-[#204682] text-lg text-center font-bold">
                            Assignment
                        </span>
                        <AnnouncementList />
                        <Button variant="contained" color="primary" onClick={() => setTambahFormOpen(true)}>Add Announcement</Button>
                    </div>
                    <div className="w-1/4 drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
                        <span className="text-[#204682] text-lg text-center font-bold">
                            Upcoming Schedule
                        </span>
                        <div className="max-h-[18rem] overflow-y-auto flex flex-col justify-center items-center">
                            {loadingSchedule ? (
                                <Loading /> // Tampilkan loading saat fetching jadwal
                            ) : (
                                <ul className="space-y-4 mt-4 w-full">
                                    {(() => {
                                        const filteredSchedules = scheduleItems.filter((item) => {
                                            const scheduleDate = new Date(item.tanggal_mulai);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0); // Mengatur waktu ke awal hari
                                            return scheduleDate >= today; // Tampilkan jika jadwal >= hari ini
                                        });

                                        if (filteredSchedules.length === 0) {
                                            return (
                                                <li className="text-gray-500 text-center w-full flex justify-center items-center h-full">
                                                    There is no schedule
                                                </li>
                                            );
                                        }

                                        return filteredSchedules.map((item, index) => (
                                            <li key={index} className="border p-4 rounded-lg shadow-sm">
                                                <div className="text-lg font-semibold">{item.judul}</div>
                                                <div className="text-sm text-gray-600">{formatDate(item.tanggal_mulai)}</div>
                                                <div className="text-sm text-gray-600">{item.mulai}</div>
                                                {/* Container untuk tombol */}
                                                <div className="mt-4 p-2 bg-blue-500 rounded-lg">
                                                    <button
                                                        onClick={handleReadMore}
                                                        className="text-white font-semibold px-4 py-2 rounded-md"
                                                    >
                                                        Read More
                                                    </button>
                                                </div>
                                            </li>
                                        ));
                                    })()}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 p-4">
                    <CheckinDashboard />
                    <div className="col-span-2 drop-shadow-lg bg-white p-4 rounded-xl border h-72">
                        <FormControl variant="outlined" size="small" className="w-40 mb-2">
                            <InputLabel>Select Chart</InputLabel>
                            <Select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
                                <MenuItem value="kehadiranUser">Kehadiran User</MenuItem>
                                <MenuItem value="kehadiran">Kehadiran</MenuItem>
                                <MenuItem value="gender">Gender</MenuItem>
                                <MenuItem value="karyawan">Karyawan</MenuItem>
                            </Select>
                        </FormControl>
                        {selectedChart === "kehadiranUser" && <ChartDataKehadiranUser />}
                        {selectedChart === "kehadiran" && <ChartDataKehadiran />}
                        {selectedChart === "gender" && <ChartDataGender />}
                        {selectedChart === "karyawan" && <ChartDataKaryawan />}
                    </div>
                </div> */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                    <div className="drop-shadow-lg bg-white p-4 rounded-xl border h-72">
                        <h2 className="text-lg font-bold">Today's Absences</h2>
                        <div className="overflow-y-auto h-60">
                            {loading ? <Loading /> : absensiItems.map((item, index) => (
                                <div key={index} className="p-2 border-b">{item.nama} - {item.status}</div>
                            ))}
                        </div>
                    </div>
                    <div className="drop-shadow-lg bg-white p-4 rounded-xl border h-72">
                        <h2 className="text-lg font-bold">Announcements</h2>
                        <AnnouncementList />
                        <Button variant="contained" color="primary" onClick={() => setTambahFormOpen(true)}>Add Announcement</Button>
                    </div>
                </div> */}
            </div>
            {isTambahFormOpen && <Announcment onClose={() => setTambahFormOpen(false)} onSubmit={() => Swal.fire("Added successfully!")} />}
        </div>
    );
};
export default DashboardAdminSide;
