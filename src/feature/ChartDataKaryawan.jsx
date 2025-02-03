import { Chart } from "chart.js";
import { ArcElement, Legend, Tooltip } from "chart.js";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import ip from "../ip";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";

function ChartDataKaryawan() {
  Chart.register(ArcElement, Tooltip, Legend);
  const dispatch = useDispatch()
const loading = useSelector((state) => state.loading.isLoading);

  const [karyawanData, setKaryawanData] = useState(null);

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/status`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setKaryawanData(response.data);
        // console.log(response.data);
        dispatch(loadingAction.startLoading(false))
      })
      .catch((error) => {
        console.error("Error", error);
      });
    // Lakukan panggilan API di sini untuk mendapatkan data pengguna);
  }, []);

  const data = {
    labels: ["Permanent", "Contract", "Probation", "Intern", "Resigned"],
    datasets: [
      {
        data: karyawanData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(255, 206, 186, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 206, 186, 0.2)",
          "rgba(75, 192, 192, 1)",
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
    responsive: true,
    maintainAspectRatio: false, // Menonaktifkan rasio aspek tetap
  };
  

  if (loading) {
    return <Loading />
  }

  return (
    <div className="h-fit w-[16rem] mx-auto">
      <div className="">
        <Typography variant="h6">Employee Data</Typography>
      </div>
      <div className="mx-auto w-full h-full p-4">
        <Pie data={data} options={options} /> {/* Change to Pie chart */}
      </div>
    </div>
  );
}

export default ChartDataKaryawan;
