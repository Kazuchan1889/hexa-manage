/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import {
  TableContainer,
  TableCell,
  TableRow,
  Table,
  TableBody,
} from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";
import ip from "../ip";
import OperationSelection from "./OperationSelection";
import Autocomplete from '@mui/material/Autocomplete';

const API_URL = `${ip}/api/role`;
const TambahKaryawan = ({ onClick, onClose, fetchData }) => {
  const [chosenArray, setChosenArray] = useState([]);
  // const [searchValue, setSearchValue] = useState("");
  // const [searchValue2, setSearchValue2] = useState("");
  const [step3Data, setStep3Data] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  // const [choiceArray, setChoiceArray] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    nik: "",
    npwp: "",
    level: "",
    role: "",
    status: "",
    salary: 0,
    divisi: "",
    lokasi: "",
  });

  const formatSalary = (salary) => {
    return `Rp ${salary.toLocaleString("id-ID")}`; // Format as Rupiah (Rp)
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const apiAddKaryawan = `${ip}/api/auth/operation`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  const [operation, setOperation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiAddKaryawan, config);
        // Berhasil menerima data dari server
        console.log(response.data);
        setOperation(response.data);
      } catch (error) {
        // Tangani kesalahan jika permintaan gagal
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // console.log(OperationSelection(operation, null));
  }, []);

  // {  const handleSearchChange1 = (e) => {
  //     setSearchValue(e.target.value);
  //   };

  //   const handleSearchChange2 = (e) => {
  //     setSearchValue2(e.target.value);
  //   };

  //   const filteredChoices = choiceArray.filter((choice) =>
  //     choice.toLowerCase().includes(searchValue.toLowerCase())
  //   );

  //   const filteredChosen = chosenArray.filter((chosen) =>
  //     chosen.toLowerCase().includes(searchValue2.toLowerCase())
  //   );

  //   const handleSelect = (choice) => {
  //     if (chosenArray.includes(choice)) {
  //       // Move the chosen item back to choiceArray
  //       const updatedChoices = [choice, ...choiceArray];
  //       const updatedChosen = chosenArray.filter((item) => item !== choice);
  //       setChoiceArray(updatedChoices);
  //       setChosenArray(updatedChosen);
  //     } else if (choiceArray.includes(choice)) {
  //       const updatedChosen = [choice, ...chosenArray];
  //       const updatedChoices = choiceArray.filter((item) => item !== choice);
  //       setChosenArray(updatedChosen);
  //       setChoiceArray(updatedChoices);
  //     }
  //   };
  //}
  const handleStep3 = () => {
    // Kumpulkan data pada step 3
    const censoredPassword = "*****";
    const formattedSalary = formatSalary(formData.salary);
    const step3Data = {
      Nama: formData.nama,
      Jabatan: formData.jabatan,
      Email: formData.email,
      Password: censoredPassword,
      Role: formData.role,
      Status: formData.status,
      Divisi: formData.divisi,
      Lokasi: formData.lokasikerja,
      NoTelp: formData.notelp,
      Salary: formattedSalary,
      Authority: chosenArray.map((item) => item.operation),
    };
    setStep3Data(step3Data);
    setActiveStep(3); // Move to step 3 after collecting data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "salary") {
      const salaryValue = parseFloat(value.replace(/\D/g, "")); // Remove non-numeric characters and parse as a float
      setFormData({
        ...formData,
        [name]: salaryValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeStep < 2) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      handleStep3();
      console.log("Data printed:", formData);
      onClose();
      const selectedRole = roles.find((r) => r.role === formData.role);
      const operations = selectedRole ? selectedRole.operation : [];
      const roleId = selectedRole ? selectedRole.id : null;
      const dataToSend = {
        nama: formData.nama,
        jabatan: formData.jabatan,
        email: formData.email,
        password: formData.password,
        nik: formData.nik,
        npwp: formData.npwp,
        dob: formData.dob,
        gender: formData.gender,
        level: formData.level,
        role: formData.role,
        status: formData.status,
        operation: operations,
        roleid: roleId,
        lokasikerja: formData.lokasikerja,
        divisi: formData.divisi,
        notelp: formData.notelp,
        gaji: formData.salary,
        // Tambahkan data lainnya yang perlu disimpan
      };

      try {
        const response = await axios.post(
          `${ip}/api/auth/register`,
          dataToSend,
          config
        );

        if (response.status === 200) {
          // Data berhasil disimpan
          console.log("Data berhasil disimpan");
          // Show success alert
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data created successfully!",
          });
        } else {
          // Data gagal disimpan
          console.error("Gagal menyimpan data");
          // Show error alert
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error creating data. Please try again.",
          });
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred. Please try again.",
        });
      }
      fetchData();
    }
  };




  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken") || "",
        },
      });
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }

  }
  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${ip}/api/geolocation/get/kantor/all`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });

      // Assume response.data contains the locations array
      const lokasiList = response.data.map((location) => location.lokasi); // Extract 'lokasi' field
      setLocations(lokasiList);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchLocations();


  const handleChange = (event, value) => {
    setFormData((prevData) => ({
      ...prevData,
      lokasikerja: value, // Update selected value
    }));
  };





  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-3 ml-40 rounded-lg flex flex-col w-full max-w-[1107px] h-[530px] md:w-[900px] md:h-[450px] sm:w-[700px] sm:h-[400px] xs:w-[90%] xs:h-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-black text-xl font-bold text-center ml-8 w-full">Add Employee</h2>
          <button
            onClick={onClose}
            className="text-red-500 p-2 rounded focus:outline-none hover:bg-red-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto">
          {activeStep === 1 && (
            <div>
              <div className="flex flex-col items-center">
                <div className="flex space-x-4 mb-5 max-w-4xl max-h-72 w-full justify-center">
                  <TextField
                    label="Nama"
                    variant="outlined"
                    fullWidth
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex max-w-4xl space-x-4 mb-5 w-full justify-center">
                  <TextField
                    label="Email"
                    variant="outlined"
                    style={{ width: "487px" }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    style={{ width: "487px" }}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleShowPasswordToggle}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      ),
                    }}
                  />
                </div>

                <div className="flex max-w-4xl space-x-4 mb-5 w-full justify-center">
                  <TextField
                    label="NIK"
                    variant="outlined"
                    style={{ width: "487px" }}
                    type="integer"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="NPWP"
                    variant="outlined"
                    style={{ width: "487px" }}
                    type="integer"
                    name="npwp"
                    value={formData.npwp}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex max-w-4xl space-x-4 mb-5 w-full justify-center">
                  <TextField
                    label="Level"
                    variant="outlined"
                    name="level"
                    style={{ width: "487px" }}
                    select
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="leader">Leader</MenuItem>
                    <MenuItem value="Head">Head</MenuItem>
                    <MenuItem value="Senior">Senior</MenuItem>
                    <MenuItem value="Staff">Staff</MenuItem>
                  </TextField>
                  <Autocomplete
                    options={locations}
                    loading={loading}
                    value={formData.lokasikerja}
                    style={{ width: "487px" }}
                    onChange={handleChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Lokasi Kerja"
                        variant="outlined"
                      />
                    )}
                  />
                </div>

                <div className="flex max-w-4xl space-x-4 mb-5 w-full justify-center">
                  <TextField
                    label="Role"
                    variant="outlined"
                    select
                    style={{ width: "487px" }}
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.role}>
                        {role.role}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Status"
                    variant="outlined"
                    select
                    style={{ width: "487px" }}
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="tetap">Tetap</MenuItem>
                    <MenuItem value="kontrak">Kontrak</MenuItem>
                    <MenuItem value="probation">Probation</MenuItem>
                    <MenuItem value="magang">Magang</MenuItem>
                  </TextField>
                </div>

                <div className="flex max-w-4xl space-x-4 mt-5 w-full justify-center">
                  <TextField
                    label="Divisi"
                    variant="outlined"
                    fullWidth
                    name="divisi"
                    value={formData.divisi}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Move Button below Divisi Input */}
                <div className="flex justify-center mt-4">
                  <Button
                    variant="contained"
                    size="small"
                    style={{
                      backgroundColor: "#204684",
                      borderRadius: "20px",
                      width: "136px",
                      height: "40px"
                    }}
                    onClick={handleStep3}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* {activeStep === 2 && (
            // <div>
            //   <div className="flex justify-center mt-1">
            //     <div
            //       className="w-full md:w-1/2"
            //       style={{ marginRight: "20px", minHeight: "300px" }}
            //     >
            //       <div className="flex justify-center mb-2">
            //         <TextField
            //           onChange={handleSearchChange1}
            //           label="Cari"
            //           variant="outlined"
            //           fullWidth
            //           style={{ marginTop: "10px", color: "black" }}
            //           InputProps={{
            //             style: { color: "black", padding: "0" },
            //             inputProps: {
            //               style: {
            //                 padding: "8px",
            //               },
            //             },
            //             endAdornment: (
            //               <InputAdornment position="end">
            //                 <SearchIcon
            //                   style={{ height: "20px", color: "black" }}
            //                 />
            //               </InputAdornment>
            //             ),
            //           }}
            //           InputLabelProps={{
            //             style: {
            //               paddingBottom: "25px",
            //               alignItems: "center",
            //               display: "flex",
            //               height: "100%",
            //             },
            //           }}
            //         />
            //       </div>
            //       <div
            //         className="p-4 rounded-t-lg"
            //         style={{ backgroundColor: "#204684" }}
            //       >
            //         <p className="text-white font-semibold text-center">
            //         </p>
            //       </div>
            //       <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg max-h-[300px] overflow-auto">
            //         <TableContainer>
            //           <Table size="small">
            //             <TableBody>
            //               {filteredChoices.map((choice, index) => (
            //                 <TableRow key={index}>
            //                   <TableCell align="center">
            //                     <Button
            //                       onClick={() => handleSelect(choice)}
            //                       variant="text"
            //                       className="m-2 p-2 md:p-4 md:min-w-[150px] md:text-lg"
            //                     >
            //                       {choice.replace("_", " ")}
            //                     </Button>
            //                   </TableCell>
            //                 </TableRow>
            //               ))}
            //             </TableBody>
            //           </Table>
            //         </TableContainer>
            //       </div>
            //     </div>
            //     <div className="w-full md:w-1/2 relative">
            //       <div className="flex justify-center mb-2">
            //         <TextField
            //           onChange={handleSearchChange2}
            //           label="Cari"
            //           variant="outlined"
            //           fullWidth
            //           style={{ marginTop: "10px", color: "black" }}
            //           InputProps={{
            //             style: { color: "black", padding: "0" },
            //             inputProps: {
            //               style: {
            //                 padding: "8px",
            //               },
            //             },
            //             endAdornment: (
            //               <InputAdornment position="end">
            //                 <SearchIcon
            //                   style={{ height: "20px", color: "black" }}
            //                 />
            //               </InputAdornment>
            //             ),
            //           }}
            //           InputLabelProps={{
            //             style: {
            //               paddingBottom: "25px",
            //               alignItems: "center",
            //               display: "flex",
            //               height: "100%",
            //             },
            //           }}
            //         />
            //       </div>
            //       <div
            //         className="p-4 rounded-t-lg"
            //         style={{ backgroundColor: "#204684" }}
            //       >
            //         <p className="text-white font-semibold text-center">
            //           Hak Yang Didapat
            //         </p>
            //       </div>
            //       <div className="bg-white border border-t-0 border-gray-300 p-4 rounded-b-lg max-h-[300px] overflow-auto">
            //         <TableContainer>
            //           <Table size="small">
            //             <TableBody>
            //               {filteredChosen.map((chosen, index) => (
            //                 <TableRow key={index}>
            //                   <TableCell align="center">
            //                     <Button
            //                       onClick={() => handleSelect(chosen)}
            //                       variant="text"
            //                       className="m-2 p-2 md:p-4 md:min-w-[150px] md:text-lg"
            //                     >
            //                       {chosen.replace("_", " ")}
            //                     </Button>
            //                   </TableCell>
            //                 </TableRow>
            //               ))}
            //             </TableBody>
            //           </Table>
            //         </TableContainer>
            //       </div>
            //     </div>
            //   </div>
            //   <div className="flex justify-end mt-5 mr-2">
            //     <Button
            //       variant="contained"
            //       size="small"
            //       style={{ backgroundColor: "#204684" }}
            //       onClick={() => handleStep3()}
            //     >
            //       Next
            //     </Button>
            //   </div>
            // </div>
            // <OperationSelection
            //   allOperation={operation}
            //   chosenOperation={chosenArray}
            //   btnFunction={handleStep3}
            //   setSubmitValue={setChosenArray}
            //   isSubmit={false}
            // />
            // <Button
            //   variant="contained"
            //   size="small"
            //   style={{ backgroundColor: "#204684" }}
            //   onClick={() => {
            //     handleStep3();
            //   }}
            // >
            //   {isSubmit ? "Submit" : "Next"}
            // </Button>
            // <div>
            //   <div className="sticky bottom-0 flex justify-end bg-white mt-4">
            //     <Button
            //       variant="contained"
            //       size="small"
            //       style={{ backgroundColor: "#204684" }}
            //       onClick={(handleStep3)}
            //     >
            //       Next
            //     </Button>
            //   </div>
            // </div>
          )} */}
          {activeStep === 3 && step3Data && (
            <div>
              <div className="space-y-2">
                {Object.entries(step3Data).map(([key, value]) =>
                  key !== "Authority" ? ( // Exclude Authority from display here
                    <div key={key} className="flex items-center text-black">
                      <strong>{key}:</strong>
                      <span className="ml-1">{value}</span> {/* Space 1 between colon and value */}
                    </div>
                  ) : null
                )}

                {step3Data.Authority.length > 0 && ( // Display Authority only if it exists
                  <div className="mt-4 text-black">
                    <div className="flex items-center">
                      <strong>Authority:</strong>
                      <ul className="ml-1 list-disc pl-5">
                        {step3Data.Authority.map((authority, index) => (
                          <li key={index}>{authority}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-4 sticky bottom-0 p-3">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSubmit}
                  className="w-32 h-10 rounded-full text-white"
                >
                  Create
                </Button>
              </div>
            </div>
          )}




        </form>
      </div>
    </div>
  );
};

export default TambahKaryawan;