import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Dialog,
  DialogContent,
  Alert,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon, Height } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import Swal from "sweetalert2";
import ip from "../ip";

function FormIzin() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadAlert, setUploadAlert] = useState(false);
  const [uploading] = useState(false);
  const [uploadInProgress] = useState(false);
  const [uploadedFileBase64, setUploadedFileBase64] = useState("");
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [uploadedFileBase64s, setUploadedFileBase64s] = useState([]);

  const [formData, setFormData] = useState({
    alasan: "",
    mulai: "",
    selesai: "",
    jenis: "",
  });

  //Untuk menghubungkan melalui accessToken
  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    setLoading(true);

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleFileUpload = async (acceptedFiles) => {
    const maxSizeInBytes = 5000000; // 5 MB
    const newUploadedFiles = [...acceptedFiles];
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

    await setUploadedFile(acceptedFiles[0]);
    const newFileBase64s = acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });

    setUploadedFileBase64s(newFileBase64s[0]);

    console.log(acceptedFiles[0].path);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "file/pdf": [".pdf"],
      "file/docx": [".docx"],
    },
    onDrop: (acceptedFiles) => {
      // Filter acceptedFiles to only include pdf, docx, png, jpg, jpeg files
      const allowedExtensions = ["pdf", "docx", "png", "jpg", "jpeg"];
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      });

      if (filteredFiles.length === 1) {
        handleFileUpload(filteredFiles);
      } else {
        // Handle the case where the user uploaded an invalid file
        console.log(
          "Please upload a single file with pdf, docx, png, jpg, or jpeg extension."
        );
      }
    },
    multiple: false,
  });

  const fetchTableData = () => {
    // Untuk melakukan Fetch data table
    const apiUrl = `${ip}/api/pengajuan/get/izin/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        setTableData(data);
        console.log(tableData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Untuk mendapatkan data untuk table melalui acessToken
  useEffect(() => {
    const apiUrl = `${ip}/api/pengajuan/get/izin/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        fetchTableData();
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Untuk mengecek field yang kosong
  const requiredFields = ["alasan", "mulai", "selesai", "jenis"];
  const isAnyFieldEmpty = requiredFields.some((field) => {
    if (field === "image" && formData.jenis === "sehari penuh") {
      // Require image validation only if "Sehari Penuh" is selected
      return !uploadedFile;
    }
    return !formData[field];
  });

  useEffect(() => {
    // Untuk mengecek field yang kosong
    const requiredFields = ["alasan", "mulai", "selesai", "jenis", "image"];
    const isAnyFieldEmpty = requiredFields.some((field) => {
      if (field === "image") {
        // Require image validation only if "Sehari Penuh" is selected
        if (formData.jenis === "setengah hari") return false;
        else return !uploadedFile;
      }
      return !formData[field];
    });

    // Additional conditions for date validation
    const isDateValid =
      (formData.jenis === "setengah hari" &&
        formData.mulai == formData.selesai) ||
      (formData.jenis === "sehari penuh" &&
        new Date(formData.mulai) <= new Date(formData.selesai));

    // Untuk memastikan semua field terisi dan tambahan kondisi Setengah Hari dan Mulai sebelum Selesai
    setIsFormValid(!isAnyFieldEmpty && isDateValid);
  }, [formData, uploadedFile]);

  // Untuk melakukan Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.jenis === "Setengah hari" && !uploadedFileBase64s) {
      // Allow submission for "Setengah Hari" without an image
      setUploadAlert(false);
    } else if (
      formData.jenis === "Setengah hari" &&
      uploadedFileBase64s.length === 0
    ) {
      // Show alert if "Setengah Hari" is selected, but the image is still being processed
      return setUploadAlert(true);
    }

    const requestBody = {
      alasan: formData.alasan,
      mulai: formData.mulai,
      selesai: formData.selesai,
      jenis: formData.jenis,
      image: uploadedFileBase64s.result,
    };

    if (uploadInProgress) {
      return;
    }

    // Untuk post menggunakan axios
    const apiSubmit = `${ip}/api/pengajuan/post/izin`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(apiSubmit, requestBody, { headers });
      console.log(response.data);

      await Swal.fire({
        icon: "success",
        title: "Submit Sukses",
        text: response.data,
        customClass: {
          container: "z-30",
        },
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Submit Gagal",
        text: "Terjadi kesalahan saat memproses permintaan Anda.",
        customClass: {
          container: "z-30",
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //Untuk membuka image pada table jika dipencet
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  // Untuk pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    <div className="w-screen h-screen bg-primary overflow-y-hidden">
      {loading ? (
        <div className="w-screen h-screen flex justify-center items-center mx-auto">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-screen h-fit flex">
          <div className="h-full w-full mx-auto">
            <div className="flex flex-col justify-between items-center mt-3">
              <div className="w-[90%] mb-4 flex justify-between	items-center">
                <Typography variant="h5">Form Izin</Typography>
              </div>
              {uploadAlert && (
                <Alert
                  severity="error"
                  variant="filled"
                  onClose={() => setUploadAlert(false)}
                  style={{ marginBottom: "10px" }}
                >
                  You must upload a file when choosing "Sehari Penuh."
                </Alert>
              )}
              <form
                onSubmit={handleSubmit}
                className="w-[90%] h-8/12 rounded-md flex flex-col justify-center bg-card p-5"
              >
                <Grid container spacing={2}>
                  {/* Alasan */}
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="alasan"
                      id="alasan"
                      label="Alasan"
                      variant="outlined"
                      fullWidth
                      multiline
                      className="mb-2"
                      size="small"
                      value={formData.alasan}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Tanggal */}
                  <Grid container item xs={12} spacing={2}>
                    {/* Tanggal Mulai */}
                    <Grid item xs={12} sm={6}>
                      <div className="mb-2">
                        <TextField
                          name="mulai"
                          label="Tanggal Mulai"
                          id="mulai"
                          type="date"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={formData.mulai}
                          onChange={handleInputChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            placeholder: "",
                          }}
                        />
                      </div>
                    </Grid>

                    {/* Tanggal Berakhir */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="selesai"
                        label="Tanggal Berakhir"
                        id="selesai"
                        type="date"
                        variant="outlined"
                        fullWidth
                        className="mb-2"
                        size="small"
                        value={formData.selesai}
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Jenis"
                        name="jenis"
                        select
                        variant="outlined"
                        fullWidth
                        className="mb-2 text-left"
                        size="small"
                        value={formData.jenis}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="setengah hari">Setengah Hari</MenuItem>
                        <MenuItem value="sehari penuh">Sehari Penuh</MenuItem>
                      </TextField>
                    </Grid>

                    {/* Image */}
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" className="text-left">
                        Upload File
                      </Typography>

                      <div {...getRootProps()} className="mb-2">
                        <input {...getInputProps()} id="fileInput" />

                        {uploading ? (
                          <div className="flex items-center">
                            <CircularProgress color="primary" size={24} />
                            <Typography variant="body2" className="text-left">
                              Uploading...
                            </Typography>
                          </div>
                        ) : uploadedFile ? (
                          <div className="flex items-center">
                            <CheckCircleIcon color="primary" />
                            <Typography className=" ml-2 text-left">
                              Upload successful: {uploadedFile.name}
                            </Typography>
                          </div>
                        ) : (
                          <Button variant="outlined" color="secondary">
                            <Typography variant="body2">
                              Drop file here
                            </Typography>
                          </Button>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <div className="mt-3">
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    fullWidth
                    disabled={!isFormValid}
                  >
                    Submit
                  </Button>
                </div>
              </form>

              {!isMobile && (
                <div className="w-[90%] mt-3 flex flex-col justify-center items-center mx-auto rounded-md bg-card p-5">
                  <div className="w-full">
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
                      className="rounded-md max-h-52 overflow-y-auto"
                      component={Paper}
                    >
                      <Table>
                        <TableHead style={{ backgroundColor: "#204684" }}>
                          <TableRow>
                            <TableCell size="small" className="w-[30%]">
                              <Typography
                                variant="body2"
                                className="text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Alasan
                              </Typography>
                            </TableCell>
                            <TableCell size="small" className="w-[10%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Tanggal Mulai
                              </Typography>
                            </TableCell>
                            <TableCell size="small" className="w-[10%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Tanggal Selesai
                              </Typography>
                            </TableCell>
                            <TableCell size="small" className="w-[10%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Jenis
                              </Typography>
                            </TableCell>
                            <TableCell size="small" className="w-[5%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Bukti
                              </Typography>
                            </TableCell>
                            <TableCell size="small" className="w-[10%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Status
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
                                <TableCell size="small" className="w-1/6">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.alasan}
                                  </Typography>
                                </TableCell>
                                <TableCell size="small" className="w-1/6">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.mulai}
                                  </Typography>
                                </TableCell>
                                <TableCell size="small" className="w-1/6">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.selesai}
                                  </Typography>
                                </TableCell>
                                <TableCell size="small" className="w-1/6">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.jenis}
                                  </Typography>
                                </TableCell>
                                <TableCell size="small" className="w-1/6">
                                  <div className="flex justify-center">
                                    {row.dokumen && (
                                      <a
                                        href={row.dokumen}
                                        target="_blank "
                                        download
                                        className="cursor-pointer"
                                      >
                                        <DownloadIcon />
                                      </a>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell size="small" className="w-1/6">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                    style={{
                                      color:
                                        row.status === null
                                          ? "grey"
                                          : row.status === true
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {row.status === null
                                      ? "Waiting"
                                      : row.status === true
                                      ? "Accepted"
                                      : "Rejected"}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              )}
              {!isMobile && (
                <div className="flex w-11/12 items-end justify-end">
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
      )}
    </div>
  );
}

export default FormIzin;
