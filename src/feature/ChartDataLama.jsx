import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import ip from "../ip";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, plugins } from "chart.js";

function ChartDataGenderKaryawan() {
  Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

  const [karyawanLamaKerjaData, setKaryawanLamaKerjaData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${ip}/api/karyawan/lamakerja`;
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: accessToken,
          "Content-Type": "application/json",
        };
        const response = await axios.get(apiUrl, { headers });
        setKaryawanLamaKerjaData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["< 1 thn", "1-2 thn", "> 2 tahun"],
    datasets: [
      {
        label: 'Jumlah Karyawan',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: karyawanLamaKerjaData,
      },
    ],
  };

  // Chart options
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom", // Adjust the legend position as needed
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  };

  // const data = {
  //   labels: ["Kurang dari 1 tahun", "1-2 tahun", "Lebih dari 2 tahun"],
  //   datasets: [
  //     {
  //       label: "Jumlah Karyawan",
  //       data: karyawanLamaKerjaData,
  //       fill: false,
  //       backgroundColor: "rgba(255, 99, 132, 0.2)",
  //       borderColor: "rgba(255, 99, 132, 1)",
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const options = {
  //   indexAxis: "y",
  //   elements: {
  //     bar: {
  //       borderWidth: 2,
  //     },
  //   },
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "right",
  //     },
  //     title: {
  //       display: true,
  //       text: "Data Karyawan",
  //     },
  //   },
  // };

  return (
    <div className="h-fit w-[16rem] mx-auto">
      <div className="">
        <Typography variant="h6">Data Lama Kerja Karyawan</Typography>
      </div>
      <div className="flex justify-center items-center mx-auto w-full h-full lg:h-72">
        <Bar 
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}

export default ChartDataGenderKaryawan;
