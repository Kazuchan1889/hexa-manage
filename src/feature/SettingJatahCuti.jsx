import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from "axios";
import ip from "../ip";
import Swal from "sweetalert2";

const SettingJatahCuti = ({ isOpen, onClose }) => {
  const [jatahCutiMandiri, setJatahCutiMandiri] = useState("");
  const [jatahCutiBersama, setJatahCutiBersama] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleJatahCutiMandiriChange = (event) => {
    setJatahCutiMandiri(event.target.value);
  };

  const handleJatahCutiBersamaChange = (event) => {
    setJatahCutiBersama(event.target.value);
  };

  const handleSubmit = () => {

    const apiSettingJatahCuti = `${ip}/api/pengajuan/patch/jatahCuti`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    const data = {
      cutiMandiri: jatahCutiMandiri,
      cutiBersama: jatahCutiBersama,
    };

    axios.patch(apiSettingJatahCuti, data, config)
      .then((response) => {
        console.log("Berhasil mengirim data ke server:", response.data);
        onClose();

        // Tampilkan SweetAlert2 setelah sukses submit
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data has been submitted successfully!',
        });
      })
      .catch((error) => {
        console.error("Gagal mengirim data ke server:", error);

        // Tampilkan SweetAlert2 jika terjadi kesalahan
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to submit data. Please try again.',
        });
      });
  };

  return (
    <Modal open={isOpen || false} onClose={onClose}>
      <div
        className="w-2/5 h-2/6"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card className="h-full" style={{ overflowY: 'auto' }}>
          <CardContent>
            <div className="flex items-center justify-between">
              <Typography variant="h6">Setting Jatah Cuti</Typography>
              <Button
                size="small"
                variant="text"
                onClick={handleClose}
              >
                <CloseIcon className="text-gray-500" />
              </Button>
            </div>
            <div className="flex justify-between items-center space-x-1 my-5">
              <TextField
                label='Atur Jatah Cuti Mandiri'
                variant="outlined"
                type="number"
                fullWidth
                value={jatahCutiMandiri}
                onChange={handleJatahCutiMandiriChange}
              />
              <TextField
                label='Atur Jatah Cuti Bersama'
                variant="outlined"
                type="number"
                fullWidth
                value={jatahCutiBersama}
                onChange={handleJatahCutiBersamaChange}
              />
            </div>
            <div className="flex items-end justify-end my-2">
              <Button
                size="small"
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  )
}

export default SettingJatahCuti;
