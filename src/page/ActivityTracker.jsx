import { useState, useEffect } from "react";
import ip from "../ip";

export default function ActivityPage() {
    const [activities, setActivities] = useState([]);
    const [idk, setIdk] = useState("");
    const [report, setReport] = useState("");
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null); // ID dari aktivitas yang sedang diedit

    // Fungsi untuk mengambil data aktivitas
    const fetchActivities = async () => {
        try {
            const headers = {
                Authorization: localStorage.getItem("accessToken"),
                "Content-Type": "application/json",
            };

            const response = await fetch(`${ip}/api/Act/Get`, { headers });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setActivities(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    // Ambil data saat pertama kali komponen dimuat
    useEffect(() => {
        fetchActivities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        let parsedReport;
        try {
            parsedReport = JSON.parse(report);
        } catch (error) {
            setError("Invalid JSON format in Report field.");
            return;
        }

        const headers = {
            Authorization: localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
        };

        try {
            const response = await fetch(`${ip}/api/Act/Post`, {
                method: "POST",
                headers,
                body: JSON.stringify({ idk, report: parsedReport }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setIdk("");
            setReport("");
            fetchActivities(); // Refresh data setelah menambahkan aktivitas
        } catch (error) {
            console.error("Error posting activity:", error);
            setError("Failed to submit activity. Please check the console.");
        }
    };

    // Fungsi untuk mulai mengedit aktivitas
    const handleEdit = (activity) => {
        setEditingId(activity.id); // Simpan ID aktivitas yang sedang diedit
        setIdk(activity.idk);
        setReport(JSON.stringify(activity.report, null, 2)); // Format JSON agar lebih terbaca
    };

    // Fungsi untuk mengupdate aktivitas
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");

        if (!editingId) {
            setError("No activity selected for update.");
            return;
        }

        let parsedReport;
        try {
            parsedReport = JSON.parse(report);
        } catch (error) {
            setError("Invalid JSON format in Report field.");
            return;
        }

        const headers = {
            Authorization: localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
        };

        try {
            const response = await fetch(`${ip}/api/Act/Fetch`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({ id: editingId, idk, report: parsedReport }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setIdk("");
            setReport("");
            setEditingId(null);
            fetchActivities(); // Refresh data setelah update
        } catch (error) {
            console.error("Error updating activity:", error);
            setError("Failed to update activity. Please check the console.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Activity List</h1>
            {error && <p className="text-red-500">{error}</p>}

            {/* Form untuk menambah atau mengedit aktivitas */}
            <form className="mt-4" onSubmit={editingId ? handleUpdate : handleSubmit}>
                <input
                    type="text"
                    placeholder="IDK"
                    value={idk}
                    onChange={(e) => setIdk(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <textarea
                    placeholder='Report (JSON Format, contoh: {"key": "value"})'
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editingId ? "Update Activity" : "Add Activity"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setIdk("");
                            setReport("");
                        }}
                        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* List aktivitas */}
            <ul className="mt-6">
                {activities.length > 0 ? (
                    activities.map((act) => (
                        <li key={act.id} className="border p-2 my-2">
                            <p><strong>IDK:</strong> {act.idk}</p>
                            <p><strong>Report:</strong> {JSON.stringify(act.report)}</p>
                            <p><strong>Created At:</strong> {act.created_at}</p>
                            <button
                                onClick={() => handleEdit(act)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
                            >
                                Edit
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No activities found.</p>
                )}
            </ul>
        </div>
    );
}
