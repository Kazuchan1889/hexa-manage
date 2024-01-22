/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
// import TextField from "@mui/material/TextField";
// import SearchIcon from "@mui/icons-material/Search";
// import InputAdornment from "@mui/material/InputAdornment";
// import {
//   TableContainer,
//   TableCell,
//   TableRow,
//   Table,
//   TableBody,
// } from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";
import ip from "../ip";
import OperationSelection from "./OperationSelection";

const EditOperation = ({ data, onClose, fetchData }) => {
  const [chosenArray, setChosenArray] = useState([]);
  const [choiceArray, setChoiceArray] = useState([]);
  // const [searchValue, setSearchValue] = useState("");
  // const [searchValue2, setSearchValue2] = useState("");
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
  {
    // useEffect(() => {
    //   console.log(operation);
    //   console.log(chosenArray);
    // }, [operation]);
    // useEffect(() => {
    //   setChosenArray(
    //     operation.filter((item) => data.operation === item.operation)
    //   );
    // }, [operation]);
    // Add a new useEffect to filter initialChoices when chosenArray changes
    // useEffect(() => {
    //   const initialChoices = operation.map((item) => item.operation);
    //   const filteredChoices = initialChoices.filter(
    //     (item) => !chosenArray.includes(item)
    //   );
    //   setChoiceArray(filteredChoices);
    //   console.log(choiceArray, chosenArray);
    // }, [chosenArray, operation]);
    // const handleSearchChange1 = (e) => {
    //   setSearchValue(e.target.value);
    // };
    // const handleSearchChange2 = (e) => {
    //   setSearchValue2(e.target.value);
    // };
    // const filteredChoices = choiceArray.filter((choice) =>
    //   choice.toLowerCase().includes(searchValue.toLowerCase())
    // );
    // const filteredChosen = chosenArray.filter((chosen) =>
    //   chosen.toLowerCase().includes(searchValue2.toLowerCase())
    // );
    // const handleSelect = (choice) => {
    //   if (chosenArray.includes(choice)) {
    //     // Move the chosen item back to choiceArray
    //     const updatedChoices = [choice, ...choiceArray];
    //     const updatedChosen = chosenArray.filter((item) => item !== choice);
    //     setChoiceArray(updatedChoices);
    //     setChosenArray(updatedChosen);
    //   } else if (choiceArray.includes(choice)) {
    //     const updatedChosen = [choice, ...chosenArray];
    //     const updatedChoices = choiceArray.filter((item) => item !== choice);
    //     setChosenArray(updatedChosen);
    //     setChoiceArray(updatedChoices);
    //   }
    // };
  }
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
          <h2>Setting Operation</h2>
          <Button
            variant="text"
            startIcon={<CloseIcon className="text-gray-500" />}
            onClick={onClose}
          />
        </div>
        {/* <div className="flex mb-2">
            <div className="w-full md:w-1/2 pr-2">
              <TextField
                onChange={handleSearchChange1}
                label="Cari"
                variant="outlined"
                fullWidth
                style={{ marginBottom: "16px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon style={{ color: "black" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <div
                className="p-4 rounded-t-lg"
                style={{ backgroundColor: "#204684" }}
              >
                <p className="text-white font-semibold text-center">
                  Hak Yang Tersedia
                </p>
              </div>
              <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg max-h-[300px] overflow-auto">
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {filteredChoices &&
                        filteredChoices.map((choice, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">
                              <Button
                                onClick={() => handleSelect(choice)}
                                variant="text"
                                className="m-2 p-2 md:p-4 md:min-w-[150px] md:text-lg"
                              >
                                {choice}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <div className="w-full md:w-1/2 pl-2">
              <TextField
                onChange={handleSearchChange2}
                label="Cari"
                variant="outlined"
                fullWidth
                style={{ marginBottom: "16px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon style={{ color: "black" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <div
                className="p-4 rounded-t-lg"
                style={{ backgroundColor: "#204684" }}
              >
                <p className="text-white font-semibold text-center">
                  Hak Yang Didapat
                </p>
              </div>
              <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg max-h-[300px] overflow-auto">
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {filteredChosen &&
                        filteredChosen.map((chosen, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">
                              <Button
                                onClick={() => handleSelect(chosen)}
                                variant="text"
                                className="m-2 p-2 md:p-4 md:min-w-[150px] md:text-lg"
                              >
                                {chosen}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <Button
              size="small"
              style={{ backgroundColor: "#204684" }}
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div> */}
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
