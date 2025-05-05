import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const KeystrokeTracker = () => {
    const navigate = useNavigate();
    const [keystrokes, setKeystrokes] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [logs, setLogs] = useState([]);
    const [appHistory, setAppHistory] = useState([]);
    const [visitedTabs, setVisitedTabs] = useState([]); // 🔹 State untuk menyimpan tab yang dikunjungi
    const [lastApp, setLastApp] = useState(null);
    const [startTime, setStartTime] = useState(null);

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

                    // 🔹 Jika aplikasi adalah browser dan memiliki title (tab), simpan ke daftar visitedTabs
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
        <div className="p-6 bg-gradient-to-br from-gray-100 to-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-700 drop-shadow-sm">
                    Keystroke, Click & Active App Tracker
                </h1>

                <div className="flex justify-center mb-6">
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition duration-300"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Keystroke & Click */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Keystroke & Click</h2>
                    <p className="text-lg text-gray-700 mb-1">
                        Total Keystrokes: <span className="font-bold text-blue-600">{keystrokes}</span>
                    </p>
                    <p className="text-lg text-gray-700">
                        Total Mouse Clicks: <span className="font-bold text-blue-600">{clicks}</span>
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Recent Logs:</h3>
                    <ul className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                        {logs.length > 0 ? logs.map((log, index) => (
                            <li key={index} className="text-sm text-gray-700 py-1 border-b last:border-b-0">{log}</li>
                        )) : <li className="text-sm text-gray-500">Belum ada data</li>}
                    </ul>
                </div>

                {/* Application History */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Application History</h2>
                    <ul className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                        {appHistory.length > 0 ? appHistory.map((app, index) => (
                            <li key={index} className="text-sm text-gray-800 border-b last:border-b-0 py-3">
                                <div className="font-semibold text-blue-700">{app.name || "Unknown App"}</div>
                                <div>{app.title || "No Title"}</div>
                                <div className="text-xs text-gray-500">{app.timestamp || "Unknown Time"}</div>
                                <div className="text-sm text-gray-700 mt-1">Durasi Aktif: {app.duration} detik</div>
                                {app.name.includes("chrome.exe") && app.title && (
                                    <div className="mt-1 text-xs text-blue-500 italic">
                                        🔹 Tab: {app.title}
                                    </div>
                                )}
                            </li>
                        )) : <li className="text-sm text-gray-500">Belum ada aplikasi yang terdeteksi</li>}
                    </ul>
                </div>

                {/* Visited Tabs */}
                <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Visited Tabs</h2>
                    <ul className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                        {visitedTabs.length > 0 ? visitedTabs.map((tab, index) => (
                            <li key={index} className="text-sm text-gray-700 border-b last:border-b-0 py-2">
                                🔹 {tab}
                            </li>
                        )) : <li className="text-sm text-gray-500">Belum ada tab yang dikunjungi</li>}
                    </ul>
                </div>
            </div>
        </div>


    );
};

export default KeystrokeTracker;
