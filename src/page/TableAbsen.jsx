import React, { useState, useEffect, useRef } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SettingHoliday from "../feature/SettingHoliday";
import PatchStatus from "../feature/PatchStatus";
import ActionButton from "../feature/ActionButton";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from 'axios';
import ip from "../ip";
import { Link, useNavigate } from "react-router-dom";
import {
  ClickAwayListener,
  IconButton,
  MenuList,
  Popper,
  Typography,
  Grow,
} from "@mui/material";
import NavbarUser from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";
import { Close } from "@mui/icons-material";




const TableAbsen = () => {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTimeSettingOpen, setIsTimeSettingOpen] = useState(false);
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [timeMasuk, setTimeMasuk] = useState(null);
  const [timeKeluar, setTimeKeluar] = useState(null);
  const [selectedToleransi, setSelectedToleransi] = useState(null);
  const operation = localStorage.getItem("operation");
  const apiURLAbsenKaryawan = `${ip}/api/absensi/get/data/dated`;
  const apiURLSettingJam = `${ip}/api/absensi/update/seting`;
  const currentDay = new Date().getDay(); // 0 untuk Minggu, 1 untuk Senin, dst.
  const [openModal, setOpenModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [isRotating, setIsRotating] = useState(false);



  // Periksa apakah hari ini adalah Sabtu (6) atau Minggu (0)
  const isWeekend = currentDay === 6 || currentDay === 0;

  const requestBody1 = {
    date: selectedDate,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          apiURLAbsenKaryawan,
          requestBody1,
          config
        );
        // console.log('Response Data:', response.data);
        setRows(response.data);
        setOriginalRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchTime = async () => {
      const url = `${ip}/api/absensi/get/time`;
      try {
        const response = await axios.get(url, config);
        console.log(response.data);
        setTimeMasuk(new Date());
        setTimeKeluar(
          `${response.data.keluar.jam}:${response.data.keluar.menit}`
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // fetchTime();
    fetchData(); // Call the function when the component mounts
  }, [selectedDate]);

  const handleOpenDateFilter = () => {
    setIsDateFilterOpen(true);
  };

  const handleCloseDateFilter = () => {
    setIsDateFilterOpen(false);
  };

  const handleDateFilterChange = (date) => {
    setSelectedDate(date);
    setIsDateFilterOpen(false);
    setPage(0);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseA = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setMenuOpen(false);
    setIsRotating(false); // Reset rotasi
  };

  const openTimeSetting = () => {
    setIsTimeSettingOpen(true);
    handleClose();
  };

  const openHolidaySetting = () => {
    setIsHolidayOpen(true);
    handleClose();
  };

  const closeHolidaySetting = () => {
    setIsHolidayOpen(false);
  };

  const handleTimeChange = (newVal, bool) => {
    console.log(newVal, bool);
    if (bool) {
      setTimeMasuk(newVal);
    } else setTimeKeluar(newVal);
  };

  const handleToleransiChange = (newTime) => {
    setSelectedToleransi(newTime);
  };

  const handleTimeSave = () => {
    handleTimeChange(timeMasuk, true);
    handleTimeChange(timeKeluar, false);
    handleToleransiChange(selectedToleransi);
    console.log(timeMasuk, timeKeluar, selectedToleransi);
    const requestBody2 = {
      masuk: {
        jam: timeMasuk ? timeMasuk.$H : null,
        menit: timeMasuk ? timeMasuk.$m : null,
        toleransi: selectedToleransi ?? null,
      },
      keluar: {
        jam: timeKeluar ? timeKeluar.$H : null,
        menit: timeKeluar ? timeKeluar.$m : null,
      },
    };
    console.log(requestBody2);
    axios
      .post(apiURLSettingJam, requestBody2, config)
      .then((response) => {
        // console.log('Response Data:', response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    closeTimeSetting();
    handleClose();
  };

  const closeTimeSetting = () => {
    setIsTimeSettingOpen(false);
    handleClose();
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    setPage(0);

    if (query === "" || query === null) {
      // Jika kotak pencarian kosong, kembalikan ke data asli
      setRows(originalRows);
    }
  };

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) => {
      // Sesuaikan dengan kriteria pencarian Anda
      return row.nama.toLowerCase().includes(query.toLowerCase());
    });

    setRows(filteredRows);
    setPage(0);
  };

  const handleSearch = () => {
    searchInRows(search);
    setPage(0);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/0`;

    const requestBody = {
      date: selectedDate,
    };

    axios({
      url: api,
      method: "POST",
      responseType: "blob", // Respons diharapkan dalam bentuk blob (file)
      data: requestBody,
      headers: {
        "Content-Type": "application/json", // Sesuaikan dengan tipe konten yang diterima oleh API
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Data Absen.xlsx"); // Nama file yang ingin Anda unduh
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // if(response.response.status === 400) return alert('gk ada data')
        // else {

        // }
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  const handleApproval = (data) => {
    // console.log(data);
    // if (data) {
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: localStorage.getItem("accessToken"),
    //     },
    //   };

    //   const status = 1;
    //   const id = data.id
    //   // const overtime_id = data.id
    //   const apiApprovalURL = `${ip}/api/overtime/status/${id}`;

    //   axios
    //     .patch(apiApprovalURL, {status}, config) // Sertakan pesan hall dalam payload
    //     .then((response) => {
    //       console.log(response.data);
    //       fetchData(""); // Refresh data after approval
    //       // Show success alert
    //       Swal.fire({
    //         icon: "success",
    //         title: "Approval Success",
    //         text: "The request has been approved successfully.",
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Error approving data:", error);
    //       // Show error alert
    //       Swal.fire({
    //         icon: "error",
    //         title: "Approval Error",
    //         text: "An error occurred while approving the request. Please try again.",
    //       });
    //     });
    // }
  };

  const handleReject = (data) => {
    // if (data) {
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: localStorage.getItem("accessToken"),
    //     },
    //   };

    //   const status = false;
    //   console.log(data)
    //   const id = data.id
    //   const apiReject = `${ip}/api/overtime/status/${id}`;

    //   axios
    //     .patch(apiReject, {status}, config) // Sertakan pesan hall dalam payload
    //     .then((response) => {
    //       console.log(response.data);
    //       fetchData(""); // Refresh data after rejection
    //       // Show success alert
    //       Swal.fire({
    //         icon: "success",
    //         title: "Rejection Success",
    //         text: "The request has been rejected successfully.",
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Error rejecting data:", error);
    //       // Show error alert
    //       Swal.fire({
    //         icon: "error",
    //         title: "Rejection Error",
    //         text: "An error occurred while rejecting the request. Please try again.",
    //       });
    //     });
    // }
  };
  function Base64Image({ base64String }) {
    // Buat URL untuk base64 data
    const imageUrl = `data:image/jpeg;base64,${base64String}`;

    return <img src={imageUrl} alt="Gambar" style={{ maxWidth: '100px', maxHeight: '100px' }} />;
  }

  useEffect(() => {
    // Get the server time using your existing method or API if needed
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric", // Added the year to the format
    });
    const currentHour = new Date().getHours();

    setDate(currentDate); // Set the formatted date
    setHour(currentHour); // Set the current hour
  }, []);

  const handleToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
    setIsRotating((prevRotating) => !prevRotating);
  };


  const handleLogout = () => {
    // Hapus token atau proses logout lainnya
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      <Sidebar isMobile={isMobile} />
      <div className="w-full min-h-screen bg-gray-100 overflow-auto ">
        <NavbarUser />
        <div className="min-h-screen bg-gray-100">
          {/* Container 1 */}
          <div className="bg-[#11284E] text-white p-6  shadow-lg h-72">
            <div className="flex justify-between items-center">
              {/* Left Corner */}
              <div>
                <p className="text-lg font-bold">{date}</p>
                {hour !== null && (
                  <p className="text-sm">Current hour: {hour} o'clock</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Notification Icon */}
                <IconButton>
                  <NotificationsIcon className="w-6 h-6 text-white cursor-pointer" />
                </IconButton>

                {/* Settings Dropdown */}

                {/* Icon Button */}
                <IconButton
                  ref={anchorRef}
                  aria-controls={menuOpen ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <SettingsIcon
                    className={`w-6 h-6 text-white cursor-pointer transform transition-transform duration-300 ${isRotating ? "rotate-180" : ""
                      }`}
                  />
                </IconButton>

                {/* Dropdown Menu */}
                <Popper
                  open={menuOpen}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  transition
                  disablePortal
                  style={{ zIndex: 1 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom" ? "center top" : "center bottom",
                      }}
                    >
                      <Paper className="mr-3">
                        <ClickAwayListener onClickAway={handleCloseA}>
                          <MenuList
                            autoFocusItem={menuOpen}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDown}
                            className="outline-none"

                          >
                            <MenuItem
                              component={Link}
                              to="/accountsetting"
                              className="px-4 py-2"
                            >
                              <Typography variant="button">Settings</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout} className="px-4 py-2">
                              <Typography variant="button">Logout</Typography>
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>

            </div>

            {/* Center Content */}
            <div className="text-center mt-6">
              <h1 className="text-2xl font-bold">Attendance Data</h1>
              <div className="mt-4 flex justify-center items-center space-x-4">
                {/* Button with Dots */}
                <button
                  className="p-2 bg-white rounded-full shadow"
                  onClick={handleClick}
                >
                  <MoreHorizIcon className="text-[#11284E] w-6 h-6" />
                </button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={openTimeSetting} onClose={handleClose}>
                    <SettingsIcon className="text-gray-500" style={{ marginRight: "8px" }} />
                    Setting Attendance Hours
                  </MenuItem>
                  <MenuItem onClick={openHolidaySetting} onClose={handleClose}>
                    <CalendarMonthIcon className="text-gray-500" style={{ marginRight: "8px" }} />
                    Setting Holiday Dates
                  </MenuItem>
                </Menu>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="p-2 pl-10 rounded-full border border-gray-300 w-80 focus:outline-none focus:ring focus:ring-blue-500 text-black"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 15.75L19.5 19.5"
                      />
                      <circle cx="11" cy="11" r="8" />
                    </svg>
                  </div>
                </div>

                {/* File Icon */}
                <button className="p-2 bg-white rounded-full shadow" onClick={handleExcel}>
                  <InsertDriveFileIcon className="text-[#11284E] w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="rounded-lg overflow-y-auto mt-8 shadow-md mx-4">
              <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                    <TableRow className="h-16 ">
                      <TableCell align="center">
                        <p className="text-indigo font-semibold">Name</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-indigo font-semibold">Clock In</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-indigo font-semibold">Clock Out</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-indigo font-semibold">Date</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-indigo font-semibold">Overtime</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-indigo font-semibold">Photo</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-indigo font-semibold">Status</p>
                      </TableCell>
                      {isWeekend && (
                        <TableCell align="center">
                          <p className="text-indigo font-semibold">Action</p>
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <p className="text-indigo font-semibold">Export</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="bg-gray-100">
                    {rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const jamMasukRow = new Date(`1970-01-01T${row.masuk}:00`);
                        const jamKeluarRow = new Date(`1970-01-01T${row.keluar}:00`);
                        const isLateMasuk = jamMasukRow > timeMasuk;
                        const isLateKeluar = jamKeluarRow > timeKeluar;

                        return (
                          <TableRow key={index}>
                            <TableCell align="center">{row.nama}</TableCell>
                            <TableCell align="center" style={{ color: isLateMasuk ? "red" : "black" }}>
                              {row.masuk}
                            </TableCell>
                            <TableCell align="center" style={{ color: isLateKeluar ? "red" : "black" }}>
                              {row.keluar}
                            </TableCell>
                            <TableCell align="center">{row.date}</TableCell>
                            <TableCell align="center">no</TableCell>
                            <TableCell align="center">
                              {row.fotomasuk ? (
                                <div className="flex justify-center items-center h-full">
                                  <img
                                    src={row.fotomasuk}
                                    alt="Foto Masuk"
                                    style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
                                    onClick={() => setSelectedPhoto(row.fotomasuk)}
                                  />
                                </div>
                              ) : (
                                <p>No Photo</p>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <PatchStatus string={row.status} id={row.id} />
                            </TableCell>
                            {isWeekend && (
                              <TableCell align="center">
                                <ActionButton onAccept={() => { }} onReject={() => { }} data={row} />
                              </TableCell>
                            )}
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<FileDownloadOutlined />}
                                onClick={() => {
                                  axios.post(`${ip}/api/export/data/8`, { userId: row.idk }, {
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: localStorage.getItem("accessToken"),
                                    },
                                    responseType: "blob",
                                  })
                                    .then((response) => {
                                      const url = window.URL.createObjectURL(new Blob([response.data]));
                                      const link = document.createElement("a");
                                      link.href = url;
                                      link.setAttribute("download", "data_export.xlsx");
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    })
                                    .catch((error) => {
                                      console.error("Error exporting data:", error);
                                      alert("Failed to export data.");
                                    });
                                }}
                              >
                                Export
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>


            {/* Container 2 */}

          </div>
          {isHolidayOpen && <SettingHoliday onClose={closeHolidaySetting} />}

          <Dialog open={isTimeSettingOpen} onClose={closeTimeSetting}>
            <DialogTitle>Setting Attendance Hours</DialogTitle>
            <DialogContent>
              <div className="flex space-x-1">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex my-2">
                    <TimePicker
                      label="Clock In"
                      value={timeMasuk}
                      onChange={(val) => {
                        handleTimeChange(val, true);
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                </LocalizationProvider>
                <div className="flex my-2">
                  <TextField
                    label="Tolerance (Minute)"
                    type="number"
                    value={selectedToleransi}
                    onChange={(event) =>
                      handleToleransiChange(
                        parseInt(event.target.value)
                      )
                    }
                  />
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex my-2">
                    <TimePicker
                      label="Clock Out"
                      value={timeKeluar}
                      onChange={(val) => {
                        handleTimeChange(val, false);
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                </LocalizationProvider>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleTimeSave}
                size="small"
                style={{ backgroundColor: "#204684" }}
                variant="contained"
              >
                <p>Save</p>
              </Button>
              <Button
                onClick={closeTimeSetting}
                style={{ backgroundColor: "#F&FAFC" }}
                size="small"
                variant="outlined"
              >
                <p className="bg-gray-100">Close</p>
              </Button>
            </DialogActions>
          </Dialog>
          {selectedPhoto && (
            <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
              <DialogContent className="relative flex flex-col items-center p-4">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <Close fontSize="large" />
                </button>
                <img
                  src={selectedPhoto}
                  alt="Preview"
                  className="max-w-full max-h-[80vh] rounded-lg"
                />
                <Button
                  className="mt-4"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = selectedPhoto;
                    link.download = "photo.jpg";
                    link.click();
                  }}
                >
                  Download Photo
                </Button>
              </DialogContent>
            </Dialog>
          )}


        </div>
      </div>
      </div>

      );
};


      export default TableAbsen;
