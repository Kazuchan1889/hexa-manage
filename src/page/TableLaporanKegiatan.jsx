import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TablePagination from "@mui/material/TablePagination";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import ip from "../ip";

const TableLaporanKegiatan = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState();
  const [anchorJenis, setAnchorJenis] = useState();
  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState("harian");
  const [jenisFilter, setJenisFilter] = useState("Didalam Kantor");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiURLLaporanKegiatan = `${ip}/api/laporan/get`;

  const requestBody = {
    search: "",
    tipe: reportType,
    jenis: jenisFilter,
    date: selectedDate,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching data

    try {
      const response = await axios.post(
        apiURLLaporanKegiatan,
        requestBody,
        config
      );
      if (response.data[0].nama) {
        setRows(response.data);
        setOriginalRows(response.data);
      } else {
        setRows([]);
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, reportType, jenisFilter]);

  const handleSearch = () => {
    searchInRows(search);
    setPage(0);
  };

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) => {
      // Sesuaikan dengan kriteria pencarian Anda
      return row.nama.toLowerCase().includes(query.toLowerCase());
    });

    setRows(filteredRows);
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

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageClick = (images) => {
    setSelectedImage(images);
  };

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

  const handleJenisOpen = (event, index) => {
    setAnchorJenis(event.currentTarget);
  };

  const handleJenisTypeChange = (newJenisType) => {
    setPage(0);
    setJenisFilter(newJenisType);
    handleJenisClose();
  };

  const handleJenisClose = () => {
    setAnchorJenis(null);
  };

  const filteredRows = rows.filter((row) => {
    const matchJenis = !jenisFilter || row.jenis === jenisFilter;
    const matchReportType = !reportType || row.reportType === reportType;
    const matchDate = !selectedDate || row.tanggal === selectedDate;

    return matchJenis && matchReportType && matchDate;
  });

  const handleExcel = () => {
    const api = `${ip}/api/export/data/3`;

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
        link.setAttribute("download", "Laporan Kegiatan.xlsx"); // Nama file yang ingin Anda unduh
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  return (
    <div className="w-full h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Laporan Kegiatan
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
                    size="small"
                    variant="outlined"
                    onClick={(event) => handleJenisOpen(event)}
                  >
                    {jenisFilter === "Didalam Kantor" ? (
                      <Typography
                        variant="caption"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Didalam Kantor
                      </Typography>
                    ) : (
                      <Typography
                        variant="caption"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Keluar Kantor
                      </Typography>
                    )}
                  </Button>
                  <Menu
                    anchorEl={anchorJenis}
                    open={Boolean(anchorJenis)}
                    onClose={handleJenisClose}
                  >
                    <MenuItem
                      onClick={() => handleJenisTypeChange("Didalam Kantor")}
                    >
                      <p className="text-gray-500">Didalam Kantor</p>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleJenisTypeChange("Keluar Kantor")}
                    >
                      <p className="text-gray-500">Keluar Kantor</p>
                    </MenuItem>
                  </Menu>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => handleMenuOpen(event)}
                  >
                    {reportType === "harian" ? (
                      <Typography variant="button">Harian</Typography>
                    ) : (
                      <Typography variant="button">Mingguan</Typography>
                    )}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleReportTypeChange("harian")}>
                      <p className="text-gray-500">Harian</p>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleReportTypeChange("mingguan")}
                    >
                      <p className="text-gray-500">Mingguan</p>
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
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <CircularProgress />
              </div>
            ) : (
              <div className="max-h-72 rounded-lg drop-shadow-lg overflow-y-auto">
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
                            Tanggal Laporan
                          </p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Jam Submit</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Lokasi</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Jenis</p>
                        </TableCell>
                        <TableCell align="center" className="w-[30%]">
                          <p className="text-white font-semibold">Keterangan</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Dokumen</p>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {rows && (
                      <TableBody className="bg-gray-100">
                        {(rowsPerPage > 0
                          ? rows.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : rows
                        ).map((row, index) => (
                          <TableRow key={index}>
                            <TableCell
                              align="center"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "150px",
                              }}
                            >
                              {row.nama}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                color: row.ontime ? "black" : "red",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "150px",
                              }}
                            >
                              {row.target}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "150px",
                              }}
                            >
                              {row.jam}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "150px",
                              }}
                            >
                              {row.lokasi}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "150px",
                              }}
                            >
                              {row.jenis}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                maxHeight: "100px",
                                maxWidth: "150px",
                              }}
                            >
                              {row.keterangan}
                            </TableCell>
                            <TableCell align="center">
                              {row.dokumen && row.dokumen.length > 0 && (
                                <div className="flex justify-center gap-[20%]">
                                  {row.dokumen[0] && (
                                    <img
                                      src={row.dokumen[0]}
                                      alt=""
                                      className="h-7 cursor-pointer m-auto"
                                      onClick={() =>
                                        handleImageClick(row.dokumen)
                                      }
                                    />
                                  )}
                                  {row.dokumen[1] && (
                                    <img
                                      src={row.dokumen[1]}
                                      alt=""
                                      className="h-7 cursor-pointer m-auto"
                                      onClick={() =>
                                        handleImageClick(row.dokumen)
                                      }
                                    />
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
      >
        <DialogContent>
          {selectedImage &&
            selectedImage.length > 0 &&
            selectedImage.map((image, index) => (
              <img
                key={index}
                alt=""
                src={image}
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
            ))}
        </DialogContent>
      </Dialog>
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          {rows && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TableLaporanKegiatan;
