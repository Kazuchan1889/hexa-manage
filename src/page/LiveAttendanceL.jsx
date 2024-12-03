import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import Swal from "sweetalert2";
import NavbarUser from "../feature/NavbarUser";
import { useNavigate } from "react-router-dom"; // Untuk redirect ke halaman Home
import axios from "axios"; // Import axios
import ip from "../ip";  // Assuming this file contains your API endpoint

function LiveAttendance() {
    const [serverTime, setServerTime] = useState("");
    const [date, setDate] = useState("");  // state to store formatted date
    const videoRef = useRef(null);
    const navigate = useNavigate(); // Untuk redirect ke halaman Home
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

    // Fetch current time every second
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

    // Access webcam stream
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

    // Set formatted date once when component mounts
    useEffect(() => {
        const day = new Date().toLocaleDateString("en-US", { weekday: "short" });
        const currentDate = new Date()
            .toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(",", "");
        setDate(`${day}, ${currentDate}`);  // update date state
    }, []); // This effect will run only once when component mounts

    const handleRequestAbsen = async () => {
        // Retrieve user data from localStorage or context
        
        // Set headers with Authorization token from localStorage
        const headers = {
            Authorization: localStorage.getItem("accessToken"),
        };

        try {
            const response = await axios.post(
                `${ip}/api/weekendabsensi/post/self`, 
                { date: date },  // Send the date state
                { headers }  // Include headers in the request
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Request Has Successfully Sent!",
                    text: "You will be redirected to the Home page.",
                }).then(() => {
                    navigate("/Dashboard"); // Arahkan user ke halaman Home
                });
            }
        } catch (error) {
            console.error("Error sending request", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "There was an error with the request.",
            });
        }
    };
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // Format menjadi yyyy-mm-dd
        setDate(formattedDate);
      }, []);
    
      const handleRequest = async () => {
        const headers = {
          Authorization: localStorage.getItem("accessToken"), // Menambahkan header otorisasi
        };
    
        try {
          setLoading(true);
          const response = await axios.post(
            `${ip}/api/weekendabsensi/post/self`,
            { date: date },
            { headers: headers } // Mengirimkan headers bersama permintaan
          );
    
          if (response.status === 200) {
            Swal.fire({
                icon: "success",
                title: "Request Has Successfully Sent!",
                text: "You will be redirected to the Home page.",
            }).then(() => {
                navigate("/Dashboard"); // Arahkan user ke halaman Home
            });
        }
    } catch (error) {
        console.error("Error sending request", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There was an error with the request.",
        });
    }
      };

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
                            {date}  {/* Render the date */}
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
                        onClick={handleRequest}
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
