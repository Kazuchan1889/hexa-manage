import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Typography } from "@mui/material";
import axios from "axios";
import ip from "../ip";

function ChartDataKehadiran() {
  Chart.register(ArcElement, Tooltip, Legend);
  const [kehadiranData, setKehadiranData] = useState(null);

  useEffect(() => {
    const apiUrl = `${ip}/api/absensi/get/data/status`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setKehadiranData(response.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
    // Lakukan panggilan API di sini untuk mendapatkan data pengguna);
  });

  const data = {
    labels: ["Masuk", "Cuti", "Izin", "Sakit", "Tanpa Alasan", "Terlambat"],
    datasets: [
      {
        data: kehadiranData,
        backgroundColor: [
          "rgba(0, 128, 0, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 0, 0, 0.2)",
          "rgba(153, 102, 255, 0.2)",
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
        display: true,
        position: "right",
      },
    },
    cutout: 0,
  };

  return (
    <div className="h-fit w-[16rem] mx-auto">
      <div className="">
        <Typography variant="h6">Data Kehadiran Hari Ini</Typography>
      </div>
      <div className="mx-auto w-full h-52 lg:h-72">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default ChartDataKehadiran;
