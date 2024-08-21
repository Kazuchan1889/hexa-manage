import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import axios from "axios";
import ip from "../ip";

function ChartDataKaryawan() {
  Chart.register(ArcElement, Tooltip, Legend);
  const [jumlahKaryawan, setJumlahKaryawan] = useState(0);

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/lamakerja`; // Pastikan endpoint ini benar
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const totalKaryawan = response.data.length; // Hitung jumlah total ID
        setJumlahKaryawan(totalKaryawan);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const karyawanPercentage = (jumlahKaryawan / 150) * 100;

  return (
    <div className="h-fit w-[16rem] mx-auto">
      <div className="text-center mb-4">
        <Typography variant="h6">Jumlah Karyawan</Typography>
      </div>
      <div className="flex justify-center items-center">
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "5px solid orange",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            "&::before": {
              content: `"${jumlahKaryawan}"`,
              position: "absolute",
              fontSize: "1.5rem",
              fontWeight: "bold",
            },
            "&::after": {
              content: `""`,
              position: "absolute",
              width: `${karyawanPercentage}%`,
              height: `${karyawanPercentage}%`,
              backgroundColor: "rgba(255, 165, 0, 0.2)",
              borderRadius: "50%",
            },
          }}
        />
      </div>
    </div>
  );
}

export default ChartDataKaryawan;
