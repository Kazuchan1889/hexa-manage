import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Dialog,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TablePagination,
  Paper,
  Modal,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ChartDataKaryawan from "../feature/ChartDataKaryawan";
import ChartDataKehadiran from "../feature/ChartDataKehadiran";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import ChartDataLama from "../feature/ChartDataLama";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Swal from "sweetalert2";
import ip from "../ip";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useDropzone } from "react-dropzone";
import LaporanKegiatanDashboard from "../minicomponent/LaporanKegiatanDashboard";
import CheckinDashboard from "../minicomponent/CheckinDashboard";
import StatusDashboard from "./StatusApproval";
import StatusRequest from "../minicomponent/StatusRequest";
import ChartAdminSlider from "./ChartAdminSlider";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import View from "../minicomponent/viewdata";
import ChartDataGender from "../feature/ChartDataGender";
import Announcment from "../minicomponent/Announcment";
import AnnouncementList from "../minicomponent/ViewAnnounce";

function DashboardAdmin() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  // const [slideIndex, setSlideIndex] = useState(0);
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

  return (
    <div className="w-screen h-fit lg:h-screen xl:overflow-x-hidden bg-primary">
      <NavbarUser />
      <div className="flex flex-col h-fit lg:h-screen w-screen">
        <div className="h-full w-[95%] flex flex-col  items-center mx-auto">
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
            {/* {checkOperation.includes("SELF_ABSENSI") ? (
              !isMobile && (
                <div className="flex justify-between drop-shadow-lg bg-white px-5 lg:px-0 my-5 rounded-md mx-auto w-80 lg:w-[33%]">
                  <StatusRequest />
                </div>
              )
            ) : (
              <div className="flex justify-between drop-shadow-lg bg-white px-5 lg:px-0 my-5 rounded-md mx-auto lg:mx-0 w-80 lg:w-[49%]">
                <StatusRequest />
              </div>
            )}
            {checkOperation.includes("SELF_ABSENSI") && (
              <div className="flex flex-col items-center drop-shadow-lg bg-white px-5 lg:px-11 my-5 rounded-md mx-auto lg:mx:0 w-[100%] lg:w-[30%] h-[13rem] lg:h-[14.5rem]">
                <CheckinDashboard />
              </div>
            )} */}
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
                {/* <div className="w-full lg:w-[22%] h-[23rem] lg:mb-4 drop-shadow-lg mr-4 bg-white p-10 rounded-xl border">
                    <Announcement />
                  </div> */}
                <div className="w-full lg:w-[53%] h-[23rem] lg:h-[23rem] lg:mr-4 mb-4 drop-shadow-lg bg-white p-6 rounded-xl border overflow-hidden">
                  <div className="h-[80%] mb-2">
                    <AnnouncementList />
                  </div>
                  <div className="h-[20%]">
                    <Button
                      size="small"
                      variant="contained"
                      style={{ backgroundColor: "#1E6D42" }}
                      onClick={() => setTambahFormOpen(true)}
                    >
                      Add Announcement
                    </Button>
                  </div>
                </div>
                {checkOperation.includes("SELF_ABSENSI") && (
                  <div className="w-full lg:w-[22%] h-[23rem] lg:mb-4 drop-shadow-lg bg-white p-10 rounded-xl border">
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
