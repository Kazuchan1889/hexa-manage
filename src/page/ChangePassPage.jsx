import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Swal from "sweetalert2";
import ip from "../ip";

function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);

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
      const response = await axios.post(`${ip}/api/auth/generateotp`, { email });

      if (response.data.bool === true) {
        setStep(2);
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: "Please check your email for the OTP.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${ip}/api/auth/check/otp`, {
        otp,
        email,
      });

      if (response.data.bool) {
        setStep(3);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleSaveNewPassword = async () => {
    try {
      console.log("Sending request to change password with data:", {
        email,
        newPassword,
        confirmNewPassword,
      });

      const response = await axios.post(`${ip}/api/auth/changepass/otp`, {
        email,
        changepass: newPassword,
        confirmpass: confirmNewPassword,
      });

      console.log("Password change response:", response.data);

      if (response.data.bool === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password changed successfully!",
        });
        window.location.href = "/"; // Redirect to login page or any other page
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error saving new password:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-[24px] font-bold text-[#204682] mb-2 text-left">Change Password</h2>
        <p className="text-[16px] text-black mb-6 text-left">Enter the email associated with your account</p>
        {step === 1 && (
          <div className="space-y-6">
            <TextField
              size="small"
              id="email"
              value={email}
              onChange={handleEmailChange}
              label="Email"
              variant="outlined"
              fullWidth
              required
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 py-2 rounded-md"
            >
              Send OTP
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <TextField
              size="small"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              label="OTP"
              variant="outlined"
              fullWidth
              required
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleResetPassword}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 py-2 rounded-md"
            >
              Verify OTP
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <TextField
              size="small"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
              required
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              required
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleSaveNewPassword}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 py-2 rounded-md"
            >
              Save New Password
            </Button>
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500 text-center">
          Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>

  );
}

export default ChangePasswordPage;
