import React, { useState } from 'react';
import NavbarUser from "../feature/NavbarUser";

// Function to calculate countdown from start date to end date
const calculateCountdown = (startDate, endDate) => {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  const currentTime = new Date().getTime();

  const timeDifference = endTime - currentTime;

  // If the end time is already passed, return "Waktu habis"
  if (timeDifference <= 0) {
    return "Waktu habis";
  }

  // Convert time difference to days, hours, and minutes
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  let countdown = "";
  if (days > 0) {
    countdown += days + " hari ";
  }
  if (hours > 0) {
    countdown += hours + " jam ";
  }
  if (minutes > 0) {
    countdown += minutes + " menit ";
  }

  return countdown;
};

function Taskform() {
    const [activity, setActivity] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [schedules, setSchedules] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const newSchedule = {
            task: activity,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };
        setSchedules([...schedules, newSchedule]);
        setActivity('');
        setLocation('');
        setStartDate('');
        setEndDate('');
        alert('Data telah disimpan!');
    };

    return (
        <div className="max-w-lg mx-auto">
            <NavbarUser />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Make Schedule
            </h2>
            <div className="mt-24 grid grid-rows-6 gap-x-6 gap-y-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="activity" className="block text-sm font-medium leading-6 text-gray-900">Kegiatan:</label>
                        <input type="text" id="activity" value={activity} onChange={(e) => setActivity(e.target.value)} 
                        className="w-full rounded-md border-2 border-gray-300 py-2 pl-3 focus:outline-none focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">Keterangan</label>
                        <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-md border-2 border-gray-300 py-2 pl-3 focus:outline-none focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium leading-6 text-gray-900">Tanggal Mulai:</label>
                        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-md border-2 border-gray-300 py-2 pl-3 focus:outline-none focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium leading-6 text-gray-900">Tanggal Selesai:</label>
                        <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-md border-2 border-gray-300 py-2 pl-3 focus:outline-none focus:border-indigo-500"/>
                    </div>
                    <button type="submit" className="w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Submit
                    </button>
                </form>
                <div className="mt-10 ">
                    <h2 className="text-xl font-semibold mb-3 text-center">Daftar Jadwal</h2>
                    <table className="w-full">
                        <thead>
                            <tr>  
                                <th className="text-left">Kegiatan</th>
                                <th className="text-left">Tanggal Mulai</th>
                                <th className="text-left">Tanggal Selesai</th>
                                <th className="text-left">Countdown</th> {/* Add column for countdown */}
                            </tr>
                        </thead>
                        <tbody >
                            {schedules.map((schedule, index) => (
                                <tr key={index}>
                                    <td>{schedule.task}</td>
                                    <td>{schedule.startDate.toLocaleDateString()}</td>
                                    <td>{schedule.endDate.toLocaleDateString()}</td>
                                    <td>{calculateCountdown(schedule.startDate, schedule.endDate)}</td> {/* Display countdown */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Taskform;
