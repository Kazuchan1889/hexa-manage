import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import Swal from "sweetalert2";
import ip from "../ip";


function LaporanKegiatanForm({ onClose }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileBase64s, setUploadedFileBase64s] = useState([]);
  const [uploadAlert, setUploadAlert] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [formData, setFormData] = useState({
    lokasi: "",
    keterangan: "",
    time: "",
    tanggal: "",
    jenis: "",
    deskripsi: "",
  });

  const handleFileUpload = (acceptedFiles) => {
    const newUploadedFiles = [...uploadedFiles, ...acceptedFiles];
    setUploadedFiles(newUploadedFiles);

    const newFileBase64s = acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });
    setUploadedFileBase64s(newFileBase64s);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      });

      if (filteredFiles.length > 0) {
        handleFileUpload(filteredFiles);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.jenis === "Keluar kantor" && uploadedFiles.length === 0) {
      return setUploadAlert(true);
    }

    const requestBody = {
      lokasi: formData.lokasi,
      keterangan: formData.keterangan,
      jenis: formData.jenis,
      time: formData.time,
      tanggal: formData.tanggal,
      dokumen: uploadedFileBase64s.map((reader) => reader.result),
    };

    const apiSubmit = `${ip}/api/laporan/post`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    axios
      .post(apiSubmit, requestBody, { headers })
      .then((response) => {
        console.log(response);
        setUploadedFiles([]);
        setUploadedFileBase64s([]);
        Swal.fire({
          icon: "success",
          title: "Submit Sukses",
          text: response.data,
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        }).then(() => {
          onClose(); // Tutup modal setelah submit
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Submit Gagal",
          text: "error",
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        });
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "jenis" && value === "Keluar kantor") {
      setShowUploadFile(true);
    } else {
      setShowUploadFile(false);
    }
  };

  return (
    <div className="p-4 bg-indigo-500 rounded rounded-xl w-80 h-80 justify-self-auto">
      <Typography variant="h5">Activity Report</Typography>
      {uploadAlert && (
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setUploadAlert(false)}
          style={{ marginBottom: "10px" }}
        >
          You must upload a file when choosing "Keluar kantor."
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="mt-4 ">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Keterangan"
              name="keterangan"
              id="keterangan"
              type="text"
              size="small"
              variant="outlined"
              fullWidth
              value={formData.keterangan}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lokasi"
              name="lokasi"
              id="lokasi"
              size="small"
              variant="outlined"
              fullWidth
              value={formData.lokasi}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="time"
              label="Time"
              id="time"
              type="time"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.time}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="tanggal"
              label="Tanggal"
              id="tanggal"
              type="date"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.tanggal}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Jenis"
              name="jenis"
              id="jenis"
              select
              size="small"
              variant="outlined"
              fullWidth
              value={formData.jenis}
              onChange={handleInputChange}
            >
              <MenuItem value="Didalam kantor">
                <div className="text-left">Didalam kantor</div>
              </MenuItem>
              <MenuItem value="Keluar kantor">
                <div className="text-left">Keluar kantor</div>
              </MenuItem>
            </TextField>
          </Grid>
          {showUploadFile && (
            <Grid item xs={12}>
              <p className="text-left">Upload Files</p>
              <div {...getRootProps()} className="mb-2">
                <input {...getInputProps()} id="fileInput" />
                {uploading ? (
                  <div className="flex items-center">
                    <CircularProgress color="primary" size={24} />
                    <p className="ml-2">Uploading...</p>
                  </div>
                ) : uploadedFiles.length > 0 ? (
                  <div>
                    <Typography variant="body2">
                      {uploadedFiles.length} Files Uploaded
                    </Typography>
                    <ul>
                      {uploadedFiles.map((file, index) => (
                        <li key={index}>
                          <span className="ml-2">{file.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Button size="small" variant="outlined">
                    Drop files here
                  </Button>
                )}
              </div>
            </Grid>
          )}
        </Grid>
        <div className="mt-5">
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LaporanKegiatanForm;
