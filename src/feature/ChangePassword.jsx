import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import axios from "axios";
import ip from "../ip";
import Swal from "sweetalert2";
import ForgetPassword from "./ForgetPassword";

function PasswordResetDialog({ open, onClose }) {
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Reset the state when the modal is opened
    if (open) {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setResetPassword(false);
    }
  }, [open]);

  const handleAnswerCheck = (e) => {
    e.preventDefault();
    // Make an API request to check the answer
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };
    axios
      .post(`${ip}/api/auth/check/jawaban`, { password: password }, { headers })
      .then((response) => {
        console.log(response.data);
        if (response.data.bool == true) {
          // The answer is correct, allow password reset
          setResetPassword(true);
        } else {
          Swal.fire({
            icon: "error",
            title: "Password Salah!",
            text: response.data.message,
            customClass: {
              container: "z-30", // or any value that ensures it's in front of everything
            },
          });
        }
      })
      .catch((error) => {
        console.log("Error Response Data:", error.response.data);
        console.error(error);
        // Handle the error or show an error message to the user
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.data.message,
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        });
      });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: localStorage.getItem("accessToken"),
      };
      // Make an API request to save the new password
      const response = await axios.post(
        `${ip}/api/auth/changepass/inside`,
        {
          changepass: newPassword,
          confirmpass: confirmPassword,
        },
        { headers }
      );

      if (response.data.bool === true) {
        Swal.fire({
          icon: "success",
          title: "Password berhasil diubah!",
          text: response.data.message,
          customClass: {
            container: "z-30", // or any value that ensures it's in front of everything
          },
        });
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Password Tidak Sama!",
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
//AL.J V3
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="mb-4">Change Password</DialogTitle>
      <DialogContent>
        {!resetPassword ? (
          <div className="flex flex-col">
            {/* Security Question */}
            <div className="mb-3">
              <Typography variant="body2">Masukkan password anda</Typography>
            </div>
            <div className="mb-3">
              <TextField
                size="small"
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleAnswerCheck}
            >
              Submit Answer
            </Button>
          </div>
        ) : (
          <div>
            {/* Password Reset Form */}
            <div className="mb-3">
              <TextField
                label="New Password"
                size="small"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <TextField
                label="Confirm Password"
                size="small"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              size="small"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handlePasswordReset}
            >
              Submit Answer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PasswordResetDialog;
