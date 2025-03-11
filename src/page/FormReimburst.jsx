import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
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
  Select,
  MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Swal from "sweetalert2";
import ip from "../ip";
import DownloadIcon from "@mui/icons-material/Download";
import Head from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";
import NavbarUser from "../feature/MobileNav";

function FormReimburst() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false); // Menambahkan state untuk status upload
  const [loading, setLoading] = useState(true); // Untuk status loading tabel dan form
  const [uploadedFileBase64, setUploadedFileBase64] = useState("");
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [uploadedFileBase64s, setUploadedFileBase64s] = useState([]);
  const [selectedForm, setSelectedForm] = useState('cuti');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [formData, setFormData] = useState({
    keterangan: "",
    biaya: " ",
    tanggal: "",
  });

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    setLoading(true); // Aktifkan loading sebelum data dimuat

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        fetchTableData();
        console.log(response.data);
        setLoading(false); // Matikan loading setelah data berhasil dimuat
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Matikan loading jika terjadi kesalahan
      });
  }, []);

  const handleFileUpload = async (acceptedFiles) => {
    setUploading(true); // Aktifkan loading saat file diunggah
    const maxSizeInBytes = 5000000; // 5 MB
    const newUploadedFiles = [...acceptedFiles];
    const oversizedFiles = acceptedFiles.filter(
      (file) => file.size > maxSizeInBytes
    );

    if (oversizedFiles.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "File Too Big",
        text: "File size exceeds the limit of 5 MB",
      });
      setUploading(false); // Matikan loading saat upload gagal
      return;
    }

    await setUploadedFile(acceptedFiles[0]);
    const newFileBase64s = acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });

    setUploadedFileBase64s(newFileBase64s[0]);
    setUploading(false); // Matikan loading setelah file berhasil diunggah

    console.log(acceptedFiles[0].path);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "file/xlxs": [".xlxs"],
      "file/zip": [".zip"],
      "file/rar": [".rar"],
    },
    onDrop: (acceptedFiles) => {
      const allowedExtensions = ["png", "jpg", "jpeg", "xlxs", "zip", "rar"];
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

  const handleBiayaChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^\d]/g, "");
    const dotlessValue = numericValue.replace(/\./g, "");

    let formattedValue = "Rp. ";
    for (let i = 0; i < dotlessValue.length; i++) {
      formattedValue += dotlessValue[i];
      if (
        (dotlessValue.length - i - 1) % 3 === 0 &&
        i !== dotlessValue.length - 1
      ) {
        formattedValue += ".";
      }
    }

    setFormData({
      ...formData,
      biaya: formattedValue,
    });
  };

  const fetchTableData = () => {
    setLoading(true); // Aktifkan loading sebelum data dimuat
    const apiUrl = `${ip}/api/reimburst/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        setTableData(data);
        setLoading(false); // Matikan loading setelah data berhasil dimuat
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Matikan loading jika terjadi kesalahan
      });
  };

  useEffect(() => {
    const requiredFields = ["keterangan", "biaya", "tanggal", "image"];
    const isAnyFieldEmpty = requiredFields.some((field) => {
      if (field === "image") {
        return !uploadedFile;
      }
      return !formData[field];
    });

    setIsFormValid(!isAnyFieldEmpty);
  }, [formData, uploadedFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(uploadedFile);
    const requestBody = {
      keterangan: formData.keterangan,
      biaya: formData.biaya,
      tanggal: formData.tanggal,
      image: uploadedFileBase64s.result,
    };

    if (!uploadedFile) {
      console.log("b");
      return;
    }

    const apiSubmit = `${ip}/api/reimburst/post`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    console.log(requestBody);

    try {
      const response = await axios.post(apiSubmit, requestBody, { headers });
      fetchTableData();
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

  useEffect(() => {
    const apiUrl = `${ip}/api/reimburst/get/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        fetchTableData();
        console.log(tableData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === 'other') {
      setIsOtherSelected(true);
      setFormData((prevData) => ({
        ...prevData,
        keterangan: '',
      }));
    } else {
      setIsOtherSelected(false);
      setFormData((prevData) => ({
        ...prevData,
        keterangan: value,
      }));
    }
  };
  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="flex flex-col flex-1 overflow-auto">
        <Head />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] justify-center items-center text-white p-6 h-56">
          <h1 className="text-2xl font-bold text-center">Reimburst Form</h1>
          <div className="h-full w-full mx-auto">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col justify-between items-center mt-3 w-full">
                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="w-full mt-16 rounded-[15px] flex flex-col justify-center bg-card p-5"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {!isOtherSelected ? (
                        <Select
                          name="keterangan"
                          value={formData.keterangan}
                          onChange={handleSelectChange}
                          variant="outlined"
                          size="small"
                          fullWidth
                          className="mb-2"
                          displayEmpty
                        >
                          <MenuItem value="">Select an option</MenuItem>
                          <MenuItem value="tiket parkir">Tiket Parkir</MenuItem>
                          <MenuItem value="bill obat">Bill Obat</MenuItem>
                          <MenuItem value="bill rumah sakit / dokter">Bill Rumah Sakit / Dokter</MenuItem>
                          <MenuItem value="bensin">Bensin</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      ) : (
                        <TextField
                          name="keterangan"
                          label="Details"
                          size="small"
                          variant="outlined"
                          fullWidth
                          className="mb-2"
                          value={formData.keterangan}
                          onChange={handleInputChange}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="biaya"
                        label="Cost"
                        size="small"
                        variant="outlined"
                        fullWidth
                        className="mb-2"
                        value={formData.biaya}
                        onChange={handleBiayaChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <div className="mb-2">
                        <TextField
                          name="tanggal"
                          label="Date"
                          type="date"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={formData.tanggal}
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

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" className="text-left">
                        Upload File
                      </Typography>
                      <div {...getRootProps()} className="mb-2">
                        <input {...getInputProps()} />
                        {uploading ? (
                          <div className="flex items-center">
                            <CircularProgress color="primary" size={24} />
                            <p className="ml-2">Uploading...</p>
                          </div>
                        ) : uploadedFile ? (
                          <div className="flex items-center">
                            <CheckCircleIcon color="primary" />
                            <p className="ml-2">
                              Upload successful: {uploadedFile.name}
                            </p>
                          </div>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                          >
                            <Typography variant="body2">
                              Drop file here
                            </Typography>
                          </Button>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                  <div className="mt-5">
                    <Button
                      type="submit"
                      size="small"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!isFormValid}
                    >
                      Submit
                    </Button>
                  </div>
                </form>

                {/* Table */}
                <div className="w-full flex flex-col justify-center items-center mx-auto rounded-md bg-card p-5">
                  <div className="w-full">
                    <div className="flex justify-between">
                    </div>
                    <TableContainer className="w-full flex flex-col justify-center items-center mx-auto rounded-md bg-card p-5" component={Paper}>
                      <Table size="small">
                        <TableHead style={{ backgroundColor: "#204684" }}>
                          <TableRow>
                            {(isMobile
                              ? ["Cost", "Date", "Status"]
                              : ["Details", "Cost", "Date", "Evidence", "Status"]
                            ).map((header) => (
                              <TableCell key={header} className="w-[20%]">
                                <Typography
                                  className="font-semibold text-white text-center"
                                  style={{ fontWeight: "bold" }}
                                  variant="body2"
                                >
                                  {header}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                              <TableRow key={index}>
                                {!isMobile && (
                                  <TableCell className="w-1/5">
                                    <Typography className="text-center" variant="body2">
                                      {row.keterangan}
                                    </Typography>
                                  </TableCell>
                                )}
                                <TableCell className="w-1/5">
                                  <Typography className="text-center" variant="body2">
                                    {row.biaya}
                                  </Typography>
                                </TableCell>
                                <TableCell className="w-1/5">
                                  <Typography className="text-center" variant="body2">
                                    {row.date}
                                  </Typography>
                                </TableCell>
                                {!isMobile && (
                                  <TableCell className="text-center w-1/5 flex justify-center mx-auto">
                                    <div className="flex justify-center">
                                      <a href={row.dokumen} target="_blank " download className="cursor-pointer">
                                        <DownloadIcon />
                                      </a>
                                    </div>
                                  </TableCell>
                                )}
                                <TableCell className="w-1/5">
                                  <Typography
                                    className="text-center"
                                    variant="body2"
                                    style={{
                                      color:
                                        row.progress === "sudah ditransfer"
                                          ? "#22c55e"
                                          : row.progress === "rejected"
                                            ? "#ef4444"
                                            : "grey",
                                    }}
                                  >
                                    {row.progress.charAt(0).toUpperCase() + row.progress.slice(1)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>


                  </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormReimburst;
