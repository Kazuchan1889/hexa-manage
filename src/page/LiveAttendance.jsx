import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ip from "../ip";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarUser from "../feature/Headbar";
import { useNavigate } from "react-router-dom";

function LiveAttendance() {
    const [masuk, setMasuk] = useState("");
    const [keluar, setKeluar] = useState("");
    const [serverTime, setServerTime] = useState("");
    const [checkInStatus, setCheckInStatus] = useState(
        localStorage.getItem("result") || null
    );
    const [location, setLocation] = useState(null);
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const isUserCheckin = checkInStatus === "udahMasuk";
    const isUserCheckout = checkInStatus === "udahKeluar";

    useEffect(() => {
        if (checkInStatus) {
            return;
        }

        const apiCheckIn = `${ip}/api/absensi/get/today/self`;
        const headers = {
            Authorization: localStorage.getItem("accessToken"),
        };
        axios
            .get(apiCheckIn, { headers })
            .then((response) => {
                setMasuk(response.data.masuk);
                setKeluar(response.data.keluar);
                setCheckInStatus(localStorage.getItem("result"));
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error", error);
            });
    }, [checkInStatus]);

    useEffect(() => {
        const fetchServerTime = () => {
            const apiCheckIn = `${ip}/api/absensi/get/today/self`;
            const headers = {
                Authorization: localStorage.getItem("accessToken"),
            };

            axios
                .get(apiCheckIn, { headers })
                .then((response) => {
                    setServerTime(response.data.currtime);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching server time", error);
                });
        };

        fetchServerTime();
        const intervalId = setInterval(fetchServerTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // Fungsi untuk mengambil lokasi kerja dari access token
    function getLokasiKerjaFromAccessToken() {
        const token = localStorage.getItem("accessToken");
        if (!token) return null; // Token tidak ditemukan

        try {
            // Token biasanya berupa format Base64 (mungkin JWT)
            const payloadBase64 = token.split('.')[1]; // Bagian payload dari token (biasanya setelah titik pertama)
            const decodedPayload = atob(payloadBase64); // Decode dari Base64
            const payload = JSON.parse(decodedPayload); // Parsing JSON payload

            return payload.lokasikerja || null; // Mengambil lokasi kerja jika ada
        } catch (error) {
            console.error("Invalid token format:", error);
            return null;
        }
    }

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        // Gambar frame video ke dalam canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Buat timestamp
        const now = new Date();
        const timestamp = now.toLocaleString(); // Format waktu lokal

        // Ambil lokasi kerja dari access token
        let lokasiKerja = getLokasiKerjaFromAccessToken() || "Lokasi Tidak Tersedia"; // Default jika tidak ada lokasi kerja

        // Tambahkan timestamp dan lokasi ke canvas
        ctx.font = "24px Helvetica";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        // Gambar teks dengan outline hitam agar lebih terbaca
        ctx.strokeText(timestamp + " - " + lokasiKerja, 10, canvas.height - 30);
        ctx.fillText(timestamp + " - " + lokasiKerja, 10, canvas.height - 30);

        // Konversi canvas ke data URL
        return canvas.toDataURL("image/jpeg");
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => reject(error)
            );
        });
    };

    const isWithinArea = (latitude, longitude) => {
        const targetLat = -6.1677998;
        const targetLng = 106.7861411;
        const radius = 80000; // 80 meters radius

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = (value) => (value * Math.PI) / 180;
            const R = 6371e3; // Radius of Earth in meters
            const φ1 = toRad(lat1);
            const φ2 = toRad(lat2);
            const Δφ = toRad(lat2 - lat1);
            const Δλ = toRad(lon2 - lon1);

            const a =
                Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c; // in meters
        };

        const distance = calculateDistance(latitude, longitude, targetLat, targetLng);

        console.log("Current Location:", { latitude, longitude });
        console.log("Distance from target:", distance, "meters");

        return distance <= radius;
    };

    const getLocalIP = () => {
        return new Promise((resolve, reject) => {
            const peerConnection = new RTCPeerConnection();
            peerConnection.createDataChannel("");
            peerConnection.createOffer().then((offer) => peerConnection.setLocalDescription(offer));

            peerConnection.onicecandidate = (event) => {
                if (event && event.candidate) {
                    const candidate = event.candidate.candidate;
                    const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
                    if (ipMatch) {
                        resolve(ipMatch[1]); // Return the matched IP address
                        peerConnection.close();
                    }
                }
            };
            setTimeout(() => reject("Unable to get IP address"), 5000);
        });
    };

    const handleCheckIn = async () => {
        if (isLoading || isUserCheckin) {
            Swal.fire({
                icon: "error",
                title: "Check In Gagal!",
                text: "Anda sudah melakukan Check In atau Check Out.",
            }).then(() => {
                navigate("/home");
            });
            return;
        }
        setIsLoading(true);

        try {
            const localIP = await getLocalIP();
            console.log("Detected IP:", localIP);


            if (localIP !== "192.168.1.142") {
                Swal.fire({
                    icon: "error",
                    title: "Check In Gagal!",
                    text: "Anda tidak terhubung ke jaringan yang sesuai.",
                });
                setIsLoading(false);
                return;
            }

            const fotomasuk = capturePhoto();
            const location = await getLocation();

            if (!isWithinArea(location.latitude, location.longitude)) {
                Swal.fire({
                    icon: "error",
                    title: "Check In Failed!",
                    text: "You are not within the required location.",
                });
                setIsLoading(false);
                return;
            }

            const apiSubmit = `${ip}/api/absensi/patch/masuk`;
            const headers = {
                Authorization: localStorage.getItem("accessToken"),
                "Content-Type": "application/json",
            };
            const payload = { fotomasuk, location };

            const response = await axios.patch(apiSubmit, payload, { headers });

            if (response.status === 200) {
                localStorage.setItem("result", "udahMasuk");
                setCheckInStatus("udahMasuk");
                setMasuk(response.data.masuk);
                Swal.fire({
                    icon: "success",
                    title: "Check In Sukses!",
                    text: response.data,
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Check In Gagal!",
                text: "An error occurred while processing your request.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleCheckOut = async () => {
        if (isLoading || isUserCheckout) {
            // Jika user sudah check-out, tampilkan notifikasi dan arahkan ke Home
            Swal.fire({
                icon: "error",
                title: "Check Out Gagal!",
                text: "Anda sudah melakukan Check Out atau Check In.",
            }).then(() => {
                navigate("/home"); // Arahkan user ke halaman Home
            });
            return;
        }
        setIsLoading(true);

        try {
            // 🔍 Validasi IP sebelum check-out
            const localIP = await getLocalIP();
            if (localIP !== "192.168.1.142") {
                Swal.fire({
                    icon: "error",
                    title: "Check Out Gagal!",
                    text: `IP Address Anda (${localIP}) tidak diizinkan.`,
                });
                setIsLoading(false);
                return;
            }

            // 📸 Ambil foto saat check-out
            const fotokeluar = capturePhoto(); // Get Base64 photo

            // 🔗 Endpoint API untuk check-out
            const apiSubmit = `${ip}/api/absensi/patch/keluar`;
            const headers = {
                Authorization: localStorage.getItem("accessToken"),
                "Content-Type": "application/json",
            };
            const payload = {
                fotokeluar, // send Base64 photo
            };

            // 📨 Kirim request ke API
            const response = await axios.patch(apiSubmit, payload, { headers });

            // ✅ Jika berhasil
            if (response.status === 200) {
                localStorage.setItem("result", "udahKeluar");
                setCheckInStatus("udahKeluar");
                setKeluar(response.data.keluar);
                Swal.fire({
                    icon: "success",
                    title: "Check Out Sukses!",
                    text: response.data,
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Check Out Gagal!",
                text: "An error occurred while processing your request.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((error) => {
                console.error("Error accessing webcam", error);
            });
    }, []);

    const day = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const date = new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).replace(",", "");

    const formattedDate = `${day}, ${date}`;

    function formatServerTime(serverTime) {
        const [hours, minutes] = serverTime
            .split(":")
            .map((part) => (part.length === 1 ? `0${part}` : part));
        return `${hours}:${minutes}`;
    }

    return (
        <div className="w-full h-full">
            <NavbarUser />
            {/* Header */}
            <div>
                <div className="w-full py-6 flex flex-col items-center bg-[#11284E]">
                    <h1 className="text-white font-bold text-2xl text-center px-2">
                        LIVE ATTENDANCE
                    </h1>
                    <div className="text-white font-bold text-xl mt-2">
                        {serverTime} WIB
                    </div>
                    <Typography variant="subtitle2" className="text-white text-sm">
                        Check-in Time
                    </Typography>
                </div>
                <div className="m-auto mt-10 p-6 border rounded-lg drop-shadow-lg bg-white flex flex-col items-center max-w-[1000px] w-full h-auto">
                    {/* Video Stream */}
                    <div className="w-full flex justify-center mb-6">
                        <video
                            ref={videoRef}
                            className="w-40 sm:w-80 aspect-square rounded-full border-4 border-gray-300 object-cover"
                        />
                    </div>

                    {/* Attendance Actions */}
                    <div className="flex  flex-col items-center  w-full">
                        {checkInStatus === "udahMasuk" && !isUserCheckout ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleCheckOut}
                                className="w-full sm:w-1/2 bg-[#11284E]"
                                disabled={isUserCheckout || isLoading}
                            >
                                Check Out
                            </Button>
                        ) : checkInStatus === "udahKeluar" || (isUserCheckin && isUserCheckout) ? (
                            <span className="text-red-600 text-lg">
                                Kamu sudah absen hari ini!
                            </span>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleCheckIn}
                                className="w-full sm:w-1/2 bg-[#11284E]"
                                disabled={isUserCheckin || isLoading}
                            >
                                Check In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveAttendance;