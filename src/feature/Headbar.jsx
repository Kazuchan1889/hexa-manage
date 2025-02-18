import React, { useState, useEffect, useRef } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SettingHoliday from "../feature/SettingHoliday";
import PatchStatus from "../feature/PatchStatus";
import ActionButton from "../feature/ActionButton";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from 'axios';
import ip from "../ip";
import { Link, useNavigate } from "react-router-dom";
import {
  ClickAwayListener,
  IconButton,
  MenuList,
  Popper,
  Typography,
  Grow,
} from "@mui/material";



const Headb = () => {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTimeSettingOpen, setIsTimeSettingOpen] = useState(false);
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [timeMasuk, setTimeMasuk] = useState(null);
  const [timeKeluar, setTimeKeluar] = useState(null);
  const [selectedToleransi, setSelectedToleransi] = useState(null);
  const operation = localStorage.getItem("operation");
  const apiURLAbsenKaryawan = `${ip}/api/absensi/get/data/dated`;
  const apiURLSettingJam = `${ip}/api/absensi/update/seting`;
  const currentDay = new Date().getDay(); // 0 untuk Minggu, 1 untuk Senin, dst.
  const [openModal, setOpenModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [isRotating, setIsRotating] = useState(false);
  const [uniqueIdkCount, setUniqueIdkCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [cutiCount, setCutiCount] = useState(0);
  const [izinCount, setIzinCount] = useState(0);



  // Periksa apakah hari ini adalah Sabtu (6) atau Minggu (0)
  const isWeekend = currentDay === 6 || currentDay === 0;

  const requestBody1 = {
    date: selectedDate,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          apiURLAbsenKaryawan,
          requestBody1,
          config
        );
        // console.log('Response Data:', response.data);
        setRows(response.data);
        setOriginalRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchTime = async () => {
      const url = `${ip}/api/absensi/get/time`;
      try {
        const response = await axios.get(url, config);
        console.log(response.data);
        setTimeMasuk(new Date());
        setTimeKeluar(
          `${response.data.keluar.jam}:${response.data.keluar.menit}`
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // fetchTime();
    fetchData(); // Call the function when the component mounts
  }, [selectedDate]);

  const handleOpenDateFilter = () => {
    setIsDateFilterOpen(true);
  };

  const handleCloseDateFilter = () => {
    setIsDateFilterOpen(false);
  };

  const handleDateFilterChange = (date) => {
    setSelectedDate(date);
    setIsDateFilterOpen(false);
    setPage(0);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setMenuOpen(false);
    setIsRotating(false); // Reset rotasi
  };

  const openTimeSetting = () => {
    setIsTimeSettingOpen(true);
    handleClose();
  };

  const openHolidaySetting = () => {
    setIsHolidayOpen(true);
    handleClose();
  };

  const closeHolidaySetting = () => {
    setIsHolidayOpen(false);
  };

  const handleTimeChange = (newVal, bool) => {
    console.log(newVal, bool);
    if (bool) {
      setTimeMasuk(newVal);
    } else setTimeKeluar(newVal);
  };

  const handleToleransiChange = (newTime) => {
    setSelectedToleransi(newTime);
  };

  const handleTimeSave = () => {
    handleTimeChange(timeMasuk, true);
    handleTimeChange(timeKeluar, false);
    handleToleransiChange(selectedToleransi);
    console.log(timeMasuk, timeKeluar, selectedToleransi);
    const requestBody2 = {
      masuk: {
        jam: timeMasuk ? timeMasuk.$H : null,
        menit: timeMasuk ? timeMasuk.$m : null,
        toleransi: selectedToleransi ?? null,
      },
      keluar: {
        jam: timeKeluar ? timeKeluar.$H : null,
        menit: timeKeluar ? timeKeluar.$m : null,
      },
    };
    console.log(requestBody2);
    axios
      .post(apiURLSettingJam, requestBody2, config)
      .then((response) => {
        // console.log('Response Data:', response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    closeTimeSetting();
    handleClose();
  };

  const closeTimeSetting = () => {
    setIsTimeSettingOpen(false);
    handleClose();
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };





  useEffect(() => {
    // Get the server time using your existing method or API if needed
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric", // Added the year to the format
    });
    const currentHour = new Date().getHours();

    setDate(currentDate); // Set the formatted date
    setHour(currentHour); // Set the current hour
  }, []);

  const handleToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
    setIsRotating((prevRotating) => !prevRotating);
  };


  const handleLogout = () => {
    // Hapus token atau proses logout lainnya
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setMenuOpen(false);
    }
  };

  const handleClickr = () => {
    navigate('/aptes');
  };
//buat itung merah auo uo
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: localStorage.getItem("accessToken"),
      };

      console.log("Fetching data with headers:", headers);

      // Fetch Absensi data
      const absensiResponse = await axios.get(`${ip}/api/weekendabsensi/get/list`, { headers });
      console.log("Response from absensi list:", absensiResponse.data);

      // Filter data with status not equal to "approve"
      const filteredAbsensiData = absensiResponse.data.filter(item => item.status !== true);
      const uniqueNames = new Set(filteredAbsensiData.map((item) => item.nama));
      console.log("Unique nama count (excluding approve):", uniqueNames.size);

      setUniqueIdkCount(uniqueNames.size); // Set the unique count to state

      // Fetch Cuti and Izin data
      const cutiResponse = await axios.get(`${ip}/api/pengajuan/get/cuti/self`, { headers });
      const cutiData = cutiResponse.data.filter(item => item.status === null);
      setCutiCount(cutiData.length); // Set the count for Cuti

      const izinResponse = await axios.get(`${ip}/api/pengajuan/get/izin/self`, { headers });
      const izinData = izinResponse.data.filter(item => item.status === null);
      setIzinCount(izinData.length); // Set the count for Izin

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading state to false once data is fetched
    }
  };

  // Fetch all data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) return null; // Menyembunyikan komponen jika isMobile true

  console.log("Total unique nama count:", uniqueIdkCount);

  return (
    <div className="flex justify-between px-4 pt-2 items-center bg-[#11284E]">
      {/* Left Corner */}
      <div className="text-white">
        <p className="text-md ">{date}</p>
        {/* {hour !== null && (
              <p className="text-sm">Current hour: {hour} o'clock</p>
            )} */}
      </div>

      <div className="flex items-center">
        {/* Notification Icon */}
        <IconButton onClick={handleClickr} className="relative">
          <NotificationsIcon className="w-6 h-6 text-white cursor-pointer" />
          {uniqueIdkCount + cutiCount + izinCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-sm w-4 h-4 flex items-center justify-center">
              {uniqueIdkCount + cutiCount + izinCount}
            </span>
          )}
        </IconButton>

        {/* Settings Dropdown */}

        <IconButton
          ref={anchorRef}
          aria-controls={menuOpen ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <SettingsIcon
            className={`w-6 h-6 text-white cursor-pointer transform transition-transform duration-300 ${isRotating ? "rotate-180" : ""
              }`}
          />
        </IconButton>

        {/* Dropdown Menu */}
        <Popper
          open={menuOpen}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          style={{ zIndex: 1 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper className="mr-3">
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={menuOpen}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                    className="outline-none"

                  >
                    <MenuItem
                      component={Link}
                      to="/accountsetting"
                      className="px-4 py-2"
                    >
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
  );
};



export default Headb;