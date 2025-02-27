import React, { useState, useEffect, useRef } from "react";
import {
  AppBar, Toolbar, IconButton, Drawer, List, Popper, Paper, ClickAwayListener, MenuList, MenuItem, Typography, ListItem, ListItemIcon, ListItemText, Box
} from "@mui/material";
import { ExpandMore, Notifications as NotificationsIcon, Settings as SettingsIcon } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PaymentIcon from "@mui/icons-material/Payment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Collapse } from "@mui/material";
import ip from "../ip";

const MobileNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [uniqueIdkCount, setUniqueIdkCount] = useState(0);
  const [cutiCount, setCutiCount] = useState(0);
  const [izinCount, setIzinCount] = useState(0);
  const anchorRef = useRef(null);
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);
  const isUserAdmin = localStorage.getItem("role") === "admin";

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickNotification = () => {
    navigate('/aptes');
  };

  const handleToggleDropdown = (event) => {
    setMenuDropdownOpen((prev) => !prev);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setMenuDropdownOpen(false);
  };

  const toggleMasterMenu = () => {
    setMasterMenuOpen(!masterMenuOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        const absensiResponse = await axios.get(`${ip}/api/weekendabsensi/get/list`, { headers });
        const filteredAbsensiData = absensiResponse.data.filter(item => item.status !== true);
        const uniqueNames = new Set(filteredAbsensiData.map((item) => item.nama));
        setUniqueIdkCount(uniqueNames.size);

        const cutiResponse = await axios.get(`${ip}/api/pengajuan/get/cuti/self`, { headers });
        const cutiData = cutiResponse.data.filter(item => item.status === null);
        setCutiCount(cutiData.length);

        const izinResponse = await axios.get(`${ip}/api/pengajuan/get/izin/self`, { headers });
        const izinData = izinResponse.data.filter(item => item.status === null);
        setIzinCount(izinData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    

    fetchData();
  }, []);


  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#204682" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={handleClickNotification} className="relative">
            <NotificationsIcon className="w-6 h-6 text-white cursor-pointer" />
            {(uniqueIdkCount + cutiCount + izinCount) > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-sm w-4 h-4 flex items-center justify-center">
                {uniqueIdkCount + cutiCount + izinCount}
              </span>
            )}
          </IconButton>
          <IconButton ref={anchorRef} onClick={handleToggleDropdown}>
            <SettingsIcon className="w-6 h-6 text-white cursor-pointer" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer} PaperProps={{ style: { backgroundColor: "#204682" } }}>
        <List>
          <ListItem button component={Link} to="/dashboard" style={{ color: "white" }}>
            <ListItemIcon style={{ color: "white" }}><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button onClick={toggleMenu} style={{ color: "white" }}>
            <ListItemIcon style={{ color: "white" }}><InventoryIcon /></ListItemIcon>
            <ListItemText primary="Form" />
            <ExpandMore style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s", color: "white" }} />
          </ListItem>
          <Collapse in={menuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {["/laporan", "/OverUser", "/Form", "/reimburst", "/resign", "/payroll"].map((path, index) => {
                const labels = [
                  "Laporan Kegiatan", "Overtime", "Time Off", "Reimburse", "Resign", "Payroll"
                ];
                const icons = [
                  <EventNoteIcon fontSize="small" />, <AssignmentIcon fontSize="small" />,
                  <BeachAccessIcon fontSize="small" />, <AttachMoneyIcon fontSize="small" />,
                  <ExitToAppIcon fontSize="small" />, <PaymentIcon fontSize="small" />
                ];
                const isSelected = location.pathname === path;
                return (
                  <ListItem
                    button
                    component={Link}
                    to={path}
                    key={path}
                    style={{
                      paddingLeft: 32,
                      color: isSelected ? "#204682" : "white",
                      backgroundColor: isSelected ? "#D9D9D9" : "transparent",
                      transition: "0.3s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#D9D9D9";
                      e.currentTarget.style.color = "#204682";
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "white";
                      }
                    }}
                  >
                    <ListItemIcon style={{ minWidth: 30, color: isSelected ? "#204682" : "white" }}>
                      {icons[index]}
                    </ListItemIcon>
                    <ListItemText primary={labels[index]} primaryTypographyProps={{ fontSize: "0.875rem" }} />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
          {isUserAdmin && (
            <>
              <ListItem button onClick={toggleMasterMenu} style={{ color: "white" }}>
                <ListItemIcon style={{ color: "white" }}><InventoryIcon /></ListItemIcon>
                <ListItemText primary="Master Menu" />
                <ExpandMore style={{ transform: masterMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s", color: "white" }} />
              </ListItem>
              <Collapse in={masterMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {[
                    { id: 31, label: "Attendance", path: "/masterabsen" },
                    { id: 32, label: "Permit", path: "/masterizin" },
                    { id: 33, label: "Time Off", path: "/mastercuti" },
                    { id: 34, label: "Reimburse", path: "/masterreimburst" },
                    { id: 35, label: "Resign", path: "/masterresign" },
                    { id: 36, label: "Report", path: "/masterlaporan" },
                    { id: 37, label: "Geotech", path: "/geotech" },
                    { id: 38, label: "Overtime", path: "/Over" },
                  ].map((item) => (
                    <ListItem button component={Link} to={item.path} key={item.id} style={{ paddingLeft: 32, color: "white" }}>
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "0.875rem" }} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          )}

          <ListItem button component={Link} to="/AccountSetting" style={{ color: "white" }}>
            <ListItemIcon style={{ color: "white" }}><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={() => alert("Logout")} style={{ color: "white" }}>
            <ListItemIcon style={{ color: "white" }}><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Popper open={menuDropdownOpen} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement="bottom-end">
        <Paper>
          <ClickAwayListener onClickAway={handleCloseDropdown}>
            <MenuList autoFocusItem={menuDropdownOpen}>
              <MenuItem component={Link} to="/accountsetting" onClick={handleCloseDropdown}>
                <Typography variant="button">Settings</Typography>
              </MenuItem>
              <MenuItem onClick={() => { localStorage.removeItem("accessToken"); navigate("/"); }}>
                <Typography variant="button">Logout</Typography>
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
};

export default MobileNavbar;
