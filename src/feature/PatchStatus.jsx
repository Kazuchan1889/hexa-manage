/* eslint-disable react/prop-types */
import { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import ip from "../ip";

const PatchStatus = ({ string, id }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };
  const url = `${ip}/api/absensi/update/status`;
  const [status, setStatus] = useState(string);
  const statusValue = [
    "masuk",
    "cuti",
    "izin",
    "sakit",
    "tanpa alasan",
    "terlambat",
  ];

  async function update(e) {
    setStatus(e.target.value);
    const body = {
      status: e.target.value,
      id: id,
    };
    try {
      const response = await axios.patch(url, body, config);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <TextField
      select
      value={status}
      size="small"
      onChange={(e) => update(e)}
      variant="standard"
      style={{ marginTop: "10px" }}
      SelectProps={{
        MenuProps: {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          getContentAnchorEl: null,
          PaperProps: {
            style: {
              maxHeight: 150,
              width: 200, // Sesuaikan lebar dropdown
            },
          },
        },
        disableUnderline: true,
      }}
      fullWidth
      style={{ padding: 0 }}
      className="text-left"
    >
      {statusValue.map((val) => (
        <MenuItem key={val} value={val} style={{ textAlign: "center" }}>
          {val}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default PatchStatus;
