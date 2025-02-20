import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Typography,
    InputBase,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Card,
    CardContent,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import ip from "../ip";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavbarUser from "../feature/MobileNav";
import Sidebar from "../feature/Sidebar";
import Head from "../feature/Headbar";


const API_URL = `${ip}/api/role`;

const RoleManage = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRoleIndex, setSelectedRoleIndex] = useState(null);
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [availableOperations, setAvailableOperations] = useState([]);
    const [assignedOperations, setAssignedOperations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRoleId, setCurrentRoleId] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        fetchRoles();
    }, []);

    const getHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken") || "",
    });

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${API_URL}/list`, {
                headers: getHeaders(),
            });
            const rolesData = response.data || [];
            setRoles(rolesData);

            const operationsSet = new Set();
            rolesData.forEach(role => {
                if (Array.isArray(role.operation)) {
                    role.operation.forEach(op => operationsSet.add(op));
                }
            });
            setAvailableOperations([...operationsSet]);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };
    const toggleRowExpand = (rowId) => {
        if (expandedRows.includes(rowId)) {
            setExpandedRows(expandedRows.filter((id) => id !== rowId));
        } else {
            setExpandedRows([...expandedRows, rowId]);
        }
    };
    const handleAddRole = async () => {
        const newRole = {
            role: newRoleName,
            operation: assignedOperations, // Mengirim sebagai array biasa
        };

        try {
            await axios.post(`${API_URL}/create`, newRole, {
                headers: getHeaders(),
            });
            fetchRoles();
            handleCloseAddRole();
        } catch (error) {
            console.error("Error adding role:", error);
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearch(query);
        if (query === "" || query === null) {
            setRows(originalRows);
        } else {
            searchInRows(query);
        }
    };

    const handleUpdateRole = async () => {
        if (!currentRoleId) return;

        try {
            const updatedRole = { role: newRoleName };
            await axios.patch(`${API_URL}/update/role/${currentRoleId}`, updatedRole, {
                headers: getHeaders(),
            });

            const currentOperations = roles.find(role => role.id === currentRoleId)?.operation || [];

            const operationsToAdd = assignedOperations.filter(op => !currentOperations.includes(op));
            const operationsToRemove = currentOperations.filter(op => !assignedOperations.includes(op));

            for (const operation of operationsToAdd) {
                await axios.patch(`${API_URL}/update/operation/${currentRoleId}`, {
                    operation: [operation] // Mengirim sebagai array biasa
                }, {
                    headers: getHeaders(),
                });
            }

            for (const operation of operationsToRemove) {
                await axios.patch(`${API_URL}/update/delete/${currentRoleId}`, {
                    operation: [operation] // Mengirim sebagai array biasa
                }, {
                    headers: getHeaders(),
                });
            }

            fetchRoles();
            handleCloseAddRole();
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    const handleDeleteRole = async (roleId) => {
        try {
            await axios.delete(`${API_URL}/delete/${roleId}`, {
                headers: getHeaders(),
            });
            fetchRoles();
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    const handleOpenAddRole = () => {
        setIsAddRoleOpen(true);
        setIsEditing(false);
        setNewRoleName("");
        setAssignedOperations([]);
        setCurrentRoleId(null);
    };

    const handleCloseAddRole = () => {
        setIsAddRoleOpen(false);
        setNewRoleName("");
        setAssignedOperations([]);
        setIsEditing(false);
        setCurrentRoleId(null);
    };

    const handleEditRole = (role) => {
        setNewRoleName(role.role);
        setAssignedOperations(role.operation || []);
        setIsEditing(true);
        setIsAddRoleOpen(true);
        setCurrentRoleId(role.id);
    };

    const assignOperation = (operation) => {
        if (!assignedOperations.includes(operation)) {
            setAssignedOperations((prev) => [...prev, operation]);
        }
    };

    const unassignOperation = (operation) => {
        setAssignedOperations((prev) => prev.filter((op) => op !== operation));
    };

    const handleMenuOpen = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedRoleIndex(index);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRoleIndex(null);
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
            {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
            <div className="flex flex-col flex-1 overflow-auto">
                <Head />
                {/* Center Content with Search Bar and Buttons */}
                <div className="bg-[#11284E] text-white p-6 shadow-lg h-48 ">
                    <h1 className="text-2xl ml-2 font-bold">Role Managment</h1>
                    <div className={`mt-4 flex ${isMobile ? 'flex-col items-center relative w-full' : 'justify-center items-center relative w-full'}`}>

                        {/* Search Bar */}
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearchChange}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                className={`p-2 pl-10 rounded-full border border-gray-300 w-full focus:outline-none focus:ring focus:ring-blue-500 text-black ${isMobile ? "w-68 h-6" : "w-80 h-10"}`}
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

                        {/* Request Button */}
                        <button
                            className={`w-[115px] h-[33px] bg-white text-black rounded-full shadow flex items-center justify-center space-x-2 ${isMobile ? 'mt-4 self-end' : 'absolute right-20'}`}
                            size="small"
                            variant="contained"
                            style={{ backgroundColor: "#FFFFFF" }}
                            onClick={() => setTambahFormOpen(true)}
                        >
                            <AddIcon className="text-[#055817] w-4 h-4" />
                            <span className="text-sm font-medium">REQUEST</span>
                        </button>

                    </div>



                    <div className="flex flex-col justify-between items-center rounded-xl mx-auto drop-shadow-xl w-full mt-12">

                        <div className=" w-[90%] max-h-72 rounded-lg overflow-y-auto drop-shadow-xl">
                            {loading ? (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height="100%"
                                >
                                    <CircularProgress /> {/* Komponen animasi loading */}
                                </Box>
                            ) : (
                                <TableContainer component={Paper} style={{ width: "100%" }} className="rounded-full">
                                    <Table aria-label="simple table" size="small">
                                        <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                                            <TableRow>
                                                <TableCell align="center">
                                                    <p className="text-indigo font-semibold">Role</p>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <p className="text-indigo font-semibold">Operation</p>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <p className="text-indigo font-semibold">Actions</p>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="bg-gray-100">
                                            {roles
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((role, index) => (
                                                    <TableRow key={role.id}>
                                                        <TableCell align="center">{role.role}</TableCell>
                                                        <TableCell align="center">
                                                            {(() => {
                                                                const operations = Array.isArray(role.operation) ? role.operation : [];
                                                                const isExpanded = expandedRows.includes(role.id);

                                                                return (
                                                                    <>
                                                                        {isExpanded
                                                                            ? operations.join(", ") // Tampilkan semua operasi jika diperluas
                                                                            : operations.slice(0, 5).join(", ")}{" "}
                                                                        {operations.length > 5 && (
                                                                            <Button
                                                                                size="small"
                                                                                style={{ textTransform: "none", color: "#204684" }}
                                                                                onClick={() => toggleRowExpand(role.id)}
                                                                            >
                                                                                {isExpanded ? "Show Less" : "Read More"}
                                                                            </Button>
                                                                        )}
                                                                    </>
                                                                );
                                                            })()}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <IconButton onClick={(event) => handleMenuOpen(event, index)}>
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            <Menu
                                                                anchorEl={anchorEl}
                                                                open={Boolean(anchorEl) && selectedRoleIndex === index}
                                                                onClose={handleMenuClose}
                                                            >
                                                                <MenuItem onClick={() => handleEditRole(role)}>
                                                                    <EditIcon className="text-gray-500" style={{ marginRight: "8px" }} />
                                                                    Edit Role
                                                                </MenuItem>
                                                                <MenuItem onClick={() => handleDeleteRole(role.id)}>
                                                                    <DeleteIcon className="text-gray-500" style={{ marginRight: "8px" }} />
                                                                    Delete Role
                                                                </MenuItem>
                                                            </Menu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>F
                    </div>
                    <div className="flex w-full justify-center">
                        <div className="flex w-11/12 items-end justify-end">
                            <TablePagination
                                rowsPerPageOptions={[15, 25]}
                                component="div"
                                count={roles.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                                labelRowsPerPage="Rows per page"
                            />
                        </div>
                        <Dialog open={isAddRoleOpen} onClose={handleCloseAddRole} fullWidth maxWidth="md">
                            <DialogTitle>
                                {isEditing ? "Edit Role" : "Add New Role"}
                                <IconButton
                                    onClick={handleCloseAddRole}
                                    style={{ position: "absolute", top: 8, right: 8 }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <div className="flex flex-col space-y-4">
                                    <InputBase
                                        placeholder="Role Name"
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                                    />
                                    <div className="flex space-x-4">
                                        <TableContainer component={Paper} className="w-1/2">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="text-gray-700 font-semibold">Available Operations</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {availableOperations
                                                        .filter((op) => !assignedOperations.includes(op))
                                                        .map((operation, index) => (
                                                            <TableRow key={index} onClick={() => assignOperation(operation)} style={{ cursor: "pointer" }}>
                                                                <TableCell>{operation}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TableContainer component={Paper} className="w-1/2">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="text-gray-700 font-semibold">Assigned Operations</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {assignedOperations.map((operation, index) => (
                                                        <TableRow key={index} onClick={() => unassignOperation(operation)} style={{ cursor: "pointer" }}>
                                                            <TableCell>{operation}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                    <Button
                                        onClick={isEditing ? handleUpdateRole : handleAddRole}
                                        variant="contained"
                                        style={{ backgroundColor: "#204684", color: "#FFFFFF" }}
                                        fullWidth
                                    >
                                        {isEditing ? "Save Changes" : "Save Role"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleManage;
