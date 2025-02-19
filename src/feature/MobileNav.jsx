import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from "@mui/icons-material/Payment";
import { Link } from "react-router-dom";

const MobileNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#204682" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left"  open={drawerOpen} onClose={toggleDrawer}>
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/laporan">
            <ListItemIcon><EventNoteIcon /></ListItemIcon>
            <ListItemText primary="Laporan Kegiatan" />
          </ListItem>
          <ListItem button component={Link} to="/OverUser">
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Overtime" />
          </ListItem>
          <ListItem button component={Link} to="/Form">
            <ListItemIcon><BeachAccessIcon /></ListItemIcon>
            <ListItemText primary="Time Off" />
          </ListItem>
          <ListItem button component={Link} to="/reimburst">
            <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
            <ListItemText primary="Reimburse" />
          </ListItem>
          <ListItem button component={Link} to="/resign">
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Resign" />
          </ListItem>
          <ListItem button component={Link} to="/payroll">
            <ListItemIcon><PaymentIcon /></ListItemIcon>
            <ListItemText primary="Payroll" />
          </ListItem>
          <ListItem button component={Link} to="/AccountSetting">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={() => alert("Logout")}> {/* Gantilah dengan fungsi logout yang sesuai */}
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
