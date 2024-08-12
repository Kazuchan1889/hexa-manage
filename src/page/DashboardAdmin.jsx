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
    <>
      <div className="flex items-center justify-center w-1/4 h-full my-8 w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-4 rounded-xl border">
        <ChartDataKehadiranUser />
      </div>
      <div className="flex items-center justify-center w-1/4 h-full my-8 w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-4 rounded-xl border">
        <ChartDataKaryawan />
      </div>
      <div className="flex items-center justify-center w-1/4 h-full my-8 w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-4 rounded-xl border">
        <ChartDataGender />
      </div>
      <div className="flex items-center justify-center w-1/4 h-full my-8 w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-4 rounded-xl border">
        <ChartDataLama />
      </div>
    </>
  );

  return (
    <div className="w-screen h-fit lg:h-screen xl:overflow-x-hidden bg-primary">
      <NavbarUser />
      <div className="flex flex-col h-fit lg:h-screen w-screen">
        <div className="h-full w-[95%] flex flex-col items-center mx-auto">
          <div className="w-full h-full lg:h-full flex flex-col lg:flex-row justify-between">
            <div className={`flex justify-between items-center drop-shadow-lg bg-home px-10 py-10 my-5 rounded-md w-[100%] ${!checkOperation.includes("SELF_ABSENSI") && "lg:px-5"}`}>
              <ProfileDashboard />
            </div>
          </div>
          {checkOperation.includes("SELF_ABSENSI") ? (
            <div className="w-full mb-6 justify-center flex flex-col h-fit">
              {!isMobile && <div className="w-full flex items-center justify-center gap-4 mb-4">{renderCharts()}</div>}
              <div className="flex flex-row justify-self-auto w-full h-fit lg:h-1/2 mb-6">
                <div className="w-full lg:w-[22%] h-[23rem] lg:mb-4 drop-shadow-lg bg-white p-10 rounded-xl overflow-y-auto">
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
                <div className="w-full lg:w-[53%] h-[23rem] lg:h-[23rem] lg:mr-4 mb-4 drop-shadow-lg bg-white p-6 rounded-xl border ml-5 overflow-hidden">
                  <div className="h-[80%] mb-2">
                    <AnnouncementList />
                  </div>
                  <div className="h-[22%] flex justify-center items-end">
                    <Button size="large" variant="contained" style={{ backgroundColor: "#1E6D42" }} onClick={() => setTambahFormOpen(true)}>
                      Add Announcement
                    </Button>
                  </div>
                </div>
                <div className="w-full lg:w-[22%] h-[23rem] lg:h-[23rem] drop-shadow-lg bg-white p-6 rounded-xl border overflow-hidden">
                  <View />
                </div>
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
