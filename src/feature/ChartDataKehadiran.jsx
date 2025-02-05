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

  const loading = useSelector((state) => state.loading.isLoading);
  const [kehadiranData, setKehadiranData] = useState([0, 0, 0, 0, 0, 0]); // Default nilai agar tidak error
  const dispatch = useDispatch();

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
          "rgba(0, 128, 0, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 0, 0, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderColor: [
          "rgba(0, 128, 0, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
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
            let percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#FFFFFF", // Warna teks
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => {
          if (value === 0) return ""; // Tidak menampilkan angka jika 0
          let percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
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
    <div className="h-fit w-[15rem] mx-auto">
      <span className="text-[#204682] text-lg text-center font-bold">Overall Attendance Data</span>
      {/* <Typography variant="h6" className="text-[#204682]">Overall Attendance Data</Typography> */}
      <div className="mx-auto w-2/3 h-2/3 my-4">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default ChartDataKehadiran;