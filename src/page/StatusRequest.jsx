import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ip from "../ip";
import axios from "axios";

function StatusRequest() {
  const [waitReimburse, setWaitReimburse] = useState("");
  const [waitIzin, setWaitIzin] = useState("");
  const [waitCuti, setWaitCuti] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const apiCheckIn = `${ip}/api/pengajuan/status/waiting`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };
    axios
      .get(apiCheckIn, { headers })
      .then((response) => {
        setWaitCuti(response.data.data.cuti);
        setWaitIzin(response.data.data.izin);
        setWaitReimburse(response.data.data.reimburst);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, []);

  return (
    <div className="flex flex-col justify-between w-full h-fit">
      <div className="mb-10 mt-3">
        <Typography variant="h6" style={{ fontWeight: "400" }}>
          Status request
        </Typography>
      </div>
      <div className="flex justify-between mx-2">
        <Button
          variant="outlined"
          style={{ height: "6rem", width: "6rem" }}
          onClick={() => navigate("/masterizin")}
        >
          <div className="flex flex-col justify-evenly h-full">
            <Typography variant="body2">Izin</Typography>
            <Typography variant="h6">{waitIzin}</Typography>
          </div>
        </Button>

        <Button
          variant="outlined"
          style={{ height: "6rem", width: "6rem" }}
          onClick={() => navigate("/mastercuti")}
        >
          <div className="flex flex-col justify-evenly h-full">
            <Typography variant="body2">Cuti</Typography>
            <Typography variant="h6">{waitCuti}</Typography>
          </div>
        </Button>
        <Button
          variant="outlined"
          style={{ height: "6rem", width: "6rem" }}
          onClick={() => navigate("/masterreimburst")}
        >
          <div className="flex flex-col justify-evenly h-full">
            <Typography variant="body2">Reimburse</Typography>
            <Typography variant="h6">{waitReimburse}</Typography>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default StatusRequest;
