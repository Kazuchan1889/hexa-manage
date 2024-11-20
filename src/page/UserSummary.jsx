import React, { useState, useEffect } from 'react';
import { TextField } from "@mui/material";
import axios from 'axios';
import ip from '../ip'; // Pastikan path ke file ip sesuai

const UserSummary = () => {
    const [summaryData, setSummaryData] = useState({
        totalAttendance: 0,
        totalOvertime: 0,
        totalDayOff: 0,
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                console.error("Access token not found.");
                return;
            }

            // Decode payload token JWT untuk mendapatkan data user
            const userData = JSON.parse(atob(accessToken.split(".")[1]));
            const extractedUserId = userData?.id;

            if (!extractedUserId) {
                console.error("User ID not found in token.");
                return;
            }

            setUserId(extractedUserId);
        } catch (error) {
            console.error("Error decoding access token:", error);
        }
    }, []);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("accessToken"),
        },
    };

    useEffect(() => {
        if (userId && selectedYear) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(
                        `${ip}/api/kehadiran/list/karyawan/${userId}?year=${selectedYear}`,
                        config
                    );

                    const responseData = response.data[0];
                    if (responseData) {
                        setSummaryData({
                            totalAttendance: responseData["total absensi"],
                            totalOvertime: responseData["jatah overtime"],
                            totalDayOff: responseData["total hari cuti"],
                        });
                    } else {
                        console.warn("No data received from the server.");
                        setSummaryData({
                            totalAttendance: 0,
                            totalOvertime: 0,
                            totalDayOff: 0,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [selectedYear, userId]);

    const handleYearChange = (e) => {
        const newYear = e.target.value;

        // Pastikan input hanya angka positif
        if (newYear && !isNaN(newYear) && parseInt(newYear, 10) > 0) {
            setSelectedYear(parseInt(newYear, 10));
        } else if (newYear === '') {
            // Jika input kosong, kosongkan state `selectedYear`
            setSelectedYear('');
        }
    };

    return (
        <div>
            <div className='flex mx-2 justify-between border-b-2 pb-2 border-gray-300'>
                <TextField
                    type="number"
                    label="Year"
                    size="small"
                    className="w-1/6"
                    value={selectedYear}
                    onChange={handleYearChange}
                />
                <h1>{new Date().toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}</h1>
            </div>
            <div className='flex mx-4 my-2 justify-between'>
                <div>
                    <h1 className='font-bold'>Total Attendance</h1>
                    <h2 className='text-center'>{summaryData.totalAttendance} days</h2>
                </div>
                <div>
                    <h1 className='font-bold'>Total Overtime</h1>
                    <h2 className='text-center'>{summaryData.totalOvertime} hours</h2>
                </div>
                <div>
                    <h1 className='font-bold'>Total Day Off</h1>
                    <h2 className='text-center'>{summaryData.totalDayOff} days</h2>
                </div>
            </div>
        </div>
    );
};

export default UserSummary;
