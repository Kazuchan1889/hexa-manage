import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import ip from "../ip";

function ViewData() {
  const [cutiMandiri, setCutiMandiri] = useState(null);
  const [sisaJatah, setSisaJatah] = useState(null);

  useEffect(() => {
    fetchTableData();
    fetchSisaJatah();
  }, []); // useEffect akan dijalankan sekali saat komponen dimuat

  const fetchTableData = () => {
    const apiUrl = `${ip}/api/pengajuan/get/cuti/self`; // Endpoint untuk mendapatkan data cuti mandiri
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        const sisaCuti = localStorage.getItem("cutimandiri");
        setCutiMandiri(sisaCuti);
      })
      .catch((error) => {
        console.error(error);
      }); 
  };

  const fetchSisaJatah = () => {
    const apiUrl = `${ip}/api/pengajuan/get/sisa`; // Endpoint untuk mendapatkan data sisa jatah cuti
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: accessToken,
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const sisaJatah = parseInt(response.data.cuti_terpakai);// Mengakses data "Cuti_Terpakai" dari respons
        setSisaJatah(sisaJatah);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col items-start text-left">
        <div className="text-s font-bold">
          Cuti Tahunan Balance
        </div>
        <div className="text-s font-semibold ">
          {cutiMandiri !== null ? `${cutiMandiri} Days` : '0'}
        </div>
        <a className="flex flex-row mt-2 font-semibold" href="/cuti">
          Form Cuti
          <svg
            className='ml-2'
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1.5em"
            width="1em"
          >
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
      <div className="flex flex-col items-start text-left mt-3">
        <div className="text-s font-bold">
          Izin yang Digunakan 
        </div>
        <div className="text-s font-semibold ">
          {sisaJatah !== null ? `${sisaJatah} Days` : '0'}
        </div>
        <a className="flex flex-row mt-2 font-semibold" href="/izin">
          Form izin
          <svg
            className='ml-2'
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1.5em"
            width="1em"
          >
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
      <div className="flex flex-col items-start text-left mt-3">
        <div className="text-s font-bold">
          Who's Off 
        </div>
        <div className="text-s font-semibold ">
          0 
        </div>
        <a className="flex flex-row mb-5 font-semibold" href="/Timeoff">
          Lihat
          <svg
            className='ml-2'
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1.5em"
            width="1em"
          >
            <path d="M18.59 13H3a1 1 0 010-2h15.59l-5.3-5.3a1 1 0 111.42-1.4l7 7a1 1 0 010 1.4l-7 7a1 1 0 01-1.42-1.4l5.3-5.3z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default ViewData;
