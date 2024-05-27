import React, { useState, useEffect } from "react";
import NavbarUser from "../feature/NavbarUser";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import axios from "axios";
import ip from "../ip";
import LaporanKegiatanDashboard from "../minicomponent/LaporanKegiatanDashboard";
import CheckinDashboard from "../minicomponent/CheckinDashboard";
import ChartDataKaryawan from "../feature/ChartDataKaryawan";
import ChartDataKehadiran from "../feature/ChartDataKehadiran";
import ChartDataGender from "../feature/ChartDataGender";
import ChartDataLama from "../feature/ChartDataLama";
import Announcement from "../minicomponent/Anounce";


import StatusApproval from "./StatusApproval";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import View from "../minicomponent/viewdata";

function DashboardUser() {
  const [nama, setNama] = useState("");
  const [dokumen, setDokumen] = useState(null);
  const [masuk, setMasuk] = useState("");
  const [keluar, setKeluar] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [uploading, setUploading] = useState(false);

  const [checkInStatus, setCheckInStatus] = useState(
    localStorage.getItem("result")
  );
  const [chekOut, setCheckOut] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let cutimandiri = "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${ip}/api/karyawan/get/data/self`;
        const headers = {
          Authorization: localStorage.getItem("accessToken"),
        };

        const response = await axios.get(apiUrl, { headers });
        setNama(response.data[0].nama);
        cutimandiri = response.data[0].cutimandiri;
        localStorage.setItem("cutimandiri", cutimandiri);
        setDokumen(response.data[0].dokumen);
        setLoading(false);

        const localStorageStatus = localStorage.getItem("result");
        if (localStorageStatus) {
          setCheckInStatus(localStorageStatus);
        }
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    };

    fetchData();
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

  return (
    <div
      className="w-full h-fit lg:h-screen"
    >
      <NavbarUser />
      <div className="flex h-fit "
        style={{ backgroundColor: "#F0F0F0" }}>
        <div className="h-full w-[95%] flex flex-col justify-center items-center mx-auto">
          <div className="h-[40rem] lg:h-full w-full flex flex-col lg:flex-row justify-between items center">
            <div className="flex justify-between items-center drop-shadow-lg bg-home px-5 lg:px-10 py-10 my-5 rounded-md w-[100%] lg:w-[100%]">
              <ProfileDashboard />
            </div>
          </div>
          <div className="w-full mb-6 justify-center flex flex-col h-fit ">
            {!isMobile && (
              <div className="w-full flex items-center justify-center gap-4">
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
          </div>
          <div className="flex flex-row justify-self-auto  w-full h-fit lg:h-1/2">
            <div className="w-full lg:w-[22%] h-[23rem] lg:mb-4 drop-shadow-lg mr-4 bg-white p-10 rounded-xl border">
              <Announcement />
            </div>
            <div className="w-full lg:w-[53%] h-[23rem] lg:h-[23rem] lg:mr-4 mb-4 drop-shadow-lg bg-white p-10 rounded-xl border">
              <LaporanKegiatanDashboard />
            </div>
            <div className="w-full lg:w-[22%] h-[23rem] lg:mb-4 drop-shadow-lg bg-white p-10 rounded-xl border">
              <View />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
export default DashboardUser;