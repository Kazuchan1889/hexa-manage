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
import NavbarUser from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const TableLaporanKegiatan = () => {
  const [dataLaporan, setDataLaporan] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [filteredLaporan, setFilteredLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [endDate, setEndDate] = useState('');
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  const isImageFile = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = fileName.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  // Fungsi untuk mendownload file
  const handleDownload = (fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop(); // Nama file dari URL
    link.click();
  };
  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      <Sidebar isMobile={isMobile} />
      <div className="w-full min-h-screen bg-gray-100 overflow-auto ">
        <NavbarUser />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] text-white p-6  shadow-lg h-48 ">
          <h1 className="text-2xl ml-2 font-bold">Employe Report</h1>
          <div className="mt-4 flex justify-center items-center mr-8 space-x-4">
            {/* Search Bar */}
            <div className="relative ml-16">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="p-2 pl-10 rounded-full border border-gray-300 w-80 focus:outline-none focus:ring focus:ring-blue-500 text-black"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75L19.5 19.5"
                  />
                  <circle cx="11" cy="11" r="8" />
                </svg>
              </div>
            </div>

            {/* File Icon */}
            <button className="p-2 bg-white rounded-full shadow" onClick={handleExcelExport}>
              <InsertDriveFileIcon className="text-[#11284E] w-6 h-6" />
            </button>
          </div>

          <div className="rounded-lg overflow-y-auto mt-10 shadow-md mx-4">
            <TableContainer component={Paper} style={{ backgroundColor: "#FFFFFF", width: "100%" }}>
              <Table aria-label="simple table" size="small">
                <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                  <TableRow>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Name</p></TableCell>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Report Date</p></TableCell>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Submission Hours</p></TableCell>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Location</p></TableCell>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Type</p></TableCell>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Detail</p></TableCell>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Description</p></TableCell>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Document</p></TableCell>
                    <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Export</p></TableCell>
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
                                alt={`Document ${docIndex + 1}`}
                                className="h-7 cursor-pointer m-auto"
                                onClick={() => setSelectedDoc(doc)}
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
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: window.innerWidth < 600 ? "90%" : 700, // Jika di mobile, lebar modal 90% dari layar
                maxHeight: "80vh", // Maksimal tinggi modal
                bgcolor: "background.paper",
                borderRadius: "8px",
                boxShadow: 24,
                p: 4,
                overflowY: "auto",
                whiteSpace: "pre-line", // Menjaga jeda antar paragraf
                wordBreak: "break-word", // Mencegah teks overflow
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
          {selectedDoc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className=" p-4 rounded shadow-lg w-[80%] max-w-lg relative">
                <button
                  className="absolute top-2 right-1 text-gray-600 hover:text-gray-900"
                  onClick={() => setSelectedDoc(null)}
                >
                  ✖
                </button>
                <img src={selectedDoc} alt="Selected Document" className="w-full h-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Table Section */}

      </div>
    </div>
  );
};

export default TableLaporanKegiatan;
