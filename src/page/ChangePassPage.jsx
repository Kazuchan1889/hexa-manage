import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import ip from "../ip";
import Swal from "sweetalert2";

function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, setResetPassword] = useState(false);

  useEffect(() => {
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setResetPassword(false);
  }, []);

  const handleAnswerCheck = (e) => {
    e.preventDefault();
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };
    axios
      .post(`${ip}/api/auth/check/jawaban`, { password: password }, { headers })
      .then((response) => {
        if (response.data.bool === true) {
          setResetPassword(true);
        } else {
          Swal.fire({
            icon: "error",
            title: "Password Salah!",
            text: response.data.message,
            customClass: {
              container: "z-30",
            },
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response.data.message,
          customClass: {
            container: "z-30",
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
            container: "z-30",
          },
        }).then(() => {
          // Redirect to login page after success message
          window.location.href = "/*"; // Replace with your login page URL
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Password Tidak Sama!",
          text: response.data.message,
          customClass: {
            container: "z-30",
          },
        });
      }
    } catch (error) {
      console.error("Error saving new password:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Change Password</h2>
        <form className="space-y-6">
          <div>
            <TextField
              label={!resetPassword ? "Current Password" : "New Password"}
              type="password"
              value={!resetPassword ? password : newPassword}
              onChange={(e) => !resetPassword ? setPassword(e.target.value) : setNewPassword(e.target.value)}
              fullWidth
              required
              className="mb-4"
            />
          </div>
          {!resetPassword ? (
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full bg-blue-500 text-white"
                onClick={handleAnswerCheck}
              >
                Submit
              </Button>
            </div>
          ) : (
            <>
              <div>
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  className="mb-4"
                />
              </div>
              <div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="w-full bg-blue-500 text-white"
                  onClick={handlePasswordReset}
                >
                  Reset Password
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
