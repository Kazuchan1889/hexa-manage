import React, { useEffect, useState } from "react";
import axios from "axios";
import ip from "../ip";
import Head from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";
import { Button, Menu, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const AbsensiPage = () => {
  const [absensiList, setAbsensiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportType, setReportType] = useState("approval");

  const headers = {
    Authorization: localStorage.getItem("accessToken"),
  };

  useEffect(() => {
    const fetchAbsensiList = async () => {
      try {
        const response = await axios.get(`${ip}/api/weekendabsensi/get/list`, { headers });
        setAbsensiList(response.data);
      } catch (error) {
        console.error("Error fetching absensi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbsensiList();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await axios.patch(`${ip}/api/weekendabsensi/patch/list/${id}`, { status }, { headers });
      setAbsensiList((prevList) =>
        prevList.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (error) {
      console.error("Error updating absensi status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ip}/api/weekendabsensi/delete/${id}`, { headers });
      setAbsensiList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting absensi:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleReportTypeChange = (type) => {
    setReportType(type);
    handleMenuClose();
  };

  const filteredAbsensi = reportType === "approval"
    ? absensiList.filter((item) => !item.status)
    : absensiList.filter((item) => item.status);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      <Sidebar />
      <div className="w-full min-h-screen bg-gray-100 overflow-auto">
        <Head />
        <div className="bg-[#11284E] text-white p-6 shadow-lg h-48 flex justify-between items-center px-10">
          <h1 className="text-2xl ml-20 font-bold text-center flex-1">Weekend absance</h1>
          <Button variant="outlined" onClick={handleMenuOpen} style={{ borderColor: "white", color: "white" }}>
            <Typography variant="button">{reportType === "approval" ? "Approval" : "History"}</Typography>
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleReportTypeChange("approval")}><p className="text-gray-500">Approval</p></MenuItem>
            <MenuItem onClick={() => handleReportTypeChange("history")}><p className="text-gray-500">History</p></MenuItem>
          </Menu>
        </div>
        <div className="rounded-lg overflow-y-auto -my-9 shadow-md mx-4">
          <TableContainer component={Paper} style={{ width: "100%" }}>
            <Table aria-label="simple table" size="small">
              <TableHead style={{ backgroundColor: "#FFFFFF" }}>
                <TableRow>
                  <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Name</p></TableCell>
                  <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Email</p></TableCell>
                  <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Date</p></TableCell>
                  <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Status</p></TableCell>
                  <TableCell align="center" className="w-[10%]"><p className="text-indigo font-semibold">Action</p></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAbsensi.length > 0 ? (
                  filteredAbsensi.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{item.nama}</TableCell>
                      <TableCell align="center">{item.email}</TableCell>
                      <TableCell align="center">{formatDate(item.date)}</TableCell>
                      <TableCell align="center">{item.status ? "Approved" : "Pending"}</TableCell>
                      <TableCell align="center">
                        {!item.status && (
                          <>
                            <Button onClick={() => handleApproval(item.id, true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Approve</Button>
                            <Button onClick={() => handleApproval(item.id, false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reject</Button>
                          </>
                        )}
                        <Button onClick={() => handleDelete(item.id)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <div className="py-60 text-gray-500 text-lg">There is no request now</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>

  );
};

export default AbsensiPage;
