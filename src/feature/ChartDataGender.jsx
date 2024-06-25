import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import ip from "../ip";

function ChartDataGender() {
  Chart.register(ArcElement, Tooltip, Legend);
  const [DataKaryawanGender, setDataKaryawanGender] = useState(null);

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/gender`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setDataKaryawanGender(response.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
    // Lakukan panggilan API di sini untuk mendapatkan data pengguna);
  }, []);

  const data = {
    labels: ["Laki-laki", "Perempuan"],
    datasets: [
      {
        data: DataKaryawanGender,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

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
        <Typography variant="h6">gender diversity</Typography>
      </div>
      <div className="mx-auto w-full h-fit lg:h-60">
        <Pie data={data} options={options} /> {/* Change to Pie chart */}
      </div>
    </div>
  );
}

export default ChartDataGender;
