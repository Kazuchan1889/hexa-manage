import { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom"; // Tambahkan untuk navigasi
import ip from "../ip";
import axios from "axios";

function CheckinDashboard() {
  const [masuk, setMasuk] = useState("");
  const [keluar, setKeluar] = useState("");
  const [serverTime, setServerTime] = useState("");
  const [checkInStatus, setCheckInStatus] = useState(
    localStorage.getItem("result") || "belumMasuk"
  );
  const navigate = useNavigate(); // Untuk navigasi ke halaman lain

  const isUserCheckin = checkInStatus === "udahMasuk";
  const isUserCheckout = checkInStatus === "udahKeluar";

  useEffect(() => {
    const apiCheckIn = `${ip}/api/absensi/get/today/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };
    axios
      .get(apiCheckIn, { headers })
      .then((response) => {
        setMasuk(response.data.masuk);
        setKeluar(response.data.keluar);
      })
      .catch((error) => {
        console.error("Error", error);
      });

    const fetchServerTime = () => {
      axios
        .get(apiCheckIn, { headers })
        .then((response) => {
          setServerTime(response.data.currtime);
        })
        .catch((error) => {
          console.error("Error fetching server time", error);
        });
    };

    fetchServerTime();
    const intervalId = setInterval(fetchServerTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleButtonClick = () => {
    if (checkInStatus !== "udahKeluar") {
      navigate("/liveattendance");
    }
  };

  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full h-full flex-row justify-center items-center mt-16">
      <div className="w-full flex flex-row justify-center">
        <div className="w-full flex flex-col justify-center items-center h-20">
          <div className="w-full flex flex-row justify-center items-center">
            <div className="flex flex-col justify-center h-12">
              <Typography variant="body2" className="text-center">Check In</Typography>
              <div className="flex flex-col items-center">
                <div
                  className="p-2 rounded-lg my-2 w-fit"
                  style={{
                    backgroundColor: isUserCheckin ? "#1e3a8a" : "#f3f4f6",
                  }}
                >
                  <CheckCircleRoundedIcon
                    className="text-black text-center"
                    style={{
                      fontSize: 40,
                      color: isUserCheckin ? "#84cc16" : "#d1d5db",
                    }}
                  />
                </div>
              </div>
              <Typography variant="body2" className="text-center">
                {masuk || "Haven’t Check-In yet"}
              </Typography>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center h-20">
          <div className="w-full flex flex-row justify-center items-center">
            <div className="flex flex-col justify-center h-12">
              <Typography variant="body2" className="text-center">Check Out</Typography>
              <div className="flex flex-col items-center ">
                <div
                  className="p-2 rounded-lg my-2 w-fit"
                  style={{
                    backgroundColor: isUserCheckout ? "#1e3a8a" : "#f3f4f6",
                  }}
                >
                  <CheckCircleRoundedIcon
                    style={{
                      fontSize: 40,
                      color: isUserCheckout ? "#84cc16" : "#d1d5db",
                    }}
                  />
                </div>
              </div>
              <Typography variant="body2" className="text-center">
                {keluar || "Haven’t Check-Out yet"}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full mt-6">
        <Button
          variant="contained"
          onClick={handleButtonClick}
          disabled={checkInStatus === "udahKeluar"} // Disable jika status sudah check out
          fullWidth
        >
          {checkInStatus === "belumMasuk"
            ? "Check In"
            : checkInStatus === "udahMasuk"
              ? "Check Out"
              : "Terima Kasih"}
        </Button>
      </div>
    </div>
  );
}

export default CheckinDashboard;