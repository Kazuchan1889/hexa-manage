import React, { useEffect, useState } from "react";
import {
  Button,
} from "@mui/material";

import axios from "axios";
import ip from "../ip";
import NavbarUser from "../feature/NavbarUser";
import ChartDataKaryawan from "../feature/ChartDataKaryawan";
import ChartDataKehadiran from "../feature/ChartDataKehadiran";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import ChartDataLama from "../feature/ChartDataLama";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Swal from "sweetalert2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useDropzone } from "react-dropzone";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import View from "../minicomponent/viewdata";
import ChartDataGender from "../feature/ChartDataGender";
import Announcment from "../minicomponent/Announcment";
import AnnouncementList from "../minicomponent/ViewAnnounce";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PaidIcon from '@mui/icons-material/Paid';
function DashboardAdmin() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isTambahFormOpen, setTambahFormOpen] = useState(false);
  const checkOperation = localStorage.getItem("operation");

  // Untuk membuat responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = () => {
    // Perform your submission logic here

    // Example logic: Simulate submission success
    Swal.fire({
      icon: "success",
      title: "Announcement added successfully!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      // Reload the page after the success message
      window.location.reload();
    });
  };

  return (
    <div className="w-screen h-fit lg:h-screen xl:overflow-x-hidden bg-primary">
      <NavbarUser />
      <div className="flex flex-col h-fit lg:h-screen w-screen">
        <div className="h-full w-[95%] flex flex-col items-center mx-auto">
          <div className="w-full h-full lg:h-full w-full flex flex-col lg:flex-row justify-between">
            {checkOperation.includes("SELF_ABSENSI") ? (
              <div className="flex justify-between items-center drop-shadow-lg bg-home px-10 py-10 my-5 rounded-md w-[100%]">
                <ProfileDashboard />
              </div>
            ) : (
              <div className="flex justify-between items-center drop-shadow-lg bg-home px-5 lg:px-10 py-10 my-5 rounded-md w-[100%] lg:w-[100%]">
                <ProfileDashboard />
              </div>
            )}
          </div>
          {checkOperation.includes("SELF_ABSENSI") ? (
            <div className="w-full mb-6 justify-center flex flex-col h-fit">
              {!isMobile && (
                <div className="w-full flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-1/4 h-full my-8w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-4 rounded-xl border">
                    <ChartDataKehadiranUser />
                  </div>
                  <div className="flex items-center justify-center w-1/4 h-full my-8w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-4 rounded-xl border">
                    <ChartDataKaryawan />
                  </div>
                  <div className="flex items-center justify-center w-1/4 h-full my-8w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-4 rounded-xl border">
                    <ChartDataGender />
                  </div>
                  <div className="flex items-center justify-center w-1/4 h-full my-8w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-4 rounded-xl border">
                    <ChartDataLama />
                  </div>
                </div>
              )}
              <div className="flex flex-row justify-self-auto w-full h-fit lg:h-1/2 mb-6">
                <div className="w-full lg:w-[22%] h-[23rem] lg:mb-4 drop-shadow-lg bg-white p-10 rounded-xl">
                  <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                  <ul className="space-y-2">
                    <li>
                      <a href="/cal" className="flex items-center p-2 text-gray-800 hover:bg-gray-200 rounded-lg gap-3">
                      <CalendarMonthIcon /> <span>Scheduler</span>
                      </a>
                    </li>
                    <li>
                      <a href="/companyfile" className="flex items-center p-2 text-gray-800 hover:bg-gray-200 rounded-lg gap-3">
                        <InsertDriveFileIcon /> <span>Company File</span>
                      </a>
                    </li>
                    <li>
                      <a href="/Asset" className="flex items-center p-2 text-gray-800 hover:bg-gray-200 rounded-lg gap-3">
                        <WarehouseIcon /> <span>Asset</span>
                      </a>
                    </li>
                    <li>
                      <a href="/masterpayroll" className="flex items-center p-2 text-gray-800 hover:bg-gray-200 rounded-lg gap-3">
                        <PaidIcon /> <span>PayRoll</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="w-full lg:w-[53%] h-[23rem] lg:h-[23rem] lg:mr-4 mb-4 drop-shadow-lg bg-white p-6 rounded-xl border ml-5 overflow-hidden">
                  <div className="h-[80%] mb-2">
                    <AnnouncementList />
                  </div>
                  <div className="h-[22%] flex justify-center items-end">
                    <Button
                      size="large"
                      variant="contained"
                      style={{ backgroundColor: "#1E6D42" }}
                      onClick={() => setTambahFormOpen(true)}
                    >
                      Add Announcement
                    </Button>
                  </div>
                </div>
                {checkOperation.includes("SELF_ABSENSI") && (
                  <div className="w-full lg:w-[22%] h-[23rem] lg:h-[23rem] drop-shadow-lg bg-white p-6 rounded-xl border overflow-hidden">
                  <View />
                </div>
                
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row justify-between items-center w-full h-fit lg:h-1/2">
              {!isMobile && (
                <div className="w-[100%] lg:w-full h-[23rem] lg:m-0 drop-shadow-lg bg-white p-10 rounded-xl border">
                  <div className="flex items-center justify-center h-full">
                    <div className="w-full h-72 mx-auto flex">
                      <ChartDataKaryawan />
                      <ChartDataKehadiran />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isTambahFormOpen && (
        <Announcment
          onClose={() => setTambahFormOpen(false)}
          // fetchData={fetchData}
        />
      )}
    </div>
  );
}

export default DashboardAdmin;
