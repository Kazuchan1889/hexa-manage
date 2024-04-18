import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import ip from "../ip";

function ChartDataGenderKaryawan() {
  Chart.register(ArcElement, Tooltip, Legend);
  const [Joblevel, setJoblevel] = useState(null);

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/level`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setJoblevel(response.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
    // Lakukan panggilan API di sini untuk mendapatkan data pengguna);
  });

  const data = {
    labels: ["Kontrak", "Leader","Senior","Staff"],
    datasets: [
      {
        data: Joblevel,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(255, 206, 186, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 206, 186, 0.2)",
        ],
        borderWidth: 1,
      },
    ],
  };
  console.log(data)
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right", // Adjust the legend position as needed
      },
    },
    cutout: 0, // Change the cutout to 0 to make it a pie chart
  };

  return (
    <div className="h-fit w-[16rem] mx-auto">
      <div className="">
        <Typography variant="h6">Data Gender Karyawan</Typography>
      </div>
      <div className="mx-auto w-full h-fit lg:h-72">
        <Pie data={data} options={options} /> {/* Change to Pie chart */}
      </div>
    </div>
  );
}

export default ChartDataGenderKaryawan;
