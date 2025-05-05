import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Head from "../feature/Headbar"; // Impor Head
import Sidebar from "../feature/Sidebar"; // Impor Sidebar

const KeystrokeTracker = () => {
    const navigate = useNavigate();
    const [keystrokes, setKeystrokes] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [logs, setLogs] = useState([]);
    const [appHistory, setAppHistory] = useState([]);
    const [visitedTabs, setVisitedTabs] = useState([]); // State untuk menyimpan tab yang dikunjungi
    const [lastApp, setLastApp] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); // Menentukan apakah perangkat mobile

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024); // Update isMobile saat resize
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize); // Bersihkan event listener saat komponen unmount
        };
    }, []);

    useEffect(() => {
        if (window.electron) {
            console.log("Electron ditemukan, menunggu data...");

            window.electron.receive("keystroke-data", (data) => {
                console.log("Data diterima dari Electron:", data);
                if (typeof data === "string") {
                    if (data.startsWith("Key Pressed:")) {
                        setKeystrokes((prev) => prev + 1);
                    } else if (data.startsWith("Mouse Clicked:")) {
                        setClicks((prev) => prev + 1);
                    }
                    setLogs((prevLogs) => [...prevLogs, data].slice(-10));
                }
            });

            window.electron.receive("active-app-history", (data) => {
                console.log("🚀 Data aplikasi diterima:", data);

                if (data && data.name) {
                    setAppHistory((prevHistory) => {
                        const existingApp = prevHistory.find((app) => app.name === data.name);
                        if (existingApp) {
                            return prevHistory.map((app) =>
                                app.name === data.name ? { ...app, timestamp: data.timestamp } : app
                            );
                        }
                        return [...prevHistory, { ...data, duration: 0 }];
                    });

                    setLastApp(data);
                    setStartTime(new Date());

                    // Jika aplikasi adalah browser dan memiliki title (tab), simpan ke daftar visitedTabs
                    if (data.name.includes("chrome.exe") && data.title) {
                        setVisitedTabs((prevTabs) => {
                            if (!prevTabs.includes(data.title)) {
                                return [...prevTabs, data.title];
                            }
                            return prevTabs;
                        });
                    }
                } else {
                    console.warn("⚠️ Data aplikasi tidak valid:", data);
                }
            });

            window.electron.receive("active-app-time", (data) => {
                console.log("⏳ Update durasi aplikasi diterima:", data);

                if (data && data.name) {
                    setAppHistory((prevHistory) =>
                        prevHistory.map((app) =>
                            app.name === data.name ? { ...app, duration: data.duration } : app
                        )
                    );
                }
            });
        } else {
            console.warn("window.electron tidak ditemukan!");
        }
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
                                    {/* Gambar User digantikan dengan Icon Orang */}
                                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                                        <i className="fas fa-user text-white text-2xl"></i> {/* Ikon orang */}
                                    </div>
                                    <div className="">
                                        <h2 className="text-2xl font-semibold text-black">Nama Pengguna</h2>
                                        <p className="text-xl text-gray-500">Jabatan Pengguna</p>
                                    </div>
                                </div>
                            </div>

                            {/* Komponen Counter Mouse Click dan Key Stroke */}
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-black mb-4">Counter</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-black">
                                        <span>Mouse Clicks</span>
                                        <span>{clicks}</span> {/* Dinamis dari state clicks */}
                                    </div>
                                    <div className="flex justify-between text-black">
                                        <span>Key Strokes</span>
                                        <span>{keystrokes}</span> {/* Dinamis dari state keystrokes */}
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
                                <div key={index}>{app.name}</div> // Tampilkan nama aplikasi
                            ))}
                        </div>
                    </div>

                    {/* Tab yang Dikunjungi */}
                    <div className="bg-white p-4 border border-black rounded-lg shadow-md flex-1">
                        <h3 className="text-lg font-semibold text-black mb-4">Visited Tabs</h3>
                        <div className="space-y-2">
                            {visitedTabs.map((tab, index) => (
                                <div key={index}>{tab}</div> // Tampilkan tab yang dikunjungi
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeystrokeTracker;
