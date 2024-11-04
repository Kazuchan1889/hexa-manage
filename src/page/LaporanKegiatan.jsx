import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Alert,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon, CloudDownload, Edit as EditIcon } from "@mui/icons-material";
import Swal from "sweetalert2";

import ip from "../ip";
import NavbarUser from "../feature/NavbarUser";

function LaporanKegiatan() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileBase64s, setUploadedFileBase64s] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadAlert, setUploadAlert] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailDescription, setDetailDescription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    lokasi: "",
    keterangan: "",
    time: "",
    tanggal: "",
    jenis: "",
  });

  useEffect(() => {
    const apiUrl = `${ip}/api/laporan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    setLoading(true);

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        setTableData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        setTableData([]);
        setLoading(false);
        console.error(error);
      });
  }, []);

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

    // Mengirim data ke backend
    axios
      .post(`${ip}/api/laporan/post`, requestBody, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Submit Sukses",
          text: "Data berhasil disimpan ke backend.",
        }).then(() => {
          // Refresh halaman setelah submit berhasil
          window.location.reload();
        });
        setUploadedFiles([]);
        setUploadedFileBase64s([]);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        Swal.fire({
          icon: "error",
          title: "Submit Gagal",
          text: "Terjadi kesalahan saat mengirim data ke backend.",
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

  const handleOpenDetailModal = () => {
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleDetailDescriptionChange = (e) => {
    setDetailDescription(e.target.value);
  };

  const handleOpenEditModal = (row) => {
    setEditData(row);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleEditSave = () => {
    // Simulasi penyimpanan perubahan tanpa mengirim ke backend
    console.log("Data yang akan diedit (tidak dikirim ke backend):", editData);
    Swal.fire({
      icon: "success",
      title: "Edit Sukses",
      text: "Data berhasil diubah (simulasi tanpa backend).",
    });
    handleCloseEditModal();
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className=" bg-white overflow-y-auto">
      <NavbarUser />
      <div className="flex h-fit w-screen h-screen flex-col items-center gap-6 p-4">
        
        {/* Form Section */}
        <div className="w-full md:w-3/4 bg-gray-100 p-6 rounded-lg shadow-md ">
          <Typography variant="h5" align="center" gutterBottom>
            Laporan Kegiatan
          </Typography>
          {loading ? (
            <div className="flex justify-center py-10">
              <CircularProgress />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
                  <TextField
                    label="Keterangan"
                    name="keterangan"
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
                    type="time"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.time}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="tanggal"
                    label="Tanggal"
                    type="date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Jenis"
                    name="jenis"
                    select
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.jenis}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Didalam kantor">Didalam kantor</MenuItem>
                    <MenuItem value="Keluar kantor">Keluar kantor</MenuItem>
                  </TextField>
                </Grid>
                {showUploadFile && (
                  <Grid item xs={12}>
                    <p>Upload Files</p>
                    <div {...getRootProps()} className="mb-2">
                      <input {...getInputProps()} />
                      {uploading ? (
                        <CircularProgress color="primary" size={24} />
                      ) : uploadedFiles.length > 0 ? (
                        <ul>
                          {uploadedFiles.map((file, index) => (
                            <li key={index}>
                              <CheckCircleIcon color="primary" />
                              <span className="ml-2">{file.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Button size="small" variant="outlined">
                          Drop files here
                        </Button>
                      )}
                    </div>
                  </Grid>
                )}
              </Grid>

              {/* Button untuk Add Detail */}
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleOpenDetailModal}
                style={{ marginTop: '20px' }}
              >
                Add Detail
              </Button>

              {/* Button Submit */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '10px' }}
              >
                Submit
              </Button>
            </form>
          )}
        </div>

        {/* Table Section */}
        <div className="w-full md:w-3/4 bg-gray-100 p-6 rounded-lg shadow-md h-96 overflow-y-auto">
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow style={{ backgroundColor: '#204684' }}>
                  {['Keterangan', 'Lokasi', 'Waktu', 'Tanggal Laporan', 'Tanggal Kirim', 'Jenis', 'Bukti', 'Edit'].map((header) => (
                    <TableCell key={header} align="center" style={{ color: 'white', fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(Array.isArray(tableData) ? tableData : [])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{row.keterangan}</TableCell>
                      <TableCell align="center">{row.lokasi}</TableCell>
                      <TableCell align="center">{row.time}</TableCell>
                      <TableCell align="center">{row.tanggal}</TableCell>
                      <TableCell align="center">{row.target}</TableCell>
                      <TableCell align="center">{row.jenis}</TableCell>
                      <TableCell align="center">
                        <div className="flex justify-center gap-4">
                          {row.dokumen && row.dokumen[0] && (
                            <a href={row.dokumen[0]} target="_blank" download>
                              <CloudDownload />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEditModal(row)}
                        >
                          <EditIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>

      {/* Modal untuk Detail Description */}
      <Dialog open={isDetailModalOpen} onClose={handleCloseDetailModal} maxWidth="sm" fullWidth>
        <DialogTitle>Detail Description</DialogTitle>
        <DialogContent>
          <TextField
            label="Describe your activity"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={detailDescription}
            onChange={handleDetailDescriptionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal untuk Edit Data */}
      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Laporan</DialogTitle>
        <DialogContent>
          {editData && (
            <>
              <TextField
                label="Keterangan"
                name="keterangan"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editData.keterangan}
                onChange={handleEditInputChange}
              />
              <TextField
                label="Lokasi"
                name="lokasi"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editData.lokasi}
                onChange={handleEditInputChange}
              />
              <TextField
                label="Waktu"
                name="time"
                type="time"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editData.time}
                onChange={handleEditInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Tanggal"
                name="tanggal"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editData.tanggal}
                onChange={handleEditInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Jenis"
                name="jenis"
                select
                variant="outlined"
                fullWidth
                margin="normal"
                value={editData.jenis}
                onChange={handleEditInputChange}
              >
                <MenuItem value="Didalam kantor">Didalam kantor</MenuItem>
                <MenuItem value="Keluar kantor">Keluar kantor</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LaporanKegiatan;
