import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Swal from "sweetalert2";
import ip from "../ip";

const EditDataKaryawan = ({
  data,
  onClose,
  rows,
  selectedRowIndex,
  setRows,
  fetchData,
}) => {
  const [formData, setFormData] = useState(data);
  const [salary, setSalary] = useState(formData.gaji);
  const [divisi, setDivisi] = useState(formData.divisi);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const apiEditKaryawan = `${ip}/api/karyawan/patch/${data.id}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
      nama: formData.nama,
      email: formData.email,
      password: formData.password,
      notelp: formData.notelp,
      alamat: formData.alamat,
      jabatan: formData.jabatan,
      status: formData.status,
      lokasikerja: formData.lokasikerja,
      nik: formData.nik,
      npwp: formData.npwp,
      nikid: formData.nikid,
      level: formData.level,
      tglmasuk: formData.tglmasuk,
      tglkeluar: formData.tglkeluar,
      gaji: salary,
      divisi: formData.divisi,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    };

    axios
      .patch(apiEditKaryawan, requestBody, config)
      .then((response) => {
        console.log("Data updated:", formData); // Log updated data
        // Update data in the table
        const updatedRows = [...rows];
        updatedRows[selectedRowIndex] = formData;
        setRows(updatedRows);
        onClose(); // Close overlay
        fetchData(); // Fetch updated data
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data updated successfully!",
        });
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error updating data. Please try again.",
        });
      });
  };
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: data ? "flex" : "none", // Menggunakan 'flex' untuk menanggapi perubahan pada overlay
    alignItems: "center",
    justifyContent: "center",
  };

  const popupStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <div className="justify-center items-center">
          <h3 className="text-xl">Edit Profile</h3>
          {/* Konten dan tombol untuk menyimpan perubahan */}
          {/* ... */}
          <img
            alt=""
            src={formData.dokumen}
            className="h-20 w-20 rounded-full cursor-pointer mx-1"
          />
        </div>
        <div className="max-h-80 min-w-full overflow-y-auto">
          <div className="flex items-center  m-5">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center m-5">
            <TextField
              label="Position"
              variant="outlined"
              fullWidth
              name="jabatan"
              value={formData.jabatan}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center m-5">
            <TextField
              className="text-left"
              label="Status"
              variant="outlined"
              select
              fullWidth
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <MenuItem value="tetap">Permanent</MenuItem>
              <MenuItem value="kontrak">Contract</MenuItem>
              <MenuItem value="probation">Probationary</MenuItem>
              <MenuItem value="magang">Intern</MenuItem>
            </TextField>
          </div>
          <div className="flex items-center m-5">
            <TextField
              label="Work Location"
              variant="outlined"
              fullWidth
              name="lokasikerja"
              value={formData.lokasikerja}
              onChange={handleInputChange}
            ></TextField>
          </div>
          <div className="flex items-center m-5">
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              name="notelp"
              value={formData.notelp}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center m-5">
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex item-center m-5">
            <TextField
              label="Date of Entry"
              variant="outlined"
              fullWidth
              type="date"
              name="tglmasuk"
              value={formData.tglmasuk}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                placeholder: "",
              }}
            />
          </div>
          <div className="flex item-center m-5">
            <TextField
              label="Exit Date"
              variant="outlined"
              fullWidth
              type="date"
              name="tglkeluar"
              value={formData.tglkeluar}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                placeholder: "",
              }}
            />
          </div>
          <div className="flex item-center m-5">
            <TextField
              className="text-left"
              label="Level"
              variant="outlined"
              name="level"
              fullWidth
              select
              value={formData.level}
              onChange={handleInputChange}
            >
              <MenuItem value="leader">Leader</MenuItem>
              <MenuItem value="Head">Head</MenuItem>
              <MenuItem value="Senior">Senior</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </TextField>
          </div>
          <div className="flex items-center m-5">
            <TextField
              label="NIK (KTP)"
              variant="outlined"
              fullWidth
              name="nik"
              value={formData.nik}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center m-5">
            <TextField
              label="NPWP"
              variant="outlined"
              fullWidth
              name="npwp"
              value={formData.npwp}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center m-5">
            <TextField
              label="Nomor Induk Karyawan"
              variant="outlined"
              fullWidth
              name="nikid"
              value={formData.nikid}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center m-5">
            <TextField
              label="Divition"
              variant="outlined"
              fullWidth
              name="divisi"
              value={formData.divisi}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex item-center m-5">
            <TextField
              label="Salary"
              fullWidth
              value={formData.gaji}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                setFormData({
                  ...formData,
                  gaji: numericValue,
                });
                setSalary(numericValue);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rp.</InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          <p className="text-white font-semibold">Save</p>
        </button>
      </div>
    </div>
  );
};

export default EditDataKaryawan;
