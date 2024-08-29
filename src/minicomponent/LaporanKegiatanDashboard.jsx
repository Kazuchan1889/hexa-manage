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
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import ip from "../ip";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import Swal from "sweetalert2";

function LaporanKegiatanDashboardPage() {
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
    // Set the current time and date
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    setFormData((prevFormData) => ({
      ...prevFormData,
      time: currentTime,
      tanggal: currentDate,
    }));

    // Fetch table data
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
          setTableData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  }, []);

  const handleDetailButtonClick = () => {
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
  };

  const handleFileUpload = async (acceptedFiles) => {
    const maxSizeInBytes = 5000000; // 5 MB
    const newUploadedFiles = [...uploadedFiles, ...acceptedFiles];
    const oversizedFiles = acceptedFiles.filter(
      (file) => file.size > maxSizeInBytes
    );

    if (oversizedFiles.length > 0) {
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
    const requiredFields = ["lokasi", "keterangan", "time", "tanggal", "jenis"];
    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);

    setIsFormValid(!isAnyFieldEmpty);
  }, [formData]);

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

        Swal.fire({
          icon: "success",
          title: "Submission Success",
          text: "The report has been submitted successfully.",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 402) {
          Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: `${error.response.data.message}`,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Submission Error",
            text: "An error occurred while submitting the report. Please try again.",
          });
        }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

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
        <Grid item xs={12} sm={4}>
          <TextField
            name="jenis"
            label="Jenis"
            id="jenis"
            select
            variant="outlined"
            size="small"
            fullWidth
            className="mb-2"
            value={formData.jenis}
            onChange={handleInputChange}
          >
            <MenuItem value="Keluar kantor">Keluar kantor</MenuItem>
            <MenuItem value="Dalam kantor">Dalam kantor</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {showUploadFile && (
        <div>
          <div
            {...getRootProps()}
            className={`w-full h-20 flex justify-center items-center border-2 border-dashed border-gray-400 rounded-md mb-2`}
            style={{
              backgroundColor: uploadedFiles.length > 0 ? "#f0f0f0" : "inherit",
              position: "relative",
            }}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <CircularProgress size={30} />
            ) : (
              <p>
                {uploadedFiles.length > 0
                  ? "Drag & drop files to upload more"
                  : "Drag & drop a file here, or click to select a file"}
              </p>
            )}
          </div>

          {uploadedFiles.length > 0 && (
            <div className="w-full mb-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-1"
                >
                  <div className="flex items-center">
                    <CheckCircleIcon style={{ marginRight: "5px" }} />
                    <span>{file.name}</span>
                  </div>
                  <HighlightOffIcon
                    onClick={() =>
                      setUploadedFiles((prevFiles) =>
                        prevFiles.filter((_, i) => i !== index)
                      )
                    }
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid}
        fullWidth
      >
        Submit
      </Button>

      {/* Table */}
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Jenis</TableCell>
              <TableCell>Lokasi</TableCell>
              <TableCell>Keterangan</TableCell>
              <TableCell>Dokumen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
              tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.jenis}</TableCell>
                    <TableCell>{row.lokasi}</TableCell>
                    <TableCell>{row.keterangan}</TableCell>
                    <TableCell>
                      {row.dokumen.map((doc, docIndex) => (
                        <img
                          key={docIndex}
                          src={doc}
                          alt="Dokumen"
                          className="cursor-pointer"
                          onClick={() => handleImageClick(doc)}
                          style={{ width: "50px", height: "50px" }}
                        />
                      ))}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={tableData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* History Modal */}
      <Modal open={showHistoryModal} onClose={handleCloseHistoryModal}>
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg">
            <Typography variant="h6">History Modal</Typography>
            <Button onClick={handleCloseHistoryModal}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Image Preview Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          maxWidth="md"
        >
          <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />
        </Dialog>
      )}
    </form>
  );
}

export default LaporanKegiatanDashboardPage;
