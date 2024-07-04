import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import ip from "../ip";

function ViewData() {
  const [cutiMandiri, setCutiMandiri] = useState(null);
  const [sisaJatah, setSisaJatah] = useState(null);

  useEffect(() => {
    fetchTableData();
    fetchSisaJatah();
  }, []);

  const fetchTableData = () => {
    const apiUrl = `${ip}/api/pengajuan/get/cuti/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const sisaCuti = localStorage.getItem("cutimandiri");
        setCutiMandiri(sisaCuti);
      })
      .catch((error) => {
        console.error(error);
      }); 
  };

  const fetchSisaJatah = () => {
    const apiUrl = `${ip}/api/pengajuan/get/sisa`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const sisaJatah = parseInt(response.data.cuti_terpakai);
        setSisaJatah(sisaJatah);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto p-6 min-h-[50vh] max-h-[70vh] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Cuti Tahunan Balance</h2>
        <p className="text-lg font-semibold text-gray-700">{cutiMandiri !== null ? `${cutiMandiri} Days` : '0'}</p>
        <a className="flex items-center mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300" href="/cuti">
          Form Cuti
          <svg className="ml-2" viewBox="0 0 24 24" fill="currentColor" height="1.5em" width="1em">
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Izin yang Digunakan</h2>
        <p className="text-lg font-semibold text-gray-700">{sisaJatah !== null ? `${sisaJatah} Days` : '0'}</p>
        <a className="flex items-center mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300" href="/izin">
          Form Izin
          <svg className="ml-2" viewBox="0 0 24 24" fill="currentColor" height="1.5em" width="1em">
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Who's Off</h2>
        <p className="text-lg font-semibold text-gray-700">0</p>
        <a className="flex items-center mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300" href="/Timeoff">
          Lihat
          <svg className="ml-2" viewBox="0 0 24 24" fill="currentColor" height="1.5em" width="1em">
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default ViewData;
