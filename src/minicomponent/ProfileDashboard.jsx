import React, { useEffect, useState } from "react";
import { Typography, Avatar } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import axios from "axios";
import Swal from "sweetalert2";
import ip from "../ip";
import Shortcut from "./Shortcut";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProfileDashboard() {
  const [userData, setUserData] = useState({
    nama: "",
    dokumen: null,
    jabatan: "",
    cutimandiri: ""
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const isUserBelumCheckin = localStorage.getItem("result") === "belumMasuk";
  const isUserSudahCheckin = localStorage.getItem("result") === "udahMasuk";
  const isUserSudahCheckout = localStorage.getItem("result") === "udahKeluar";

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const userData = response.data[0];
        checkRequiredProperties(userData, ["alamat", "email", "notelp", "nik", "bankname", "bankacc", "maritalstatus"]);
        setUserData({
          nama: userData.nama || "",
          dokumen: userData.dokumen || null,
          jabatan: userData.jabatan || "",
          cutimandiri: userData.cutimandiri || ""
        });
        localStorage.setItem("cutimandiri", userData.cutimandiri);
      })
      .catch((error) => {
        console.error("Error", error);
        Swal.fire({
          icon: "error",
          title: "Data Not Available",
          text: "User data is not available. Please check your internet connection or try again later.",
        });
      });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkRequiredProperties = (data, requiredProperties) => {
    const emptyProperties = requiredProperties.filter(property => !data[property]);
    if (emptyProperties.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete User Data",
        text: `Please fill out all required user data fields: ${emptyProperties.join(", ")}`,
      });
    }
  };

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const hour = new Date().getHours();

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-col text-left">
        <div className="font-semibold text-xl lg:text-3xl">
          <Typography variant="h5" className="text-neutral-200">
            <div className="w-full font-semibold">
              {hour >= 12 ? (hour >= 17 ? <h1>Good Evening, {userData.nama}! </h1> : <h1>Good Afternoon, {userData.nama}! </h1>) : <h1>Good Morning, {userData.nama}! </h1>}
            </div>
            <h2 className="text-sm">It's {date}</h2>
            <Shortcut />
          </Typography>
          {isUserBelumCheckin && (
            <div className="flex">
              <ReportProblemIcon className="text-yellow-400" />
              <div className="mt-1">
                <Typography variant="body2" className="text-yellow-400">
                  Jangan Lupa Check in Hari ini!
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
      {userData.dokumen && (
        <Avatar
          alt="User Avatar"
          src={userData.dokumen}
          sx={{ width: isMobile ? 70 : 110, height: isMobile ? 70 : 110 }}
        />
      )}
    </div>
  );
}

export default ProfileDashboard;
