import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { loadingAction } from "../store/store"; // Importing Redux action
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import Typography from "@mui/material/Typography";
import DropdownButton from "../feature/ApprovalButton";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ip from "../ip";
import Swal from "sweetalert2";
import ActionButton from "../feature/ActionButton";

const TableAproIzin = () => {
  const [page, setPage] = useState(0);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState();
  const [reportType, setReportType] = useState("approval");

  const dispatch = useDispatch(); // Initialize Redux dispatch
  const loading = useSelector((state) => state.loading.isLoading); // Access loading state

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
    <div className="w-full h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Permit Approval Data
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
                    <DialogTitle>Select Date</DialogTitle>
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
                    size="small"
                    variant="outlined"
                    onClick={(event) => handleMenuOpen(event)}
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
                    <MenuItem
                      onClick={() => handleReportTypeChange("approval")}
                    >
                      <p className="text-gray-500">Approval</p>
                    </MenuItem>
                    <MenuItem onClick={() => handleReportTypeChange("history")}>
                      <p className="text-gray-500">History</p>
                    </MenuItem>
                  </Menu>
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
      <div className="flex flex-col justify-between items-center rounded-xl mx-auto drop-shadow-xl w-full my-2">
        <Card className="w-[90%]">
          <CardContent>
            <div className="rounded-lg overflow-y-auto drop-shadow-lg">
              <TableContainer
                component={Paper}
                style={{ backgroundColor: "#FFFFFF", width: "100%" }}
              >
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#204684" }}>
                    <TableRow>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Name</p>
                      </TableCell>
                      <TableCell align="center" className="w-[14%]">
                        <p className="text-white font-semibold">
                          Start Date
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[14%]">
                        <p className="text-white font-semibold">
                          End Date
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[30%]">
                        <p className="text-white font-semibold">Detail</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Document</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold text-center">
                          Action
                        </p>
                      </TableCell>
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
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          <TablePagination
            rowsPerPageOptions={[15, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Jumlah Data"
          />
        </div>
      </div>
    </div>
  );
};

export default TableAproIzin;
