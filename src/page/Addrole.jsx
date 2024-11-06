import React, { useState, useEffect } from "react";
import axios from "axios";
import ip from "../ip";
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
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import NavbarUser from "../feature/NavbarUser";

// Define API URL
const API_URL = `${ip}/api/role`;

const Rolemanage = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [availableOperations, setAvailableOperations] = useState([]);
    const [assignedOperations, setAssignedOperations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRoleId, setCurrentRoleId] = useState(null); // Track the ID of the role being edited

    // Fetch roles and extract unique operations on component mount
    useEffect(() => {
        fetchRoles();
    }, []);

    // Function to include authorization header in all requests
    const getHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
    });

    // Fetch roles with operations from the back-end
    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${API_URL}/list`, {
                headers: getHeaders(),
            });
            const rolesData = response.data || [];
            setRows(rolesData);

            // Extract unique available operations from roles
            const operationsSet = new Set();
            rolesData.forEach(role => {
                if (Array.isArray(role.operation)) {
                    role.operation.forEach(op => operationsSet.add(op));
                }
            });
            setAvailableOperations([...operationsSet]); // Convert Set to array
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Add a new role in the back-end
    const handleAddRole = async () => {
        const newRole = {
            role: newRoleName,
            operation: assignedOperations,
        };

        try {
            await axios.post(`${API_URL}/create`, newRole, {
                headers: getHeaders(),
            });
            fetchRoles(); // Refresh roles
            handleCloseAddRole();
        } catch (error) {
            console.error("Error adding role:", error);
        }
    };

    // Update an existing role in the back-end
    const handleUpdateRole = async () => {
        if (!currentRoleId) return; // Ensure a role ID is selected

        const updatedRole = { role: newRoleName };

        try {
            // Update the role name
            await axios.patch(`${API_URL}/update/id/${currentRoleId}`, updatedRole, {
                headers: getHeaders(),
            });

            // Update role's operations by adding any new operations
            const currentOperations = rows.find(row => row.id === currentRoleId)?.operation || [];
            const operationsToAdd = assignedOperations.filter(op => !currentOperations.includes(op));
            for (const operation of operationsToAdd) {
                await axios.patch(`${API_URL}/update/operation/${currentRoleId}`, { operation }, {
                    headers: getHeaders(),
                });
            }

            fetchRoles(); // Refresh roles
            handleCloseAddRole();
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    // Delete a role in the back-end
    const handleDeleteRole = async (roleId) => {
        try {
            await axios.delete(`${API_URL}/delete/${roleId}`, {
                headers: getHeaders(),
            });
            fetchRoles(); // Refresh roles after deletion
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    const handleOpenAddRole = () => {
        setIsAddRoleOpen(true);
        setIsEditing(false);
        setNewRoleName("");
        setAssignedOperations([]);
        setCurrentRoleId(null); // Clear currentRoleId for new role
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
        setCurrentRoleId(role.id); // Set currentRoleId to the selected role's ID
    };

    const assignOperation = (operation) => {
        setAssignedOperations((prev) => [...prev, operation]);
    };

    const unassignOperation = (operation) => {
        setAssignedOperations((prev) => prev.filter((op) => op !== operation));
    };

    return (
        <div className="w-screen h-screen bg-gray-100 overflow-y-auto">
            <NavbarUser />
            <div className="flex w-full justify-center">
                <div className="flex w-[90%] items-start justify-start my-2">
                    <Typography variant="h5" style={{ fontWeight: 600 }}>
                        Role Management
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
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && fetchRoles()}
                                    />
                                </div>
                            </div>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: "#204684" }}
                                onClick={handleOpenAddRole}
                                startIcon={<AddIcon />}
                            >
                                Add Role
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col justify-between items-center rounded-xl mx-auto drop-shadow-xl w-full my-2">
                <Card className="w-[90%]">
                    <CardContent>
                        <TableContainer component={Paper} style={{ backgroundColor: "#FFFFFF", width: "100%", maxHeight: "400px", overflow: "auto" }}>
                            <Table aria-label="simple table" size="small">
                                <TableHead style={{ backgroundColor: "#204684" }}>
                                    <TableRow>
                                        <TableCell align="center" className="w-[10%]">
                                            <p className="text-white font-semibold">Role</p>
                                        </TableCell>
                                        <TableCell align="center" className="w-[10%]">
                                            <p className="text-white font-semibold">Operation</p>
                                        </TableCell>
                                        <TableCell align="center" className="w-[10%]">
                                            <p className="text-white font-semibold"></p>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="bg-gray-100">
                                    {rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center">{row.role}</TableCell>
                                                <TableCell align="center">
                                                    {(Array.isArray(row.operation) ? row.operation : []).join(", ")}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl)}
                                                        onClose={() => setAnchorEl(null)}
                                                    >
                                                        <MenuItem onClick={() => handleEditRole(row)}>Edit</MenuItem>
                                                        <MenuItem onClick={() => handleDeleteRole(row.id)}>Delete</MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="flex w-full justify-center">
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                    labelRowsPerPage="Rows per page"
                />
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
    );
};

export default Rolemanage;
