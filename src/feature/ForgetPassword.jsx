import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import ip from "../ip";

function ForgetPassword(props) {
  const { isOpen, onClose } = props;
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleClose = () => {
    onClose();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(`${ip}/api/auth/generateotp`, {
        email,
      });

      if (response.data.bool === true) {
        setStep(2);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${ip}/api/auth/check/otp`, {
        otp: otp,
        email: email,
      });

      if (response.data.bool) {
        setStep(3);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleSaveNewPassword = async () => {
    try {
      const response = await axios.post(`${ip}/api/auth/changepass/otp`, {
        email: email,
        changepass: newPassword,
        confirmpass: confirmNewPassword,
      });

      if (response.data.bool === true) {
        // Password change successful, show a success alert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Password changed successfully!",
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        });
        handleClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        });
      }
    } catch (error) {
      console.error("Error saving new password:", error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      disableBackdropClick
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="bg-white h-1/4 w-1/4 flex justify-center items-center border rounded-lg"
        style={{
          background: "white",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {step === 1 && (
          <div className="flex flex-col justify-center z-40">
            <TextField
              size="small"
              id="email"
              value={email}
              onChange={handleEmailChange}
              label="Email"
              variant="outlined"
              fullWidth
            />

            <Button
              size="small"
              variant="contained"
              onClick={handleSendOtp}
              style={{ marginTop: 8 }}
            >
              Send OTP
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col justify-center z-40">
            <TextField
              size="small"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              label="OTP"
              variant="outlined"
              fullWidth
            />
            <Button
              size="small"
              variant="contained"
              onClick={handleResetPassword}
              style={{ marginTop: 8 }}
            >
              Verify OTP
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col justify-center my-5 mx-10 z-40">
            <TextField
              size="small"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
            />
            <TextField
              size="small"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              label="Confirm New Password"
              variant="outlined"
              fullWidth
              type="password"
              style={{ marginTop: 8 }}
            />
            <Button
              size="small"
              variant="contained"
              onClick={handleSaveNewPassword}
              style={{ marginTop: 8 }}
            >
              Save New Password
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ForgetPassword;
