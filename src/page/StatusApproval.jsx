import axios from "axios";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Slider from "react-slick";
import ip from "../ip";

function StatusApproval() {
  const [summaryData, setSummaryData] = useState({
    overtime: 0,
    cuti: 0,
    absensi: 0,
  });
  const [waitingCuti, setWaitingCuti] = useState("");
  const [acceptedCuti, setAcceptedCuti] = useState("");
  const [declinedCuti, setDeclinedCuti] = useState("");
  const [waitingIzin, setWaitingIzin] = useState("");
  const [acceptedIzin, setAcceptedIzin] = useState("");
  const [declinedIzin, setDeclinedIzin] = useState("");
  const [waitingReimburse, setWaitingReimburse] = useState("");
  const [acceptedReimburse, setAcceptedReimburse] = useState("");
  const [declinedReimburse, setDeclinedReimburse] = useState("");

  useEffect(() => {
    // Fetch data for Summary
    const fetchSummary = async () => {
      try {
        const headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        const response = await axios.get(`${ip}/api/kehadiran/list`, { headers });
        const data = response.data[0]; // Assuming the first data corresponds to the current user
        setSummaryData({
          overtime: data["jatah overtime"] || 0,
          cuti: data["total hari cuti"] || 0,
          absensi: data["total absensi"] || 0,
        });
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    // Fetch data for Cuti, Izin, Reimburse
    const fetchApprovalData = async () => {
      try {
        const headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        const response = await axios.get(`${ip}/api/pengajuan/status/get/self`, {
          headers,
        });
        const { cuti, izin, reimburst } = response.data.data;

        setWaitingCuti(cuti.menunggu || 0);
        setAcceptedCuti(cuti.diterima || 0);
        setDeclinedCuti(cuti.ditolak || 0);
        setWaitingIzin(izin.menunggu || 0);
        setAcceptedIzin(izin.diterima || 0);
        setDeclinedIzin(izin.ditolak || 0);
        setWaitingReimburse(reimburst.menunggu || 0);
        setAcceptedReimburse(reimburst.diterima || 0);
        setDeclinedReimburse(reimburst.ditolak || 0);
      } catch (error) {
        console.error("Error fetching approval data:", error);
      }
    };

    fetchSummary();
    fetchApprovalData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="flex flex-col w-10/12 mx-auto">
      <Slider {...settings} className="w-full h-full mx-auto">
        {/* Summary Slide */}
        <div>
          <Typography variant="h5" className="mb-5" style={{ fontWeight: "400" }}>
            Summary Kehadiran
          </Typography>
          <div className="flex flex-row justify-between items-center my-2">
            {/* Overtime */}
            <div className="py-2 lg:py-2 px-8 lg:px-7 bg-blue-500 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Overtime Quota</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {summaryData.overtime}
              </Typography>
            </div>
            {/* Cuti */}
            <div className="py-2 lg:py-2 px-8 lg:px-7 bg-yellow-400 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Available Leave</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {summaryData.cuti}
              </Typography>
            </div>
            {/* Absensi */}
            <div className="py-2 lg:py-2 px-8 lg:px-7 bg-green-500 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Total Absence</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {summaryData.absensi}
              </Typography>
            </div>
          </div>
        </div>

        {/* Cuti Slide */}
        <div>
          <Typography variant="h5" className="mb-5" style={{ fontWeight: "400" }}>
            Status Approval Cuti
          </Typography>
          <div className="flex flex-row justify-between items-center my-2">
            {/* Waiting */}
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-gray-400 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Waiting</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {waitingCuti}
              </Typography>
            </div>
            {/* Accepted */}
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-green-500 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Accepted</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {acceptedCuti}
              </Typography>
            </div>
            {/* Declined */}
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-red-600 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Declined</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {declinedCuti}
              </Typography>
            </div>
          </div>
        </div>

        {/* Izin Slide */}
        <div>
          <Typography variant="h5" className="mb-5" style={{ fontWeight: "400" }}>
            Status Approval Izin
          </Typography>
          <div className="flex flex-row justify-between items-center my-2">
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-gray-400 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Waiting</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {waitingIzin}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-green-500 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Accepted</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {acceptedIzin}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-red-600 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Declined</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {declinedIzin}
              </Typography>
            </div>
          </div>
        </div>

        {/* Reimburse Slide */}
        <div>
          <Typography variant="h5" className="mb-5" style={{ fontWeight: "400" }}>
            Status Approval Reimburse
          </Typography>
          <div className="flex flex-row justify-between items-center my-2">
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-gray-400 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Waiting</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {waitingReimburse}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-green-500 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Accepted</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {acceptedReimburse}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 bg-red-600 w-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Declined</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {declinedReimburse}
              </Typography>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
}

export default StatusApproval;
