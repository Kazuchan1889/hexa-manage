import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import {
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import ip from "../ip";

function FormCuti() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [namaPengganti, setNamaPengganti] = useState([]);
  const [idPengganti, setIdPengganti] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [loading, setLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    alasan: "",
    pengganti: 0,
    mulai: "",
    selesai: "",
  });
  const [selectedPengganti, setSelectedPengganti] = useState("");
  const [pengganti, setPengganti] = useState([]);

  console.log(formData);
  const sisaCuti = localStorage.getItem("cutimandiri");

  useEffect(() => {
    // Untuk Fetch data user
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

  useEffect(() => {
    // Untuk Fetch data pengganti yang sama divisinya
    const apiUrl = `${ip}/api/pengajuan/pengganti`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        setPengganti(data);
        setNamaPengganti(data.map((item) => item.namaPengganti));
        setIdPengganti(data.map((item) => item.id));
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const fetchTableData = () => {
    // Untuk fetch updated data
    const apiUrl = `${ip}/api/pengajuan/get/cuti/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        console.log(tableData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Untuk mengecek apakah ada field yang kosong
    const requiredFields = ["alasan", "mulai", "selesai"];
    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);

    // Jika kosong maka form tidak valid (tidak dapat disubmit)
    const isMulaiGreaterThanSelesai = formData.mulai > formData.selesai;
    // If the input is a date, parse it to a Date object

    const mulaiDate = new Date(formData.mulai);
    mulaiDate.setHours(1, 0, 0, 0); // Set time components to 00:00:00:000

    const dateTest = new Date();
    dateTest.setHours(0, 0, 0, 0); // Set time components to 00:00:00:000

    console.log("dateTest:", dateTest);
    console.log("mulaiDate:", mulaiDate);

    const isDateValid = mulaiDate >= dateTest;
    console.log("Is date valid:", isDateValid);
    console.log(isAnyFieldEmpty, isMulaiGreaterThanSelesai);
    setIsFormValid(
      !isAnyFieldEmpty &&
        !isMulaiGreaterThanSelesai &&
        selectedPengganti &&
        isDateValid
    );
  }, [formData, setSelectedPengganti]);

  //Untuk melakukan submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      alasan: formData.alasan,
      pengganti: selectedPengganti,
      mulai: formData.mulai,
      selesai: formData.selesai,
      sisaCuti: sisaCuti,
    };

    const apiSubmit = `${ip}/api/pengajuan/post/cuti`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    console.log(requestBody);

    try {
      const response = await axios.post(apiSubmit, requestBody, { headers });

      fetchTableData();
      console.log(response.data);

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Submit Sukses",
          text: response.data,
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        }).then(() => {
          window.location.reload();
        });
      } else {
        // Handle other success scenarios or status codes if needed
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 406) {
        // Custom error message for insufficient leave balance (status code 450)
        await Swal.fire({
          icon: "error",
          title: "Sisa Cuti Tidak Mencukupi",
          text: "Maaf, sisa cuti Anda tidak mencukupi untuk mengajukan cuti.",
        });
      } else {
        // Default error handling for other errors
        await Swal.fire({
          icon: "error",
          title: "Submit Gagal",
          text: "Terjadi kesalahan saat memproses permintaan Anda.",
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        });
      }

      window.location.reload();
    }
  };

  // Untuk Fetch data
  useEffect(() => {
    const apiUrl = `${ip}/api/pengajuan/get/cuti/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        setTableData(data);
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
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
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

  return (
    <div className="w-screen h-screen bg-primary overflow-y-hidden">
      <NavbarUser />
      {loading ? (
        <div className="w-screen h-full flex justify-center items-center mx-auto">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-screen h-fit flex">
          <div className="h-full w-full mx-auto">
            <div className="flex flex-col justify-between items-center mt-3">
              <div className="w-[90%] mb-4 flex justify-between items-center ">
                <Typography variant="h5">Form Cuti</Typography>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-[90%] h-8/12 rounded-md flex flex-col justify-center bg-card p-5"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="alasan"
                      id="alasan"
                      label="Alasan"
                      size="small"
                      variant="outlined"
                      fullWidth
                      multiline
                      className="mb-2"
                      value={formData.alasan}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="pengganti"
                      id="pengganti"
                      variant="outlined"
                      fullWidth
                      className="mb-2"
                      size="small"
                      select
                      label="Pelaksana Tugas Sementara"
                      onChange={(e) => setSelectedPengganti(e.target.value)}
                    >
                      {pengganti &&
                        pengganti.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            <div className="text-left">{item.nama}</div>
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div className="mb-2">
                        <TextField
                          name="mulai"
                          id="mulai"
                          label="Tanggal Mulai"
                          type="date"
                          size="small"
                          variant="outlined"
                          fullWidth
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

                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="selesai"
                        id="selesai"
                        label="Tanggal Selesai"
                        type="date"
                        size="small"
                        variant="outlined"
                        fullWidth
                        className="mb-2"
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
                  </Grid>
                </Grid>
                <div className="mt-5">
                  <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={
                      !isFormValid || new Date(formData.mulai) < new Date()
                    }
                  >
                    Submit
                  </Button>
                </div>
              </form>

              {!isMobile && (
                <div className="w-[90%] flex flex-col justify-center items-center mt-3 mx-auto rounded-md bg-card p-5">
                  <div className="w-full">
                    <div className="flex justify-between">
                      <Typography variant="h6" id="history-modal-title">
                        History Table
                      </Typography>
                      <div className="mt-1">
                        <Typography variant="h7" className="font-semibold">
                          Sisa Cuti : {sisaCuti}
                        </Typography>
                      </div>
                    </div>
                    <TableContainer
                      className="rounded-md max-h-56 overflow-y-auto"
                      component={Paper}
                    >
                      <Table size="small" className="">
                        <TableHead style={{ backgroundColor: "#204684" }}>
                          <TableRow className="text-center">
                            <TableCell className="w-[30%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Alasan
                              </Typography>
                            </TableCell>
                            <TableCell className="w-[20%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Pelaksana Tugas Sementara
                              </Typography>
                            </TableCell>
                            <TableCell className="w-[10%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Tanggal Mulai
                              </Typography>
                            </TableCell>
                            <TableCell className="w-[10%]">
                              <Typography
                                variant="body2"
                                className="font-semibold text-white text-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Tanggal Berakhir
                              </Typography>
                            </TableCell>
                            <TableCell className="w-[10%]">
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
                                <TableCell className="w-1/5">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.alasan}
                                  </Typography>
                                </TableCell>
                                <TableCell className="w-1/5">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.pengganti}
                                  </Typography>
                                </TableCell>
                                <TableCell className="w-1/5">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.mulai}
                                  </Typography>
                                </TableCell>
                                <TableCell className="w-1/5">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.selesai}
                                  </Typography>
                                </TableCell>
                                <TableCell className="w-1/5">
                                  <Typography
                                    className="text-center"
                                    variant="body2"
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
                                      ? "Diterima"
                                      : "Ditolak"}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormCuti;
