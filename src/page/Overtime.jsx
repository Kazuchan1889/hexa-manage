import { useState, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import DropdownButton from "../feature/ApprovalButton";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Card, CardContent } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TablePagination from "@mui/material/TablePagination";
import SettingsIcon from "@mui/icons-material/Settings";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Swal from "sweetalert2";
import ip from "../ip";
import ActionButton from "../feature/ActionButton";
import SettingJatahCuti from "../feature/SettingJatahCuti";
import SettingJadwalCuti from "../feature/SettingJadwalCuti";
import Formovertime from "../page/Formovertime";
import Head from "../feature/Headbar";
import NavbarUser from "../feature/MobileNav";
import Sidebar from "../feature/Sidebar";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { Modal, IconButton, Box } from "@mui/material";

const TableOverTime = () => {
  const [page, setPage] = useState(0);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState();
  const [reportType, setReportType] = useState("approval");
  const [data, setData] = useState(null);
  const [isTambahFormOpen, setTambahFormOpen] = useState(false);
  const jabatan = localStorage.getItem("jabatan");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = (string) => {
    const apiURLover = `${ip}/api/overtime/list`;

    const requestBody = {
      search: string,
      jenis: reportType,
      date: selectedDate,
    };



    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    console.log(search);
    axios
      //search belom jalan kurang api baru 
      .get(apiURLover, config)
      .then((response) => {
        console.log("Response Data:", response.data);
        setRows(response.data);
        setOriginalRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleOpenDateFilter = () => {
    setIsDateFilterOpen(true);
  };

  const handleCloseDateFilter = () => {
    setIsDateFilterOpen(false);
  };

  const handleDateFilterChange = (date) => {
    setSelectedDate(date);
    setPage(0);
    setIsDateFilterOpen(false);
    // console.log(date.toISOString(),selectedDate);
  };

  useEffect(() => {
    fetchData(); // Initial data fetch
  }, [selectedDate]);

  const handleApproval = (data) => {
    console.log(data);
    if (data) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      const status = 1;
      const id = data.id
      // const overtime_id = data.id
      const apiApprovalURL = `${ip}/api/overtime/status/${id}`;

      axios
        .patch(apiApprovalURL, { status }, config) // Sertakan pesan hall dalam payload
        .then((response) => {
          console.log(response.data);
          fetchData(""); // Refresh data after approval
          // Show success alert
          Swal.fire({
            icon: "success",
            title: "Approval Success",
            text: "The request has been approved successfully.",
          });
        })
        .catch((error) => {
          console.error("Error approving data:", error);
          // Show error alert
          Swal.fire({
            icon: "error",
            title: "Approval Error",
            text: "An error occurred while approving the request. Please try again.",
          });
        });
    }
  };

  const handleReject = (data) => {
    if (data) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      const status = false;
      console.log(data)
      const id = data.id
      const apiReject = `${ip}/api/overtime/status/${id}`;

      axios
        .patch(apiReject, { status }, config) // Sertakan pesan hall dalam payload
        .then((response) => {
          console.log(response.data);
          fetchData(""); // Refresh data after rejection
          // Show success alert
          Swal.fire({
            icon: "success",
            title: "Rejection Success",
            text: "The request has been rejected successfully.",
          });
        })
        .catch((error) => {
          console.error("Error rejecting data:", error);
          // Show error alert
          Swal.fire({
            icon: "error",
            title: "Rejection Error",
            text: "An error occurred while rejecting the request. Please try again.",
          });
        });
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

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    setPage(0);

    if (query === "" || query === null) {
      // Jika kotak pencarian kosong, kembalikan ke data asli
      setRows(originalRows);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const filteredRows = rows.filter((row) =>
    reportType === "approval" ? row.status === null : row.status !== null
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };
  // const handleReportTypeChange = (newReportType) => {
  //   setPage(0);
  //   setReportType(newReportType);
  //   handleMenuClose();
  // };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaidLeaveOpen, setIsPaidLeaveOpen] = useState(false);
  const [isDatePaidLeaveOpen, setIsDatePaidLeaveOpen] = useState(false);

  const handleSettingsOpen = (event) => {
    setIsSettingsOpen(event.currentTarget);
  };

  const handleOpenPaidLeave = () => {
    setIsPaidLeaveOpen(true);
    handleMenuClose();
  };

  const handleClosePaidLeave = () => {
    setIsPaidLeaveOpen(false);
  };

  const handleOpenDatePaidLeave = () => {
    setIsDatePaidLeaveOpen(true);
    handleMenuClose();
  };

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleCloseDatePaidLeave = () => {
    setIsDatePaidLeaveOpen(null);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(null);
  };

  const handleReportTypeChange = (newReportType) => {
    setPage(0);
    setReportType(newReportType);
    handleMenuClose();
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      <div className="w-full min-h-screen bg-gray-100 overflow-auto ">
        <Head />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] text-white p-6  shadow-lg h-48">
          <h1 className="text-2xl ml-5 font-bold">Overtime Aproval Data</h1>
          <div className="mt-4 flex justify-center items-center mr-16 space-x-4">

            <Button
              size="small"
              variant="outlined"
              onClick={(event) => handleMenuOpen(event)}
              style={{ borderColor: "white", color: "white" }}
              className={`${isMobile ? "w-20 h-5 text-[4px]" : "w-100 h-6 text-[14px]"}`}
            >
              {reportType === "approval" ? (
                <Typography variant="button" style={{ fontSize: isMobile ? '8px' : '14px' }}>Approval</Typography>
              ) : (
                <Typography variant="button" style={{ fontSize: isMobile ? '8px' : '14px' }}>History</Typography>
              )}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => handleReportTypeChange("approval")}
              >
                <p className="text-gray-500">Approval</p>
              </MenuItem>
              <MenuItem onClick={() => handleReportTypeChange("history")}>
                <p className="text-gray-500">History</p>
              </MenuItem>
            </Menu>
            {/* Search Bar */}
            <div className="relative ml-4 sm:ml-8 md:ml-16 w-full max-w-lg">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className={`p-2 pl-10 rounded-full border border-gray-300 w-full focus:outline-none focus:ring focus:ring-blue-500 text-black
                      ${isMobile ? "w-68 h-6" : "w-80 h-10"} focus:outline-none focus:ring focus:ring-blue-500 text-black`}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75L19.5 19.5" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
              </div>
            </div>

            {/* File Icon */}

          </div>

          <div className="rounded-lg overflow-y-auto mt-10 shadow-md mx-4">
            <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
              <Table aria-label="simple table" size="small">
                <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                  <TableRow>
                    {(isMobile
                      ? ["Catatan", "Mulai", "Detail"]
                      : ["Title", "Start", "End", "Date", "Overtime Type", "Action"]
                    ).map((header) => (
                      <TableCell key={header} align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold">{header}</p>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className="bg-gray-100">
                  {(rowsPerPage > 0
                    ? filteredRows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : filteredRows).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{row.note}</TableCell>
                        <TableCell align="center">{row.mulai}</TableCell>
                        {!isMobile && <TableCell align="center">{row.selesai}</TableCell>}
                        {!isMobile && <TableCell align="center">{row.tanggal_overtime}</TableCell>}
                        {!isMobile && <TableCell align="center">{row.tipe}</TableCell>}
                        {!isMobile && (
                          <TableCell
                            align="center"
                            style={{ color: row.status ? "black" : "red" }}
                          >
                            {row.status === null ? (
                              // <DropdownButton
                              //   onApproveSakit={handleApproveSakit}
                              //   onApproval={handleApproval}
                              //   data={row}
                              //   onReject={handleReject}
                              // />
                              <ActionButton
                                onAccept={handleApproval}
                                onReject={handleReject}

                                data={row}
                                tipe={"nonIzin"}
                                string={"Overtime"}
                              ></ActionButton>
                            ) : row.status ? (
                              "accepted"
                            ) : (
                              "rejected"
                            )}
                          </TableCell>
                        )}
                        {isMobile && (
                          <TableCell align="center">
                            <IconButton onClick={() => handleOpenModal(row)}>
                              <InfoIcon color="primary" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {/* Modal */}
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md">
              <Typography variant="h6" className="text-center font-bold">Detail Information</Typography>
              {selectedRow && (
                <div className="flex flex-col space-y-2 mt-4">
                  <p><strong>Catatan:</strong> {selectedRow.note}</p>
                  <p><strong>Mulai:</strong> {selectedRow.mulai}</p>
                  <p><strong>Selesai:</strong> {selectedRow.selesai}</p>
                  <p><strong>Tanggal:</strong> {selectedRow.tanggal_overtime}</p>
                  <p><strong>Tipe Overtime:</strong> {selectedRow.tipe}</p>
                  <p><strong>Breaktime:</strong> {selectedRow.breaktime}</p>
                  <div className="flex items-center justify-between mt-4">
                    {selectedRow.status === null ? (
                      <>
                        <p><strong>Action:</strong></p>
                        <ActionButton onAccept={handleApproval} onReject={handleReject} data={selectedRow} tipe={"nonIzin"} string={"Overtime"} />
                      </>
                    ) : (
                      <p><strong>Status:</strong> {selectedRow.status ? "Accepted" : "Rejected"}</p>
                    )}
                  </div>
                </div>
              )}
              <Button fullWidth variant="contained" color="primary" className="mt-4" onClick={handleCloseModal}>
                Close
              </Button>
            </Box>
          </Modal>

        </div>

        {/* Table Section */}
      </div>
    </div>
  );
};

export default TableOverTime;