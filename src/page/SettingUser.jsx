import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import ip from "../ip";

function AccountSettings() {
  const [uploadedFileBase64, setUploadedFileBase64] = useState("");
  const [formData, setFormData] = useState({
    alamat: "",
    email: "",
    notelp: "",
    nik: "",
    bankname: "",
    bankacc: "",
    maritalstatus: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  // Untuk mendapatkan data user
  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data[0];
        setUploadedFileBase64(data.dokumen);
        setFormData({
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

  // Untuk melakukan filter file yang dikirim
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setUploadedFileBase64(base64String);
      };
      reader.readAsDataURL(file);
    },
    multiple: false,
  });

  // Untuk membuka dan menutup modal
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Untuk melakukan request ke admin
  const handleRequest = async () => {
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

    const apiRequest = `${ip}/api/karyawan/request/update`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    try {
      const response = await axios.post(apiRequest, requestBody, { headers });
      console.log(response.data);

      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text: "Your request has been sent to the admin.",
      }).then(() => {
        handleModalClose();
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Request Failed!",
        text: "An error occurred while sending your request.",
      });
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center p-4">
      {/* Image Upload */}
      <div className="flex justify-center mb-6">
        <div {...getRootProps()} className="flex items-center justify-center">
          <input {...getInputProps()} id="fileInput" />
          <Avatar
            src={uploadedFileBase64}
            alt="Profile Picture"
            sx={{
              width: 130, // Ukuran lebar avatar
              height: 130, // Ukuran tinggi avatar
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-3xl border p-4">
        <form className="flex flex-col space-y-4">
          {/* Alamat */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            id="alamat"
            label="Alamat"
            name="alamat"
            value={formData.alamat}
            InputProps={{ readOnly: true, style: { paddingLeft: 0 } }}
          />

          {/* Email */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={formData.email}
            InputProps={{ readOnly: true, style: { paddingLeft: 0 } }}
          />

          {/* Phone Number */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            id="notelp"
            label="No HP"
            name="notelp"
            type="text"
            value={formData.notelp}
            InputProps={{ readOnly: true, style: { paddingLeft: 0 } }}
          />

          {/* Marital Status */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            id="maritalstatus"
            label="Marital Status"
            name="maritalstatus"
            value={formData.maritalstatus}
            InputProps={{ readOnly: true, style: { paddingLeft: 0 } }}
          />

          {/* Bank Account */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            id="bankacc"
            label="Bank Account"
            name="bankacc"
            value={formData.bankacc}
            InputProps={{ readOnly: true, style: { paddingLeft: 0 } }}
          />

          {/* Bank Account Name */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            id="bankname"
            label="Bank Account Name"
            name="bankname"
            value={formData.bankname}
            InputProps={{ readOnly: true, style: { paddingLeft: 0 } }}
          />

          {/* NIK Kependudukan */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            id="nik"
            label="Nomor Induk Kependudukan"
            name="nik"
            value={formData.nik}
            InputProps={{ readOnly: true, style: { paddingLeft: 0 } }}
          />

          <Button
            size="small"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleModalOpen}
          >
            Request Changes
          </Button>
        </form>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Request Changes</DialogTitle>
        <DialogContent>
          <form className="flex flex-col space-y-4">
            {/* Alamat */}
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              id="alamat"
              label="Alamat"
              name="alamat"
              value={formData.alamat}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  alamat: e.target.value,
                }))
              }
            />

            {/* Email */}
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            {/* Phone Number */}
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              id="notelp"
              label="No HP"
              name="notelp"
              type="text"
              value={formData.notelp}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notelp: e.target.value,
                }))
              }
            />

            {/* Marital Status */}
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              id="maritalstatus"
              label="Marital Status"
              name="maritalstatus"
              value={formData.maritalstatus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maritalstatus: e.target.value,
                }))
              }
            />

            {/* Bank Account */}
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              id="bankacc"
              label="Bank Account"
              name="bankacc"
              value={formData.bankacc}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bankacc: e.target.value,
                }))
              }
            />

            {/* Bank Account Name */}
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              id="bankname"
              label="Bank Account Name"
              name="bankname"
              value={formData.bankname}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bankname: e.target.value,
                }))
              }
            />

            {/* NIK Kependudukan */}
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              id="nik"
              label="Nomor Induk Kependudukan"
              name="nik"
              value={formData.nik}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nik: e.target.value,
                }))
              }
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRequest} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AccountSettings;
