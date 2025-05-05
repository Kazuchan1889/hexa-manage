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
import Head from "../feature/Headbar";
import NavbarUser from "../feature/MobileNav";
import Sidebar from "../feature/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Info as InfoIcon } from "@mui/icons-material";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "@mui/material";
import {

  Modal,
  Box,
} from "@mui/material";



const TablePayroll = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);

  dispatch(loadingAction.startLoading(false));

  if (loading) {
    return <Loading />;
  }

  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSettingRumusPayrollOpen, setIsSettingRumusPayrollOpen] =
    useState(false);
  const [isCreatePayrollOpen, setIsCreatePayrollOpen] = useState(false);
  const operation = localStorage.getItem("operation");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const apiURLPayroll = `${ip}/api/payroll/get`;

  const monthsIndex = {
    All: null,
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const requestBody = {
    year: selectedYear,
    month: monthsIndex[selectedMonth],
    search: search,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  function fetchData() {
    axios
      .post(apiURLPayroll, requestBody, config)
      .then((response) => {
        setRows(response.data);
        setOriginalRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) => {
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
      setRows(originalRows);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const openSettingRumusPayroll = () => {
    setIsSettingRumusPayrollOpen(true);
  };

  const closeSettingRumusPayroll = () => {
    setIsSettingRumusPayrollOpen(false);
  };

  const openCreatePayroll = () => {
    setIsCreatePayrollOpen(true);
  };

  const closeCreatePayroll = () => {
    setIsCreatePayrollOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };

  const handleDownloadPayroll = (id, file) => {
    const api = `${ip}/api/export/slipgaji/${file}/${id}`;

    axios({
      url: api,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Slip Payroll.${file}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/5`;

    axios({
      url: api,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Data Payroll.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0);
  };

  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="w-full min-h-screen bg-gray-100 overflow-auto ">
        <Head />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] text-white p-6  shadow-lg  h-48">
          <h1 className="text-2xl font-bold">Payroll</h1>
          <div className="mt-4 flex justify-center items-center mr-12 space-x-4">
    

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




          </div>


          <div className="rounded-lg overflow-y-auto mt-10 shadow-md mx-4">
            {/* Table Section */}
            <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
              <Table aria-label="simple table" size="small">
                <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                  <TableRow>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold">Name</p>
                    </TableCell>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold">Position</p>
                    </TableCell>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold">Month</p>
                    </TableCell>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold">Bank Account Number</p>
                    </TableCell>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold">Nominal Salary</p>
                    </TableCell>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold" >Salary slip</p>
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
                  ).map((rows, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{rows.nama}</TableCell>
                      <TableCell align="center">{rows.jabatan}</TableCell>
                      <TableCell align="center">
                        {rows.month},{rows.year}
                      </TableCell>
                      <TableCell align="center">{rows.rekening}</TableCell>
                      <TableCell align="center">{rows.nominal}</TableCell>
                      <TableCell align="center">
                        <div className="flex justify-evenly">
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() =>
                              handleDownloadPayroll(rows.id, "xlsx")
                            }
                          >
                            <FontAwesomeIcon
                              className="text-green-700"
                              icon={faFileExcel}
                            />
                          </Button>
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() =>
                              handleDownloadPayroll(rows.id, "pdf")
                            }
                          >
                            <FontAwesomeIcon
                              className="text-red-700"
                              icon={faFilePdf}
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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

        </div>
        
      </div>
    </div>
  );
};

export default TablePayroll;
