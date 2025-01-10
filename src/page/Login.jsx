//AL.j v.3
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ip from "../ip";
import ForgetPassword from "../feature/ForgetPassword";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import loadingSlice from "../store/loadingSlice";
import Loading from "./Loading";
import { loadingAction } from "../store/store";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const navigate = useNavigate();
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const loading = useSelector((state => state.loading.isLoading))
  const dispatch = useDispatch();

  const toggleForgetPassword = () => {
    setShowForgetPassword(!showForgetPassword);
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    dispatch(loadingAction.startLoading(true));
    e.preventDefault();

    try {
        const response = await axios.post(`${ip}/api/auth/login`, {
            email,
            password,
        });

        console.log("Response Data:", response.data);

        const { accessToken, result, role, jabatan, operation, status } = response.data;

        if (accessToken) { // Ensure accessToken is valid
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("role", role);
            localStorage.setItem("result", result);
            localStorage.setItem("jabatan", jabatan);
            localStorage.setItem("operation", operation);
            localStorage.setItem("status", status);
            
            // Stop loading on success
            dispatch(loadingAction.startLoading(false));
            navigate("/dashboard");
        } else {
            throw new Error("No access token received");
        }
    } catch (error) {
        console.error("Login failed", error);
        dispatch(loadingAction.startLoading(false));
        // Show sweet alert on login failure
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Invalid username or password. Please try again.",
        });
        
        // Stop loading on error
        dispatch(loadingSlice.startLoading(false));
    }
};


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) {
    return <Loading />
  }

  return (
    <div className="lg:w-full w-screen h-screen bg-violet-100 flex flex-col lg:flex-row justify-center items-center rounded-md m-auto">
      <div className="absolute left-18 top-24 lg:left-5 lg:top-5">
        <img
          src="/logo-login.png"
          className="rounded-md h-14"
        ></img>
      </div>
      <div className="w-1/2">
        <div className="justify-center items-center flex flex-col">
          <p className="text-xl font-medium">Selamat Datang</p>
          <div className="flex-col mt-5">
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <div className="mb-2">
                    <TextField
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      label="Username/Email"
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="mb-2">
                    <TextField
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      label="Password"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={handleShowPasswordToggle}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        ),
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="flex justify-center mx-auto my-5">
                    <Button
                      style={{ width: "100%", backgroundColor: "#311B92" }}
                      type="submit"
                      variant="contained"
                    >
                      Log in
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </form>
            <Button onClick={toggleForgetPassword}>Forgot Password</Button>

            {showForgetPassword && (
              <div>
                <ForgetPassword
                  isOpen={showForgetPassword}
                  onClose={toggleForgetPassword}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        {!isMobile && (
          <img
            src="/login.png"
            className="rounded-md h-full"
            alt="Login"
          />
        )}
      </div>
    </div>
  );
}

export default Login;
