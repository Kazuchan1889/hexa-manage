import React, { useState } from 'react';
import axios from 'axios';
import ip from "../ip";

const AssetForm = () => {
  const [formData, setFormData] = useState({
    nama_barang: '',
    merek: '',
    model_tipe: '',
    harga: '',
    jumlah: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiURL = `${ip}/api/asset/post`; // Ubah sesuai dengan URL API Anda
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? accessToken : '',
        },
      };

      const response = await axios.post(apiURL, formData, config);
      console.log(response.data);

      // Tampilkan notifikasi
      alert("Data berhasil ditambahkan!");
      
      // Reset form
      setFormData({
        nama_barang: '',
        merek: '',
        model_tipe: '',
        harga: '',
        jumlah: ''
      });

      // Redirect to /Asset page
      window.location.href = '/Asset';
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Form Input Data Barang</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nama_barang" className="block mb-1">Nama Barang:</label>
          <input type="text" id="nama_barang" name="nama_barang" value={formData.nama_barang} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="merek" className="block mb-1">Merek:</label>
          <input type="text" id="merek" name="merek" value={formData.merek} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="model_tipe" className="block mb-1">Model/Tipe:</label>
          <input type="text" id="model_tipe" name="model_tipe" value={formData.model_tipe} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="harga" className="block mb-1">Harga:</label>
          <input type="number" id="harga" name="harga" value={formData.harga} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="jumlah" className="block mb-1">Jumlah:</label>
          <input type="number" id="jumlah" name="jumlah" value={formData.jumlah} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
      </form>
    </div>
  );
};

export default AssetForm;
