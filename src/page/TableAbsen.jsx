// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
// import { loadingAction } from "../store/store"; // Importing Redux action
// import axios from "axios";
// import NavbarUser from "../feature/NavbarUser";
// import SettingHoliday from "../feature/SettingHoliday";
// import Typography from "@mui/material/Typography";
// import TableContainer from "@mui/material/TableContainer";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import { Card, CardContent } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import InputBase from "@mui/material/InputBase";
// import DescriptionIcon from "@mui/icons-material/Description";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import SettingsIcon from "@mui/icons-material/Settings";
// import TablePagination from "@mui/material/TablePagination";
// import Paper from "@mui/material/Paper";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import ip from "../ip";
// import PatchStatus from "../feature/PatchStatus";
// import Loading from "../page/Loading"; // Importing Loading component

// const TableAbsen = () => {
//   const [rows, setRows] = useState([]);
//   const [originalRows, setOriginalRows] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [search, setSearch] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [isTimeSettingOpen, setIsTimeSettingOpen] = useState(false);
//   const [isHolidayOpen, setIsHolidayOpen] = useState(false);
//   const [timeMasuk, setTimeMasuk] = useState(null);
//   const [timeKeluar, setTimeKeluar] = useState(null);
//   const [selectedToleransi, setSelectedToleransi] = useState(null);
//   const operation = localStorage.getItem("operation");
//   const apiURLAbsenKaryawan = `${ip}/api/absensi/get/data/dated`;
//   const apiURLSettingJam = `${ip}/api/absensi/update/seting`;

//   const dispatch = useDispatch(); // Using dispatch from Redux
//   const loading = useSelector((state) => state.loading.isLoading); // Accessing loading state from Redux

//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: localStorage.getItem("accessToken"),
//     },
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       dispatch(loadingAction.startLoading(true)); // Dispatch loading start
//       try {
//         const response = await axios.post(apiURLAbsenKaryawan, { date: selectedDate }, config);
//         setRows(response.data);
//         setOriginalRows(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         dispatch(loadingAction.startLoading(false)); // Dispatch loading end
//       }
//     };

//     fetchData();
//   }, [selectedDate, dispatch]);

//   const handleSearchChange = (event) => {
//     const query = event.target.value;
//     setSearch(query);
//     setPage(0);
//     if (!query) {
//       setRows(originalRows);
//     }
//   };

//   const handleSearch = () => {
//     const filteredRows = originalRows.filter((row) =>
//       row.nama.toLowerCase().includes(search.toLowerCase())
//     );
//     setRows(filteredRows);
//     setPage(0);
//   };

//   if (loading) {
//     return <Loading />; // Show loading state if data is being fetched
//   }

//   function Base64Image({ base64String }) {
//     // Buat URL untuk base64 data
//     const imageUrl = `data:image/jpeg;base64,${base64String}`;

//     return <img src={imageUrl} alt="Gambar" style={{ maxWidth: '100px', maxHeight: '100px' }} />;
// }

//   return (
//     <div className="w-full h-screen bg-gray-100 overflow-y-hidden">
//       <NavbarUser />
//       <div className="flex w-full justify-center">
//         <div className="flex w-[90%] items-start justify-start my-2">
//           <Typography variant="h5" style={{ fontWeight: 600 }}>Data Absensi</Typography>
//         </div>
//       </div>
//       <div className="flex justify-center items-center w-screen my-2">
//         <Card className="w-[90%]">
//           <CardContent>
//             <div className="flex justify-between items-center">
//               <div className="flex items-center w-full mx-auto space-x-1">
//                 <div className="bg-gray-200 rounded-lg flex justify-start items-center w-2/5 border border-gray-400">
//                   <SearchIcon style={{ fontSize: 25 }} />
//                   <InputBase
//                     placeholder="Search..."
//                     onKeyPress={(event) => {
//                       if (event.key === "Enter") {
//                         handleSearch();
//                       }
//                     }}
//                     onChange={handleSearchChange}
//                     className="w-full"
//                   />
//                 </div>
//                 <div className="flex rounded-lg space-x-1">
//                   <Button size="small" variant="text" onClick={() => setIsDateFilterOpen(true)}>
//                     <CalendarMonthIcon className="text-black" />
//                   </Button>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     style={{ backgroundColor: "#204684" }}
//                     onClick={handleSearch}
//                   >
//                     Search
//                   </Button>
//                   <Dialog open={isDateFilterOpen} onClose={() => setIsDateFilterOpen(false)}>
//                     <DialogTitle>Pilih Tanggal</DialogTitle>
//                     <DialogContent>
//                       <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <DatePicker
//                           value={selectedDate}
//                           onChange={(date) => {
//                             setSelectedDate(date);
//                             setIsDateFilterOpen(false);
//                           }}
//                           renderInput={(params) => (
//                             <div className="w-64 mt-2">
//                               <input
//                                 {...params.inputProps}
//                                 className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
//                               />
//                             </div>
//                           )}
//                         />
//                       </LocalizationProvider>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="flex flex-col justify-between items-center my-2 rounded-xl mx-auto drop-shadow-xl">
//         <Card className="w-[90%]">
//           <CardContent>
//             <div className="max-h-72 rounded-lg overflow-y-auto drop-shadow-lg">
//               <TableContainer component={Paper} style={{ width: "100%" }}>
//                 <Table aria-label="simple table" size="small">
//                   <TableHead style={{ backgroundColor: "#204684" }}>
//                     <TableRow>
//                       <TableCell align="center">
//                         <p className="text-white font-semibold">Nama</p>
//                       </TableCell>
//                       <TableCell align="center">
//                         <p className="text-white font-semibold">Jam Masuk</p>
//                       </TableCell>
//                       <TableCell align="center">
//                         <p className="text-white font-semibold">Jam Pulang</p>
//                       </TableCell>
//                       <TableCell align="center">
//                         <p className="text-white font-semibold">Tanggal</p>
//                       </TableCell>
//                       <TableCell align="center">
//                         <p className="text-white font-semibold">Photo</p>
//                       </TableCell>
//                       <TableCell align="center">
//                         <p className="text-white font-semibold">Status</p>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody className="bg-gray-100">
//                     {(rowsPerPage > 0
//                       ? rows.slice(
//                           page * rowsPerPage,
//                           page * rowsPerPage + rowsPerPage
//                         )
//                       : rows
//                     )
//                       .sort((a, b) => a.nama.localeCompare(b.nama))
//                       .map((row, index) => {
//                         const jamMasukRow = new Date(`1970-01-01T${row.masuk}:00`);
//                         const jamKeluarRow = new Date(`1970-01-01T${row.keluar}:00`);
//                         const isLateMasuk = jamMasukRow > timeMasuk;
//                         const isLateKeluar = jamKeluarRow > timeKeluar;

//                         return (
//                           <TableRow key={index}>
//                             <TableCell align="center">{row.nama}</TableCell>
//                             <TableCell 
//                               align="center" 
//                               style={{ color: isLateMasuk ? 'red' : 'black' }}
//                             >
//                               {row.masuk}
//                             </TableCell>
//                             <TableCell 
//                               align="center" 
//                               style={{ color: isLateKeluar ? 'red' : 'black' }}
//                             >
//                               {row.keluar}
//                             </TableCell>
//                             <TableCell align="center">{row.date}</TableCell>
//                             <TableCell align="center">
//                                   <img 
//                                     src={row.fotomasuk} 
//                                     alt="Foto Masuk" 
//                                     style={{ width: "50px", height: "50px", objectFit: "cover" }} 
//                                   />
//                                 </TableCell>
//                             <TableCell align="center" className="flex items-center">
//                               <PatchStatus string={row.status} id={row.id} />
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="flex w-full justify-center">
//         <div className="flex w-11/12 items-end justify-end">
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={rows.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={(event, newPage) => setPage(newPage)}
//             onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
//             labelRowsPerPage="Jumlah Data"
//           />
//         </div>
//       </div>
//       {isHolidayOpen && <SettingHoliday onClose={() => setIsHolidayOpen(false)} />}
//     </div>
//   );
// };

// export default TableAbsen;

import { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import SettingHoliday from "../feature/SettingHoliday";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Card, CardContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ip from "../ip";
import PatchStatus from "../feature/PatchStatus";
import ActionButton from "../feature/ActionButton";

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

  return (
    <div className="w-full h-screen bg-gray-100 overflow-y-auto">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            {" "}
            Attendance Data{" "}
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
                    onKeyPress={handleKeyPress}
                    onChange={handleSearchChange}
                    className="w-full"
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
                  <Dialog
                    open={isDateFilterOpen}
                    onClose={handleCloseDateFilter}
                  >
                    <DialogTitle>Pilih Tanggal</DialogTitle>{" "}
                    {/* Judul "Pilih Tanggal" */}
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
                <div className="flex space-x-1">
                  <Button
                    disabled={!operation.includes("UPDATE_ABSENSI")}
                    size="small"
                    variant="contained"
                    className="bg-blue-500 hover-bg-blue-400 p-1 rounded-lg"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={openTimeSetting} onClose={handleClose}>
                      <SettingsIcon
                        className="text-gray-500"
                        style={{ marginRight: "8px" }}
                      />
                      Setting Attendance Hours
                    </MenuItem>
                    <MenuItem
                      onClick={openHolidaySetting}
                      onClose={handleClose}
                    >
                      <CalendarMonthIcon
                        className="text-gray-500"
                        style={{ marginRight: "8px" }}
                      />
                      Setting Holiday Dates
                    </MenuItem>
                  </Menu>
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
                  <Button
                    size="small"
                    variant="contained"
                    style={{ backgroundColor: "#1E6D42" }}
                    onClick={handleExcel}
                  >
                    <DescriptionIcon className="text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col justify-between items-center my-2 rounded-xl mx-auto drop-shadow-xl">
        <Card className="w-[90%]">
          <CardContent>
            <div className="max-w-full rounded-lg overflow-y-auto drop-shadow-lg">
              <TableContainer component={Paper} style={{ width: "100%" }}>
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#204684" }}>
                    <TableRow>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Name</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Clock In</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Clock Out</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Date</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Overtime</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Status</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Action</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="bg-gray-100">
                    {(rowsPerPage > 0
                      ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      : rows
                    )
                      .sort((a, b) => a.nama.localeCompare(b.nama))
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{row.nama}</TableCell>
                          <TableCell align="center">{row.masuk}</TableCell>
                          <TableCell align="center">{row.keluar}</TableCell>
                          <TableCell align="center">{row.date}</TableCell>
                          <TableCell align="center">no</TableCell>
                          <TableCell
                            align="center"
                            className="flex items-center"
                          >
                            <PatchStatus string={row.status} id={row.id} />
                          </TableCell>
                          <TableCell align="center" className="flex items-center">
                            <ActionButton
                              onAccept={handleApproval}
                              onReject={handleReject}

                              data={row}
                              tipe={"nonIzin"}
                              string={"Absen"}
                            ></ActionButton>

                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          <TablePagination
            rowsPerPageOptions={[15, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Jumlah Data"
          />
        </div>
      </div>
      {isHolidayOpen && <SettingHoliday onClose={closeHolidaySetting} />}
    </div>
  );
};

export default TableAbsen;