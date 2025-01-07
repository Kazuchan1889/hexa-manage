import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  InputBase,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Paper,
  TablePagination,
  Modal,
  Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";
import ip from "../ip"; // Sesuaikan path ini sesuai dengan struktur proyek Anda
import NavbarUser from "../feature/NavbarUser";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";

const TableLaporanKegiatan = () => {
  const [dataLaporan, setDataLaporan] = useState([]);
  const [filteredLaporan, setFilteredLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [endDate, setEndDate] = useState('');
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        const response = await axios.get(`${ip}/api/laporan/get/all`, { headers });
        setDataLaporan(response.data);
        setFilteredLaporan(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const search = e.target.value.toLowerCase();
    const filtered = dataLaporan.filter((laporan) =>
      Object.values(laporan).some(
        (value) =>
          value && value.toString().toLowerCase().includes(search)
      )
    );
    setFilteredLaporan(filtered);
  };

  const handleDateFilterChange = () => {
    if (!startDate || !endDate) {
      alert('Silakan pilih tanggal mulai dan tanggal selesai.');
      return;
    }

    const filteredData = dataLaporan.filter((laporan) => {
      const laporanDate = new Date(laporan.tanggal.split('/').reverse().join('-'));
      const start = new Date(startDate);
      const end = new Date(endDate);
      return laporanDate >= start && laporanDate <= end;
    });

    setFilteredLaporan(filteredData);
    setIsDateFilterOpen(false);
  };

  const handleOpenDateFilter = () => {
    setIsDateFilterOpen(true);
  };

  const handleCloseDateFilter = () => {
    setIsDateFilterOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };

  const handleExcelExport = () => {
    const api = `${ip}/api/export/data/8`;

    axios({
      url: api,
      method: "POST",
      responseType: "blob",
      data: {
        startDate,
        endDate,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Laporan_Kegiatan.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error);
        alert("Terjadi kesalahan saat mengunduh file. Silakan coba lagi.");
      });
  };
  const handleOpenModal = (description) => {
    setSelectedDescription(description);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (loading) return <div className="flex justify-center items-center h-40"><CircularProgress /></div>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="w-full h-screen bg-gray-100 overflow">
      <NavbarUser />
      {/* Header */}
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Activity Report
          </Typography>
        </div>
      </div>
      {/* Search and Filter Bar */}
      <div className="flex justify-center items-center w-screen my-2">
        <Card className="w-[90%]">
          <CardContent>
            <div className="flex justify-between items-center">
              {/* Search and Filter Section */}
              <div className="flex items-center w-full space-x-1">
                {/* Search Bar */}
                <div className="bg-gray-200 rounded-lg flex justify-start items-center w-2/5 border border-gray-400">
                  <SearchIcon style={{ fontSize: 25 }} />
                  <InputBase
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    className="w-full"
                  />
                </div>
                {/* Filter Button */}
                <Button
                  size="small"
                  variant="text"
                  onClick={handleOpenDateFilter}
                >
                  <CalendarMonthIcon className="text-black" />
                </Button>
              </div>
              {/* Export Button Section */}
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={handleExcelExport}
                className="ml-auto"
              >
                <DescriptionIcon className="text-white" /> Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Modal for Date Filter */}
      <Dialog open={isDateFilterOpen} onClose={handleCloseDateFilter}>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-4">
            <div>
              <Typography>Start Date</Typography>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <Typography>Until Date</Typography>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </DialogContent>
        <div className="flex justify-end p-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDateFilterChange}
          >
            Apply
          </Button>
        </div>
      </Dialog>
      {/* Table Display */}
      <div className="flex flex-col justify-between items-center rounded-xl mx-auto drop-shadow-xl w-full my-2">
        <Card className="w-[90%]">
          <CardContent>
            <div className="rounded-lg drop-shadow-lg overflow-y-auto">
              <TableContainer component={Paper} style={{ backgroundColor: "#FFFFFF", width: "100%" }}>
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#204684" }}>
                    <TableRow>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Name</p></TableCell>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Report Date</p></TableCell>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Submission Hours</p></TableCell>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Location</p></TableCell>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Type</p></TableCell>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Detail</p></TableCell>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Description</p></TableCell>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Document</p></TableCell>
                      <TableCell align="center" className="w-[10%]"><p className="text-white font-semibold">Export</p></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody className="bg-gray-100">
                    {(rowsPerPage > 0
                      ? filteredLaporan.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredLaporan
                    ).map((laporan, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{laporan.nama}</TableCell>
                        <TableCell align="center">{laporan.tanggal}</TableCell>
                        <TableCell align="center">{laporan.jam}</TableCell>
                        <TableCell align="center">{laporan.lokasi}</TableCell>
                        <TableCell align="center">{laporan.jenis}</TableCell>
                        <TableCell align="center">{laporan.keterangan}</TableCell>
                        <TableCell align="left">
                          {laporan.deskripsi.split(" ").length > 10 ? (
                            <>
                              {laporan.deskripsi.split(" ").slice(0, 10).join(" ")}...
                              <span
                                onClick={() => handleOpenModal(laporan.deskripsi)}
                                style={{ color: "blue", cursor: "pointer" }}
                              >
                                read more
                              </span>
                            </>
                          ) : (
                            laporan.deskripsi
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {laporan.dokumen && laporan.dokumen.length > 0 ? (
                            <div className="flex justify-center gap-[20%]">
                              {laporan.dokumen.map((doc, docIndex) => (
                                <img
                                  key={docIndex}
                                  src={doc}
                                  alt="Document"
                                  className="h-7 cursor-pointer m-auto"
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">NO FILE</p>
                          )}
                        </TableCell>
                        {/* Button Export */}
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<FileDownloadOutlined />}
                            onClick={() => {
                              console.log("Mengirim userId ke backend:", laporan.idk);

                              axios
                                .post(
                                  `${ip}/api/export/data/3`,
                                  { userId: laporan.idk },
                                  {
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: localStorage.getItem("accessToken"),
                                    },
                                    responseType: "blob",
                                  }
                                )
                                .then((response) => {

                                  const url = window.URL.createObjectURL(new Blob([response.data]));

                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.setAttribute("download", "data_export.xlsx"); // Menentukan nama file unduhan
                                  document.body.appendChild(link);
                                  link.click(); // Menyimulasikan klik untuk mengunduh file
                                  document.body.removeChild(link); // Menghapus elemen link setelah digunakan
                                  alert("Data exported successfully!");
                                })
                                .catch((error) => {
                                  console.error("Error exporting data:", error);
                                  alert("Failed to export data.");
                                });
                            }}
                          >
                            Export
                          </Button>
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 750,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
           <h2 style={{ fontWeight: "bold" }}>Full Description</h2>
          <p>{selectedDescription}</p>
          <Button onClick={handleCloseModal} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>
      {/* Pagination */}
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          <TablePagination
            rowsPerPageOptions={[15, 25]}
            component="div"
            count={filteredLaporan.length}
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

export default TableLaporanKegiatan;
