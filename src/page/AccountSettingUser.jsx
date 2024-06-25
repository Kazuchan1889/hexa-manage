import React, { useState, useEffect } from 'react';
import SettingUser from './SettingUser';
import Calend from '../minicomponent/ViewAnnounce';
import CompanyBioP from './Company_Post';
import CompanyBio from './Company';
import NavbarUser from '../feature/NavbarUser';
import Swal from "sweetalert2";
import ip from "../ip";
import { Avatar } from "@mui/material";
import axios from "axios";

function AccountSettingUser() {
  const [nama, setNama] = useState("");
  const [dokumen, setDokumen] = useState(null);
  const [jabatan, setJabatan] = useState("");
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  localStorage.getItem("accessToken")
  const role = localStorage.getItem("role")
  
  useEffect(() => {
   
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const userData = response.data[0];

        console.log(apiUrl);
        // Check if any of the required properties in userData are null or empty
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

        if (emptyProperties.length > 0) {
          // Display an alert if any of the required properties are null or empty
          Swal.fire({
            icon: "warning",
            title: "Incomplete User Data",
            text: `Please fill out all required user data fields: ${emptyProperties.join(
              ", "
            )}`,
          });
        }

        setNama(userData.nama || "");
        setDokumen(userData.dokumen || null);
        setJabatan(userData.jabatan || "");
        setData(userData);
        localStorage.setItem("cutimandiri", userData.cutimandiri);
      })
      .catch((error) => {
        console.error("Error", error);

        // Display alert if data is not available
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
        return (
          <div className=''>
            <SettingUser />
          </div>
        );
      case 'security':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            {/* Add change password form */}
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
      
      
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: "#F0F0F0" }}>
      <NavbarUser />
      <div  className="flex m-4 rounded-xl bg-white drop-shadow-lg ">
        <div className="h-[folH] w-1/4 p-4 border border-gray" >
          <ul className="h-full flex flex-col space-y-2">
            <div className='flex justify-center w-full pl-4 pt-4 pr-4'>
              {dokumen && (
                <Avatar
                  alt="User Avatar"
                  src={dokumen}
                  sx={{ width: 144, height: 144 }}
                />
              )}
            </div>
            <div className='flex justify-center pb-4'>
              <h1 className='font-bold'>
                {nama}
              </h1>
            </div>
            <li className={`py-2 px-4 cursor-pointer rounded-lg ${activeTab === 'profile' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('profile')}>
              Profile
            </li>
            <li className={`py-2 px-4 cursor-pointer rounded-lg ${activeTab === 'CompanyBio' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('CompanyBio')}>
            Company Bio
            </li>
            <li className={`py-2 px-4 cursor-pointer rounded-lg ${activeTab === 'security' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('security')}>
              Security
            </li>
            <li className={`py-2 px-4 cursor-pointer rounded-lg ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('notifications')}>
              Notification
            </li>
            
          </ul>
        </div>
        <div id='folH' className="w-full bg-200 p-4 border-t border-r border-b border-gray">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AccountSettingUser;