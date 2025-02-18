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
import Sidebar from "../feature/Sidebar";
import Head from "../feature/Headbar";
import NavbarUser from "../feature/NavbarUser";



const TableApprovalreimbur = () => {
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
  const [selectedMonth, setSelectedMonth] = useState("All");
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const loading = useSelector((state) => state.loading.isLoading); // Access loading state
  const [selectedYear, setSelectedYear] = useState(null);
  const jabatan = localStorage.getItem("jabatan");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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

  const fetchData = (string) => {
    const apiUrlReimburst = `${ip}/api/reimburst/get`;

    dispatch(loadingAction.startLoading(true)); // Start loading
    const requestBody = {
      search: string,
      jenis: reportType,
      bulan: monthsIndex[selectedMonth],
      year: selectedYear,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    axios
      .post(apiUrlReimburst, requestBody, config)
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

  const handleApprove = (data) => {
    if (data && data.id) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      const apiApprovalURL = `${ip}/api/reimburst/patch/${data.id}/true`;

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

  const handleApproveAll = (data) => {
    if (data.detail.length > 0) {
      data.detail.forEach((item) => {
        handleApprove(item);
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

      const apiReject = `${ip}/api/reimburst/patch/${data.id}/false`;

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

  useEffect(() => {
    fetchData(""); // Initial data fetch
  }, [reportType, selectedMonth, selectedYear]);

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    setPage(0);

    if (query === "" || query === null) {
      setRows(originalRows);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredRows = rows.filter((row) =>
    reportType === "approval"
      ? row.progres === "waiting"
      : reportType === "history"
        ? row.progres === "rejected" || row.progres === "sudah ditransfer"
        : row.progres === "accepted"
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/4`;

    const requestBody = {};

    axios({
      url: api,
      method: "POST",
      responseType: "blob",
      data: requestBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Approval Reimburst.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  const handleDetailClick = (row) => {
    setSelectedRowData(row);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleDownloadDetail = () => {
    const api = `${ip}/api/export/reimburse/detail/pdf`;

    axios({
      url: api,
      method: "POST",
      responseType: "blob",
      data: { data: selectedRowData },
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Approval Reimburst.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading PDF file:", error);
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
     {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="w-full min-h-screen bg-gray-100 overflow-auto ">
        <Head />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] text-white p-6  shadow-lg h-48">
          <h1 className="text-2xl ml-5 font-bold">Rreimburst Aproval Data</h1>
          <div className="mt-4 flex justify-center items-center mr-8 space-x-4">

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
            <button className="p-2 bg-white rounded-full shadow" onClick={handleExcel}>
              <InsertDriveFileIcon className="text-[#11284E] w-6 h-6" />
            </button>
          </div>

          <div className="rounded-lg overflow-y-auto mt-10 shadow-md mx-4">
            <TableContainer
              component={Paper}
              style={{ backgroundColor: "#FFFFFF", width: "100%" }}
            >
              <Table aria-label="simple table" size="small">
                <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                  <TableRow>
                    <TableCell align="center" className="w-[10%]">
                      <p className="text-indigo font-semibold">Name</p>
                    </TableCell>
                    {(reportType === "approval" ||
                      reportType === "history") && (
                        <>
                          <TableCell align="center" className="w-[5%]">
                            <p className="text-indigo font-semibold">Position</p>
                          </TableCell>
                          <TableCell align="center" className="w-[35%]">
                            <p className="text-indigo font-semibold">
                              Detail
                            </p>
                          </TableCell>
                          <TableCell align="center" className="w-[10%]">
                            <p className="text-indigo font-semibold">Cost</p>
                          </TableCell>
                          <TableCell align="center" className="w-[15%]">
                            <p className="text-indigo font-semibold">
                              Filing Date
                            </p>
                          </TableCell>
                          <TableCell align="center" className="w-[5%]">
                            <p className="text-indigo font-semibold">Document</p>
                          </TableCell>
                        </>
                      )}
                    {reportType === "history" && (
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold">Status</p>
                      </TableCell>
                    )}
                    {reportType === "approval" && (
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold text-center">
                          Action
                        </p>
                      </TableCell>
                    )}
                    {reportType === "accepted" && (
                      <>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold text-center">
                            Jabatan
                          </p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold">Month</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold">Amount</p>
                        </TableCell>
                        <TableCell align="center" className="w-[15%]">
                          <p className="text-indigo font-semibold">Bank Name</p>
                        </TableCell>
                        <TableCell align="center" className="w-[15%]">
                          <p className="text-indigo font-semibold">
                            Bank account number
                          </p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold">Detail</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-indigo font-semibold text-center">
                            Action
                          </p>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
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
                      <TableCell
                        align="center"
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          maxHeight: "100px",
                          maxWidth: "100px",
                        }}
                      >
                        {row.nama}
                      </TableCell>
                      {(reportType === "approval" ||
                        reportType === "history") && (
                          <>
                            <TableCell
                              align="center"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "100px",
                              }}
                            >
                              {row.jabatan}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "100px",
                              }}
                            >
                              {row.keterangan}
                            </TableCell>
                            <TableCell align="center">{row.biaya}</TableCell>
                            <TableCell
                              align="center"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "120px",
                              }}
                            >
                              {row.date}
                            </TableCell>
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
                            {reportType === "history" ? (
                              <TableCell
                                align="center"
                                style={{
                                  whiteSpace: "normal",
                                  wordWrap: "break-word",
                                  maxHeight: "100px",
                                  maxWidth: "100px",
                                }}
                              >
                                {row.progres}
                              </TableCell>
                            ) : null}
                            {row.status === null ? (
                              <>
                                <TableCell
                                  align="center"
                                  style={{
                                    color: row.status ? "black" : "red",
                                  }}
                                >
                                  {row.status === null ? (
                                    <ActionButton
                                      data={row}
                                      onAccept={handleApprove}
                                      onReject={handleReject}
                                      tipe={"nonIzin"}
                                      string={"Reimburse"}
                                    ></ActionButton>
                                  ) : null}
                                </TableCell>
                              </>
                            ) : null}
                          </>
                        )}
                      {reportType === "accepted" && (
                        <>
                          <TableCell
                            align="center"
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              maxHeight: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            {row.jabatan}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              maxHeight: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            {`${monthNames(row.bulan, row.tahun)} ${row.tahun
                              }`}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              maxHeight: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            {row.jumlah}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              maxHeight: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            {row.bankname}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              maxHeight: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            {row.norek}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              maxHeight: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                handleDetailClick(row);
                              }}
                            >
                              Detail
                            </Button>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              color: row.status ? "black" : "red",
                            }}
                          >
                            <ActionButton
                              data={row}
                              onAccept={handleApproveAll}
                              onReject={handleRejectAll}
                              tipe={"nonIzin"}
                              string={"Reimburse"}
                            ></ActionButton>
                          </TableCell>
                        </>
                      )}
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

export default TableApprovalreimbur;
