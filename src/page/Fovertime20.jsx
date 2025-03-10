import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const Formover = ({ onClose, fetchData }) => {
    const [formData, setFormData] = useState({
        note: "",
        tipe: "",
        mulai: "",
        selesai: "",
        breaktime: "0", // Default breaktime diatur ke 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onClose();

        try {
            const response = await axios.post(`${ip}/api/overtime/post`, {
                note: formData.note,
                mulai: formData.mulai,
                selesai: formData.selesai,
                tanggal_overtime: new Date().toISOString(),
                tipe: formData.tipe === "Sebelum Shift", // Kirim true jika "Sebelum Shift", false jika tidak
                breaktime: formData.breaktime || "0", // Kirim 0 jika kosong
            }, {
                headers: {
                    Authorization: localStorage.getItem("accessToken"),
                    "Content-Type": "application/json",
                }
            });
            console.log(response.data);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Request Overtime Sent!",
            });
        } catch (error) {
            console.error("Error submitting overtime:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Terjadi kesalahan saat mengirim data.",
            });
        }
        fetchData();
    };

    useEffect(() => {
        // Set waktu saat ini ke "mulai"
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // Format "HH:mm"
        setFormData((prevData) => ({ ...prevData, mulai: currentTime }));
    }, []);

    return (
        <div className="w-full  ">
           
                <div className="flex  mb-2">
                    <h2 className="text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Request Overtime
                    </h2>
                   
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='w-full'>
                        <div className='mb-2'>
                            <label htmlFor="note" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Catatan:</label>
                            <input type="text" id="note" name="note" value={formData.note} onChange={handleInputChange}
                                className="w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="overtimeType" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Jenis Overtime:</label>
                            <select id="overtimeType" name="tipe" value={formData.tipe} onChange={handleInputChange}
                                className="w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <option value="">Pilih Jenis Overtime</option> {/* Default opsi */}
                                <option value="Sesudah Shift">Sesudah Shift</option>
                                <option value="Sebelum Shift">Sebelum Shift</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="startTime" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Dari Jam:</label>
                            <input type="time" id="mulai" name="mulai" readOnly value={formData.mulai} 
                                className="w-[36%] rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            <span className='mx-2'> sampai </span>
                            <input type="time" id="selesai" name="selesai" value={formData.selesai} onChange={handleInputChange}
                                className="w-[36%] rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="breakTime" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Istirahat (menit):</label>
                            <input type="number" id="breakTime" name="breaktime" value={formData.breaktime} onChange={handleInputChange}
                                className="w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <button type="submit" className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        
    );
};

export default Formover;
