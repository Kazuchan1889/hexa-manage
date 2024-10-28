import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ip from "../ip";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarUser from "../feature/NavbarUser";
import { useNavigate } from "react-router-dom"; // Untuk redirect ke halaman Home

function LiveAttendance() {
    const [masuk, setMasuk] = useState("");
    const [keluar, setKeluar] = useState("");
    const [serverTime, setServerTime] = useState("");
    const [checkInStatus, setCheckInStatus] = useState(
        localStorage.getItem("result") || null
    );
    const [location, setLocation] = useState(null);
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false); // prevent multiple submissions
    const navigate = useNavigate(); // Untuk redirect ke halaman Home

    const isUserCheckin = checkInStatus === "udahMasuk";
    const isUserCheckout = checkInStatus === "udahKeluar";

    useEffect(() => {
        if (checkInStatus) {
            // Jika user sudah check-in atau check-out, tidak perlu fetch lagi
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

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg");  // Return the Base64 encoded string
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

    const handleCheckIn = async () => {
        if (isLoading || isUserCheckin) {
            // Jika user sudah check-in, tampilkan notifikasi dan arahkan ke Home
            Swal.fire({
                icon: "error",
                title: "Check In Gagal!",
                text: "Anda sudah melakukan Check In atau Check Out.",
            }).then(() => {
                navigate("/home"); // Arahkan user ke halaman Home
            });
            return;
        }
        setIsLoading(true);

        try {
            const fotomasuk = capturePhoto(); // Get Base64 photo
            const location = await getLocation(); // Get user's location

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
            const payload = {
                fotomasuk, // send Base64 photo
                location,
            };

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
            const fotokeluar = capturePhoto(); // Get Base64 photo

            const apiSubmit = `${ip}/api/absensi/patch/keluar`;
            const headers = {
                Authorization: localStorage.getItem("accessToken"),
                "Content-Type": "application/json",
            };
            const payload = {
                fotokeluar, // send Base64 photo
            };

            const response = await axios.patch(apiSubmit, payload, { headers });

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
    const scheduleDate = `Schedule, ${date}`;

    function formatServerTime(serverTime) {
        const [hours, minutes] = serverTime
            .split(":")
            .map((part) => (part.length === 1 ? `0${part}` : part));
        return `${hours}:${minutes}`;
    }

    return (
        <div className="w-full h-full" style={{ backgroundColor: "#F0F0F0" }}>
            <NavbarUser />
            <div className="m-10 p-6 border rounded-lg drop-shadow-lg bg-white">
                <h1 className="text-left font-semibold text-2xl text-primary">
                    Live Attendance
                </h1>
                <div className="flex flex-row justify-between pt-2">
                    <div>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {formattedDate}
                        </Typography>
                        <Typography variant="subtitle2">
                            {scheduleDate}
                        </Typography>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-2xl font-bold" style={{ color: "#3F51B5" }}>
                            {formatServerTime(serverTime)}
                        </div>
                        <Typography variant="subtitle2">
                            Check-in Time
                        </Typography>
                    </div>
                </div>
                <div className="border-b-2 w-full border-gray-400 my-4"></div>
                <div className="w-full flex justify-center mb-6">
                    <video ref={videoRef} className="w-full max-w-sm rounded-md" />
                </div>
                <div className="flex flex-col items-center">
                    {checkInStatus !== "udahMasuk" ? (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleCheckIn}
                            style={{ width: "80%" }}
                            disabled={isUserCheckin || isLoading} // Disable button if already checked in
                        >
                            Check In
                        </Button>
                    ) : checkInStatus === "udahMasuk" && checkInStatus !== "udahKeluar" ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={handleCheckOut}
                            style={{ width: "80%" }}
                            disabled={isUserCheckout || isLoading} // Disable button if already checked out
                        >
                            Check Out
                        </Button>
                    ) : (
                        <CheckCircleRoundedIcon
                            color="success"
                            style={{ fontSize: "4rem" }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default LiveAttendance;
