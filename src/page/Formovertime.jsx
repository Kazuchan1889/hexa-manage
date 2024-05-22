import React, { useState, useEffect } from 'react';
import NavbarUser from '../feature/NavbarUser';
import axios from 'axios';
import ip from "../ip";

function Formover() {
    const [formData, setFormData] = useState({
        note: "",
        tipe: "",
        mulai: "",
        selesai: "",
        breaktime: "",
    });
    const [submitStatus, setSubmitStatus] = useState(null); // Menambahkan state untuk menyimpan status pengiriman
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${ip}/api/overtime/post`, {
                note: formData.note,
                mulai: formData.mulai,
                selesai: formData.selesai,
                tanggal_overtime: new Date().toISOString(),
                tipe: formData.overtimeType === "Sebelum Shift",
                breaktime: formData.breakTime,
                file: formData.file
            }, {
                headers: {
                    Authorization: localStorage.getItem("accessToken"),
                    "Content-Type": "application/json",
                }
            });
            console.log(response.data);
            setSubmitStatus('success'); // Atur status pengiriman menjadi berhasil
        } catch (error) {
            console.error("Error submitting overtime:", error);
            setSubmitStatus('error'); // Atur status pengiriman menjadi error
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Mendapatkan file yang diunggah
        const reader = new FileReader(); // Membuat objek FileReader

        // Mengatur fungsi onload untuk menjalankan setelah file selesai dibaca
        reader.onload = () => {
            const base64Data = reader.result; // Mendapatkan data URL (base64) dari file
            setFile(base64Data); // Menyimpan data URL ke state
        };

        // Membaca file sebagai data URL
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        // Reset status pengiriman setelah beberapa waktu
        const timer = setTimeout(() => {
            setSubmitStatus(null);
        }, 5000); // Atur waktu notifikasi hilang di sini (dalam milidetik)

        return () => clearTimeout(timer);
    }, [submitStatus]);

    return (
        <div className="">
            <NavbarUser />
            {submitStatus === 'success' && (
                <div className="bg-green-200 text-green-900 p-2 mb-4">
                    Overtime berhasil dikirim!
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="bg-red-200 text-red-900 p-2 mb-4">
                    Terjadi kesalahan saat mengirim overtime. Silakan coba lagi.
                </div>
            )}
            <div className="my-4 flex justify-center ">
                <form onSubmit={handleSubmit}>
                    <div className='w-full border border-black p-8 rounded-3xl'>
                        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Request Overtime
                        </h2>
                        <div className="mb-2">
                            <label htmlFor="note" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Catatan:</label>
                            <input type="text" id="note" name="note" value={formData.note} onChange={handleInputChange}
                                className=" w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="overtimeType" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Jenis Overtime:</label>
                            <select id="overtimeType" name="tipe" value={formData.tipe} onChange={handleInputChange}
                                className="w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <option value="">Pilih Jenis Overtime</option>
                                <option value="Sesudah Shift">Sesudah Shift</option>
                                <option value="Sebelum Shift">Sebelum Shift</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="startTime" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Dari Jam:</label>
                            <input type="time" id="mulai" name="mulai" value={formData.mulai} onChange={handleInputChange}
                                className=" w-[36%] rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            <span className='mx-4'> sampai </span>
                            <input type="time" id="selesai" name="selesai" value={formData.selesai} onChange={handleInputChange}
                                className=" w-[36%] rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="breakTime" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Istirahat (menit):</label>
                            <input type="number" id="breakTime" name="breakTime" value={formData.breakTime} onChange={handleInputChange}
                                className=" w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="file" className='block text-sm font-medium leading-6 text-gray-900 text-left mb-2'>Upload Foto</label>
                            <input type="file" id="file" name="file" onChange={handleFileChange}
                                className="w-full text-gray-900" />
                        </div>
                        <button type="submit" className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Formover;