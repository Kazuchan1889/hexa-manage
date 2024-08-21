import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import {
  TextField,
  Button,
  Grid,
  Typography,
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
} from "@mui/material";
import Swal from "sweetalert2";
import ip from "../ip";

function FormPage() {
  const [loading, setLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedForm, setSelectedForm] = useState(""); // Menyimpan pilihan form (Izin atau Cuti)
  const [pengganti, setPengganti] = useState([]);
  const [selectedPengganti, setSelectedPengganti] = useState("");
  const [formData, setFormData] = useState({
    alasan: "",
    mulai: "",
    selesai: "",
    jenis: "", // Untuk jenis izin atau cuti
  });
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sisaCuti = localStorage.getItem("cutimandiri");

  useEffect(() => {
    const fetchPengganti = async () => {
      try {
        const response = await axios.get(`${ip}/api/pengajuan/pengganti`, {
          headers: { Authorization: localStorage.getItem("accessToken") },
        });
        setPengganti(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPengganti();
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        let apiEndpoint = "";
        if (selectedForm === "Izin") {
          apiEndpoint = `${ip}/api/pengajuan/get/izin/self`; // Endpoint untuk Izin
        } else if (selectedForm === "Cuti") {
          apiEndpoint = `${ip}/api/pengajuan/get/cuti/self`; // Endpoint untuk Cuti
        }
        
        if (apiEndpoint) {
          const response = await axios.get(apiEndpoint, {
            headers: { Authorization: localStorage.getItem("accessToken") },
          });
          setTableData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedForm) {
      fetchTableData();
    }
  }, [selectedForm]);

  useEffect(() => {
    const requiredFields = ["alasan", "mulai", "selesai", "jenis"];
    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);
    const isMulaiGreaterThanSelesai = formData.mulai > formData.selesai;

    const mulaiDate = new Date(formData.mulai);
    mulaiDate.setHours(1, 0, 0, 0);

    const dateTest = new Date();
    dateTest.setHours(0, 0, 0, 0);

    const isDateValid = mulaiDate >= dateTest;

    setIsFormValid(
      !isAnyFieldEmpty &&
      !isMulaiGreaterThanSelesai &&
      selectedPengganti &&
      isDateValid
    );
  }, [formData, selectedPengganti]);

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
      pengganti: selectedPengganti,
      mulai: formData.mulai,
      selesai: formData.selesai,
      jenis: formData.jenis,
      sisaCuti: sisaCuti,
    };

    const apiSubmit = selectedForm === "Izin"
      ? `${ip}/api/pengajuan/post/izin`
      : `${ip}/api/pengajuan/post/cuti/bersama`;

    try {
      const response = await axios.post(apiSubmit, requestBody, {
        headers: { Authorization: localStorage.getItem("accessToken") },
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Submit Sukses",
          text: response.data,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Submit Gagal",
        text: "Terjadi kesalahan saat memproses permintaan Anda.",
      });
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

  return (
    <div className="w-screen h-screen bg-primary">
      <NavbarUser />
      {loading ? (
        <div className="w-screen h-full flex justify-center items-center mx-auto">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-screen h-fit flex">
          <div className="h-full w-full mx-auto">
            <div className="flex flex-col justify-between items-center mt-3">
              <div className="w-[90%] mb-4 flex justify-between items-center">
                <Typography variant="h5">Form Time Off</Typography>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-[90%] h-8/12 rounded-md flex flex-col justify-center bg-card p-5"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Pilih Form"
                      fullWidth
                      value={selectedForm}
                      onChange={(e) => setSelectedForm(e.target.value)}
                    >
                      <MenuItem value="Izin">Form Izin</MenuItem>
                      <MenuItem value="Cuti">Form Cuti</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="alasan"
                      label="Alasan"
                      size="small"
                      variant="outlined"
                      fullWidth
                      multiline
                      value={formData.alasan}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {selectedForm === "Cuti" && (
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Pelaksana Tugas Sementara"
                        fullWidth
                        value={selectedPengganti}
                        onChange={(e) => setSelectedPengganti(e.target.value)}
                      >
                        {pengganti.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.nama}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="mulai"
                      label="Tanggal Mulai"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={formData.mulai}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="selesai"
                      label="Tanggal Selesai"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={formData.selesai}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  

                  {selectedForm === "Izin" && (
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Jenis Izin"
                        fullWidth
                        name="jenis"
                        value={formData.jenis}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="izin">Izin Pribadi</MenuItem>
                        <MenuItem value="izin_sakit">Izin Sakit</MenuItem>
                      </TextField>
                    </Grid>
                  )}
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

              {/* Tabel */}
              <div className="w-[90%] mt-10">
                <TableContainer
                  className="rounded-md max-h-56 overflow-y-auto"
                  component={Paper}
                >
                  <Table size="small">
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
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell className="w-1/5">
                              <Typography variant="body2" className="text-center">
                                {row.alasan}
                              </Typography>
                            </TableCell>
                            
                            <TableCell className="w-1/5">
                              <Typography variant="body2" className="text-center">
                                {new Date(row.mulai).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell className="w-1/5">
                              <Typography variant="body2" className="text-center">
                                {new Date(row.selesai).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell className="w-1/5">
                              <Typography
                                variant="body2"
                                className="text-center"
                                style={{
                                  color:
                                    row.status === "rejected"
                                      ? "red"
                                      : row.status === "accepted"
                                      ? "green"
                                      : row.status === "acc by direktur" ||
                                        row.status === "acc by admin"
                                      ? "#facc15"
                                      : "grey",
                                }}
                              >
                                {row.status === "rejected"
                                  ? "Rejected"
                                  : row.status === "acc by direktur"
                                  ? "Accepted by Direktur"
                                  : row.status === "acc by admin"
                                  ? "Accepted by Admin"
                                  : row.status === "accepted"
                                  ? "Accepted"
                                  : "Waiting"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormPage;
