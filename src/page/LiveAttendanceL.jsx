import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Swal from "sweetalert2";
import NavbarUser from "../feature/NavbarUser";
import { useNavigate } from "react-router-dom"; // Untuk redirect ke halaman Home

function LiveAttendance() {
    const [serverTime, setServerTime] = useState("");
    const videoRef = useRef(null);
    const navigate = useNavigate(); // Untuk redirect ke halaman Home

    useEffect(() => {
        const fetchServerTime = () => {
            const currentTime = new Date();
            setServerTime(
                `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
            );
        };

        fetchServerTime();
        const intervalId = setInterval(fetchServerTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleRequestAbsen = () => {
        Swal.fire({
            icon: "success",
            title: "Request Has Successfully Sent!",
            text: "You will be redirected to the Home page.",
        }).then(() => {
            navigate("/Dashboard"); // Arahkan user ke halaman Home
        });
    };

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((error) => {
                console.error("Error accessing webcam", error);
            });
    }, []);

    const day = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const date = new Date()
        .toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        .replace(",", "");

    const formattedDate = `${day}, ${date}`;

    return (
        <div className="w-full h-full" style={{ backgroundColor: "#F0F0F0" }}>
            <NavbarUser />
            <div className="m-10 p-6 border rounded-lg drop-shadow-lg bg-white">
                <h1 className="text-left font-bold text-2xl text-primary">
                    Live Attendance
                </h1>
                <div className="flex flex-row justify-between pt-2">
                    <div>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {formattedDate}
                        </Typography>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-2xl font-bold" style={{ color: "#3F51B5" }}>
                            {serverTime}
                        </div>
                        <Typography variant="subtitle2">
                            Check-in Time
                        </Typography>
                    </div>
                </div>
                <div className="border-b-2 w-full border-gray-400 my-4"></div>
                <div className="w-full flex justify-center mb-4">
                    <video ref={videoRef} className="w-full max-w-sm rounded-md" />
                </div>
                <div className="flex flex-col items-center">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleRequestAbsen}
                        style={{ width: "80%" }}
                    >
                        Request Absen
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LiveAttendance;
