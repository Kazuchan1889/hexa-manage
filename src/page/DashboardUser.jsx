import React, { useState, useEffect } from "react";
import NavbarUser from "../feature/NavbarUser";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import axios from "axios";
import ip from "../ip";
import AnnouncementList from "../minicomponent/ViewAnnounce";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import View from "../minicomponent/viewdata";

function DashboardUser() {
  const [nama, setNama] = useState("");
  const [dokumen, setDokumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${ip}/api/karyawan/get/data/self`;
        const headers = {
          Authorization: localStorage.getItem("accessToken"),
        };

        const response = await axios.get(apiUrl, { headers });
        setNama(response.data[0].nama);
        localStorage.setItem("cutimandiri", response.data[0].cutimandiri);
        setDokumen(response.data[0].dokumen);
        setLoading(false);
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const scheduleItems = [
    {
      title: "Meeting with Marketing Team",
      date: "2024-08-22",
      time: "10:00 AM - 11:00 AM"
    },
    {
      title: "Project Deadline",
      date: "2024-08-23",
      time: "5:00 PM"
    },
    {
      title: "Team Building Activity",
      date: "2024-08-25",
      time: "2:00 PM - 4:00 PM"
    },
    {
      title: "Quarterly Review Meeting",
      date: "2024-08-28",
      time: "1:00 PM - 3:00 PM"
    },
    {
      title: "Client Presentation",
      date: "2024-08-30",
      time: "11:00 AM - 12:00 PM"
    },
    {
      title: "Office Renovation",
      date: "2024-09-01",
      time: "All Day"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-y-auto">
      <NavbarUser />
      <div className="flex flex-col items-center w-[90%] mx-auto py-5 space-y-5">
        {/* Bagian atas dengan ProfileDashboard */}
        <div className="w-full drop-shadow-lg bg-home px-5 lg:px-10 py-10 rounded-md">
          <ProfileDashboard />
        </div>

        {/* Bagian tengah dengan ChartDataKehadiranUser dan AnnouncementList */}
        <div className="flex flex-col lg:flex-row w-full space-y-5 lg:space-y-0 lg:space-x-5">
          {!isMobile && (
            <div className="w-full lg:w-[30%] drop-shadow-lg bg-white p-10 rounded-xl border h-[23rem]">
              <ChartDataKehadiranUser />
            </div>  
          )}
          <div className="w-full lg:w-[45%] drop-shadow-lg bg-white p-6 rounded-xl border ml-5">
            <div className="h-[85%] mb-2">
              <AnnouncementList />
            </div>
          </div>
          <div className="w-full lg:w-[22%] h-[23rem] lg:mb-4 drop-shadow-lg bg-white p-10 rounded-xl border">
          <div className="h-[calc(100%-2.5rem)] overflow-y-auto">
                    <ul className="space-y-4 mt-4">
                      {scheduleItems.map((item, index) => (
                        <li key={index} className="border p-4 rounded-lg shadow-sm">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.date}</p>
                          <p className="text-sm text-gray-600">{item.time}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardUser;
