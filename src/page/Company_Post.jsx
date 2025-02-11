import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ip from "../ip";
import { Avatar, Typography, TextField, Button } from "@mui/material";

const AddCompanyProfile = () => {
  const [formData, setFormData] = useState({
    logo: "",
    company_name: "",
    company_pnumber: "",
    email: "",
    address: "",
    province: "",
    city: "",
    industry: "",
    company_size: "",
    jumlah_karyawan: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${ip}/api/perusahaan/get`;
        const headers = { Authorization: localStorage.getItem("accessToken") };

        const companyResponse = await axios.get(apiUrl, { headers });
        if (companyResponse.data && companyResponse.data.length > 0) {
          const data = companyResponse.data[0];
          setFormData((prevState) => ({
            ...prevState,
            logo: data.logo || "",
            company_name: data.company_name || "",
            company_pnumber: data.company_pnumber || "",
            email: data.email || "",
            address: data.address || "",
            province: data.province || "",
            city: data.city || "",
            industry: data.industry || "",
            company_size: data.company_size || "",
          }));
        }

        // Fetch jumlah karyawan
        const jumlahKaryawanResponse = await axios.get(`${ip}/api/perusahaan/jumlah`, { headers });
        if (jumlahKaryawanResponse.data && jumlahKaryawanResponse.data.length > 0) {
          setFormData((prevState) => ({
            ...prevState,
            jumlah_karyawan: jumlahKaryawanResponse.data[0].jumlah_karyawan || "0",
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevState) => ({
        ...prevState,
        logo: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = `${ip}/api/perusahaan/update`;
    const headers = { Authorization: localStorage.getItem("accessToken") };

    try {
      const response = await axios.patch(apiUrl, formData, { headers });
      console.log(response.data);
      alert("Data berhasil diperbarui");
      setIsEditing(false); // Kembali ke mode tampilan setelah update
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Gagal memperbarui data");
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };


  return (
    <div className="w-full h-full bg-white flex flex-col items-center p-4">
      {/* Header - Profile Image & Name */}
      <div className="w-full flex items-center mb-6">
        <Avatar
          src={formData.logo}
          alt="Upload File"
          sx={{ width: 130, height: 130, cursor: "pointer" }}
          className="ml-4 border border-gray-300 shadow-md"
          onClick={isEditing ? handleLogoClick : null}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />

        <div className="ml-6">
          <Typography
            variant="h6"
            className="font-bold"
            style={{ fontSize: 30, fontFamily: "Helvetica Bold", textAlign: "left" }}
          >
            {formData.company_name || "Nama Perusahaan"}
          </Typography>

          <div className="text-left">
            {!isEditing ? (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                className="px-4 py-1 text-sm"
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                size="small"
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className="px-4 py-1 text-sm"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-4">
        <form onSubmit={handleSubmit} className="flex flex-col bg-white p-6 rounded-lg">
          {[
            { label: "Alamat", name: "address" },
            { label: "Email Address", name: "email" },
            { label: "No HP", name: "company_pnumber", type: "text" },
            { label: "Provinsi", name: "province" },
            { label: "Kota", name: "city" },
            { label: "Industri", name: "industry" },
            { label: "Ukuran Perusahaan", name: "company_size" },
            { label: "Jumlah Karyawan", name: "jumlah_karyawan", readonly: true },
          ].map((field, index) => (
            <div key={index} className="flex items-center rounded-lg p-2">
              <Typography className="w-1/3 text-left pr-4" variant="body1">
                {field.label}:
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                InputProps={{
                  style: { paddingLeft: 8, borderRadius: 10 },
                  readOnly: field.readonly || !isEditing, // Hanya bisa diedit jika dalam mode editing
                }}
                className="w-2/3 rounded-lg bg-gray-100"
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default AddCompanyProfile;
