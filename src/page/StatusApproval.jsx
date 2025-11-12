import axios from "axios";
import { useState, useEffect } from "react";
import { Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
  const [activeSlide, setActiveSlide] = useState(0);

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

  const slides = [
    {
      title: "Attendance Summary",
      items: [
        {
          label: "Overtime Quota",
          value: summaryData.overtime,
          color: "bg-blue-500",
        },
        {
          label: "Available Leave",
          value: summaryData.cuti,
          color: "bg-yellow-400",
        },
        {
          label: "Total Absence",
          value: summaryData.absensi,
          color: "bg-green-500",
        },
      ],
    },
    {
      title: "Leave Approval Status",
      items: [
        {
          label: "Waiting",
          value: waitingCuti,
          color: "bg-gray-400",
        },
        {
          label: "Accepted",
          value: acceptedCuti,
          color: "bg-green-500",
        },
        {
          label: "Declined",
          value: declinedCuti,
          color: "bg-red-600",
        },
      ],
    },
    {
      title: "Permit Approval Status",
      items: [
        {
          label: "Waiting",
          value: waitingIzin,
          color: "bg-gray-400",
        },
        {
          label: "Accepted",
          value: acceptedIzin,
          color: "bg-green-500",
        },
        {
          label: "Declined",
          value: declinedIzin,
          color: "bg-red-600",
        },
      ],
    },
    {
      title: "Reimbursement Approval Status",
      items: [
        {
          label: "Waiting",
          value: waitingReimburse,
          color: "bg-gray-400",
        },
        {
          label: "Accepted",
          value: acceptedReimburse,
          color: "bg-green-500",
        },
        {
          label: "Declined",
          value: declinedReimburse,
          color: "bg-red-600",
        },
      ],
    },
  ];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex flex-col w-full h-full px-2">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <IconButton
          onClick={handlePrev}
          size="small"
          className="!bg-white !shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon />
        </IconButton>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === activeSlide ? "bg-[#204682]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <IconButton
          onClick={handleNext}
          size="small"
          className="!bg-white !shadow-md"
          aria-label="Next slide"
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <div className="flex-1 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full h-full flex justify-center px-2 sm:px-4"
            >
              <div className="w-full max-w-[680px] h-full bg-white rounded-2xl border border-gray-200 px-4 py-3 sm:px-8 sm:py-4 flex flex-col items-center justify-center gap-6">
                <Typography
                  variant="h5"
                  className="text-center text-[#11284E]"
                  style={{ fontWeight: "500" }}
                >
                  {slide.title}
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 w-full">
                  {slide.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`${item.color} w-full h-28 sm:h-32 flex flex-col justify-center items-center rounded-xl px-5 text-white`}
                    >
                      <Typography variant="body2" className="text-center">
                        {item.label}
                      </Typography>
                      <Typography variant="body1" className="text-center" style={{ fontWeight: "bold" }}>
                        {item.value ?? 0}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4 sm:hidden">
        <IconButton
          onClick={handlePrev}
          size="small"
          className="!bg-white !shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleNext}
          size="small"
          className="!bg-white !shadow-md"
          aria-label="Next slide"
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
}

export default StatusApproval;