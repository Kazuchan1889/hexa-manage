import React, { useState, useEffect } from "react";
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Swal from "sweetalert2";
import ip from "../ip";
import ActionButton from "../feature/ActionButton";
import SettingJatahCuti from "../feature/SettingJatahCuti";
import SettingJadwalCuti from "../feature/SettingJadwalCuti";

const TableAsset = () => {
  const [page, setPage] = useState(0);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportType, setReportType] = useState("history"); // Nilai default diatur menjadi "history"
  const [TotalHarga, setTotalHarga] = useState([]);

  const jabatan = localStorage.getItem("jabatan");

  const fetchData = () => {
    const apiURLasset = `${ip}/api/asset/list`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      params: {
        search,
        jenis: reportType,
        date: selectedDate ? selectedDate.toISOString() : null,
      },
    };

    axios
      .get(apiURLasset, config)
      .then((response) => {
        console.log("Response Data:", response.data);
        const assets = response.data.asset || [];
        setRows(assets);
        setOriginalRows(assets);
        setTotalHarga(response.data.total_harga)
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
  };

  useEffect(() => {
    fetchData(); // Panggil fetchData() saat komponen dimount
  }, [selectedDate, search, reportType]);

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) => {
      return row.nama_barang.toLowerCase().includes(query.toLowerCase());
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

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Company Asset
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
                
              </div>
              <div className="flex items-center justify-between mx-auto">
                <div className="flex space-x-4">
                  <Button
                    size="small"
                    variant="contained"
                    style={{ backgroundColor: "#1E6D42" }}
                    href="/Fasset"
                  >
                    + Add
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
                        <p className="text-white font-semibold">Name</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Brand</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Type</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Unit Price</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold text-center">
                          Quantity
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold text-center">
                          Price
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
                        <TableCell align="center">{row.nama_barang}</TableCell>
                        <TableCell align="center">{row.merek}</TableCell>
                        <TableCell align="center">{row.model_tipe}</TableCell>
                        <TableCell align="center">{row.harga}</TableCell>
                        <TableCell align="center">{row.jumlah}</TableCell>
                        <TableCell align="center">{row.hargatotal}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <strong>Total Harga</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>{TotalHarga}</strong>
                      </TableCell>
                      <TableCell colSpan={1} />
                    </TableRow>
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

export default TableAsset;
