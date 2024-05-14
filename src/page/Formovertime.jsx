import React, { useState, useEffect } from 'react';
import NavbarUser from '../feature/NavbarUser';
import axios from 'axios';
import NavbarUser from "../feature/NavbarUser";

function ActivityForm() {
    const [formData, setFormData] = useState({
        activity: "",
        location: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        // Fetch data from API endpoint when component mounts
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/karyawan/get/data/self', {
                    headers: {
                        Authorization: localStorage.getItem("accessToken"),
                    }
                });
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/pengajuan/post/activity', formData, {
                headers: {
                    Authorization: localStorage.getItem("accessToken"),
                    "Content-Type": "application/json",
                }
            });
            console.log(response.data);
            // Optionally, handle success response
        } catch (error) {
            console.error(error);
            // Optionally, handle error response
        }
    };

    return (
        <div className="">
            <NavbarUser />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Request Overtime
            </h2>
            <div className="mt-24 grid grid-rows-6 gap-x-6 gap-y-8">
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="activity" className='block text-sm font-medium leading-6 text-gray-900 justify-self-start mr-60'>Kegiatan:</label>
                        <input type="text" id="activity" name="activity" value={formData.activity} onChange={handleInputChange}
                            className=" w-80 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="location" className='block text-sm font-medium leading-6 text-gray-900 mr-60'>Lokasi:</label>
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange}
                            className=" w-80 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="startDate" className='block text-sm font-medium leading-6 text-gray-900 mr-60'>Tanggal Mulai:</label>
                        <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange}
                            className=" w-1/5 rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="endDate" className='block text-sm font-medium leading-6 text-gray-900 mr-60'>Tanggal Selesai:</label>
                        <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange}
                            className=" w-1/5 rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                    <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ActivityForm;
