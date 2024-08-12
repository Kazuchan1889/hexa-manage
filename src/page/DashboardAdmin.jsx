import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import Swal from "sweetalert2";
import NavbarUser from "../feature/NavbarUser";
import ChartDataKaryawan from "../feature/ChartDataKaryawan";
import ChartDataKehadiran from "../feature/ChartDataKehadiran";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import ChartDataLama from "../feature/ChartDataLama";
import ChartDataGender from "../feature/ChartDataGender";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import View from "../minicomponent/viewdata";
import AnnouncementList from "../minicomponent/ViewAnnounce";
import Announcment from "../minicomponent/Announcment";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function DashboardAdmin() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isTambahFormOpen, setTambahFormOpen] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const checkOperation = localStorage.getItem("operation");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const absentEmployees = [
    {
      photo: "https://www.shutterstock.com/image-photo/asian-man-wearing-traditional-javanese-260nw-2201100881.jpg",
      name: "John Doe",
      reason: "Sick leave",
      date: "2024-07-25",
    },
    {
      photo: "https://c.pxhere.com/photos/cc/14/man_person_guy_male_hoodie-1410020.jpg!d",
      name: "Jane Smith",
      reason: "Family emergency",
      date: "2024-07-25",
    },
    {
      photo: "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg",
      name: "Alice Johnson",
      reason: "Vacation",
      date: "2024-07-25",
    },
    {
      photo: "",
      name: "Michael Brown",
      reason: "Medical appointment",
      date: "2024-07-25",
    },
    {
      photo: "https://i.pinimg.com/originals/df/96/67/df96679570925cdd4cff9a67d7ef89a5.png",
      name: "Laura Wilson",
      reason: "Personal reasons",
      date: "2024-07-25",
    },
    {
      photo: "https://asset.kompas.com/crops/uWy9sjOHu_N21k29z9PxyS63OPg=/0x0:1000x667/1200x800/data/photo/2022/05/04/6271c5c7d49c9.jpg",
      name: "Robert Lee",
      reason: "Conference",
      date: "2024-07-25",
    },
  ];

  const renderCharts = () => (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} w-full`}>
      <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
        <ChartDataKehadiranUser />
      </div>
      <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
        <ChartDataKaryawan />
      </div>
      <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
        <ChartDataGender />
      </div>
      <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
        <ChartDataLama />
      </div>
    </div>
  );

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
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] overflow-y-auto lg:w-[22%]">
                  <h2 className="text-xl font-bold mb-4">Today's Absences</h2>
                  <ul className="space-y-4">
                    {absentEmployees.map((employee, index) => (
                      <li key={index} className="flex items-center space-x-4 border p-2 rounded-lg">
                        <img src={employee.photo} alt={employee.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-semibold">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.reason}</p>
                          <p className="text-sm text-gray-600">{employee.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] lg:w-[53%]">
                  <div className="h-[80%] mb-2 overflow-y-auto">
                    <AnnouncementList />
                  </div>
                  <div className="h-[20%] flex justify-center items-center">
                    <Button size="large" variant="contained" style={{ backgroundColor: "#1E6D42" }} onClick={() => setTambahFormOpen(true)}>
                      Add Announcement
                    </Button>
                  </div>
                </div>
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] lg:w-[22%]">
                  <View />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {isTambahFormOpen && <Announcment onClose={() => setTambahFormOpen(false)} />}
      <div className={`fixed bottom-5 right-10 p-3 z-50 duration-0 ${isBubbleOpen ? "bg-blue-500 rounded-lg w-40 min-h-24" : "bg-blue-500 flex rounded-full items-center justify-center"}`}>
        <IconButton onClick={() => setIsBubbleOpen(!isBubbleOpen)}>
          {isBubbleOpen ? <CloseIcon style={{ color: "white" }} /> : <MenuIcon style={{ color: "white" }} />}
        </IconButton>
        {isBubbleOpen && (
          <div className="flex flex-col gap-2 mt-2 p-3 rounded-lg">
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/Asset"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              Asset
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/masterlaporan"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              Laporan Karyawan
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/companyfile"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardAdmin;
