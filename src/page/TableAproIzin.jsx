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
import DownloadIcon from "@mui/icons-material/Download";
import NavbarUser from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";


const TableApprovalizin = () => {
  const [page, setPage] = useState(0);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState();
  const [reportType, setReportType] = useState("approval");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [data, setData] = useState(null);

  const dispatch = useDispatch(); // Initialize Redux dispatch
  const loading = useSelector((state) => state.loading.isLoading); // Access loading state

  const jabatan = localStorage.getItem("jabatan");

  const fetchData = () => {
    const apiURLIzin = `${ip}/api/pengajuan/get/izin`;
    const requestBody = { search: "", jenis: reportType, date: selectedDate };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    dispatch(loadingAction.startLoading(true)); // Start loading
    axios
      .post(apiURLIzin, requestBody, config)
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
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchData(); // Initial data fetch
  }, [selectedDate]);

  const handleApproveSakit = (data) => {
    if (data && data.id) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      const apiApprovalURL = `${ip}/api/pengajuan/patch/izin/${data.id}/true`;

      axios
        .patch(apiApprovalURL, { suratsakit: true }, config)
        .then(() => {
          fetchData(); // Refresh data after approval
          Swal.fire({
            icon: "success",
            title: "Approval Success",
            text: "The sick request has been approved successfully.",
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Approval Error",
            text: "An error occurred while approving the request. Please try again.",
          });
        });
    }
  };

  const handleApproval = (data) => {
    if (data && data.id) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      const apiApprovalURL = `${ip}/api/pengajuan/patch/izin/${data.id}/true`;

      axios
        .patch(apiApprovalURL, {}, config)
        .then(() => {
          fetchData(); // Refresh data after approval
          Swal.fire({
            icon: "success",
            title: "Approval Success",
            text: "The request has been approved successfully.",
          });
        })
        .catch((error) => {
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

      const apiReject = `${ip}/api/pengajuan/patch/izin/${data.id}/false`;

      axios
        .patch(apiReject, {}, config)
        .then(() => {
          fetchData(); // Refresh data after rejection
          Swal.fire({
            icon: "success",
            title: "Rejection Success",
            text: "The request has been rejected successfully.",
          });
        })
        .catch((error) => {
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
      tipe: "izin",
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
        link.setAttribute("download", "Approval Izin.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }


  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      <Sidebar isMobile={isMobile} />
      <div className="w-full min-h-screen bg-gray-100 overflow-auto ">
        <NavbarUser />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] text-white p-6  shadow-lg  h-48">
          <h1 className="text-2xl font-bold">Permit Aproval Data</h1>
          <div className="mt-4 flex justify-center items-center mr-12 space-x-4">
            {/* Button with Outline */}
            <Button
              size="small"
              variant="outlined"
              onClick={(event) => handleMenuOpen(event)}
              style={{ borderColor: "white", color: "white" }}
              className={`${isMobile ? "w-24 h-6 text-[5px]" : "w-100 h-6"}`}
            >
              {reportType === "approval" ? (
                <Typography variant="button">Approval</Typography>
              ) : (
                <Typography variant="button">History</Typography>
              )}
            </Button>


            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleReportTypeChange("approval")}>
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
              <div className="absolute inset-y-0 left-0 flex items-center ml-3">
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

            {/* File Icon Button */}
            <button
              className={`flex items-center justify-center bg-white rounded-full shadow ${isMobile ? "w-6 h-6" : "w-8 h-8"}`}
              onClick={handleExcel}
            >
              <InsertDriveFileIcon className="text-[#11284E] w-3 h-3" />
            </button>


          </div>


          <div className="rounded-lg overflow-y-auto mt-10 shadow-md mx-4">
            <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
              <Table aria-label="simple table" size="small">
                <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                  <TableCell align="center" className="w-[10%]">
                    <p className="text-indigo font-semibold">Name</p>
                  </TableCell>
                  <TableCell align="center" className="w-[14%]">
                    <p className="text-indigo font-semibold">Start Date</p>
                  </TableCell>
                  <TableCell align="center" className="w-[14%]">
                    <p className="text-indigo font-semibold">End Date</p>
                  </TableCell>
                  <TableCell align="center" className="w-[30%]">
                    <p className="text-indigo font-semibold">Detail</p>
                  </TableCell>
                  <TableCell align="center" className="w-[10%]">
                    <p className="text-indigo font-semibold">Document</p>
                  </TableCell>
                  <TableCell align="center" className="w-[10%]">
                    <p className="text-indigo font-semibold text-center">Action</p>
                  </TableCell>
                </TableHead>
                <TableBody className="bg-gray-100">
                  {(rowsPerPage > 0
                    ? filteredRows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : filteredRows
                  ).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{row.nama}</TableCell>
                      <TableCell align="center">{row.mulai}</TableCell>
                      <TableCell align="center">{row.selesai}</TableCell>
                      <TableCell align="center">{row.alasan}</TableCell>
                      <TableCell align="center">
                        {row.dokumen && (
                          <div className="flex justify-center">
                            <Button
                              size="small"
                              href={row.dokumen}
                              target="_blank "
                              download
                              className="cursor-pointer"
                            >
                              <DownloadIcon className="text-gray-400" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ color: row.status ? "black" : "red" }}
                      >
                        {row.status === null ? (
                          <ActionButton
                            onAccept={handleApproval}
                            onReject={handleReject}
                            onSakit={handleApproveSakit}
                            data={row}
                            tipe={"izin"}
                            string={"izin"}
                          />
                        ) : row.status ? (
                          "accepted"
                        ) : (
                          "rejected"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        {/* Table Section */}

      </div>
    </div>
  );
};

export default TableApprovalizin;
