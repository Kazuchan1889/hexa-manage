import React, { useState, useEffect } from "react";
import axios from "axios";
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
  CircularProgress, // Import CircularProgress untuk loading spinner
} from "@mui/material";
import Swal from "sweetalert2";
import ip from "../ip";
import Head from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";
import NavbarUser from "../feature/NavbarUser";

function FormResign() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true); // Status loading
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    alasan: "",
    tanggalkeluar: "",
  });

  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    setLoading(true); // Aktifkan loading sebelum fetch data

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        console.log(response.data);
        setLoading(false); // Matikan loading setelah data berhasil dimuat
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Matikan loading jika terjadi kesalahan
      });
  }, []);

  useEffect(() => {
    const requiredFields = ["alasan", "tanggalkeluar"];
    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);
    setIsFormValid(!isAnyFieldEmpty);
  }, [formData]);

  // Tambahkan fungsi handleInputChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      alasan: formData.alasan,
      tanggal: formData.tanggalkeluar,
    };

    const apiSubmit = `${ip}/api/resign/post`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    setLoading(true); // Aktifkan loading saat submit

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
    } finally {
      setLoading(false); // Matikan loading setelah submit selesai
    }
  };

  useEffect(() => {
    const apiUrl = `${ip}/api/resign/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    setLoading(true); // Aktifkan loading sebelum fetch data

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
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
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
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
     {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="flex flex-col flex-1 overflow-auto">
        <Head />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] justify-center items-center text-white p-6 h-56">
          <h1 className="text-2xl font-bold text-center">Form Resign</h1>
          <div className="h-full w-full mx-auto">
            <div className="flex flex-col justify-between items-center ">
              <div className="flex w-full flex-col justify-between items-center mt-3">
                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="w-full mt-16 h-8/12 rounded-[15px] flex flex-col justify-center bg-card p-4"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        id="alasan"
                        name="alasan"
                        label="Alasan"
                        variant="outlined"
                        fullWidth
                        className="mb-2"
                        value={formData.alasan}
                        onChange={handleInputChange} // pastikan onChange memanggil handleInputChange
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        name="tanggalkeluar"
                        label="Tanggal Resign"
                        variant="outlined"
                        type="date"
                        fullWidth
                        className="mb-2"
                        value={formData.tanggalkeluar}
                        onChange={handleInputChange} // pastikan onChange memanggil handleInputChange
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          placeholder: "",
                        }}
                      />
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
                <div className="w-full mt-3 flex flex-col justify-center items-center mx-auto rounded-md bg-card p-4">
                  <div className="w-full">
                    <div className="flex justify-between">
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
                                className="text-white flex justify-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Alasan
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                className="text-white flex justify-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Tanggal Mengajukan
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                className="text-white flex justify-center"
                                style={{ fontWeight: "bold" }}
                              >
                                Tanggal Resign
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
                                <TableCell className="w-1/3">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.alasan}
                                  </Typography>
                                </TableCell>
                                <TableCell className="w-1/3">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.tanggalmengajukan}
                                  </Typography>
                                </TableCell>
                                <TableCell className="w-1/3">
                                  <Typography
                                    variant="body2"
                                    className="text-center"
                                  >
                                    {row.tanggalkeluar}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormResign;
