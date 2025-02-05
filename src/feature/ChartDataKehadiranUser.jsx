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
  const [userData, setUserData] = useState([]); // Default jadi array kosong
  const [currentMonth, setCurrentMonth] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const loading = useSelector((state) => state.loading.isLoading);
  const dispatch = useDispatch();

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
        const data = response.data || [0, 0, 0, 0, 0, 0]; // Pastikan data ada
        setUserData(data);
        setTotalDays(data.reduce((acc, cur) => acc + cur, 0)); // Hitung total hari
        setCurrentMonth(new Date().toLocaleString("default", { month: "long" }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        dispatch(loadingAction.startLoading(false)); // Stop loading setelah fetch selesai
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
          "rgba(153, 102, 255,  1)",
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
        display: false  ,
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            let value = tooltipItem.raw;
            let total = totalDays;
            let percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#FFFFFF",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => {
          if (value === 0) return ""; // Jika 0, label tidak muncul
          let percentage = ((value / totalDays) * 100).toFixed(1);
          return `${percentage}%`;
        },
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
    <div className="h-fit w-[15rem] mx-auto">
      <span className="text-[#204682] text-lg text-center font-bold">Your Monthly Attendance</span>
      {/* <Typography variant="h6" className="text-[#204682]">Your Monthly Attendance</Typography> */}
      <div className="mx-auto w-2/3 h-2/3 my-4">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default ChartDataKehadiranUser;