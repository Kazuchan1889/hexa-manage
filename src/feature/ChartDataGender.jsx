import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin datalabels
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import ip from "../ip";

function ChartDataGenderKaryawan() {
  Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels); // Daftarkan datalabels
  const [karyawanGenderData, setKaryawanGenderData] = useState([0, 0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/gender`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setKaryawanGenderData(response.data || [0, 0]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const total = karyawanGenderData.reduce((a, b) => a + b, 0);

  const data = {
    labels: ["Laki-laki", "Perempuan"],
    datasets: [
      {
        data: karyawanGenderData,
        backgroundColor: ["rgba(60, 110, 189, 1)", "rgba(217, 70, 153, 1)"],
        borderColor: ["rgba(60, 110, 189, 1)", "rgba(217, 70, 153, 1)"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
        position: "right",
      },
      datalabels: {
        color: "#FFFFFF", // Warna teks
        font: {
          weight: "base",
          size: 12,
        },
        formatter: (value, context) => {
          if (total === 0) return "0%"; // Jika total 0, hindari NaN
          let percentage = ((value / total) * 100).toFixed(1);
          return `${value} (${percentage}%)`; // Menampilkan persentase
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
  };

  return (
    <div className={`h-fit mx-auto ${isMobile ? 'w-[10rem]' : 'w-[15rem]'}`}>
      <span className={`text-[#204682] text-center font-bold ${isMobile ? 'text-md' : 'text-lg'}`}>
        Gender Diversity
      </span>
      <div className="relative my-4 w-[80%] h-[80%] mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>

  );
}

export default ChartDataGenderKaryawan;