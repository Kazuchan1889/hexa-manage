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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
      // case 'Summary':
      //   return (
      //     <div>
      //       <h2 className="text-xl font-bold mb-4">Sumarry</h2>
      //       <UserSummary />
      //     </div>
      //   );
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: "#F0F0F0" }}>
      <NavbarUser />
      <div className="flex m-4 rounded-xl bg-white drop-shadow-lg">
        {/* Sidebar for user info and navigation */}
        <div className="h-[folH] w-1/4 p-4 border border-gray">
          <ul className="h-full flex flex-col space-y-2">
            <div className="w-full h-16 flex items-center justify-center border-b">
              <button
                className="absolute left-4 text-blue-600"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowBackIcon fontSize="large" />
              </button>
              <div className="text-[#204682] text-2xl font-bold font-['Inter']">Settings</div>
            </div>
            {/* Navigation links */}
            <li
              className={`w-full px-6 py-3 text-base font-normal cursor-pointer ${activeTab === 'profile' ? 'bg-[#D1E3FF] text-blue-500' : 'text-black'} hover:bg-[#D1E3FF]`} 
              onClick={() => handleTabClick('profile')}
            >
              Profile
            </li>
            <li
              className={`w-full px-6 py-3 text-base font-normal cursor-pointer ${activeTab === 'CompanyBio' ? 'bg-[#D1E3FF] text-blue-500' : 'text-black'} hover:bg-[#D1E3FF]`} 
              onClick={() => handleTabClick('CompanyBio')}
            >
              Company Bio
            </li>
            <li
              className={`w-full px-6 py-3 text-base font-normal cursor-pointer ${activeTab === 'security' ? 'bg-[#D1E3FF] text-blue-500' : 'text-black'} hover:bg-[#D1E3FF]`} 
              onClick={() => handleTabClick('security')}
            >
              Security
            </li>
            {/* <li
              className={`py-2 px-4 cursor-pointer rounded-lg text-justify text-sm md:text-base lg:text-lg ${
                activeTab === 'Summary' ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => handleTabClick('Summary')}
            >
              Summary
            </li> */}
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
