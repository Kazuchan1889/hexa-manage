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
import NavbarUser from "../feature/NavbarUser";
import Swal from "sweetalert2";
import ip from "../ip";
import PasswordResetDialog from "../feature/ChangePassword";

function AccountSettings() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading] = useState(false);
  const [uploadInProgress] = useState(false);
  const [uploadedFileBase64, setUploadedFileBase64] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [formData, setFormData] = useState({
    alamat: "",
    email: "",
    notelp: "",
    nik: "",
    bankname: "",
    bankacc: "",
    maritalstatus: "",
  });

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
        setUploadedFileBase64(response.data[0].dokumen);
        setFormData({
          alamat: data.alamat || "",
          email: data.email || "",
          notelp: data.notelp || "",
          nik: data.nik || "",
          bankname: data.bankname || "",
          bankacc: data.bankacc || "",
          maritalstatus: data.maritalstatus || "",
        });
        console.log(data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, []);

  // Untuk upload file (image) untuk profile picture
  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setUploadedFileBase64(base64String);
    };

    reader.readAsDataURL(file);
  };

  // Untuk melakukan filter file yang dikirim
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      });

      if (filteredFiles.length === 1) {
        handleFileUpload(filteredFiles);
      }
    },
    multiple: false,
  });

  // Untuk melakukan submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      dokumen: uploadedFileBase64,
      alamat: formData.alamat,
      email: formData.email,
      password: formData.password,
      notelp: formData.notelp,
      nik: formData.nik,
      maritalstatus: formData.maritalstatus,
      bankname: formData.bankname,
      bankacc: formData.bankacc,
    };

    if (uploadInProgress) {
      return;
    }

    const apiSubmit = `${ip}/api/karyawan/patch/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    try {
      const response = await axios.patch(apiSubmit, requestBody, { headers });
      console.log(response.data);
      console.log(uploadedFileBase64.split(",")[1].slice(0, 20));

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

  //Untuk mengganti input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //Untuk mengganti input (int)
  const handleInputNumberChange = (e) => {
    const { name, value } = e.target;

    // Ensure only numbers are entered
    const numericValue = value.replace(/\D/g, "");

    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  // Untuk membuka change password
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // Untuk menutup change password
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Untuk membuat responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-white overflow-y-hidden">
      <NavbarUser />
      <div className="w-screen flex h-fit">
        <div className="flex h-fit w-screen mx-auto">
          <div className="flex flex-col justify-between items-center my-3 rounded-xl">
            <form
              onSubmit={handleSubmit}
              className="w-10/12 flex justify-center items-center"
            >
              <div className="w-full h-8/12 flex flex-col justify-center">
                <div className="flex flex-row justify-between">
                  <Typography variant="h5" align="left" gutterBottom>
                    Account Settings
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleOpenDialog}
                  >
                    <Typography variant="caption">Change Password</Typography>
                  </Button>
                  <PasswordResetDialog
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                  />
                </div>

                {/* Image */}
                <Grid container spacing={1}>
                  <Grid item xs={1.5} className="cursor-pointer">
                    <div {...getRootProps()} className="mb-2">
                      <input {...getInputProps()} id="fileInput" />

                      {uploading ? (
                        <div className="flex items-center">
                          <CircularProgress color="primary" size={24} />
                          <Typography variant="body1" className="ml-2">
                            Uploading...
                          </Typography>
                        </div>
                      ) : uploadedFile ? (
                        <div>
                          <div className="flex items-center">
                            <CheckCircleIcon color="primary" />
                            <Typography variant="body1" className="ml-2">
                              Upload successful: {uploadedFile.name}
                            </Typography>
                          </div>
                        </div>
                      ) : (
                        <Avatar
                          src={uploadedFileBase64}
                          alt="Upload File"
                          sx={{
                            width: 100,
                            height: 100,
                            marginTop: 2,
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </div>
                  </Grid>

                  {/* Alamat */}
                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="alamat"
                      label="Alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Phone Number */}
                  <Grid item xs={6}>
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
                      onChange={handleInputNumberChange}
                    />
                  </Grid>

                  {/* Marital Status */}
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="maritalstatus"
                      label="Marital Status"
                      name="maritalstatus"
                      value={formData.maritalstatus}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Bank Account */}
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="bankacc"
                      label="Bank Account"
                      name="bankacc"
                      value={formData.bankacc}
                      onChange={handleInputNumberChange}
                    />
                  </Grid>

                  {/* Bank Account Name */}
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="bankname"
                      label="Bank Account Name"
                      name="bankname"
                      value={formData.bankname}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* NIK Kependudukan */}
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="nik"
                      label="Nomor Induk Kependudukan"
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputNumberChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      size="small"
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </form>
            <PasswordResetDialog
              open={resetDialogOpen}
              onClose={() => setResetDialogOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
