import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // ✅ Import plugin datalabels
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Typography } from "@mui/material";
import ip from "../ip";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";

function ChartDataKehadiran() {
  Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels); // ✅ Register plugin datalabels
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const loading = useSelector((state) => state.loading.isLoading);
  const [kehadiranData, setKehadiranData] = useState([0, 0, 0, 0, 0, 0]); // Default nilai agar tidak error
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(loadingAction.startLoading(true));
    const apiUrl = `${ip}/api/absensi/get/data/status`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setKehadiranData(response.data || [0, 0, 0, 0, 0, 0]); // Jika kosong, isi dengan default
        dispatch(loadingAction.startLoading(false));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(loadingAction.startLoading(false));
      });
  }, [dispatch]);

  const total = kehadiranData.reduce((acc, cur) => acc + cur, 0);

  const data = {
    labels: ["Present", "Leave", "Permission", "Sick", "Absent", "Late"],
    datasets: [
      {
        data: kehadiranData,
        backgroundColor: [
          "#204682",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "#D94699",
          "rgba(153, 102, 255, 1)",
        ],
        borderColor: [
          "#204682",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "#D94699", 
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
            let percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#FFFFFF", // Warna teks
        font: {
          weight: "base",
          size: 12,
        },
        formatter: (value) => {
          if (value === 0) return ""; // Tidak menampilkan angka jika 0
          let percentage = ((value / total) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%", // Ubah Pie menjadi Doughnut dengan lubang tengah 50%
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`h-fit mx-auto ${isMobile ? 'w-[10rem]' : 'w-[15rem]'}`}>
      <span className={`text-[#204682] text-center font-bold ${isMobile ? 'text-md' : 'text-lg'}`}>
        Overall Attendance Data
      </span>
      <div className="relative my-4 w-[80%] h-[80%] mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>

  );
}

export default ChartDataKehadiran;