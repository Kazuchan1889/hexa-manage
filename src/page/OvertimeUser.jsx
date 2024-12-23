import { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Swal from "sweetalert2";
import ip from "../ip";
import Formovertime from "../page/Formovertime";
import dayjs from 'dayjs';
import Loading from "../page/Loading";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CircularProgress, Box } from "@mui/material";
import { Email, Person, Lock, Phone, LocationOn } from "@mui/icons-material";

const OvertimeUser = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isTambahFormOpen, setTambahFormOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [daysOff, setDaysOff] = useState(0);
  const [afterConvert, setafterConvert] = useState(0);
  const [currentOvertimeId, setCurrentOvertimeId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    note: "",
    mulai: "",
    selesai: "",
    tipe: "",
    tanggal_overtime: "",
    istirahat: "",
  });
  const apiURLover = `${ip}/api/overtime/list`;


  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };



  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiURLover, config);
      const data = response.data.map((item) => ({
        ...item,
        status: item.status === null ? "waiting for approval" : item.status,
      }));
      setRows(data);
      setOriginalRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (data) => {
    if (data) {
      const status = true;
      const id = data.id;
      const apiApprovalURL = `${ip}/api/overtime/status/${id}`;

      try {
        await axios.patch(apiApprovalURL, { status }, config);
        fetchData();
        Swal.fire({
          icon: "success",
          title: "Approval Success",
          text: "The request has been approved successfully.",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Approval Error",
          text: "An error occurred while approving the request. Please try again.",
        });
      }
    }
  };

  const handleReject = async (data) => {
    if (data) {
      const status = false;
      const id = data.id;
      const apiReject = `${ip}/api/overtime/status/${id}`;

      try {
        await axios.patch(apiReject, { status }, config);
        fetchData();
        Swal.fire({
          icon: "success",
          title: "Rejection Success",
          text: "The request has been rejected successfully.",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Rejection Error",
          text: "An error occurred while rejecting the request. Please try again.",
        });
      }
    }
  };

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setRows(filteredRows);
    setPage(0);
  };

  const handleSearch = () => {
    searchInRows(search);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    if (query === "" || query === null) {
      setRows(originalRows);
    } else {
      searchInRows(query);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleOpenDateFilter = () => {
    setIsDateFilterOpen(true);
  };

  const handleCloseDateFilter = () => {
    setIsDateFilterOpen(false);
  };

  const handleDateFilterChange = (date) => {
    setSelectedDate(date);
    setIsDateFilterOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (a.status === "waiting for approval" && b.status !== "waiting for approval") return -1;
    if (a.status !== "waiting for approval" && b.status === "waiting for approval") return 1;
    return 0;
  });

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const handleEditOpen = (id, data) => {
    setCurrentOvertimeId(id);
    setEditFormData({
      ...data,
      tanggal_overtime: dayjs(data.tanggal_overtime).format("YYYY-MM-DD"),
    });
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditFormData({
      note: "",
      mulai: "",
      selesai: "",
      tipe: "",
      tanggal_overtime: "",
      istirahat: "",
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    const apiEditURL = `${ip}/api/overtime/update/self/${currentOvertimeId}`;
    const formData = {
      ...editFormData,
      tipe: editFormData.tipe === "Sesudah Shift" ? 1 : 0, // Konversi tipe menjadi boolean
    };

    try {
      const response = await axios.patch(apiEditURL, formData, config);
      if (response.status === 200) {
        fetchData(); // Refresh data setelah berhasil diupdate
        Swal.fire({
          icon: "success",
          title: "Update Success",
          text: "Overtime data has been updated successfully.",
        });
        handleEditClose();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire({
        icon: "error",
        title: "Update Error",
        text: "An error occurred while updating the overtime data.",
      });
    }
  };
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [calculatedDaysOff, setCalculatedDaysOff] = useState(0);

  function getIdFromAccessToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null; // Token tidak ditemukan

    try {
      // Token biasanya berupa format JWT (header.payload.signature)
      const payloadBase64 = token.split('.')[1]; // Bagian payload
      const decodedPayload = atob(payloadBase64); // Decode dari Base64
      const payload = JSON.parse(decodedPayload); // Parsing JSON

      return payload.id || null; // Mengambil ID jika ada
    } catch (error) {
      console.error("Invalid token format:", error);
      return null;
    }
  }

  const userId = getIdFromAccessToken();
  console.log("User ID:", userId);


  const fetchOvertimeData = async () => {
    try {
      const userId = getIdFromAccessToken(); // Ambil ID dari AccessToken

      // Konfigurasi Header
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      // Request data ke API dengan config
      const response = await axios.get(
        `${ip}/api/kehadiran/list/karyawan/${userId}`,
        config
      );

      if (response.data && response.data.length > 0) {
        const overtimeData = response.data[0]; // Ambil data pertama

        // Total jatah overtime
        const totalDays = overtimeData["total jatah overtime (hari)"];
        const totalHours = overtimeData["total jatah overtime (jam)"];

        // Update state atau lakukan perhitungan lainnya
        setOvertimeHours(totalHours);
        setCalculatedDaysOff(totalDays);
      }
    } catch (error) {
      console.error("Failed to fetch overtime data:", error);
    }
  };

  useEffect(() => {
    fetchOvertimeData();
  }, []);




  return (
    <div className="w-screen h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Request Overtime
          </Typography>
        </div>
      </div>
      <div className="flex justify-center items-center w-screen my-2">
        <Card className="w-[90%]">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center w-full mx-auto space-x-1">
                <div className="bg-gray-200 rounded-lg flex justify-start items-center w-2/5 border border-gray-400">
                  <SearchIcon style={{ fontSize: 25 }} />
                  <InputBase
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    className="w-full px-2"
                  />
                </div>
                <div className="flex rounded-lg space-x-1">
                  <Button
                    size="small"
                    variant="text"
                    onClick={handleOpenDateFilter}
                  >
                    <CalendarMonthIcon className="text-black" />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "#204684" }}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  <Dialog open={isDateFilterOpen} onClose={handleCloseDateFilter}>
                    <DialogTitle>Pilih Tanggal</DialogTitle>
                    <DialogContent>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={selectedDate}
                          onChange={handleDateFilterChange}
                          renderInput={(params) => (
                            <div className="w-64 mt-2">
                              <input
                                {...params.inputProps}
                                className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                          )}
                        />
                      </LocalizationProvider>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex items-center justify-between mx-auto">
                <div className="flex space-x-4">
                  <Button
                    size="small"
                    variant="contained"
                    style={{ backgroundColor: "#1E6D42" }}
                    onClick={() => setTambahFormOpen(true)}
                  >
                    Request
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
       
      
          <CardContent>
            <div className="flex gap-4 align-right justify-end mx-2">
              <h3 className="font-semibold">Overtime Hours : {overtimeHours % 8} Hours</h3>
              <h3 className="font-semibold">Days Off : {calculatedDaysOff} Days</h3>
            </div>
            <div className="flex justify-end mx-2 mb-2">
              <h5 className="text-xs text-red-700">
                For every 8 hours of overtime, days off increase by 1
              </h5>
            </div>

            <div className="max-h-72 rounded-lg overflow-y-auto drop-shadow-xl">
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <CircularProgress /> {/* Komponen animasi loading */}
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  style={{ backgroundColor: "#FFFFFF", width: "100%" }}
                >
                  <Table aria-label="simple table" size="small">
                    <TableHead style={{ backgroundColor: "#204684" }}>
                      <TableRow>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Detail</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Start</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Finish</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Date</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold text-center">Overtime Type</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold text-center">Overtime Hours</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Status</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Action</p>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="bg-gray-100">
                      {sortedRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{row.note}</TableCell>
                            <TableCell align="center">{row.mulai}</TableCell>
                            <TableCell align="center">{row.selesai}</TableCell>
                            <TableCell align="center">{formatDate(row.tanggal_overtime)}</TableCell>
                            <TableCell align="center">{row.tipe}</TableCell>
                            <TableCell align="center">{ }</TableCell>
                            <TableCell
                              align="center"
                              style={{
                                color:
                                  row.status === "waiting for approval"
                                    ? "black"
                                    : row.status
                                      ? "green"
                                      : "red",
                              }}
                            >
                              {row.status === "waiting for approval" ? (
                                <div>waiting for approval</div>
                              ) : row.status ? (
                                "Approved"
                              ) : (
                                "Rejected"
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() =>
                                  handleEditOpen(row.id, {
                                    note: row.note,
                                    mulai: row.mulai,
                                    selesai: row.selesai,
                                    tipe: row.tipe,
                                    tanggal_overtime: row.tanggal_overtime,
                                    istirahat: row.istirahat,
                                  })
                                }
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Jumlah Data"
          />
        </div>
        <Dialog open={isEditModalOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Overtime</DialogTitle>
          <DialogContent>
            <div className="edit-form-container">
              <TextField
                label="Note"
                name="note"
                value={editFormData.note}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Start"
                name="mulai"
                type="time"
                value={editFormData.mulai}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Finish"
                name="selesai"
                type="time"
                value={editFormData.selesai}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  label="Type"
                  name="tipe"
                  value={editFormData.tipe}
                  onChange={handleEditChange}
                >
                  <MenuItem value="Sesudah Shift">Sesudah Shift</MenuItem>
                  <MenuItem value="Sebelum Shift">Sebelum Shift</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Date"
                name="tanggal_overtime"
                type="date"
                value={editFormData.tanggal_overtime}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <div className="button-group" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleEditClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {isTambahFormOpen && (
        <Formovertime onClose={() => setTambahFormOpen(false)} fetchData={fetchData} />
      )}
    </div>
  );
};

export default OvertimeUser;
