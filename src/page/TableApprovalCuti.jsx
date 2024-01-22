import { useState, useEffect } from "react";
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

const TableApprovalCuti = () => {
  const [page, setPage] = useState(0);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState();
  const [reportType, setReportType] = useState("approval");
  const [data, setData] = useState(null);

  const jabatan = localStorage.getItem("jabatan");

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

    console.log(search);
    axios
      .post(apiURLCuti, requestBody, config)
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

  const filteredRows = rows.filter((row) =>
    reportType === "approval" ? row.status === null : row.status !== null
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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
        console.log(response);
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
  return (
    <div className="w-screen h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Data Approval Cuti
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
                    style={{ backgroundColor: "#204684" }}
                    onClick={(event) => handleSettingsOpen(event)}
                  >
                    <SettingsIcon />
                  </Button>
                  <Menu
                    anchorEl={isSettingsOpen}
                    open={Boolean(isSettingsOpen)}
                    onClose={handleSettingsClose}
                  >
                    <MenuItem
                      onClick={handleOpenPaidLeave}
                      onClose={handleMenuClose}
                    >
                      <p className="text-gray-500">Jatah Cuti</p>
                    </MenuItem>
                    <MenuItem
                      onClick={handleOpenDatePaidLeave}
                      onClose={handleMenuClose}
                    >
                      <p className="text-gray-500">Jadwal Cuti</p>
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
            <div className="max-h-72 rounded-lg overflow-y-auto drop-shadow-xl">
              <TableContainer
                component={Paper}
                style={{ backgroundColor: "#FFFFFF", width: "100%" }}
              >
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#204684" }}>
                    <TableRow>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Nama</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">
                          Tanggal Mulai
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">
                          Tanggal Selesai
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[30%]">
                        <p className="text-white font-semibold">Keterangan</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold text-center">
                          Pengganti
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Progress</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Action</p>
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
            rowsPerPageOptions={[5, 10, 25]}
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

export default TableApprovalCuti;
