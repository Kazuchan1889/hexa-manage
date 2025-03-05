import React, { useState, useEffect } from 'react';
import SettingUser from './SettingUser';
import Calend from '../minicomponent/ViewAnnounce';
import CompanyBioP from './Company_Post';
import CompanyBio from './Company';
import NavbarUser from '../feature/NavbarUser';
import Changepass from './ChangePassPage';
import Swal from "sweetalert2";
import ip from "../ip";
import { Avatar } from "@mui/material";
import { Button, Card } from "@mui/material";
import axios from "axios";
import { ArrowBack, Notifications, Settings } from "@mui/icons-material";

import UserSummary from './UserSummary';

function AccountSettingUser() {

  const [dokumen, setDokumen] = useState(null);
  const [jabatan, setJabatan] = useState("");
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [userPhoto, setUserPhoto] = useState(null);

  // Fetching accessToken and role from localStorage
  const role = localStorage.getItem("role");

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    // Fetch user data
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const userData = response.data[0];

        // Check if any required user properties are missing
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

        // Alert if required properties are empty
        if (emptyProperties.length > 0) {
          Swal.fire({
            icon: "warning",
            title: "Incomplete User Data",
            text: `Please fill out all required user data fields: ${emptyProperties.join(
              ", "
            )}`,
          });
        }

        // Update user data in state
        setUserName(userData.nama || "");
        setDokumen(userData.dokumen || null);
        setJabatan(userData.jabatan || "");
        setData(userData);
        localStorage.setItem("cutimandiri", userData.cutimandiri);
      })
      .catch((error) => {
        // Error alert if data is unavailable
        Swal.fire({
          icon: "error",
          title: "Data Not Available",
          text: "User data is not available. Please check your internet connection or try again later.",
        });
      });

  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleBackClick = () => {
    window.location.href = "/dashboard"; // Arahkan ke dashboard
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <SettingUser />;
      case "security":
        return (
          <div>
            <Changepass />
          </div>
        );
      case "notifications":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            <Calend />
          </div>
        );
      case "CompanyBio":
        return (
          <div>
            {role === "admin" ? <CompanyBioP /> : <CompanyBio />}
          </div>
        );
      default:
        return null;
    }
  };


  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const userData = response.data[0];
        setUserPhoto(userData.dokumen || null);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Data Not Available",
          text: "User data is not available. Please check your internet connection or try again later.",
        });
      });


  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#11284E] text-white">
        <div className="flex items-center space-x-4">
          {userPhoto ? <Avatar src={userPhoto} alt="User Photo" /> : <Avatar alt="User Photo" />}
          <div>
            <h1 className="text-lg font-bold">{userName}</h1>
            <p className="text-sm text-gray-300">Account Settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Notifications className="cursor-pointer" />
          <Settings className="cursor-pointer" />
        </div>
      </div>

      {/* Navbar untuk Mobile */}
      {isMobile && (
        <div className="flex flex-col bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <ArrowBack className="text-gray-600 cursor-pointer" onClick={handleBackClick} />
            <h2 className="text-[24px] font-bold text-[#204682]">Settings</h2>
          </div>

          {/* Menampilkan Menu ke Arah Kanan */}
          <div className="flex justify-end mt-4 space-x-4">
            <div
              className={`${activeTab === 'profile' ? 'bg-[#D1E3FF] px-4 py-2 rounded-lg' : 'text-black hover:bg-[#D1E3FF] px-4 py-2 rounded-lg cursor-pointer'}`}
              onClick={() => handleTabClick("profile")}
            >
              Profile
            </div>
            <div
              className={`${activeTab === 'CompanyBio' ? 'bg-[#D1E3FF] px-4 py-2 rounded-lg' : 'text-black hover:bg-[#D1E3FF] px-4 py-2 rounded-lg cursor-pointer'}`}
              onClick={() => handleTabClick("CompanyBio")}
            >
              Company Bio
            </div>
            <div
              className={`${activeTab === 'security' ? 'bg-[#D1E3FF] px-4 py-2 rounded-lg' : 'text-black hover:bg-[#D1E3FF] px-4 py-2 rounded-lg cursor-pointer'}`}
              onClick={() => handleTabClick("security")}
            >
              Forgot Password
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex ${isMobile ? "flex-col w-full h-screen pt-0" : "flex-row gap-6 p-6"}`}>
        {/* Sidebar (Hidden in Mobile) */}
        {!isMobile && (
          <Card className="p-6 bg-white shadow-md rounded-[15px] w-[307px] h-[920px] flex flex-col">
            <div className="flex mb-4 relative">
              <ArrowBack className="text-gray-600 cursor-pointer absolute left-4" onClick={handleBackClick} />
              <h2 className="text-[24px] font-bold text-[#204682] mx-auto">Settings</h2>
            </div>
            <div className="flex flex-col text-lg text-left space-y-2">
              <div
                className={`${activeTab === 'profile' ? 'bg-[#D1E3FF]' : 'text-black hover:bg-[#D1E3FF]'}`}
                onClick={() => handleTabClick("profile")}
              >
                Profile
              </div>
              <div
                className={`${activeTab === 'CompanyBio' ? 'bg-[#D1E3FF]' : 'text-black hover:bg-[#D1E3FF]'}`}
                onClick={() => handleTabClick("CompanyBio")}
              >
                Company Bio
              </div>
              <div
                className={`${activeTab === 'security' ? 'bg-[#D1E3FF]' : 'text-black hover:bg-[#D1E3FF]'}`}
                onClick={() => handleTabClick("security")}
              >
                Forgot Password
              </div>
            </div>
          </Card>
        )}

        {/* Content Container */}
        <Card className={`p-6 bg-white shadow-md rounded-[15px] ${isMobile ? "w-full h-full" : "flex-1 h-[920px]"}`}>
          {renderContent()}
        </Card>
      </div>
    </div>
  );
}

export default AccountSettingUser;
