import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const DropdownButton = ({ onApproveSakit, onApproval, onReject, data }) => {
  const operation = localStorage.getItem("operation");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleApprove = () => {
    onApproval(data);
    setAnchorEl(null);
  };

  const handleApproveSakit = () => {
    onApproveSakit(data);
    setAnchorEl(null);
  };

  const handleReject = () => {
    onReject(data);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
//AL.J V3
  return (
    <div>
      <Button
        disabled={
          !operation.includes("UPDATE_IZIN") ||
          !operation.includes("UPDATE_CUTI") ||
          !operation.includes("UPDATE_REIMBURST")
        }
        aria-controls="dropdown-menu"
        size="small"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon className="text-gray-500" />
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleApprove(); // Panggil fungsi handleApprove saat Approve diklik
            handleClose(); // Tutup menu dropdown
          }}
        >
          <CheckIcon /> <p className="ml-2">Approve</p>
        </MenuItem>

        <MenuItem onClick={handleReject}>
          <CloseIcon /> <p className="ml-2">Reject</p>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DropdownButton;
