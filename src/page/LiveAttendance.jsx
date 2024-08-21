import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ip from "../ip";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarUser from "../feature/NavbarUser";

function LiveAttendance() {
    const [masuk, setMasuk] = useState("");
    const [keluar, setKeluar] = useState("");
    const [serverTime, setServerTime] = useState("");
    const [checkInStatus, setCheckInStatus] = useState(
        localStorage.getItem("result")
    );
    const [location, setLocation] = useState(null);
    const videoRef = useRef(null);

    const isUserCheckin = localStorage.getItem("result") === "udahMasuk";
    const isUserCheckout = localStorage.getItem("result") === "udahKeluar";
    const userStatusIzin = localStorage.getItem("status") === "izin";
    const userStatusCuti = localStorage.getItem("status") === "cuti";
    const userStatusSakit = localStorage.getItem("status") === "sakit";

    useEffect(() => {
        const apiCheckIn = `${ip}/api/absensi/get/today/self`;
        const headers = {
            Authorization: localStorage.getItem("accessToken"),
        };
        axios
            .get(apiCheckIn, { headers })
            .then((response) => {
                setMasuk(response.data.masuk);
                setKeluar(response.data.keluar);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error", error);
            });
    }, []);

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

    const handleCheckIn = () => {
        const capturePhoto = () => {
            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            const photoDataUrl = canvas.toDataURL("image/jpeg");

            // Create a link element to download the photo
            const link = document.createElement("a");
            link.href = photoDataUrl;
            link.download = "checkin_photo.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return photoDataUrl;
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

        Promise.all([capturePhoto(), getLocation()])
            .then(([photo, location]) => {
                setLocation(location);

                const isWithinArea = (latitude, longitude) => {
                    const targetLat = -6.1675795; 
                    const targetLng = 106.7824544; 
                    const radius = 520; // 80 meters radius

                    const distance = calculateDistance(latitude, longitude, targetLat, targetLng);

                    console.log("Current Location:", location); // Log koordinat ke console
                    console.log("Distance from target:", distance, "meters"); // Log jarak ke console
                    return distance <= radius;
                };

                if (!isWithinArea(location.latitude, location.longitude)) {
                    Swal.fire({
                        icon: "error",
                        title: "Check In Failed!",
                        text: "You are not within the required location.",
                    });
                    return;
                }

                const checkInSuccessful = true;
                if (checkInSuccessful) {
                    localStorage.setItem("result", "udahMasuk");
                    setCheckInStatus("udahMasuk");

                    const apiSubmit = `${ip}/api/absensi/patch/masuk`;
                    const headers = {
                        Authorization: localStorage.getItem("accessToken"),
                        "Content-Type": "application/json",
                    };

                    axios
                        .patch(apiSubmit, { photo, location }, { headers })
                        .then((response) => {
                            const apiCheckIn = `${ip}/api/absensi/get/today/self`;
                            axios
                                .get(apiCheckIn, { headers })
                                .then((response) => {
                                    setMasuk(response.data.masuk);
                                    setKeluar(response.data.keluar);
                                })
                                .catch((error) => {
                                    console.error("Error", error);
                                });
                            console.log(response);
                            Swal.fire({
                                icon: "success",
                                title: "Check In Sukses!",
                                text: response.data,
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            Swal.fire({
                                icon: "error",
                                title: "Check In Gagal!",
                                text: "An error occurred while processing your request.",
                            });
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Check In Failed!",
                    text: "Could not get location or capture photo.",
                });
            });
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

    const handleCheckOut = () => {
        const apiSubmit = `${ip}/api/absensi/patch/keluar`;
        const headers = {
            Authorization: localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
        };
        axios
            .patch(apiSubmit, {}, { headers })
            .then((response) => {
                if (!response.data.includes("dapat dilakukan")) setKeluar(true);
                console.log(response);
                Swal.fire({
                    icon: response.data.includes("dapat dilakukan") ? "error" : "success",
                    title: response.data.includes("dapat dilakukan")
                        ? "Check Out Gagal!"
                        : "Check Out Sukses!",
                    text: response.data,
                });
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Check Out Gagal!",
                    text: "An error occurred while processing your request.",
                });
            });
        if (keluar) {
            localStorage.setItem("result", "udahKeluar");
            setCheckInStatus("udahKeluar");
        }
    };

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
