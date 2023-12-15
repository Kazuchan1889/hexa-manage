import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Dialog,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TablePagination,
  Paper,
  Modal,
  DialogContent,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import ip from "../ip";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import Swal from "sweetalert2";

function LaporanKegiatanDashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileBase64s, setUploadedFileBase64s] = useState([]);
  const [formData, setFormData] = useState({
    lokasi: "",
    keterangan: "",
    time: "",
    tanggal: "",
    jenis: "",
  });
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [uploadAlert, setUploadAlert] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Untuk Fetch data table
    const apiUrl = `${ip}/api/laporan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTableData(response.data);
        } else {
          console.error("Invalid response data:", response.data);
          // If the response is not an array, set an empty array or handle it accordingly
          setTableData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  }, []);

  //Untuk membuka history
  const handleDetailButtonClick = () => {
    setShowHistoryModal(true);
  };

  //Untuk menutup history
  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
  };

  // Untuk upload file(image)
  const handleFileUpload = async (acceptedFiles) => {
    const maxSizeInBytes = 5000000; // 5 MB
    const newUploadedFiles = [...uploadedFiles, ...acceptedFiles];
    const oversizedFiles = acceptedFiles.filter(
      (file) => file.size > maxSizeInBytes
    );

    if (oversizedFiles.length > 0) {
      // Display a SweetAlert for oversized files using async function
      await Swal.fire({
        icon: "error",
        title: "File Too Big",
        text: "File size exceeds the limit of 5 MB",
      });
      return;
    }

    setUploadedFiles(newUploadedFiles);

    const newFileBase64s = acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });

    setUploadedFileBase64s(newFileBase64s);
  };

  // Untuk restriction file
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

      if (filteredFiles.length > 0) {
        handleFileUpload(filteredFiles);
      }
    },
  });

  useEffect(() => {
    // Untuk mengecek field yang kosong
    const requiredFields = ["lokasi", "keterangan", "time", "tanggal", "jenis"];
    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);

    // Kalau ada field yang kosong maka form tidak valid (disable)
    setIsFormValid(!isAnyFieldEmpty);
  }, [formData]);

  // Untuk mengupload data
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

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Submission Success",
          text: "The report has been submitted successfully.",
        }).then(() => {
          // Reload the page after the user clicks "OK"
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response);
        if (error.response && error.response.status === 402) {
          // Custom error message for status code 402
          Swal.fire({
            icon: "error",
            title: "Kamu gagal submit",
            text: `${error.response.data.message}`,
          });
        } else {
          // Default error handling for other errors
          Swal.fire({
            icon: "error",
            title: "Submission Error",
            text: "An error occurred while submitting the report. Please try again.",
          });
        }
      });
  };

  // Untuk mengganti input pada fields
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

  // Untuk mengganti page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Untuk mengganti jumlah row pada page
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Untuk memperbesar gambar pada table history
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-8/12 flex flex-col justify-center"
    >
      <div className="w-full mb-4 flex justify-between items-center">
        <Typography variant="h5" className="text-left">
          Laporan Kegiatan
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={handleDetailButtonClick}
        >
          Detail
        </Button>
      </div>
      {/* Alert untuk user yang kerja diluar namun tidak mengirim file bukti */}
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
      <Grid container spacing={2}>
        {/* Keterangan */}
        <Grid item xs={12} sm={6}>
          <div className="mb-2">
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
          </div>
        </Grid>

        {/* Lokasi */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Lokasi"
            name="lokasi"
            id="Lokasi"
            size="small"
            variant="outlined"
            fullWidth
            className="mb-2"
            value={formData.lokasi}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Waktu */}
        <Grid item xs={12} sm={4}>
          <TextField
            name="time"
            label="Time"
            id="time"
            type="time"
            variant="outlined"
            fullWidth
            className="mb-2"
            size="small"
            value={formData.time}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              placeholder: "",
            }}
          />
        </Grid>

        {/* Tanggal Laporan */}
        <Grid item xs={12} sm={4}>
          <TextField
            name="tanggal"
            label="Tanggal"
            id="tanggal"
            type="date"
            variant="outlined"
            fullWidth
            className="mb-2"
            size="small"
            value={formData.tanggal}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              placeholder: "",
            }}
          />
        </Grid>

        {/* Jenis */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Jenis"
            name="jenis"
            id="Jenis"
            select
            size="small"
            variant="outlined"
            fullWidth
            className="mb-2"
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

        {/* Image */}
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
                        <CheckCircleIcon color="primary" />
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={
            !isFormValid ||
            (formData.jenis === "Keluar kantor" && uploadedFiles.length === 0)
          }
        >
          Submit
        </Button>
      </div>
      <Modal open={showHistoryModal} onClose={handleCloseHistoryModal}>
        <div
          className="mx-auto flex flex-col items-center justify-center absolute w-10/12"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-full rounded-lg text-center align-center p-5 bg-primary">
            <div className="flex justify-between">
              <Typography variant="h6" id="history-modal-title">
                History Table
              </Typography>

              <HighlightOffIcon onClick={handleCloseHistoryModal} />
            </div>
            <TableContainer
              className="rounded-md overflow-y-auto"
              component={Paper}
            >
              <Table size="small">
                <TableHead style={{ backgroundColor: "#204684" }}>
                  <TableRow>
                    <TableCell>
                      <Typography
                        variant="body2"
                        className="font-semibold text-white flex justify-center"
                      >
                        Keterangan
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        className="font-semibold text-white flex justify-center"
                      >
                        Lokasi
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        className="font-semibold text-white flex justify-center"
                      >
                        Waktu
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        className="font-semibold text-white flex justify-center"
                      >
                        Tanggal Laporan
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        className="font-semibold text-white flex justify-center"
                      >
                        Tanggal Kirim
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        className="font-semibold text-white flex justify-center"
                      >
                        Jenis
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        className="font-semibold text-white flex justify-center"
                      >
                        Bukti
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">
                          <div className="text-center">{row.keterangan}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-center">{row.lokasi}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-center">{row.time}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-center">{row.target}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-center">{row.tanggal}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-center">{row.jenis}</div>
                        </TableCell>
                        <TableCell className="align-center">
                          <div className="flex justify-center gap-[20%]">
                            {row.dokumen[0] && (
                              <img
                                src={row.dokumen}
                                className="h-7 cursor-pointer m-auto"
                                onClick={() => handleImageClick(row.dokumen)}
                              />
                            )}
                            {row.dokumen[1] && (
                              <img
                                src={row.dokumen}
                                className="h-7 cursor-pointer m-auto"
                                onClick={() => handleImageClick(row.dokumen)}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </Modal>
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
      >
        <DialogContent>
          <img
            src={selectedImage}
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
}

export default LaporanKegiatanDashboard;
