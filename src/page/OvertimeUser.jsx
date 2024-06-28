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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
import ActionButton from "../feature/ActionButton";
import Formovertime from "../page/Formovertime";

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

  const apiURLover = `${ip}/api/overtime/list`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  const fetchData = async () => {
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
      row.nama.toLowerCase().includes(query.toLowerCase())
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
                        <p className="text-white font-semibold">Catatan</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Mulai</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Selesai</p>
                      </TableCell>
                      <TableCell align="center" className="w-[30%]">
                        <p className="text-white font-semibold">Tanggal</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold text-center">Tipe Overtime</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold text-center">Break</p>
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
                          <TableCell align="center">{row.tanggal_overtime}</TableCell>
                          <TableCell align="center">{row.tipe}</TableCell>
                          <TableCell align="center">{row.break}</TableCell>
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
                              <div>
                                waiting for aproval
                              </div>
                            ) : row.status ? (
                              "Approved"
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
            count={sortedRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Jumlah Data"
          />
        </div>
      </div>
      {isTambahFormOpen && (
        <Formovertime
          onClose={() => setTambahFormOpen(false)}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default OvertimeUser;
