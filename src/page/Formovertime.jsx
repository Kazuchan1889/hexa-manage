import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { TextField, Button, MenuItem } from "@mui/material";

const Formover = ({ onClick, onClose, fetchData }) => {
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
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-4xl rounded-2xl p-6 shadow-lg relative">
                <h2 className="text-center text-2xl font-bold text-black mb-4">Request Overtime</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">✖</button>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Notes"
                        variant="outlined"
                        fullWidth
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                    />
                    <TextField
                        select
                        label="Overtime Type"
                        variant="outlined"
                        fullWidth
                        name="tipe"
                        value={formData.tipe}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="">Choose Overtime Type</MenuItem>
                        <MenuItem value="Sesudah Shift">Sesudah Shift</MenuItem>
                        <MenuItem value="Sebelum Shift">Sebelum Shift</MenuItem>
                    </TextField>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField
                            label="Start Time"
                            type="time"
                            variant="outlined"
                            fullWidth
                            name="mulai"
                            value={formData.mulai}
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            label="End Time"
                            type="time"
                            variant="outlined"
                            fullWidth
                            name="selesai"
                            value={formData.selesai}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Break (Minutes)"
                            type="number"
                            variant="outlined"
                            fullWidth
                            name="breaktime"
                            value={formData.breaktime}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" variant="contained" color="success" className="w-48">
                            SUBMIT
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Formover;
