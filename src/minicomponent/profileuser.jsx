import React, { useEffect, useState } from "react";
import { Typography, Avatar } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Shortcut from "./Shortcut";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";

import ip from "../ip";

function ProfileDashboard() {
  const [nama, setNama] = useState("");
  const [dokumen, setDokumen] = useState(null);
  const [jabatan, setJabatan] = useState("");
  const [data, setData] = useState(null);
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

        console.log(apiUrl);
        // Check if any of the required properties in userData are null or empty
        const requiredProperties = [
          "alamat",
          "email",
          "notelp",
          "nik",
          "bankname",
          "bankacc",
          "maritalstatus",
        ];
        const emptyProperties = requiredProperties.filter(
          (property) => !userData[property]
        );

        if (emptyProperties.length > 0) {
          // Display an alert if any of the required properties are null or empty
          Swal.fire({
            icon: "warning",
            title: "Incomplete User Data",
            text: `Please fill out all required user data fields: ${emptyProperties.join(
              ", "
            )}`,
          });
        }

        setNama(userData.nama || "");
        setDokumen(userData.dokumen || null);
        setJabatan(userData.jabatan || "");
        setData(userData);
        localStorage.setItem("cutimandiri", userData.cutimandiri);
      })
      .catch((error) => {
        console.error("Error", error);

        // Display alert if data is not available
        Swal.fire({
          icon: "error",
          title: "Data Not Available",
          text: "User data is not available. Please check your internet connection or try again later.",
        });
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [open, setOpen] = useState(false); // State untuk mengontrol modal

  const handleOpen = () => {
      setOpen(true); // Buka modal
  };

  const handleClose = () => {
      setOpen(false); // Tutup modal
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full p-4">
  <div className="flex flex-col text-left mb-4 md:mb-0">
    <div className="font-semibold text-lg md:text-2xl lg:text-3xl">
      <Typography 
        variant="h5" 
        className="text-neutral-200" 
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'bold', fontSize: '30px' }}
      >
        {nama}
      </Typography>
      <Typography 
        variant="h5" 
        className="text-neutral-200"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'normal', fontSize: '24px' }}
      >
        {jabatan}
      </Typography>
    </div>
  </div>
  {dokumen && (
    <Avatar
      alt="User Avatar"
      src={dokumen}
      sx={{
        width: 110 * 1.05, // Increase size by 5% for desktop
        height: 110 * 1.05, // Increase size by 5% for desktop
        '@media (max-width: 768px)': { // Reset to original size for mobile
          width: 100,
          height: 100,
        },
      }}
    />
  )}
</div>

  );
}

export default ProfileDashboard;