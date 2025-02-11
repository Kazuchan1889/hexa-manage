import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import ip from "../ip";

function AccountSettings() {
  const [uploadedFileBase64, setUploadedFileBase64] = useState('');
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    email: "",
    notelp: "",
    nik: "",
    bankname: "",
    bankacc: "",
    maritalstatus: "",
  });
  const [isEditing, setIsEditing] = useState(false); // To handle editing state

  // UseEffect untuk mengambil data user
  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data[0];
        setUploadedFileBase64(response.data[0].dokumen);
        setFormData({
          nama: data.nama || "",
          alamat: data.alamat || "",
          email: data.email || "",
          notelp: data.notelp || "",
          nik: data.nik || "",
          bankname: data.bankname || "",
          bankacc: data.bankacc || "",
          maritalstatus: data.maritalstatus || "",
        });
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, []);

  // Menangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  // Submit data ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      dokumen: uploadedFileBase64,
      alamat: formData.alamat,
      email: formData.email,
      notelp: formData.notelp,
      nik: formData.nik,
      maritalstatus: formData.maritalstatus,
      bankname: formData.bankname,
      bankacc: formData.bankacc,
    };

    const apiSubmit = `${ip}/api/karyawan/patch/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    try {
      const response = await axios.patch(apiSubmit, requestBody, { headers });
      Swal.fire({
        icon: "success",
        title: "Update Successful!",
        text: response.data,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: "An error occurred while processing your request.",
      });
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center p-4">
      {/* Header - Profile Image & Name */}
      <div className="w-full flex items-center mb-6">
        <Avatar
          src={uploadedFileBase64}
          alt="Upload File"
          sx={{ width: 130, height: 130, cursor: "pointer" }}
          className="ml-4"
        />
        <div className="ml-6">
          <Typography
            variant="h6"
            className="font-bold"
            style={{ fontSize: 30, fontFamily: "Helvetica Bold", textAlign: "left" }}
          >
            {formData.nama || "Nama Pengguna"}
          </Typography>

          <div className="text-left">
            {!isEditing ? (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                className="px-4 py-1 text-sm"
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                size="small"
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className="px-4 py-1 text-sm"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-white p-6">
          {[
            { label: "Alamat", name: "alamat" },
            { label: "Email Address", name: "email" },
            { label: "No HP", name: "notelp", type: "text" },
            { label: "Marital Status", name: "maritalstatus" },
            { label: "Bank Account", name: "bankacc" },
            { label: "Bank Account Name", name: "bankname" },
            { label: "Nomor Induk Kependudukan", name: "nik" },
          ].map((field, index) => (
            <div key={index} className="flex items-center rounded-lg p-2">
              <Typography className="w-1/3 text-left pr-4" variant="body1">
                {field.label}:
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={
                  field.type === "text" ? handleInputNumberChange : handleInputChange
                }
                InputProps={{ style: { paddingLeft: 8, borderRadius: 10 } }}
                className="w-2/3 rounded-lg"
                disabled={!isEditing} // Disable form inputs if not editing
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}

export default AccountSettings;
