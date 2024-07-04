import React, { useState } from 'react';
import axios from 'axios';
import ip from "../ip";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
const AssetForm = ({ onClick, onClose, fetchData }) => {
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
    onClose();
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
      // alert("Data berhasil ditambahkan!");

      // Reset form
      setFormData({
        nama_barang: '',
        merek: '',
        model_tipe: '',
        harga: '',
        jumlah: ''
      });

      // Redirect to /Asset page
      // window.location.href = '/Asset';
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Item Added!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Wrong Input!",
      })
      console.error("Error:", error);
    }
    fetchData("");
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-3xl flex justify-center overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className='w-[25rem] border p-8 h-[25rem] rounded-3xl overflow-scroll'>
            <div className='flex justify-center mb-4'>
              <h2 className="text-center text-xl font-bold m-auto">Item Data Input Form</h2>
              <button onClick={onClose} className="focus:outline-none">
                <CloseIcon />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="nama_barang" className="font-semibold block mb-1 text-left">Item Name</label>
              <input type="text" id="nama_barang" name="nama_barang" value={formData.nama_barang} onChange={handleChange} className="w-full px-3 py-2 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <div className="mb-4">
              <label htmlFor="merek" className="font-semibold block mb-1 text-left">Brand</label>
              <input type="text" id="merek" name="merek" value={formData.merek} onChange={handleChange} className="w-full px-3 py-2 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <div className="mb-4">
              <label htmlFor="model_tipe" className="font-semibold block mb-1 text-left">Tipe</label>
              <input type="text" id="model_tipe" name="model_tipe" value={formData.model_tipe} onChange={handleChange} className="w-full px-3 py-2 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <div className="mb-4">
              <label htmlFor="harga" className="font-semibold block mb-1 text-left">Price</label>
              <input type="number" id="harga" name="harga" value={formData.harga} onChange={handleChange} className="w-full px-3 py-2 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <div className="mb-4">
              <label htmlFor="jumlah" className="font-semibold block mb-1 text-left">Quantity</label>
              <input type="number" id="jumlah" name="jumlah" value={formData.jumlah} onChange={handleChange} className="w-full px-3 py-2 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
