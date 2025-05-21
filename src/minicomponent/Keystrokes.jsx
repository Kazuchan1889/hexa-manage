import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Head from "../feature/Headbar"; // Impor Head
import Sidebar from "../feature/Sidebar"; // Impor Sidebar
import axios from "axios"; // Menggunakan axios untuk mengambil data dari API
import ip from "../ip"; // Menggunakan ip untuk mengambil base URL dari backend

const KeystrokeTracker = () => {
    const navigate = useNavigate();
    const [keystrokes, setKeystrokes] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [logs, setLogs] = useState([]);
    const [appHistory, setAppHistory] = useState([]);
    const [visitedTabs, setVisitedTabs] = useState([]);
    const [lastApp, setLastApp] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    // State untuk data pengguna
    const [userData, setUserData] = useState({
        nama: "",
        foto: null,
        jabatan: "",
    });

    // Ambil token dari localStorage dan kirimkan ke main process (hanya jika menggunakan Electron)
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            // Cek jika aplikasi berjalan di dalam Electron
            if (window.electron && typeof window.electron.sendAccessToken === 'function') {
                // Mengirimkan token ke main process melalui IPC jika Electron tersedia
                window.electron.sendAccessToken(accessToken);
            } else {
                console.warn('Electron is not available, skipping token send.');
            }
        }
    }, []);

    // Mengambil data aktivitas pengguna dari backend
    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                console.error("No access token found!");
                return;
            }

            try {
                // Ambil IDK dari token JWT atau localStorage (misalnya)
                const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
                const idk = decodedToken.id; // Ambil IDK dari token yang sudah didekode

                // Mengambil data aktivitas pengguna dari backend
                const response = await axios.get(`${ip}/api/Act/activity/${idk}`, {
                    headers: {
                        Authorization: accessToken, // Menyertakan token dalam header
                    },
                });

                const activityData = response.data.activity;

                if (activityData) {
                    setKeystrokes(activityData.keystrokes.length); // Hitung jumlah keystroke
                    setClicks(activityData.mouseClicks); // Langsung ambil angka dari backend
                    setLogs(activityData.keystrokes.concat(activityData.mouseClicks));
                    setVisitedTabs(activityData.visitedTabs.map(tab => tab.title));

                    // Filter aplikasi yang dibuka hari ini
                    const today = new Date().toISOString().split('T')[0]; // Ambil tanggal hari ini (yyyy-mm-dd)
                    const filteredAppHistory = activityData.visitedTabs.filter((tab) => {
                        const tabDate = new Date(tab.timestamp).toISOString().split('T')[0]; // Dapatkan tanggal aplikasi dibuka
                        return tabDate === today; // Bandingkan tanggal
                    });

                    // Format timestamp untuk hanya menampilkan jam
                    setAppHistory(filteredAppHistory.map((tab) => ({
                        app: tab.app,
                        title: tab.title,
                        timestamp: new Date(tab.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Menampilkan jam saja
                    })));
                }

                // Mengambil data pengguna
                const userResponse = await axios.get(`${ip}/api/karyawan/get/data/self`, {
                    headers: {
                        Authorization: accessToken, // Menyertakan token dalam header
                    },
                });

                const user = userResponse.data[0]; // Data pengguna ada pada array pertama
                console.log("User data:", user); // Debug: Tampilkan data pengguna di console

                // Memperbarui state dengan nama dan foto pengguna
                let userFoto = user.dokumen;
                // Menghilangkan prefix duplikat jika ada
                if (userFoto && userFoto.startsWith("data:image/jpeg;base64,data:image/jpeg;base64,")) {
                    userFoto = userFoto.replace("data:image/jpeg;base64,data:image/jpeg;base64,", "data:image/jpeg;base64,");
                }

                setUserData({
                    nama: user.nama || "Nama Pengguna", 
                    jabatan: user.jabatan || "jabatan", 
                    foto: userFoto || "default-profile-pic.jpg", // Foto dalam base64
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
            {/* Sidebar atau NavbarUser untuk tampilan mobile */}
            {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}

            <div className="flex flex-col flex-1 overflow-auto">
                {/* Head component */}
                <Head />

                {/* Bagian pertama: Profil dan Counter */}
                <div className="bg-[#11284E] justify-center items-center text-white p-6 h-56">
                    <h1 className="text-2xl font-bold text-center text-white">Activity Tracker</h1>
                    <div className="h-full w-full mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Komponen Profil Pengguna */}
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                                        {/* Foto Profil */}
                                        <img 
                                            src={userData.foto} 
                                            alt="User Profile" 
                                            className="w-full h-full rounded-full" 
                                        />
                                    </div>
                                    <div className="text-left">
                                        {/* Nama Pengguna */}
                                        <h2 className="text-2xl font-semibold text-black">{userData.nama}</h2>
                                        <p className="text-xl text-gray-500">{userData.jabatan}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Komponen Counter Mouse Click dan Key Stroke */}
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-black mb-4">Counter</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-black">
                                        <span>Mouse Clicks</span>
                                        <span>{clicks}</span> {/* Menampilkan angka klik mouse langsung */}
                                    </div>
                                    <div className="flex justify-between text-black">
                                        <span>Key Strokes</span>
                                        <span>{keystrokes}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bagian kedua: Log, Aplikasi Terbuka, dan Tab yang Dikunjungi */}
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                    {/* Log Keystroke dan Mouse Click */}
                    <div className="bg-white border border-black p-4 rounded-lg shadow-md flex-1">
                        <h3 className="text-lg font-semibold text-black mb-4">Log Activity</h3>
                        <div className="space-y-2">
                            {logs.map((log, index) => (
                                <div key={index} className="flex justify-between text-black">
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aplikasi yang Terbuka */}
                    <div className="bg-white border border-black p-4 rounded-lg shadow-md flex-1">
                        <h3 className="text-lg font-semibold text-black mb-4">Opened Applications</h3>
                        <div className="space-y-2">
                            {appHistory.map((app, index) => (
                                <div key={index} className="flex justify-between">
                                    {/* App dan Title di sebelah kiri */}
                                    <div className="text-left">{app.app}: {app.title}</div>

                                    {/* Jam dibuka di sebelah kanan */}
                                    <div className="text-right">{app.timestamp}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeystrokeTracker;
