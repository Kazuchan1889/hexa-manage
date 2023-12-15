import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import { Card, CardContent, Modal, Menu, MenuItem, Typography } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import CloseIcon from '@mui/icons-material/Close';
import CreateRumusPayroll from "./CreateRumusPayroll";
import UpdateRumus from "./UpdateRumus";
import DeleteRumus from "./DeleteRumusPayroll";
import axios from "axios";
import ip from "../ip";

const SettingRumusPayroll = ({ isOpen, onClose }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCreateRumusOpen,setIsCreateRumusOpen] = useState(false);
  const [deleteConfirmDataId, setDeleteConfirmDataId] = useState(null);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedRowIndex] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const apiSettingRumusPayroll = `${ip}/api/payroll/get/formula`;
  const [reload,setReload] = useState(0);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem("accessToken"),
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(apiSettingRumusPayroll, config);
      setRows(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [reload])

  const handleClick = (event,index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = (index) => {
    const selectedRow = rows[page * rowsPerPage + index];
    console.log(index);
    setSelectedData(selectedRow);
    setUpdateOpen(true);
    handleClose(); // You may or may not need this line, depending on your requirements
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleDelete = (index) => {
    setDeleteConfirmDataId(page * rowsPerPage + index);
    setDeleteConfirmationOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmDataId !== null) {
      const idToDelete = rows[deleteConfirmDataId].id;
      // Contoh penggunaan Axios untuk melakukan DELETE request
      // Gantilah URL dengan endpoint yang sesuai dengan aplikasi Anda
      axios.delete(`${ip}/api/payroll/delete/formula/${idToDelete}`,config)
        .then(response => {
          const updatedRows = [...rows];
          updatedRows.splice(deleteConfirmDataId, 1);
          setRows(updatedRows);
          setDeleteConfirmDataId(null);
        })
        .catch(error => {
          console.error('Error deleting data:', error);
        });
    }
    setDeleteConfirmationOpen(false);
    setPage(0);
  };
  const handleCreateRumusPayroll = () => {
    setIsCreateRumusOpen(true);
  };

  const handleCloseCreateRumusPayroll = () => {
    setIsCreateRumusOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Modal open={isOpen || false} onClose={onClose}>
      <div
        className="w-2/5 h-96"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card className="h-full">
          <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Typography variant="h6">Setting Rumus Payroll</Typography>
                </div>
                <div className="flex items-center">
                    <Button
                        size="small"
                        variant="text"
                        onClick={onClose}
                        >
                        <CloseIcon className="text-gray-500"/>
                        </Button>
                </div>
            </div>
            <Card>
              <CardContent>
                <div className="bg-gray-100 overflow-y-auto rounded-lg">
                  <TableContainer>
                    <Table size="small">
                      <TableHead style={{ backgroundColor: "#204684" }}>
                        <TableRow>
                          <TableCell align="center">
                            <p className="text-white font-semibold">Rumus</p>{" "}
                          </TableCell>
                          <TableCell align="center">
                            <p className="text-white font-semibold">Action</p>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0
                          ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          : rows
                        ).map((item,index) => (
                          <TableRow key={item.id}>
                            <TableCell align="center" style={{ width: "50%" }}>
                              {item.rumus_nama}
                            </TableCell>
                            <TableCell align="center" style={{ width: "25%" }}>
                              <Button
                                size="small"
                                variant="text"
                                onClick={(event) => handleClick(event, index)}
                              >
                                <MoreVertIcon className="text-gray-500" />
                              </Button>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                              >
                                <MenuItem
                                  onClick={() => handleUpdate(selectedIndex)}
                                  onClose={handleClose}
                                >
                                  Update/Edit Rumus
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleDelete(selectedIndex)}
                                  onClose={handleClose}
                                >
                                  Delete Rumus
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                
              </CardContent>
            </Card>
            <div className="flex items-center justify-between w-full">
                    <div  className="flex items-start justify start w-2/5">
                    <TablePagination
                        rowsPerPageOptions={[4]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Rows per page"
                        />
                    </div>
              <div className="flex items-end justify-end w-2/5 space-x-5">
                <Button size="small" 
                  variant="contained" 
                  onClick={handleCreateRumusPayroll}>
                  Create
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      <CreateRumusPayroll isOpen={isCreateRumusOpen} onClose={handleCloseCreateRumusPayroll} setReload={setReload} reload={reload}/>
      {isDeleteConfirmationOpen && (<DeleteRumus onClose={() => setDeleteConfirmationOpen(false)} onConfirm={handleDeleteConfirm}/>)}
      {isUpdateOpen && (
        <UpdateRumus
          selectedData={selectedData}
          isOpen={isUpdateOpen}
          onClose={() => setUpdateOpen(false)}
          rows={rows}
          selectedRowIndex={selectedRowIndex}
          setRows={setRows}
          fetchData={fetchData}
        />
      )}
      </div>
     </Modal>
  );
};

export default SettingRumusPayroll;
