import React, { useState, useEffect } from 'react';
import SettingUser from './SettingUser';
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
            {/* Add notification settings options */}
          </div>
        );
      case 'privacy':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
            {/* Add privacy settings options */}
          </div>
        );
      case 'billing':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Billing Settings</h2>
            {/* Add billing settings options */}
          </div>
        );
      case 'connected':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Connected Accounts</h2>
            {/* Add connected accounts options */}
          </div>
        );
      case 'preferences':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Preferences</h2>
            {/* Add preferences options */}
          </div>
        );
      case 'help':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Help & Support</h2>
            {/* Add help & support options */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: "#F0F0F0" }}>
      <NavbarUser />
      <div  className="flex m-4 rounded-xl bg-white drop-shadow ">
        <div className="h-full w-1/4 p-4 border border-gray" >
          <ul className="h-full flex flex-col space-y-2">
            <div className='flex justify-center h-full w-full pl-4 pt-4 pr-4'>
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
            <li className={`py-2 px-4 cursor-pointer ${activeTab === 'profile' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('profile')}>
              Profile Settings
            </li>
            <li className={`py-2 px-4 cursor-pointer ${activeTab === 'security' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('security')}>
              Security Settings
            </li>
            <li className={`py-2 px-4 cursor-pointer ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('notifications')}>
              Notification Settings
            </li>
            <li className={`py-2 px-4 cursor-pointer ${activeTab === 'privacy' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('privacy')}>
              Privacy Settings
            </li>
            <li className={`py-2 px-4 cursor-pointer ${activeTab === 'billing' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('billing')}>
              Billing Settings
            </li>
            <li className={`py-2 px-4 cursor-pointer ${activeTab === 'connected' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('connected')}>
              Connected Accounts
            </li>
            <li className={`py-2 px-4 cursor-pointer ${activeTab === 'preferences' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('preferences')}>
              Preferences
            </li>
            <li className={`py-2 px-4 cursor-pointer ${activeTab === 'help' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('help')}>
              Help & Support
            </li>
          </ul>
        </div>
        <div className="w-full bg-200 p-4 border-t border-r border-b border-gray">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AccountSettingUser;