import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // ✅ Import datalabels
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2"; // ✅ Ubah dari Pie ke Doughnut
import axios from "axios";
import ip from "../ip";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";

function ChartDataKaryawan() {
  Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels); // ✅ Register plugin datalabels

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);
  const [karyawanData, setKaryawanData] = useState([0, 0, 0, 0, 0]); // ✅ Default agar tidak error saat data kosong

  useEffect(() => {
    dispatch(loadingAction.startLoading(true));
    const apiUrl = `${ip}/api/karyawan/get/data/status`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setKaryawanData(response.data || [0, 0, 0, 0, 0]); // ✅ Jika kosong, isi default
        dispatch(loadingAction.startLoading(false));
      })
      .catch((error) => {
        console.error("Error", error);
        dispatch(loadingAction.startLoading(false));
      });
  }, [dispatch]);

  const total = karyawanData.reduce((acc, cur) => acc + cur, 0);

  const data = {
    labels: ["Permanent", "Contract", "Probation", "Intern", "Resigned"],
    datasets: [
      {
        data: karyawanData,
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 206, 186, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 206, 186, 1)",
          "rgba(75, 192, 192, 1)",
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
          if (value === 0) return ""; // ✅ Tidak menampilkan angka jika 0
          let percentage = ((value / total) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%", // ✅ Ubah Pie menjadi Doughnut
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-fit w-[15rem] mx-auto">
      <span className="text-[#204682] text-lg text-center font-bold">Employee Data</span>
      {/* <Typography variant="h6" className="text-[#204682]">Employee Data</Typography> */}
      <div className="mx-auto w-2/3 h-2/3 my-4">
        <Doughnut data={data} options={options} /> {/* ✅ Gunakan Doughnut */}
      </div>
    </div>
  );
}

export default ChartDataKaryawan;