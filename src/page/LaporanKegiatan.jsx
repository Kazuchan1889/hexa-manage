import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Swal from "sweetalert2"; // Impor Swal
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
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import NavbarUser from "../feature/MobileNav";
import ip from "../ip";
import Head from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";

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
  const [detailData, setDetailData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ keterangan: "", deskripsi: "" });
  const [isAddDescriptionModalOpen, setIsAddDescriptionModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const [formData, setFormData] = useState({
    lokasi: "",
    keterangan: "",
    time: "",
    tanggal: "",
    jenis: "",
    deskripsi: "",
  });

  // Menarik data dari backend
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
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
      time: new Date().toTimeString().slice(0, 5),
      tanggal: new Date().toISOString().split('T')[0],
      deskripsi: formData.deskripsi,
      dokumen: uploadedFileBase64s.map((reader) => reader.result),
    };

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
          text: "Laporan berhasil disubmit.",
        });

        setTableData((prevTableData) => [...prevTableData, requestBody]);
        setUploadedFiles([]);
        setUploadedFileBase64s([]);
        setFormData({
          lokasi: "",
          keterangan: "",
          jenis: "",
          time: new Date().toTimeString().slice(0, 5), // Waktu default dalam format HH:MM
          tanggal: new Date().toISOString().split('T')[0], // Tanggal default dalam format YYYY-MM-DD
          deskripsi: "",
        });
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        Swal.fire({
          icon: "error",
          title: "Submit Gagal",
          text: "Terjadi kesalahan saat mengirim laporan.",
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

  const handleOpenAddDescriptionModal = () => {
    setIsAddDescriptionModalOpen(true);
  };

  const handleCloseAddDescriptionModal = () => {
    setIsAddDescriptionModalOpen(false);
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      deskripsi: value,
    }));
  };

  const handleOpenDetailModal = (row) => {
    setDetailData(row);
    setEditFormData({ keterangan: row.keterangan, deskripsi: row.deskripsi });
    setIsDetailModalOpen(true);
    setIsEditing(false); // Reset editing mode
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailData(null);
    setIsEditing(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!detailData) return;

    const laporanId = detailData.id; // Assumes `id` is the unique identifier
    axios
      .patch(`${ip}/api/laporan/patch/${laporanId}`, editFormData, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Edit Sukses",
          text: "Laporan berhasil diupdate.",
        });

        setTableData((prevTableData) =>
          prevTableData.map((item) =>
            item.id === laporanId ? { ...item, ...editFormData } : item
          )
        );
        setIsEditing(false);
        setIsDetailModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        Swal.fire({
          icon: "error",
          title: "Edit Gagal",
          text: "Terjadi kesalahan saat mengupdate laporan.",
        });
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="flex flex-col flex-1 overflow-auto">
        <Head />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] justify-center items-center text-white p-6 h-56">
          <h1 className="text-2xl font-bold text-center">Activity Report</h1>
          <div className="h-full w-full mx-auto">
            <div className="flex flex-col justify-between items-center">
                <div className="w-full flex flex-col justify-between items-center mt-3">
                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="w-full mt-16 h-8/12 rounded-[15px] flex flex-col justify-center bg-card p-5"
                  >
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
                      <Grid item xs={12}>
                        <TextField
                          label="Title"
                          name="keterangan"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={formData.keterangan}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px', // Mengatur border radius pada outline
                            }
                          }}
                        />

                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Location"
                          name="lokasi"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={formData.lokasi}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px', // Mengatur border radius pada outline
                            }
                          }}
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
                          value={formData.time || new Date().toTimeString().slice(0, 5)} // Nilai default adalah waktu saat ini
                          onChange={handleInputChange} // Mengirim perubahan jika ada
                          InputLabelProps={{ shrink: true }}
                          disabled // Menonaktifkan input agar tidak bisa diubah
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px', // Mengatur border radius pada outline
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          name="tanggal"
                          label="Date"
                          type="date"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={formData.tanggal || new Date().toISOString().split('T')[0]} // Nilai default adalah tanggal hari ini
                          onChange={handleInputChange} // Mengirim perubahan jika ada
                          InputLabelProps={{ shrink: true }}
                          disabled // Menonaktifkan input agar tidak bisa diubah
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px', // Mengatur border radius pada outline
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Type"
                          name="jenis"
                          select
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={formData.jenis}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }} // Menyamakan perilaku label dengan TextField tanggal
                          disabled={false} // Pastikan input ini bisa diubah, tidak seperti tanggal yang disabled
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px', // Mengatur border radius pada outline
                            }
                          }}
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
                    {formData.deskripsi ? (
                      <div
                        style={{
                          maxHeight: "150px", // Sesuai dengan 5 baris teks
                          overflowY: "auto",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          backgroundColor: "#f9f9f9",
                          whiteSpace: "pre-wrap", // Menampilkan '\n' sebagai baris baru
                          wordWrap: "break-word", // Memastikan kata panjang tidak keluar dari area
                        }}
                      >
                        <TextField
                          label="Describe your activity"
                          multiline
                          rows={4}
                          variant="outlined"
                          fullWidth
                          value={formData.deskripsi}
                          InputProps={{
                            readOnly: true,
                          }}
                          onClick={handleOpenAddDescriptionModal}
                          style={{ cursor: 'pointer' }} // Opsional: Menambahkan efek pointer untuk menunjukkan bahwa field dapat diklik
                        />

                      </div>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={handleOpenAddDescriptionModal}
                        style={{ marginTop: "20px" }}
                        sx={{
                          borderRadius: '15px', // Mengatur border radius pada outline
                        }}
                      >
                        Add Detail
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        width: { xs: "100%", sm: "80%", md: "430px" }, // Responsif berdasarkan ukuran layar
                        height: "46px", // Tinggi tetap 46px
                        backgroundColor: "#055817", // Warna hijau sesuai permintaan
                        color: "white", // Warna teks putih
                        marginTop: "10px",
                        display: "block", // Agar bisa menggunakan margin auto
                        marginX: "auto", // Posisi tengah secara horizontal
                        borderRadius: "20px",
                        "&:hover": {
                          backgroundColor: "#044a12", // Warna lebih gelap saat hover
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </form>

                  {/* Table */}
                  <div className="w-full mt-3 flex flex-col justify-center items-center mx-auto rounded-md bg-card p-5">
                    <div className="w-full">
                      <div className="flex justify-between">
                      </div>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow style={{ backgroundColor: "#204684" }}>
                              {[
                                "Details",
                                "Location",
                                "Time",
                                "Report Date",
                                "Type",
                                "Evidence",
                                "Read Detail",
                              ].map((header) => (
                                <TableCell
                                  key={header}
                                  align="center"
                                  style={{ color: "white", fontWeight: "bold" }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tableData
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell align="center">{row.keterangan}</TableCell>
                                  <TableCell align="center">{row.lokasi}</TableCell>
                                  <TableCell align="center">{row.time}</TableCell>
                                  <TableCell align="center">{row.tanggal}</TableCell>
                                  <TableCell align="center">{row.jenis}</TableCell>
                                  <TableCell align="center">
                                    <div className="flex justify-center gap-4">
                                      {row.dokumen && row.dokumen[0] ? (
                                        <a href={row.dokumen[0]} target="_blank" download>
                                          <span className="text-blue-500 underline">Download</span>
                                        </a>
                                      ) : (
                                        <span>NO FILE</span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      size="small"
                                      onClick={() => handleOpenDetailModal(row)}
                                    >
                                      Read Detail
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                    </div>
                    {!isMobile && (
                      <div className="flex w-full items-end justify-end">
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 15]}
                          variant="body2"
                          component="div"
                          count={tableData.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </div>

                    )}
                  </div>
                  <Dialog open={isAddDescriptionModalOpen} onClose={handleCloseAddDescriptionModal} maxWidth="sm" fullWidth>
                    <DialogTitle>Add Detail Description</DialogTitle>
                    <DialogContent>
                      <TextField
                        label="Describe your activity"
                        multiline
                        rows={10}
                        variant="outlined"
                        fullWidth
                        value={formData.deskripsi}
                        onChange={handleDescriptionChange}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseAddDescriptionModal} color="primary">
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {/* Modal untuk Detail Report */}
                  <Dialog open={isDetailModalOpen} onClose={handleCloseDetailModal} maxWidth="sm" fullWidth>
                    <DialogTitle>Detail Report</DialogTitle>
                    <DialogContent>
                      {detailData && (
                        <>
                          <Typography variant="body1" gutterBottom>
                            <strong>Keterangan:</strong>{" "}
                            {isEditing ? (
                              <TextField
                                name="keterangan"
                                value={editFormData.keterangan}
                                onChange={handleEditInputChange}
                                fullWidth
                                variant="outlined"
                              />
                            ) : (
                              detailData.keterangan
                            )}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Lokasi:</strong> {detailData.lokasi}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Waktu:</strong> {detailData.time}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Tanggal:</strong> {detailData.tanggal}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Jenis:</strong> {detailData.jenis}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>Deskripsi:</strong>{" "}
                            {isEditing ? (
                              <TextField
                                name="deskripsi"
                                value={editFormData.deskripsi}
                                onChange={handleEditInputChange}
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                              />
                            ) : (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: detailData.deskripsi ? detailData.deskripsi.replace(/\n/g, "<br />") : "",
                                }}
                              />
                            )}
                          </Typography>
                        </>
                      )}
                    </DialogContent>
                    <DialogActions>
                      {isEditing ? (
                        <Button onClick={handleSaveEdit} color="primary" variant="contained">
                          Save
                        </Button>
                      ) : (
                        <Button onClick={handleEdit} color="primary" variant="outlined">
                          Edit
                        </Button>
                      )}
                      <Button onClick={handleCloseDetailModal} color="secondary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}




export default LaporanKegiatan;
