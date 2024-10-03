import React, { useState, useEffect } from "react";
import NavbarUser from "../feature/NavbarUser";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import axios from "axios";
import ip from "../ip";
import AnnouncementList from "../minicomponent/ViewAnnounce";
import ProfileDashboard from "../minicomponent/ProfileDashboard";
import View from "../minicomponent/viewdata";

const getIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  // Split token untuk mendapatkan payload (bagian kedua dari JWT)
  const base64Url = token.split('.')[1]; 
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
  // Dekode payload
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const payload = JSON.parse(jsonPayload);

  // Ambil id dari payload
  return payload.id; 
};

function DashboardUser() {
  const [nama, setNama] = useState("");
  const [dokumen, setDokumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduleItems, setScheduleItems] = useState([]);
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
  useEffect(() => {
    const fetchScheduleItems = async () => {
      try {
        const id = getIdFromToken("accessToken"); // Ambil id dari accessToken
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
      }
    };

    fetchScheduleItems();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(dateString));
  };
  
 

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
          <div className="sticky top-0 bg-white p-2 z-10">
                    <div className="text-xl font-bold">Upcoming Schedule</div>
                  </div>
          <div className="h-[calc(100%-2.5rem)] overflow-y-auto">
                    <ul className="space-y-4 mt-4">
                      {scheduleItems
                      .map((item, index) => (
                       <li key={index} className="border p-4 rounded-lg shadow-sm">
                       <div className="text-lg font-semibold">{item.judul}</div>
                       <div className="text-sm text-gray-600">{formatDate(item.tanggal_mulai)}</div>
                       <div className="text-sm text-gray-600">{item.mulai}</div>
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
