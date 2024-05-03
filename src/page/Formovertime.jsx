import React, { useState } from 'react';


function ActivityForm() {
    const [activity, setActivity] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Kegiatan:', activity);
        console.log('Lokasi:', location);
        console.log('Tanggal Mulai:', startDate);
        console.log('Tanggal Selesai:', endDate);
        alert('Data telah disimpan!');
    };
    

    return (
        <div className=''>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Request Overtime
          </h2>
        <div className="mt-24 grid grid-rows-6 gap-x-6 gap-y-8">
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="activity" className='block text-sm font-medium leading-6 text-gray-900 justify-self-start mr-60'>Kegiatan:</label>
                    <input type="text" id="activity" value={activity} onChange={(e) => setActivity(e.target.value)} 
                    className=" w-80 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <div className="mb-5">
                    <label htmlFor="location" className='block text-sm font-medium leading-6 text-gray-900 mr-60'>Lokasi:</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)}
                    className=" w-80 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <div className="mb-5">
                    <label htmlFor="startDate" className='block text-sm font-medium leading-6 text-gray-900 mr-60'>Tanggal Mulai:</label>
                    <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className=" w-1/5 rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div className="mb-5">
                    <label htmlFor="endDate" className='block text-sm font-medium leading-6 text-gray-900 mr-60'>Tanggal Selesai:</label>
                    <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className=" w-1/5 rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Submit</button>
            </form>
        </div>
    </div>
    );
}

export default ActivityForm;
