import React from "react";
import { Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function BubbleMenu({ isBubbleOpen, toggleBubble }) {
  return (
    <div className={`fixed bottom-5 right-10 p-3 z-50 duration-0 ${isBubbleOpen ? "bg-blue-500 rounded-lg w-40 min-h-24" : "bg-blue-500 flex rounded-full items-center justify-center"}`}>
        <IconButton onClick={() => setIsBubbleOpen(!isBubbleOpen)}>
          {isBubbleOpen ? <CloseIcon style={{ color: "white" }} /> : <MenuIcon style={{ color: "white" }} />}
        </IconButton>
        {isBubbleOpen && (
          <div className="flex flex-col gap-2 mt-2 p-3 rounded-lg">
            
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/masterlaporan"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              Laporan Karyawan
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/companyfile"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              File
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/Asset"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              Asset
            </Button>
            
          </div>
        )}
      </div>
  );
}

export default BubbleMenu;
