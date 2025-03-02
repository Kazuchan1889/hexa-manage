import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin datalabels
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Typography } from "@mui/material";
import ip from "../ip";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";

function ChartDataKehadiranUser() {
  Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [userData, setUserData] = useState([0, 0, 0, 0, 0, 0]); // Default array 0 agar tidak error
  const [totalDays, setTotalDays] = useState(0);
  const loading = useSelector((state) => state.loading.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(loadingAction.startLoading(true));
    const apiUrl = `${ip}/api/absensi/get/status/month`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data || [0, 0, 0, 0, 0, 0];
        setUserData(data);
        setTotalDays(data.reduce((acc, cur) => acc + cur, 0)); // Hitung total hari
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        dispatch(loadingAction.startLoading(false));
      });
  }, [dispatch]);

  const data = {
    labels: ["Present", "Leave", "Permission", "Sick", "Absent", "Late"],
    datasets: [
      {
        data: userData,
        backgroundColor: [
          "rgba(32, 70, 130, 1)",
          "rgba(235, 112, 103, 1)",
          "rgba(50, 184, 211, 1)",
          "rgba(235, 148, 44, 1)",
          "rgba(255, 0, 0, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderColor: [
          "rgba(32, 70, 130, 1)",
          "rgba(235, 112, 103, 1)",
          "rgba(50, 184, 211, 1)",
          "rgba(235, 148, 44, 1)",
          "rgba(255, 0, 0, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let value = tooltipItem.raw;
            let total = totalDays;
            let percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${tooltipItem.label}: ${value} days (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#FFFFFF", // Warna teks putih agar kontras
        font: {
          weight: "base",
          size: 12,
        },
        formatter: (value, context) => {
          if (value === 0) return ""; // Tidak menampilkan angka jika 0
          let percentage = ((value / totalDays) * 100).toFixed(1);
          return `${value} (${percentage}%)`; // Menampilkan jumlah dan persentase
        },
        // anchor: "end",
        // align: "start",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%", // Ubah menjadi Donut Chart
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`h-fit mx-auto ${isMobile ? 'w-[10rem]' : 'w-[15rem]'}`}>
      <span className={`text-[#204682] text-center font-bold ${isMobile ? 'text-md' : 'text-lg'}`}>
        Your Monthly Attendance
      </span>
      <div className="relative  my-4 w-[80%] h-[80%] mx-auto">
        <Doughnut data={data} options={{
          ...options,
          maintainAspectRatio: false, // Memastikan chart tetap fleksibel
          responsive: true
        }} />
      </div>
    </div>

  );
}

export default ChartDataKehadiranUser;
