/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";
import ip from "../ip";
import OperationSelection from "./OperationSelection";

const EditOperation = ({ data, onClose, fetchData }) => {
  const [chosenArray, setChosenArray] = useState([]);
  const [operation, setOperation] = useState([]);

  const apiAddKaryawan = `${ip}/api/auth/operation`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  useEffect(() => {
    console.log(data.operation);
    const fetchOP = async () => {
      try {
        const response = await axios.get(apiAddKaryawan, config);
        // Berhasil menerima data dari server
        console.log(response.data);
        setOperation(response.data);
        setChosenArray(
          response.data.filter((item) =>
            data.operation.some((chosenOp) => chosenOp === item.operation)
          )
        );
      } catch (error) {
        // Tangani kesalahan jika permintaan gagal
        console.error("Error fetching data:", error);
      }
    };

    fetchOP();
  }, [apiAddKaryawan, data]);
  const handleSubmit = async () => {
    const apiSubmitOperation = `${ip}/api/karyawan/patch/${data.id}`;

    try {
      const newData = {
        operation: chosenArray.map((item) => item.operation),
      };

      const response = await axios.patch(apiSubmitOperation, newData, config);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data updated successfully!",
        });

        onClose();
        fetchData();
      }
    } catch (error) {
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error submitting data. Please try again.",
      });

      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl flex flex-col">
        <div className="flex justify-between mb-4">
          <h2>Operation Settings</h2>
          <Button
            variant="text"
            startIcon={<CloseIcon className="text-gray-500" />}
            onClick={onClose}
          />
        </div>
        <OperationSelection
          allOperation={operation}
          chosenOperation={chosenArray}
          btnFunction={handleSubmit}
          setSubmitValue={setChosenArray}
          isSubmit={true}
        ></OperationSelection>
      </div>
    </div>
  );
};

export default EditOperation;
