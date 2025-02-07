import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/Headbar";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import ip from "../ip";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Sidebar from "../feature/Sidebar";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const TableResign = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);

  const requestBody = {};

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  const apiUrlResign = `${ip}/api/resign/get`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(loadingAction.startLoading(true)); // Start loading
        const response = await axios.post(apiUrlResign, requestBody, config);
        console.log("Response Data:", response.data);
        setRows(response.data);
        setOriginalRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(loadingAction.startLoading(false)); // Stop loading
      }
    };

    fetchData(); // Call the function when the component mounts
  }, [dispatch]);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/6`;

    axios({
      url: api,
      method: "POST",
      responseType: "blob", // Respons diharapkan dalam bentuk blob (file)
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
        link.setAttribute("download", "Data Karyawan Resign.xlsx"); // Nama file yang ingin Anda unduh
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
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      <Sidebar isMobile={isMobile} />
      <div className="w-full min-h-screen bg-gray-100 overflow-auto ">
        <NavbarUser />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] text-white p-6  shadow-lg h-48">
          <h1 className="text-2xl font-bold">Resign</h1>
          <div className="mt-4 flex justify-center items-center space-x-4">

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
            <div className="rounded-lg overflow-y-auto drop-shadow-lg">
              <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                    <TableRow>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold">Name</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold">Divition</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold">Position</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold">
                          Filled Date
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-indigo font-semibold">
                          Resign Date
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[30%]">
                        <p className="text-indigo font-semibold">Reason</p>
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
                    ).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{row.nama}</TableCell>
                        <TableCell align="center">{row.divisi}</TableCell>
                        <TableCell align="center">{row.jabatan}</TableCell>
                        <TableCell align="center">
                          {row.tanggalmengajukan}
                        </TableCell>
                        <TableCell align="center">
                          {row.tanggalkeluar}
                        </TableCell>
                        <TableCell align="center">{row.alasan}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
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
          {/* Table Section */}

        </div>
      </div>
    </div>
  );
};

export default TableResign;
