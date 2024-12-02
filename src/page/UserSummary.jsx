import React, { useState, useEffect } from "react";
import { Avatar, Button, Typography, TextField, MenuItem } from "@mui/material";
import NavbarUser from "../feature/NavbarUser";
import axios from "axios";
import Swal from "sweetalert2";
import ip from "../ip";

const dummyData = {
  activities: [
    { date: "2024-11-20", time: "08:30 AM", status: "Present" },
    { date: "2024-11-19", time: "09:00 AM", status: "Late" },
    { date: "2024-11-18", time: "-", status: "Absent" },
  ],
  filterOptions: ["My Logs", "All Logs"],
};

export default function SummaryPage({ isAdmin }) {
  const [filter, setFilter] = useState(dummyData.filterOptions[0]);
  const [stats, setStats] = useState({ dayOff: 0, absence: 0, overtimeHours: 0 });
  const [userData, setUserData] = useState({
    nama: "",
    jabatan: "",
    foto: "",
  });

  // Fungsi untuk mengambil data statistik dari backend
  const fetchStatsData = async () => {
    try {
      const userId = getIdFromAccessToken();
      if (!userId) throw new Error("User ID not found");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      const response = await axios.get(`${ip}/api/user/stats/${userId}`, config);

      if (response.data) {
        const { dayOff, absence, overtimeHours } = response.data;
        setStats({ dayOff, absence, overtimeHours });
      }
    } catch (error) {
      console.error("Failed to fetch stats data:", error);
    }
  };

  // Fungsi untuk mengambil data pengguna dari backend
  const fetchUserData = async () => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    try {
      const response = await axios.get(apiUrl, { headers });
      const userData = response.data[0];

      checkRequiredProperties(userData, [
        "nama",
        "jabatan",
        "foto",
      ]);

      setUserData({
        nama: userData.nama || "",
        jabatan: userData.jabatan || "",
        foto: userData.dokumen || "https://via.placeholder.com/150",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      Swal.fire({
        icon: "error",
        title: "Data Not Available",
        text: "User data is not available. Please check your internet connection or try again later.",
      });
    }
  };

  // Fungsi untuk memeriksa properti yang diperlukan
  const checkRequiredProperties = (data, requiredProperties) => {
    const emptyProperties = requiredProperties.filter((property) => !data[property]);
    if (emptyProperties.length > 0) {
      
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchStatsData();
  }, []);

  return (
    <div>
    <NavbarUser />
      <div className="w-full min-h-screen bg-gray-100 p-5">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col text-left">
            <Typography
              className="text-gray-800"
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: "bold", fontSize: "30px" }}
            >
              {userData.nama}
            </Typography>
            <Typography
              className="text-gray-600"
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: "normal", fontSize: "24px" }}
            >
              {userData.jabatan}
            </Typography>
          </div>
          <Avatar
            alt="User Avatar"
            src={userData.foto}
            sx={{ width: 120, height: 120 }}
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Typography className="text-gray-600 font-semibold text-lg">Dayoff</Typography>
            <Typography className="text-gray-800 text-2xl font-bold">{stats.dayOff}</Typography>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Typography className="text-gray-600 font-semibold text-lg">Absence</Typography>
            <Typography className="text-gray-800 text-2xl font-bold">{stats.absence}</Typography>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Typography className="text-gray-600 font-semibold text-lg">Overtime Hours</Typography>
            <Typography className="text-gray-800 text-2xl font-bold">{stats.overtimeHours}</Typography>
          </div>
        </div>

        {/* Other Sections */}
        {/* Filter Section (Admin Only) */}
        {isAdmin && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
            <TextField
              select
              label="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              fullWidth
            >
              {dummyData.filterOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}

        {/* Activity List */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <Typography className="text-lg font-semibold mb-4 text-gray-800">
            {isAdmin ? "Attendance Logs" : "Your Attendance Activities"}
          </Typography>
          <div className="divide-y divide-gray-200">
            {dummyData.activities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-4">
                <div>
                  <Typography className="text-gray-800">{activity.date}</Typography>
                  <Typography className="text-gray-500">{activity.time}</Typography>
                  <Typography className="text-gray-700">{activity.status}</Typography>
                </div>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#00bcd4",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#008ba3" },
                  }}
                >
                  Request
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
