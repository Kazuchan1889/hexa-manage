/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { loadingAction } from "../store/store"; // Importing Redux action
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
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

const TableDataKaryawan = () => {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  const apiURLDataKaryawan = `${ip}/api/karyawan/get/data/search`;

  const dispatch = useDispatch(); // Initialize Redux dispatch
  const loading = useSelector((state) => state.loading.isLoading); // Access loading state

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

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
    setRowsPerPage(parseInt(event.target.value, 10));
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
    <div className="w-full h-screen bg-gray-100 overflow-y-auto">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Data Karyawan
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
                <div className="flex rounded-lg">
                  <Button
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "#204684" }}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mx-auto">
                <div className="flex space-x-1">
                  <Button
                    disabled={!operation.includes("ADD_KARYAWAN")}
                    size="small"
                    variant="contained"
                    onClick={() => setTambahFormOpen(true)}
                  >
                    <PersonAddIcon className="text-white" />
                  </Button>
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
            <div className="max-h-72 max-w-full rounded-md overflow-y-auto drop-shadow-lg">
              <TableContainer component={Paper} style={{ width: "100%" }}>
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#204684" }}>
                    <TableRow>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold sticky top-0">
                          Nama
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[15%]">
                        <p className="text-white font-semibold sticky top-0">
                          Jabatan
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[20%]">
                        <p className="text-white font-semibold sticky top-0">
                          Divisi
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[5%]">
                        <p className="text-white font-semibold sticky top-0">
                          Level
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[5%]">
                        <p className="text-white font-semibold sticky top-0">
                          Status
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[20%]">
                        <p className="text-white font-semibold sticky top-0">
                          Email
                        </p>
                      </TableCell>
                      <TableCell align="center" className="w-[5%]">
                        <p className="text-white font-semibold sticky top-0">
                          Action
                        </p>
                      </TableCell>
                    </TableRow>
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
                            <TableCell align="center" style={{ width: "10%" }}>
                              {row.jabatan}
                            </TableCell>
                            <TableCell align="center" style={{ width: "10%" }}>
                              {row.divisi}
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
                                  {operation.includes("UPDATE_KARYAWAN") && (
                                    <MenuItem
                                      onClick={() => handleEdit(selectedIndex)}
                                    >
                                      <EditIcon
                                        className="text-gray-500"
                                        style={{ marginRight: "8px" }}
                                      />
                                      Edit Profile
                                    </MenuItem>
                                  )}
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
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
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
      {isEditOpen && (
        <EditDataKaryawan
          data={selectedData}
          onClose={() => setEditOpen(false)}
          rows={rows}
          selectedRowIndex={selectedRowIndex}
          setRows={setRows}
          fetchData={fetchData}
        />
      )}
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
  );
};

export default TableDataKaryawan;
