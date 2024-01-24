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
  Alert,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import { CloudDownload } from "@mui/icons-material";

import ip from "../ip";
import NavbarUser from "../feature/NavbarUser";

function LaporanKegiatan() {
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store multiple files
  const [uploading, setUploading] = useState(false);
  const [uploadedFileBase64s, setUploadedFileBase64s] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadAlert, setUploadAlert] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

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
        setTableData(data);
        setLoading(false);
      })
      .catch((error) => {
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
      // Show an alert if jenis is "Keluar kantor" and no files uploaded
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
          window.location.reload();
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

  const fetchTableData = () => {
    const apiUrl = `${ip}/api/laporan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        setTableData(data);
      })
      .catch((error) => {
        console.error(error);
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

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

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
    <div className="w-full h-screen bg-white overflow-y-hidden">
      <NavbarUser />
      <div className="flex h-fit">
        {/* {!isMobile && <Sidebar />} */}
        <div className="h-full w-4/5 mx-auto">
          <div className="flex flex-col justify-between items-center my-2 rounded-xl">
            {loading ? (
              <div
                className="w-1/5 h-full flex justify-center items-center"
                style={{ position: "absolute", height: "100vh" }}
              >
                <CircularProgress />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-10/12 h-8/12 flex flex-col justify-center"
              >
                <div className="w-full mb-4 flex justify-between items-center">
                  <Typography variant="h5">Laporan Kegiatan</Typography>
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
                  >
                    Submit
                  </Button>
                </div>
              </form>
            )}

            {!isMobile && (
              <div className="w-full flex flex-col mt-3 justify-center items-center mx-auto">
                <div className="w-10/12 rounded-lg text-center align-center">
                  <div className="flex justify-between">
                    <Typography variant="h6" id="history-modal-title">
                      History Table
                    </Typography>
                    <div className="mt-1">
                      <Typography
                        variant="h7"
                        id="history-modal-title"
                      ></Typography>
                    </div>
                  </div>
                  <TableContainer
                    className="rounded-md overflow-y-auto"
                    component={Paper}
                  >
                    <Table size="small">
                      <TableHead className="bg-blue-600">
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
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-center w-1/8">
                                <div className="text-center">
                                  {row.keterangan}
                                </div>
                              </TableCell>
                              <TableCell className="text-center w-1/8">
                                <div className="text-center">{row.lokasi}</div>
                              </TableCell>
                              <TableCell className="text-center w-1/8">
                                <div className="text-center">{row.time}</div>
                              </TableCell>
                              <TableCell className="text-center w-1/8">
                                <div className="text-center">{row.target}</div>
                              </TableCell>
                              <TableCell className="text-center w-1/8">
                                <div className="text-center">{row.tanggal}</div>
                              </TableCell>
                              <TableCell className="text-center w-1/8">
                                <div className="text-center">{row.jenis}</div>
                              </TableCell>
                              <TableCell className="align-center w-1/8">
                                <div className="flex justify-center gap-[20%]">
                                  {row.dokumen[0] && (
                                    <a
                                      href={row.dokumen[0]}
                                      target="_blank "
                                      download
                                      className="cursor-pointer"
                                    >
                                      <CloudDownload />
                                    </a>
                                  )}
                                  {row.dokumen[1] && (
                                    <a
                                      href={row.dokumen[1]}
                                      target="_blank "
                                      download
                                      className="cursor-pointer"
                                    >
                                      <CloudDownload />
                                    </a>
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
            )}
            <Dialog
              open={Boolean(selectedImage)}
              onClose={() => setSelectedImage(null)}
              maxWidth="lg"
            >
              <DialogContent>
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{ maxWidth: "100%", maxHeight: "80vh" }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaporanKegiatan;
