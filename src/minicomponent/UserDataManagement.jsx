/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { loadingAction } from "../store/store"; // Importing Redux action
import axios from "axios";
import TambahKaryawan from "../feature/TambahKaryawan";
import EditDataKaryawan from "../feature/EditDataKaryawan";
import DetailKaryawan from "../feature/DetailKaryawan";
import EditOperation from "../feature/EditOperation";
import DeleteConfirmation from "../feature/DeleteData";
import { Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BadgeIcon from "@mui/icons-material/Badge";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DescriptionIcon from "@mui/icons-material/Description";
import ip from "../ip";
import Loading from "../page/Loading"; // Importing Loading component
import NavbarUser from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const TableDataKaryawan = () => {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedRowIndex] = useState(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [deleteConfirmDataId, setDeleteConfirmDataId] = useState(null);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isTambahFormOpen, setTambahFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSettingOpen, setSettingOpen] = useState(null);
  const operation = localStorage.getItem("operation");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const apiURLDataKaryawan = `${ip}/api/karyawan/get/data/search`;

  const dispatch = useDispatch(); // Initialize Redux dispatch
  const loading = useSelector((state) => state.loading.isLoading); // Access loading state

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    dispatch(loadingAction.startLoading(true)); // Start loading
    try {
      const response = await axios.post(apiURLDataKaryawan, {}, config);
      setRows(response.data);
      setOriginalRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(loadingAction.startLoading(false)); // Stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) => {
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
      setRows(originalRows);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleEdit = (index) => {
    const selectedRow = rows[page * rowsPerPage + index];
    setSelectedData(selectedRow);
    setEditOpen(true);
    handleMenuClose();
  };

  const handleSettingOperation = (index) => {
    const selectedRow = rows[page * rowsPerPage + index];
    setSelectedData(selectedRow);
    setSettingOpen(true);
    handleMenuClose();
  };

  const handleView = (index) => {
    const selectedRow = rows[page * rowsPerPage + index];
    setSelectedData(selectedRow);
    setDetailOpen(true);
    handleMenuClose();
  };

  const handleDelete = (index) => {
    setDeleteConfirmDataId(page * rowsPerPage + index);
    setDeleteConfirmationOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmDataId !== null) {
      const idToDelete = rows[deleteConfirmDataId].id;
      axios
        .delete(`${ip}/api/karyawan/del/${idToDelete}`, config)
        .then(() => {
          const updatedRows = [...rows];
          updatedRows.splice(deleteConfirmDataId, 1);
          setRows(updatedRows);
          setDeleteConfirmDataId(null);
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        });
    }
    setDeleteConfirmationOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/1`;

    axios({
      url: api,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TableDataKaryawan.xlsx");
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
    return <Loading />; // Render loading spinner when data is being fetched
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      <Sidebar isMobile={isMobile} />
      <div className="w-full min-h-screen bg-gray-100 overflow-auto ">
        <NavbarUser />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] text-white p-6  shadow-lg h-48">
          <h1 className="text-2xl font-bold">User Data</h1>
          <div className="mt-4 mr-8 flex justify-center items-center space-x-4">
            <Button
              disabled={!operation.includes("ADD_KARYAWAN")}
              size="small"
              variant="contained"
              onClick={() => setTambahFormOpen(true)}
            >
              <PersonAddIcon className="text-white" />
            </Button>
            {/* Search Bar */}
            <div className="relative">
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
            <button className="p-2 bg-white rounded-full shadow" onClick={handleExcel}>
              <InsertDriveFileIcon className="text-[#11284E] w-6 h-6" />
            </button>
          </div>

          <div className="rounded-lg overflow-y-auto mt-10 shadow-md mx-4">
            <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
              <Table aria-label="simple table" size="small">
                <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                  <TableCell align="center" className="w-[10%]">
                    <p className="text-indigo font-semibold">
                      Name
                    </p>
                  </TableCell>
                  {/* <TableCell align="center" className="w-[15%]">
                        <p className="text-white font-semibold sticky top-0">
                          Position
                        </p>
                      </TableCell> */}
                  <TableCell align="center" className="w-[20%]">
                    <p className="text-indigo font-semibold">
                      Division
                    </p>
                  </TableCell>
                  <TableCell align="center" className="w-[20%]">
                    <p className="text-indigo font-semibold">
                      lokasi
                    </p>
                  </TableCell>
                  <TableCell align="center" className="w-[5%]">
                    <p className="text-indigo font-semibold">
                      Level
                    </p>
                  </TableCell>
                  <TableCell align="center" className="w-[5%]">
                    <p className="text-indigo font-semibold">
                      Status
                    </p>
                  </TableCell>
                  <TableCell align="center" className="w-[20%]">
                    <p className="text-indigo font-semibold">
                      Email
                    </p>
                  </TableCell>
                  <TableCell align="center" className="w-[5%]">
                    <p className="text-indigo font-semibold">
                      Action
                    </p>
                  </TableCell>
                </TableHead>
                <TableBody className="bg-gray-100">
                  {rows &&
                    rows.length > 0 &&
                    rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .sort((a, b) => a.nama.localeCompare(b.nama))
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center" style={{ width: "20%" }}>
                            {row.nama}
                          </TableCell>
                          {/* <TableCell align="center" style={{ width: "10%" }}>
                              {row.jabatan}
                            </TableCell> */}
                          <TableCell align="center" style={{ width: "10%" }}>
                            {row.divisi}
                          </TableCell>
                          <TableCell align="center" style={{ width: "10%" }}>
                            {row.lokasikerja}
                          </TableCell>
                          <TableCell align="center" style={{ width: "10%" }}>
                            {row.level}
                          </TableCell>
                          <TableCell align="center" style={{ width: "10%" }}>
                            {row.status}
                          </TableCell>
                          <TableCell align="center" style={{ width: "20%" }}>
                            {row.email}
                          </TableCell>
                          <TableCell align="center" style={{ width: "10%" }}>
                            <div className="flex justify-center">
                              <Button
                                size="small"
                                onClick={(event) =>
                                  handleMenuOpen(event, index)
                                }
                                className="flex items-center hover:bg-gray-200 rounded-md mx-1"
                              >
                                <MoreVertIcon className="text-gray-500" />
                              </Button>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                              >
                                {operation.includes("READ_KARYAWAN") && (
                                  <MenuItem
                                    onClick={() => handleView(selectedIndex)}
                                  >
                                    <BadgeIcon
                                      className="text-gray-500"
                                      style={{ marginRight: "8px" }}
                                    />
                                    View Profile
                                  </MenuItem>
                                )}
                                {/* {operation.includes("UPDATE_KARYAWAN") && (
                                    <MenuItem
                                      onClick={() => handleEdit(selectedIndex)}
                                    >
                                      <EditIcon
                                        className="text-gray-500"
                                        style={{ marginRight: "8px" }}
                                      />
                                      Edit Profile
                                    </MenuItem>
                                  )} */}
                                {operation.includes("UPDATE_KARYAWAN") && (
                                  <MenuItem
                                    onClick={() =>
                                      handleSettingOperation(selectedIndex)
                                    }
                                  >
                                    <SettingsIcon
                                      className="text-gray-500"
                                      style={{ marginRight: "8px" }}
                                    />
                                    Settings Operation
                                  </MenuItem>
                                )}
                                {operation.includes("DELETE_KARYAWAN") && (
                                  <MenuItem
                                    onClick={() =>
                                      handleDelete(selectedIndex)
                                    }
                                  >
                                    <DeleteIcon
                                      className="text-gray-500"
                                      style={{ marginRight: "8px" }}
                                    />
                                    Delete Profile
                                  </MenuItem>
                                )}
                              </Menu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
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
        {isTambahFormOpen && (
          <TambahKaryawan
            onClose={() => setTambahFormOpen(false)}
            fetchData={fetchData}
          />
        )}
        {isDetailOpen && (
          <DetailKaryawan
            karyawan={selectedData}
            onClose={() => setDetailOpen(false)}
          />
        )}
        {/* {isEditOpen && (
        <EditDataKaryawan
          data={selectedData}
          onClose={() => setEditOpen(false)}
          rows={rows}
          selectedRowIndex={selectedRowIndex}
          setRows={setRows}
          fetchData={fetchData}
        />
      )} */}
        {isSettingOpen && (
          <EditOperation
            data={selectedData}
            onClose={() => setSettingOpen(false)}
            fetchData={fetchData}
          />
        )}
        {isDeleteConfirmationOpen && (
          <DeleteConfirmation
            onClose={() => setDeleteConfirmationOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </div>
        </div>

        {/* Table Section */}
    </div>
   

  );
};

export default TableDataKaryawan;