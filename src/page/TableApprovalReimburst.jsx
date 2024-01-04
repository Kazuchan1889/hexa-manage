/* eslint-disable no-unused-vars */
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
import { Card, CardContent, CircularProgress, Modal } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import TablePagination from "@mui/material/TablePagination";
import DownloadIcon from "@mui/icons-material/Download";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import ip from "../ip";

const TableApprovalReimburst = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [reportType, setReportType] = useState("approval");
  const [anchorEl, setAnchorEl] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0);
    // Di sini Anda dapat menyusun ulang data dalam tabel berdasarkan bulan yang dipilih.
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

    setLoading(true);
    const requestBody = {
      search: string,
      jenis: reportType,
      bulan: monthsIndex[selectedMonth],
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
        console.log("Response Data:", response.data);
        setRows(response.data);
        setOriginalRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false regardless of success or error
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
        .then((response) => {
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

      const apiReject = `${ip}/api/reimburst/patch/${data.id}/false`;

      axios
        .patch(apiReject, {}, config)
        .then((response) => {
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

  useEffect(() => {
    console.log(search); // Log the input value
    fetchData(""); // Initial data fetch
  }, [reportType, selectedMonth]);

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
      // Jika kotak pencarian kosong, kembalikan ke data asli
      setRows(originalRows);
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

  console.log(filteredRows);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/4`;

    const requestBody = {};

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
        link.setAttribute("download", "Approval Reimburst.xlsx"); // Nama file yang ingin Anda unduh
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
    console.log(row);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Data Approval Reimburse
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
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "#204684" }}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  <select
                    className="border"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
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
                    ) : reportType === "history" ? (
                      <Typography variant="button">History</Typography>
                    ) : (
                      <Typography variant="button">Accepted</Typography>
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
                    <MenuItem
                      onClick={() => handleReportTypeChange("accepted")}
                    >
                      <p className="text-gray-500">Accepted</p>
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
              <div className="max-h-72 rounded-lg overflow-y-auto drop-shadow-lg">
                <TableContainer
                  component={Paper}
                  style={{ backgroundColor: "#FFFFFF", width: "100%" }}
                >
                  <Table aria-label="simple table" size="small">
                    <TableHead style={{ backgroundColor: "#204684" }}>
                      <TableRow>
                        <TableCell align="center" className="w-1/8">
                          <p className="text-white font-semibold">Nama</p>
                        </TableCell>
                        {(reportType === "approval" ||
                          reportType === "history") && (
                          <>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">
                                Jabatan
                              </p>
                            </TableCell>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">
                                Keterangan
                              </p>
                            </TableCell>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">Biaya</p>
                            </TableCell>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">
                                Tanggal Pengajuan
                              </p>
                            </TableCell>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">
                                Dokumen
                              </p>
                            </TableCell>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">Status</p>
                            </TableCell>
                          </>
                        )}
                        {reportType === "approval" && (
                          <TableCell align="center" className="w-1/8">
                            <p className="text-white font-semibold text-center">
                              Action
                            </p>
                          </TableCell>
                        )}
                        {reportType === "accepted" && (
                          <>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">Bulan</p>
                            </TableCell>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">Jumlah</p>
                            </TableCell>
                            <TableCell align="center" className="w-1/8">
                              <p className="text-white font-semibold">Detail</p>
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
                      )
                        // .filter(row => row.progres === "waiting" || row.progres === "accepted")
                        .map((row, index) => (
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
                                <TableCell align="center">
                                  {row.biaya}
                                </TableCell>
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
                                {reportType === "approval" ? (
                                  <TableCell align="center">
                                    <DropdownButton
                                      onApproval={handleApprove}
                                      data={row}
                                      onReject={handleReject}
                                    />
                                  </TableCell>
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
                                  {row.bulan}
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
                              </>
                            )}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedRowData && reportType == "accepted" && (
        <>
          {
            <Modal
              open={isOpen}
              onClose={handleCloseModal}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  boxShadow: 24,
                  borderRadius: "8px",
                  padding: "1rem",
                }}
                className="bg-white w-1/2 h-2/5"
              >
                <div className="flex justify-between">
                  <div className="my-2 font-semibold text-lg">
                    {selectedRowData.nama}
                  </div>
                  <div className="my-2 font-semibold text-lg">
                    Jumlah : {selectedRowData.jumlah}
                  </div>
                </div>
                <div className="w-full h-full mx-auto">
                  <TableContainer className="border rounded-md max-h-44 overflow-y-auto">
                    <Table size="small">
                      <TableHead style={{ backgroundColor: "#204684" }}>
                        <TableRow>
                          <TableCell align="center" className="w-1/2">
                            <p className="text-white font-semibold">
                              Keterangan
                            </p>
                          </TableCell>
                          <TableCell align="center" className="w-1/4">
                            <p className="text-white font-semibold">Biaya</p>
                          </TableCell>
                          <TableCell align="center" className="w-1/4">
                            <p className="text-white font-semibold">
                              Tanggal Pengajuan
                            </p>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedRowData.detail.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">
                              {row.keterangan}
                            </TableCell>
                            <TableCell align="center">{row.biaya}</TableCell>
                            <TableCell align="center">{row.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </Modal>
          }
        </>
      )}
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

export default TableApprovalReimburst;
