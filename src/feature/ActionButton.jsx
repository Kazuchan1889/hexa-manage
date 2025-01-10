/* eslint-disable react/prop-types */
import Button from "@mui/material/Button";
import { Check, Close } from "@mui/icons-material";
import Swal from "sweetalert2";

const ActionButton = ({ onAccept, onReject, onSakit, tipe, data, string }) => {
  const handleIsAccept = async (bool) => {
    if (bool) {
      if (tipe === "izin") {
        await Swal.fire({
          icon: "question",
          title: "Apakah izin bukan karena Sakit??",
          showDenyButton: true,
          confirmButtonText: "Bukan",
          denyButtonText: `Sakit`,
        }).then((result) => {
          if (result.isConfirmed) {
            handleIsSakit(false);
          } else if (result.isDenied) {
            handleIsSakit(true);
          }
        });
      } else if (tipe === "nonIzin") {
        handleIsSakit(false);
      }
    } else {
      await Swal.fire({
        icon: "question",
        title: `Apakah ingin menolak ${string}`,
        showCancelButton: true,
        confirmButtonText: "Accept",
      }).then((result) => {
        if (result.isConfirmed) {
          onReject(data);
        }
      });
    }
  };

  const handleIsSakit = async (bool) => {
    if (bool) {
      await Swal.fire({
        icon: "question",
        title: `Apakah ingin Menerima ${tipe} sakit`,
        showCancelButton: true,
        confirmButtonText: "Accept",
      }).then((result) => {
        if (result.isConfirmed) {
          onSakit(data);
        }
      });
    } else {
      await Swal.fire({
        icon: "question",
        title: `Apakah ingin Menerima ${string}`,
        showCancelButton: true,
        confirmButtonText: "Accept",
      }).then((result) => {
        if (result.isConfirmed) {
          onAccept(data);
        }
      });
    }
  };
  //AL.J V3
  return (
    <div className="flex justify-around">
      <Button
        variant="contained"
        size="small"
        onClick={() => handleIsAccept(true)}
        style={{ backgroundColor: "#22c55e" }}
      >
        <Check fontSize="20px" />
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={() => handleIsAccept(false)}
        style={{ backgroundColor: "#ef4444" }}
      >
        <Close fontSize="30px" />
      </Button>
    </div>
  );
};

export default ActionButton;
