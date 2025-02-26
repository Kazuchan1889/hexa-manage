import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { loadingAction } from "../store/store"; // Importing Redux action
import axios from "axios";
import Typography from "@mui/material/Typography";
import DropdownButton from "../feature/ApprovalButton";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Card, CardContent, CircularProgress } from "@mui/material"; // Add CircularProgress
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
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Sidebar from "../feature/Sidebar";
import Head from "../feature/Headbar";
import NavbarUser from "../feature/MobileNav";
import { IconButton, Modal, Box } from "@mui/material";
import { Info } from "@mui/icons-material";


const TableApprovalCuti = () => {
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const loading = useSelector((state) => state.loading.isLoading); // Access loading state
  const jabatan = localStorage.getItem("jabatan");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = (string) => {
    const apiURLCuti = `${ip}/api/pengajuan/get/cuti`;

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

    dispatch(loadingAction.startLoading(true)); // Start loading
    axios
      .post(apiURLCuti, requestBody, config)
      .then((response) => {
        setRows(response.data);
        setOriginalRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        dispatch(loadingAction.startLoading(false)); // Stop loading
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
  };

  useEffect(() => {
    fetchData(""); // Initial data fetch
  }, [selectedDate]);

  const handleApproval = (data) => {
    if (data && data.id) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      const apiApprovalURL = `${ip}/api/pengajuan/patch/cuti/${data.id}/true`;

      axios
        .patch(apiApprovalURL, {}, config)
        .then(() => {
          fetchData(""); // Refresh data after approval
          Swal.fire({
            icon: "success",
            title: "Approval Success",
            text: "The request has been approved successfully.",
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Approval Error",
            text: "An error occurred while approving the request. Please try again.",
          });
        });
    }
  };

  const handleReject = (data) => {
    if (data && data.id) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      const apiReject = `${ip}/api/pengajuan/patch/cuti/${data.id}/false`;

      axios
        .patch(apiReject, {}, config)
        .then(() => {
          fetchData(""); // Refresh data after rejection
          Swal.fire({
            icon: "success",
            title: "Rejection Success",
            text: "The request has been rejected successfully.",
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Rejection Error",
            text: "An error occurred while rejecting the request. Please try again.",
          });
        });
    }
  };

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) =>
      row.nama.toLowerCase().includes(query.toLowerCase())
    );
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
      setRows(originalRows);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleReportTypeChange = (newReportType) => {
    setPage(0);
    setReportType(newReportType);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const handleExcel = () => {
    const api = `${ip}/api/export/data/2`;

    const requestBody = {
      tipe: "cuti",
    };

    axios({
      url: api,
      method: "POST",
      responseType: "blob",
      data: requestBody,
      headers: {
        Authorization: localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Approval Cuti.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

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

  const handleCloseDatePaidLeave = () => {
    setIsDatePaidLeaveOpen(null);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(null);
  };




  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="flex flex-col flex-1 overflow-auto">
        <Head />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] text-white p-6  shadow-lg h-48">
          <h1 className="text-2xl font-bold">Time Off Aproval Data</h1>
          <div className="mt-4 flex justify-center items-center space-x-4">

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
                <Typography variant="button" style={{ fontSize: isMobile ? '8x' : '14px' }}>History</Typography>
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
            <button className="p-2 bg-white rounded-full shadow" onClick={handleExcel}>
              <InsertDriveFileIcon className="text-[#11284E] w-6 h-6" />
            </button>
            <Button
              className="p-2 bg-white rounded-full shadow"
              onClick={(event) => handleSettingsOpen(event)}
            >
              <SettingsIcon style={{ color: "#FFFFFF" }} /> {/* Blue icon color */}
            </Button>
          </div>
          <Menu
            anchorEl={isSettingsOpen}
            open={Boolean(isSettingsOpen)}
            onClose={handleSettingsClose}
          >
            <MenuItem
              onClick={handleOpenPaidLeave}
              onClose={handleMenuClose}
            >
              <p className="text-gray-500">Leave Allowance</p>
            </MenuItem>
            <MenuItem
              onClick={handleOpenDatePaidLeave}
              onClose={handleMenuClose}
            >
              <p className="text-gray-500">Leave Schedule</p>
            </MenuItem>
          </Menu>

          <SettingJatahCuti
            isOpen={isPaidLeaveOpen}
            onClose={handleClosePaidLeave}
          />
          <SettingJadwalCuti
            isOpen={isDatePaidLeaveOpen}
            onClose={handleCloseDatePaidLeave}
          />
          <div className="rounded-lg overflow-y-auto mt-10 shadow-md mx-4">
            <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
              <Table aria-label="simple table" size="small">
                <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                  <TableRow>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold">Name</p>
                    </TableCell>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold">Start</p>
                    </TableCell>
                    {isMobile ? (
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold">Details</p>
                      </TableCell>
                    ) : (
                      <>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold">End Date</p>
                        </TableCell>
                        <TableCell align="center" className="w-[30%]">
                          <p className="text-indigo font-semibold">Details</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold">Replacement</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold">Progress</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold">Action</p>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody className="bg-gray-100">
                  {filteredRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{row.nama}</TableCell>
                      <TableCell align="center">{row.mulai}</TableCell>
                      {isMobile ? (
                        <TableCell align="center">
                          <IconButton onClick={() => handleOpen(row)}>
                            <Info color="primary" />
                          </IconButton>
                        </TableCell>
                      ) : (
                        <>
                          <TableCell align="center">{row.selesai}</TableCell>
                          <TableCell align="center">{row.alasan}</TableCell>
                          <TableCell align="center">{row.pengganti}</TableCell>
                          <TableCell align="center">{row.progress}</TableCell>
                          <TableCell
                            align="center"
                            style={{
                              color:
                                jabatan.toLowerCase() === "direktur"
                                  ? row.shead
                                    ? "black"
                                    : "red"
                                  : row.shr
                                    ? "black"
                                    : "red",
                            }}
                          >
                            {row.status === null ? (
                              jabatan.toLowerCase() === "direktur" ? (
                                row.shead === null ? (
                                  <ActionButton
                                    onAccept={handleApproval}
                                    onReject={handleReject}
                                    data={row}
                                    tipe={"nonIzin"}
                                    string={"Cuti"}
                                  />
                                ) : null
                              ) : row.shr === null ? (
                                <ActionButton
                                  onAccept={handleApproval}
                                  onReject={handleReject}
                                  data={row}
                                  tipe={"nonIzin"}
                                  string={"Cuti"}
                                />
                              ) : null
                            ) : row.status ? (
                              "Accepted"
                            ) : (
                              "Rejected"
                            )}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Modal for displaying details */}
              <Modal open={open} onClose={handleClose}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md">
                  <Typography variant="h6" className="text-center font-bold">Detail Information</Typography>
                  {selectedRow && (
                    <div className="flex flex-col space-y-2 mt-4">
                      <p><strong>Name:</strong> {selectedRow.nama}</p>
                      <p><strong>Start:</strong> {selectedRow.mulai}</p>
                      <p><strong>End Date:</strong> {selectedRow.selesai}</p>
                      <p><strong>Details:</strong> {selectedRow.alasan}</p>
                      <p><strong>Replacement:</strong> {selectedRow.pengganti}</p>
                      <div className="flex items-center justify-between">
                        <p><strong>Progress:</strong> {selectedRow.progress}</p>
                        <div className="flex px-1">
                          {selectedRow.status === null ? (
                            jabatan.toLowerCase() === "direktur" ? (
                              selectedRow.shead === null ? (
                                <ActionButton
                                  onAccept={handleApproval}
                                  onReject={handleReject}
                                  data={selectedRow}
                                  tipe={"nonIzin"}
                                  string={"Cuti"}
                                  className="w-8"
                                />
                              ) : null
                            ) : selectedRow.shr === null ? (
                              <ActionButton
                                onAccept={handleApproval}
                                onReject={handleReject}
                                data={selectedRow}
                                tipe={"nonIzin"}
                                string={"Cuti"}
                                className="w-8"
                              />
                            ) : null
                          ) : selectedRow.status ? (
                            "Accepted"
                          ) : (
                            "Rejected"
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <Button fullWidth variant="contained" color="primary" className="mt-4" onClick={handleClose}>
                    Close
                  </Button>
                </Box>
              </Modal>
            </TableContainer>
          </div>
        </div>

        {/* Table Section */}
      </div>
    </div>
  );
};

export default TableApprovalCuti;
