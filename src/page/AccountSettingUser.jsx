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
import axios from "axios";
import Bub from "../minicomponent/Bubble";
import UserSummary from './UserSummary';

function AccountSettingUser() {
  const [nama, setNama] = useState("");
  const [dokumen, setDokumen] = useState(null);
  const [jabatan, setJabatan] = useState("");
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
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
        setNama(userData.nama || "");
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

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <SettingUser />;
      case 'security':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <Changepass />
          </div>
        );
      case 'notifications':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            <Calend />
          </div>
        );
      case 'CompanyBio':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">CompanyBio</h2>
            {role === "admin" ? <CompanyBioP /> : <CompanyBio />}
          </div>
        );
      case 'Summary':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Sumarry</h2>
            <UserSummary />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: "#F0F0F0" }}>
      <NavbarUser />
      <Bub />
      <div className="flex m-4 rounded-xl bg-white drop-shadow-lg">
        {/* Sidebar for user info and navigation */}
        <div className="h-[folH] w-1/4 p-4 border border-gray">
          <ul className="h-full flex flex-col space-y-2">
            <div className="flex justify-center w-full pl-4 pt-4 pr-4">
              {/* Responsive Avatar */}
              {dokumen && (
                <Avatar
                  alt="User Avatar"
                  src={dokumen}
                  // Responsive width and height
                  className="w-36 h-36 md:w-32 md:h-32 sm:w-28 sm:h-28"
                  // Adjust size for very small screens
                  sx={{
                    '@media (max-width: 640px)': {
                      width: 72, // equivalent to w-18 in Tailwind
                      height: 72,
                    },
                  }}
                />
              )}
            </div>
            {/* User's name */}
            <div className="flex justify-center pb-4">
              <h1 className="font-bold text-lg sm:text-base md:text-lg lg:text-xl">{nama}</h1>
            </div>
            {/* Navigation links */}
            <li
              className={`py-2 px-4 cursor-pointer rounded-lg text-justify text-sm md:text-base lg:text-lg ${
                activeTab === 'profile' ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => handleTabClick('profile')}
            >
              Profile
            </li>
            <li
              className={`py-2 px-4 cursor-pointer rounded-lg text-justify text-sm md:text-base lg:text-lg ${
                activeTab === 'CompanyBio' ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => handleTabClick('CompanyBio')}
            >
              Company Bio
            </li>
            <li
              className={`py-2 px-4 cursor-pointer rounded-lg text-justify text-sm md:text-base lg:text-lg ${
                activeTab === 'security' ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => handleTabClick('security')}
            >
              Security
            </li>
            <li
              className={`py-2 px-4 cursor-pointer rounded-lg text-justify text-sm md:text-base lg:text-lg ${
                activeTab === 'Summary' ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => handleTabClick('Summary')}
            >
              Summary
            </li>
          </ul>
        </div>
        {/* Main content area */}
        <div
          id="folH"
          className="w-full bg-200 p-4 border-t border-r border-b border-gray text-justify text-sm sm:text-base md:text-lg"
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AccountSettingUser;
