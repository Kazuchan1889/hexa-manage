import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, IconButton } from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Swal from "sweetalert2";
import NavbarUser from "../feature/NavbarUser";
import ChartDataKaryawan from "../feature/ChartDataKaryawan";
import ChartDataKehadiran from "../feature/ChartDataKehadiran";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import ChartDataLama from "../feature/ChartDataLama";
import ChartDataGender from "../feature/ChartDataGender";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import AnnouncementList from "../minicomponent/ViewAnnounce";
import Announcment from "../minicomponent/Announcment";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ip from "../ip";
import UserIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";

const getIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const payload = JSON.parse(jsonPayload);
  return payload.id; 
};

function DashboardAdmin() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isTambahFormOpen, setTambahFormOpen] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [absensiItems, setAbsensiItems] = useState([]);
  const [selectedChart, setSelectedChart] = useState("kehadiranUser");
  const checkOperation = localStorage.getItem("operation");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);

  // State untuk loading individual
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingAbsensi, setLoadingAbsensi] = useState(false);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchScheduleItems = async () => {
      setLoadingSchedule(true); // Mulai loading untuk jadwal
      try {
        const id = getIdFromToken("accessToken");
        if (!id) {
          console.error('ID not found in token');
          return;
        }

        const response = await axios.get(`${ip}/api/schedjul/scheduler/assigned/karyawan/${id}`, {
          headers: { Authorization: localStorage.getItem("accessToken") },
        });
        setScheduleItems(response.data);
      } catch (error) {
        console.error("Error fetching schedule items:", error);
      } finally {
        setLoadingSchedule(false); // Akhiri loading untuk jadwal
      }
    };
    

    const fetchAbsensiItems = async () => {
      setLoadingAbsensi(true); // Mulai loading untuk absensi
      try {
        const response = await axios.post(
          `${ip}/api/absensi/get/data/dated`,
          {
            date: new Date().toISOString().split("T")[0],
            search: "",
          },
          {
            headers: { Authorization: localStorage.getItem("accessToken") },
          }
        );
        setAbsensiItems(response.data);
      } catch (error) {
        console.error("Error fetching absensi items:", error);
      } finally {
        setLoadingAbsensi(false); // Akhiri loading untuk absensi
      }
    };

    fetchScheduleItems();
    fetchAbsensiItems();
  }, [dispatch]);

  const handleSubmit = () => {
    Swal.fire({
      icon: "success",
      title: "Announcement added successfully!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location.reload();
    });
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(dateString));
  };

  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  const renderCharts = () => {
    if (isMobile) {
      return (
        <div className="w-full">
          <div className="flex justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
            <div className="w-full flex flex-col">
              <div className="flex justify-end mb-2">
                <FormControl variant="outlined" size="small" style={{ width: '150px' }}>
                  <InputLabel id="chart-select-label">Select Chart</InputLabel>
                  <Select
                    labelId="chart-select-label"
                    value={selectedChart}
                    onChange={handleChartChange}
                    label="Select Chart"
                  >
                    <MenuItem value="kehadiranUser">Kehadiran User</MenuItem>
                    <MenuItem value="kehadiran">Kehadiran</MenuItem>
                    <MenuItem value="gender">Gender</MenuItem>
                    <MenuItem value="karyawan">Karyawan</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex justify-center items-center h-full">
                {selectedChart === "kehadiranUser" && <ChartDataKehadiranUser />}
                {selectedChart === "kehadiran" && <ChartDataKehadiran />}
                {selectedChart === "gender" && <ChartDataGender />}
                {selectedChart === "karyawan" && <ChartDataKaryawan />}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
          <ChartDataKehadiranUser />
        </div>
        <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
          <ChartDataKehadiran />
        </div>
        <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
          <ChartDataGender />
        </div>
        <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
          <ChartDataKaryawan />
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen h-fit lg:h-screen xl:overflow-x-hidden bg-primary">
      <NavbarUser />
      <div className="flex flex-col h-fit lg:h-screen w-screen">
        <div className="w-[95%] mx-auto flex flex-col h-fit lg:h-screen">
          <div className="flex flex-col lg:flex-row justify-between w-full">
            <div className="drop-shadow-lg bg-home px-5 py-5 my-5 rounded-md w-full">
              <ProfileDashboard />
            </div>
            {!checkOperation.includes("SELF_ABSENSI") && !isMobile && (
              <div className="drop-shadow-lg bg-white p-5 rounded-md w-full lg:w-[48%]">
                <div className="flex justify-center items-center h-full">
                  <ChartDataKaryawan />
                  <ChartDataKehadiran />
                </div>
              </div>
            )}
          </div>
          {checkOperation.includes("SELF_ABSENSI") ? (
            <div className="flex flex-col w-full">
              <div className="w-full flex justify-center gap-4 mb-4">
                {renderCharts()}
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] lg:w-[22%]">
                  <div className="text-xl font-bold mb-4 bg-white p-2">Today's Absences</div>
                  <div className="h-[calc(100%-2.5rem)] overflow-y-auto">
                    {loadingAbsensi ? (
                      <Loading /> // Tampilkan loading saat absensi sedang di-fetch
                    ) : (
                      <ul className="space-y-4 ">
                        {absensiItems.map((item, index) => (
                          <li key={index} className="flex items-center border p-2 rounded-lg">
                            {item.photo ? (
                              <img
                                src={item.photo.startsWith("data:image/") ? item.photo : `data:image/jpeg;base64,${item.photo}`}
                                className="w-12 h-12 rounded-full object-cover"
                                alt="Absensi Photo"
                              />
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300">
                                <UserIcon style={{ fontSize: 30, color: 'black' }} />
                              </div>
                            )}

                            <div className="ml-4 flex flex-col">
                              <p className="font-semibold">{item.nama}</p>
                              <p className="text-sm text-gray-600">{item.status}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] lg:w-[53%]">
                  <div className="h-[80%] mb-2 overflow-y-auto">
                    {loadingAnnouncement ? (
                      <Loading /> // Tampilkan loading untuk pengumuman
                    ) : (
                      <AnnouncementList />
                    )}
                  </div>
                  <div className="h-[20%] flex justify-center items-center">
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
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] lg:w-[22%]">
                  <div className="sticky top-0 bg-white p-2 z-10">
                    <div className="text-xl font-bold">Upcoming Schedule</div>
                  </div>
                  <div className="h-[calc(100%-2.5rem)] overflow-y-auto">
                    {loadingSchedule ? (
                      <Loading /> // Tampilkan loading saat fetching jadwal
                    ) : (
                      <ul className="space-y-4 mt-4">
                      {scheduleItems
                        .filter(item => {
                          const scheduleDate = new Date(item.tanggal_mulai);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0); // Mengatur waktu ke awal hari
                          return scheduleDate >= today; // Tampilkan jika jadwal >= hari ini
                        })
                        .map((item, index) => (
                          <li key={index} className="border p-4 rounded-lg shadow-sm">
                            <div className="text-lg font-semibold">{item.judul}</div>
                            <div className="text-sm text-gray-600">{formatDate(item.tanggal_mulai)}</div>
                            <div className="text-sm text-gray-600">{item.mulai}</div>
                          </li>
                        ))}
                    </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {isTambahFormOpen && <Announcment onClose={() => setTambahFormOpen(false)} onSubmit={handleSubmit} />}
      <div className={`fixed bottom-5 right-10 p-3 z-50 duration-0 ${isBubbleOpen ? "bg-blue-500 rounded-lg w-40 min-h-24" : "bg-blue-500 flex rounded-full items-center justify-center"}`}>
        <IconButton onClick={() => setIsBubbleOpen(!isBubbleOpen)}>
          {isBubbleOpen ? <CloseIcon style={{ color: "white" }} /> : <MenuIcon style={{ color: "white" }} />}
        </IconButton>
        {isBubbleOpen && (
          <div className="flex flex-col gap-2 mt-2 p-3 rounded-lg">
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/masterlaporan"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              Laporan Karyawan
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/companyfile"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              File
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/Asset"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              Asset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardAdmin;
