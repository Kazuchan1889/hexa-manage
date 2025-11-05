import React, { useState, useRef } from 'react';
import { Button, Menu, MenuItem, Modal, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, IconButton, Popper, Grow, MenuList, ClickAwayListener } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import * as XLSX from 'xlsx'; // Import XLSX to handle Excel file reading
import { Link } from 'react-router-dom';
import NavbarUser from "../feature/MobileNav";
import Sidebar from "../feature/Sidebar";

const TableAbsen = () => {
  const [rows, setRows] = useState([]); // State to store rows for the table
  const [isMobile, setIsMobile] = useState(false); // Mocked as false to simulate desktop view
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reportType, setReportType] = useState('approval');
  const [date, setDate] = useState("2023-10-17"); // Example current date
  const [hour, setHour] = useState(10); // Example current hour
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const anchorRef = useRef(null);

  // Handle file upload
  const handleImportExcel = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls"; // Specify file types accepted
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        readExcelFile(file); // Process the file once selected
      }
    };
    input.click();
  };

  // Read and parse the Excel file
  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Assuming the first sheet contains the relevant data
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Parse the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Clean and map data before setting it to state
      const updatedRows = jsonData.map((row) => ({
        Name: row.Name,
        First: row['First  attendance'] || "No data",  // Handle column name with extra space
        Last: row['Last attendance'] || "No data",  // Handle column name with space
        Date: row.Date,
        Status: row["Be late"] || row["Leave early"] || "On Time", // Handle missing status
      }));
      setRows(updatedRows); // Set the parsed rows to state
    };
    reader.readAsBinaryString(file); // Read the file as binary string
  };

  const filteredRows = rows; // Using the rows state as the table data

  // Handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSearchChange = (event) => setSearch(event.target.value);
  const handleSearch = () => console.log("Search triggered:", search);
  const handleExcel = () => handleImportExcel(); // Trigger Excel file import when clicked
  const handleReportTypeChange = (type) => setReportType(type);
  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleCloseModal = () => setOpen(false);

  const handleClickr = () => {
    console.log("Notifications Clicked");
  };
  const handleToggle = () => {
    setMenuOpen((prev) => !prev);
    setIsRotating((prev) => !prev);
  };
  const handleCloseA = () => {
    setMenuOpen(false);
  };
  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setMenuOpen(false);
    }
  };
  const handleLogout = () => {
    console.log("Logout");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {/* Sidebar or NavbarUser */}
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-auto">
        
        {/* Container 1 */}
        <div className="bg-[#11284E] text-white p-6 shadow-lg h-72">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-bold">{date}</p>
              {hour !== null && <p className="text-sm">Current hour: {hour} o'clock</p>}
            </div>

            <div className="flex items-center space-x-4">
              <IconButton onClick={handleClickr}>
                <NotificationsIcon className="w-6 h-6 text-white cursor-pointer" />
              </IconButton>
              <IconButton ref={anchorRef} aria-controls={menuOpen ? "menu-list-grow" : undefined} aria-haspopup="true" onClick={handleToggle}>
                <SettingsIcon className={`w-6 h-6 text-white cursor-pointer transform transition-transform duration-300 ${isRotating ? "rotate-180" : ""}`} />
              </IconButton>
              <Popper open={menuOpen} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 1 }}>
                {({ TransitionProps, placement }) => (
                  <Grow {...TransitionProps} style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}>
                    <Paper className="mr-3">
                      <ClickAwayListener onClickAway={handleCloseA}>
                        <MenuList autoFocusItem={menuOpen} id="menu-list-grow" onKeyDown={handleListKeyDown} className="outline-none">
                          <MenuItem component={Link} to="/accountsetting" className="px-4 py-2">
                            <Typography variant="button">Settings</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleLogout} className="px-4 py-2">
                            <Typography variant="button">Logout</Typography>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
            
          </div>
          {/* Center Content */}
        <div className="text-center mt-6">
          <h1 className="text-2xl font-bold">Attendance Data</h1>
          <div className="mt-4 flex justify-center items-center space-x-4">
            {/* Button with Dots */}
            <button
              className={`p-2 bg-white rounded-full shadow flex items-center  ${isMobile ? 'w-9 h-9' : 'w-9 h-9'}`}
              onClick={handleMenuOpen}
            >
              <MoreHorizIcon className={`text-[#11284E] -ml-0 flex ${isMobile ? 'w-[1.64px] h-[13.64px]' : 'w-6 h-6'}`} />
            </button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleSearch} onClose={handleMenuClose}>
                <SettingsIcon className="text-gray-500" style={{ marginRight: "8px" }} />
                Setting Attendance Hours
              </MenuItem>
              <MenuItem onClick={handleSearch} onClose={handleMenuClose}>
                <CalendarMonthIcon className="text-gray-500" style={{ marginRight: "8px" }} />
                Setting Holiday Dates
              </MenuItem>
            </Menu>

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
            <button
              className={`p-2 bg-white rounded-full shadow ${isMobile ? 'w-9 h-9' : 'w-9 h-9'}`}
              onClick={handleExcel}
            >
              <InsertDriveFileIcon className={`text-[#11284E] mb-8 items-center ${isMobile ? 'w-[18px] h-[18px]' : 'w-6 h-6'}`} />
            </button>
          </div>
        </div>

        </div>

        
        {/* Table to display the data */}
        <TableContainer component={Paper}>
          <Table aria-label="simple table" size="small">
            <TableHead style={{ backgroundColor: "#FFFFFF" }}>
              <TableRow className="h-16">
                <TableCell align="center">
                  <p className="text-indigo font-semibold">Name</p>
                </TableCell>
                <TableCell align="center">
                  <p className="text-indigo font-semibold">Clock In</p>
                </TableCell>
                <TableCell align="center">
                  <p className="text-indigo font-semibold">Clock Out</p>
                </TableCell>
                <TableCell align="center">
                  <p className="text-indigo font-semibold">Date</p>
                </TableCell>
                <TableCell align="center">
                  <p className="text-indigo font-semibold">Status</p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Map through the rows and display data */}
              {filteredRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.Name}</TableCell>
                  <TableCell align="center">{row.First}</TableCell> {/* First Attendance */}
                  <TableCell align="center">{row.Last}</TableCell> {/* Last Attendance */}
                  <TableCell align="center">{row.Date}</TableCell>
                  <TableCell align="center">{row.Status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md">
          <Typography variant="h6" className="text-center font-bold">Detail Information</Typography>
          {selectedRow && (
            <div className="flex flex-col space-y-2 mt-4">
              <p><strong>Name:</strong> {selectedRow.Name}</p>
              <p><strong>Start Date:</strong> {selectedRow.Date}</p>
              <p><strong>Detail:</strong> {selectedRow.Status}</p>
            </div>
          )}
          <Button fullWidth variant="contained" color="primary" className="mt-4" onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TableAbsen;
