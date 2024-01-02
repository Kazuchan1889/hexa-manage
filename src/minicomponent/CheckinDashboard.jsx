import { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ip from "../ip";
import axios from "axios";
import Swal from "sweetalert2";

//ini

function CheckinDashboard() {
  const [masuk, setMasuk] = useState("");
  const [keluar, setKeluar] = useState("");
  const [serverTime, setServerTime] = useState("");

  const [checkInStatus, setCheckInStatus] = useState(
    localStorage.getItem("result")
  );

  const isUserCheckin = localStorage.getItem("result") === "udahMasuk";
  const isUserCheckout = localStorage.getItem("result") === "udahKeluar";
  const userStatusIzin = localStorage.getItem("status") === "izin";
  const userStatusCuti = localStorage.getItem("status") === "cuti";
  const userStatusSakit = localStorage.getItem("status") === "sakit";

  // Untuk mendapatkan apakah user sudah check in/check out
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
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, []); // Add an empty dependency array to useEffect to run once

  const fetchData = () => {
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
  };

  useEffect(() => {
    const fetchServerTime = () => {
      const apiCheckIn = `${ip}/api/absensi/get/today/self`;
      const headers = {
        Authorization: localStorage.getItem("accessToken"),
      };

      axios
        .get(apiCheckIn, { headers })
        .then((response) => {
          setServerTime(response.data.currtime);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching server time", error);
        });
    };

    // Fetch initial server time
    fetchServerTime();

    // Set up interval to fetch server time every, for example, 1 minute (adjust as needed)
    const intervalId = setInterval(fetchServerTime, 1000); // 60000 milliseconds = 1 minute

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Add an empty dependency array to useEffect to run once

  // Untuk mengatur check in
  const handleCheckIn = () => {
    const checkInSuccessful = true;
    if (checkInSuccessful) {
      localStorage.setItem("result", "udahMasuk");
      setCheckInStatus("udahMasuk");
      const apiSubmit = `${ip}/api/absensi/patch/masuk`;
      const headers = {
        Authorization: localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      };

      axios
        .patch(apiSubmit, {}, { headers })
        .then((response) => {
          const apiCheckIn = `${ip}/api/absensi/get/today/self`;
          const headers = {
            Authorization: localStorage.getItem("accessToken"),
          };
          axios
            .get(apiCheckIn, { headers })
            .then((response) => {
              setMasuk(response.data.masuk);
              setKeluar(response.data.keluar);

              console.log(response.data);
              fetchData();
            })
            // .then(() => {})
            .catch((error) => {
              console.error("Error", error);
            });
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Check In Sukses!",
            text: response.data,
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Check In Gagal!",
            text: "An error occurred while processing your request.",
          });
        });
    }
  };

  // Untuk mengatur check out
  const handleCheckOut = () => {
    const apiSubmit = `${ip}/api/absensi/patch/keluar`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
    axios
      .patch(apiSubmit, {}, { headers })
      .then((response) => {
        if (!response.data.includes("dapat dilakukan")) setKeluar(true);
        console.log(response);
        Swal.fire({
          icon: response.data.includes("dapat dilakukan") ? "error" : "success",
          title: response.data.includes("dapat dilakukan")
            ? "Check Out Gagal!"
            : "Check Out Sukses!",
          text: response.data,
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Check Out Gagal!",
          text: "An error occurred while processing your request.",
        });
      });
    if (keluar) {
      localStorage.setItem("result", "udahKeluar");
      setCheckInStatus("udahKeluar");
    }
  };

  //Untuk mendapatkan tanggal hari ini
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full">
      <div className="my-2">
        <Typography variant="h6">{date}</Typography>
      </div>
      <div className="mb-6">
        <Typography variant="body2">Server time: {serverTime}</Typography>
      </div>
      {!(userStatusCuti || userStatusIzin || userStatusSakit) && (
        <div className="w-full flex justify-evenly">
          <div className="w-full flex flex-col justify-center items-center h-20 mx-3">
            <div className="w-full flex flex-row justify-between items-center">
              <div
                className="p-2 rounded-lg my-2"
                style={{
                  backgroundColor: isUserCheckin
                    ? "#1e3a8a"
                    : isUserCheckout
                    ? "#f3f4f6"
                    : userStatusIzin || userStatusCuti || userStatusSakit
                    ? "#f3f4f6"
                    : "#f3f4f6",
                }}
              >
                <CheckCircleRoundedIcon
                  className="text-black"
                  style={{
                    fontSize: 40,
                    color:
                      isUserCheckin || isUserCheckout ? "#84cc16" : "#d1d5db",
                  }}
                />
              </div>
              <div className="flex flex-col justify-between h-12">
                <div className="">
                  <Typography variant="body2">Check In</Typography>
                </div>
                <div className="">
                  <Typography variant="body2" className="text-left">
                    {masuk}
                  </Typography>
                </div>
              </div>
            </div>
            {/* Check In Button */}
            <div className="flex justify-center items-center w-full">
              <Button
                variant="contained"
                onClick={handleCheckIn}
                fullWidth
                disabled={checkInStatus !== "belumMasuk"}
              >
                <Typography variant="body2">Check In</Typography>
              </Button>
            </div>
          </div>

          {/* Check Out Section */}
          <div className="w-full flex flex-col justify-center items-center h-20">
            <div className="w-full flex flex-row justify-between items-center">
              <div
                className="p-2 rounded-lg my-2"
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
              <div className="flex flex-col justify-between h-12">
                <div className="">
                  <Typography variant="body2" style={{ whiteSpace: "nowrap" }}>
                    Check Out
                  </Typography>
                </div>
                <div className="">
                  <Typography variant="body2" className="text-left">
                    {keluar}
                  </Typography>
                </div>
              </div>
            </div>
            {/* Check Out Button */}
            <div className="flex justify-center items-center w-full">
              <Button
                variant="contained"
                onClick={handleCheckOut}
                fullWidth
                disabled={checkInStatus !== "udahMasuk"}
              >
                <Typography variant="body2">Check Out</Typography>
              </Button>
            </div>
          </div>
        </div>
      )}
      {userStatusIzin && (
        <div className="mt-14">
          <Typography variant="h5" className="text-red-800">
            Kamu sedang izin hari ini
          </Typography>
        </div>
      )}
      {userStatusCuti && (
        <div className="mt-14">
          <Typography variant="h5" className="text-red-800">
            Kamu sedang cuti hari ini
          </Typography>
        </div>
      )}
      {userStatusSakit && (
        <div className="mt-14">
          <Typography variant="h5" className="text-red-800">
            Kamu sedang sakit hari ini
          </Typography>
        </div>
      )}
    </div>
  );
}

export default CheckinDashboard;
