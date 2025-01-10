// AuthInterceptor.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { loadingAction } from "../store/store";

const AuthInterceptor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Add your Axios interceptors to check for a 403 response.
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          // Use SweetAlert to display a user-friendly alert
          Swal.fire({
            title: "Access Denied",
            text: "Your access token is expired. Please log in again.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            // Redirect to the login page if a 403 response is received
            navigate("/");
          });
        }
        dispatch(loadingAction.startLoading(false))
        return Promise.reject(error);
      }
    );
//AL.J V3
    return () => {
      // Remove the interceptor when the component unmounts to prevent memory leaks.
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // You can also return null or an empty fragment if you don't want any visible content from this component.
  return null;
};

export default AuthInterceptor;
