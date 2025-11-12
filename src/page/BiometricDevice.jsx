import React, { useState, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
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
import Head from "../feature/Headbar";
import NavbarUser from "../feature/MobileNav";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Modal, IconButton, Box, TextField } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

const TableResign = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [search, setSearch] = useState("");
    const [rows, setRows] = useState([]);
    const [originalRows, setOriginalRows] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState(""); // State untuk nama
    const [idPengguna, setIdPengguna] = useState(""); // State untuk ID Penggun
    const [users, setUsers] = useState([]); // State untuk menampung daftar pengguna

    // Fetching data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${ip}/api/palm/getall`);
                const data = await response.json();
                if (data.success) {
                    setRows(data.data);
                    setOriginalRows(data.data);
                } else {
                    console.error("No data found");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearch(query);
        if (query === "") {
            setRows(originalRows);
        } else {
            const filteredRows = originalRows.filter((row) =>
                row.userId.toString().includes(query) || row.cardId.toString().includes(query)
            );
            setRows(filteredRows);
        }
    };

    const handleSearch = () => {
        const filteredRows = originalRows.filter((row) =>
            row.userId.toString().includes(search) || row.cardId.toString().includes(search)
        );
        setRows(filteredRows);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    // Fetch users for the dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${ip}/api/karyawan/get`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("accessToken"),
                    },
                });

                // Periksa apakah status response baik (200 OK)
                if (!response.ok) {
                    console.error("API request gagal. Status:", response.status);
                    return;
                }

                const data = await response.json();
                console.log("Data dari API:", data); // Log data untuk memastikan respons API

                // Cek apakah data berisi array dan tidak kosong
                if (Array.isArray(data) && data.length > 0) {
                    setUsers(data); // Menyimpan data pengguna yang didapat dari API
                } else {
                    console.error("Gagal mengambil data pengguna atau data kosong");
                }
            } catch (error) {
                console.error("Terjadi error saat fetching data:", error);
            }
        };

        fetchUsers();
    }, []);


    // Menangani perubahan nama yang dipilih dari dropdown
    const handleNameChange = (event) => {
        const selectedName = event.target.value; // Mengambil nama yang dipilih
        setName(selectedName);

        // Mencari ID berdasarkan nama yang dipilih
        const selectedUser = users.find((user) => user.nama === selectedName);
        if (selectedUser) {
            setIdPengguna(selectedUser.id); // Menampilkan ID Pengguna yang sesuai dengan nama yang dipilih
        } else {
            setIdPengguna(""); // Jika tidak ditemukan, reset ID
        }
    };

    // Menutup modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setName(""); // Reset nama
        setIdPengguna(""); // Reset ID Pengguna
    };

    // Menangani submit data
    const handleSubmit = async () => {
        console.log("Submitted Data:", { name, idPengguna });

        // Menyiapkan data untuk dikirim ke API registerUser
        const userData = { userId: name, idPengguna };

        try {
            const response = await fetch(`${ip}/api/palm/registerUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            console.log(data.message); // Menampilkan pesan dari server
            handleCloseModal(); // Menutup modal setelah submit
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };


    return (
        <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
            {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
            <div className="w-full min-h-screen bg-gray-100 overflow-auto">
                <Head />
                {/* Center Content with Search Bar and Buttons */}
                <div className="bg-[#11284E] text-white p-6 shadow-lg h-48">
                    <h1 className="text-2xl font-bold">Biometric Device</h1>
                    <div className="mt-4 flex justify-center items-center space-x-4">
                        {/* Search Bar */}
                        <div className="relative ml-4 sm:ml-8 md:ml-16 w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearchChange}
                                className={`p-2 pl-10 rounded-full border border-gray-300 w-full focus:outline-none focus:ring focus:ring-blue-500 text-black
                      ${isMobile ? "w-68 h-6" : "w-80 h-10"}`}
                            />
                        </div>

                        {/* New "+" Button */}
                        <button onClick={handleOpenModal} className="p-2 bg-white rounded-full shadow">
                            <span className="text-[#11284E] font-bold text-xl">+</span>
                        </button>
                    </div>

                    <div className="rounded-lg overflow-y-auto mt-10 shadow-md mx-4">
                        <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
                            <Table aria-label="simple table" size="small">
                                <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                                    <TableRow>
                                        {(isMobile
                                            ? ["User ID", "Card ID", "Status", "Update Time", "Detail", "Verify"]
                                            : ["User ID", "Card ID", "Status", "Update Time", "Verify"]
                                        ).map((header) => (
                                            <TableCell key={header} align="center" className="w-[10%]">
                                                <p className="text-indigo font-semibold">{header}</p>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody className="bg-gray-100">
                                    {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{row.userid}</TableCell>
                                            <TableCell align="center">{row.cardId}</TableCell>
                                            <TableCell align="center">{row.status}</TableCell>
                                            <TableCell align="center">{row.updatetime}</TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" color="primary">
                                                    Verify
                                                </Button>
                                            </TableCell>
                                            {isMobile && (
                                                <TableCell align="center">
                                                    <IconButton>
                                                        <InfoIcon color="primary" />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="flex w-full justify-center mb-6">
                        <div className="flex w-11/12 items-end justify-end">
                            <TablePagination
                                rowsPerPageOptions={[10, 15, 25]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Rows per page"
                            />
                        </div>
                    </div>
                </div>
            </div>


            <Modal open={openModal} onClose={handleCloseModal}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md">
                    <Typography variant="h6" className="text-center font-bold">
                        Add New User
                    </Typography>
                    <div className="flex flex-col space-y-4 mt-4">
                        {/* Dropdown untuk memilih nama pengguna */}
                        <FormControl fullWidth>
                            <InputLabel>Nama</InputLabel>
                            <Select
                                value={name}
                                onChange={handleNameChange}
                                label="Nama"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 250, // Membatasi tinggi dropdown
                                            overflowY: 'auto', // Menambahkan scroll jika item lebih banyak dari maxHeight
                                        },
                                    },
                                }}
                            >
                                {/* Menampilkan semua data yang telah di-fetch, namun dapat discroll */}
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.nama}>
                                        {user.nama}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Text input untuk ID Pengguna yang hanya bisa tampil berdasarkan nama yang dipilih */}
                        <TextField
                            label="ID Pengguna"
                            variant="outlined"
                            fullWidth
                            value={idPengguna}
                            disabled // Nonaktifkan input ID
                        />
                    </div>

                    {/* Tombol untuk submit */}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="mt-4"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default TableResign;
