import axios from "axios";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Slider from "react-slick";
import ip from "../ip";

function StatusApproval() {
  // const [slideIndex, setSlideIndex] = useState(0);
  const [waitingCuti, setWaitingCuti] = useState("");
  const [acceptedCuti, setAcceptedCuti] = useState("");
  const [declinedCuti, setDeclinedCuti] = useState("");
  const [waitingIzin, setWaitingIzin] = useState("");
  const [acceptedIzin, setaAcceptedIzin] = useState("");
  const [declinedIzin, setDeclinedIzin] = useState("");
  const [waitingReimburse, setWaitingReimburse] = useState("");
  const [acceptedReimburse, setAcceptedReimburse] = useState("");
  const [declinedReimburse, setDeclinedReimburse] = useState("");

  useEffect(() => {
    const apiCheckIn = `${ip}/api/pengajuan/status/get/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };
    axios
      .get(apiCheckIn, { headers })
      .then((response) => {
        setWaitingCuti(response.data.data.cuti.menunggu);
        setAcceptedCuti(response.data.data.cuti.diterima);
        setDeclinedCuti(response.data.data.cuti.ditolak);
        setWaitingIzin(response.data.data.izin.menunggu);
        setaAcceptedIzin(response.data.data.izin.diterima);
        setDeclinedIzin(response.data.data.izin.ditolak);
        setWaitingReimburse(response.data.data.reimburst.menunggu);
        setAcceptedReimburse(response.data.data.reimburst.diterima);
        setDeclinedReimburse(response.data.data.reimburst.ditolak);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, []); // Add an empty dependency array to useEffect to run once

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // beforeChange: (current, next) => setSlideIndex(next),
  };

  return (
    <div className="flex flex-col w-10/12 mx-auto">
      <Slider {...settings} className="w-full h-full mx-auto">
        <div className="">
          <Typography variant="h6" style={{ fontWeight: "400" }}>
            Status Approval Cuti
          </Typography>

          <div className="flex flex-row justify-between items-center my-2">
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-gray-400 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Waiting</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {waitingCuti}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-green-500 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Accepted</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {acceptedCuti}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-red-600 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2" className="text-neutral-200">
                Declined
              </Typography>
              <Typography
                variant="body1"
                className="text-neutral-200"
                style={{ fontWeight: "bold" }}
              >
                {declinedCuti}
              </Typography>
            </div>
          </div>
        </div>
        <div className="">
          <Typography variant="h6" style={{ fontWeight: "400" }}>
            Status Approval Izin
          </Typography>

          <div className="flex flex-row justify-between items-center my-2">
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-gray-400 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Waiting</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {waitingIzin}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-green-500 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Accepted</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {acceptedIzin}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-red-600 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2" className="text-neutral-200">
                Declined
              </Typography>
              <Typography
                variant="body1"
                className="text-neutral-200"
                style={{ fontWeight: "bold" }}
              >
                {declinedIzin}
              </Typography>
            </div>
          </div>
        </div>
        <div className="">
          <Typography variant="h6" style={{ fontWeight: "400" }}>
            Status Approval Reimburse
          </Typography>

          <div className="flex flex-row justify-between items-center my-2">
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-gray-400 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Waiting</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {waitingReimburse}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-green-500 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2">Accepted</Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {acceptedReimburse}
              </Typography>
            </div>
            <div className="py-2 lg:py-5 px-8 lg:px-7 mt-3 lg:mt-0 bg-red-600 w-1/4 h-1/4 flex flex-col justify-center items-center rounded-md drop-shadow-lg">
              <Typography variant="body2" className="text-neutral-200">
                Declined
              </Typography>
              <Typography
                variant="body1"
                className="text-neutral-200"
                style={{ fontWeight: "bold" }}
              >
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
