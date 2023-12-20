import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import ip from "../ip";
import Swal from "sweetalert2";
import KaryawanCheckBox from "./KaryawanCheckBox";

const SettingJadwalCuti = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [step, setStep] = useState(0);
  const [batchId, setBatchId] = useState([]);

  const max = 1;
  const handleStep = (index) => {
    if (index <= max) setStep(index);
    else handleSubmit();
  };

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
  };

  const handleSubmit = () => {
    const apiSettingJadwalCuti = `${ip}/api/pengajuan/post/cuti/bersama`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    const data = {
      mulai: startDate,
      selesai: endDate,
      batchId: batchId,
    };

    axios
      .post(apiSettingJadwalCuti, data, config)
      .then((response) => {
        console.log("Berhasil mengirim data ke server:", response.data);
        onClose();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been submitted successfully!",
        });
      })
      .catch((error) => {
        console.error("Gagal mengirim data ke server:", error);

        // Tampilkan SweetAlert2 jika terjadi kesalahan
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit data. Please try again.",
        });
      });
    handleClose();
  };

  return (
    <Modal open={isOpen || false} onClose={handleClose}>
      <div
        className="w-2/5 h-96"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card className="h-full" style={{ overflowY: "auto" }}>
          <CardContent className="h-full">
            <div className="flex items-start justify-between h-1/6">
              <Typography variant="h6">Setting Jadwal Cuti bersama</Typography>
              {/* <Button size="small" variant="text" onClick={handleClose}>
                <CloseIcon className="text-gray-500" />
              </Button> */}
            </div>
            <div className="flex flex-col h-5/6 justify-between">
              {step === 0 && (
                <div className="h-4/5 overflow-auto">
                  <KaryawanCheckBox
                    batchId={batchId}
                    setBatchId={setBatchId}
                  ></KaryawanCheckBox>
                </div>
              )}
              {step === 1 && (
                <div className="flex justify-between w-full h-9/10">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              )}
              <div className="my-2 flex items-end justify-end space-x-2 h-1/10">
                {step !== 0 && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                {step !== max && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleStep(step + 1)}
                  >
                    Next
                  </Button>
                )}
                {step === max && (
                  <Button
                    variant="contained"
                    size="small"
                    disabled={false}
                    onClick={() => handleSubmit()}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
};

export default SettingJadwalCuti;
