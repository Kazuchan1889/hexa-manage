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
} from "@mui/material";
import NavbarUser from "../feature/NavbarUser";
import Swal from "sweetalert2";
import ip from "../ip";

function FormResign() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    alasan: "",
    tanggalkeluar: "",
  });

  useEffect(() => {
    // Fetch user data when the component mounts
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    setLoading(true);

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        // Handle the response data as needed
        console.log(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Check if any of the required fields are empty
    const requiredFields = ["alasan", "tanggalkeluar"];
    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);

    // If any field is empty, form is not valid
    setIsFormValid(!isAnyFieldEmpty);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the request body
    const requestBody = {
      alasan: formData.alasan,
      tanggal: formData.tanggalkeluar,
    };

    // You can submit your form data here using axios or any other method
    const apiSubmit = `${ip}/api/resign/post`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    console.log(requestBody);

    try {
      const response = await axios.post(apiSubmit, requestBody, { headers });
      console.log(response.data);

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
    } catch (error) {
      // Handle errors
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Submit Gagal",
        text: "Terjadi kesalahan saat memproses permintaan Anda.",
        customClass: {
          container: "z-30", // or any value that ensures it's in front of everything
        },
      });
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        // Handle the response data as needed
        console.log(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const apiUrl = `${ip}/api/resign/get/data/self`;
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
        // Handle errors
        console.error(error);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  // Pagination event handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset the page when changing rows per page
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
    <div className="w-screen h-screen bg-primary overflow-y-hidden">
      <NavbarUser />
      <div className="w-screen flex h-fit">
        <div className="h-full w-full mx-auto">
          <div className="flex flex-col justify-between items-center mt-3">
            <div className="w-[90%] mb-4 flex justify-between	items-center">
              <Typography variant="h5">Form Resign</Typography>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-[90%] h-8/12 rounded-md bg-card p-5"
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
                    onChange={handleInputChange}
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

            {!isMobile && (
              <div className="w-screen">
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
                      className="rounded-md max-h-56 overflow-y-auto"
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
    </div>
  );
}

export default FormResign;
