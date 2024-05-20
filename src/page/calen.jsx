import React, { useState, useEffect } from 'react';
import NavbarUser from "../feature/NavbarUser";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Taskform() {
    const [activity, setActivity] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedDateSchedules, setSelectedDateSchedules] = useState([]);
    const [nationalHolidays, setNationalHolidays] = useState([]);

    useEffect(() => {
        fetchNationalHolidays();
    }, []);

    useEffect(() => {
        const selectedDate = startDate.toLocaleDateString();
        const filteredSchedules = schedules.filter(schedule => {
            const scheduleDate = schedule.endDate.toLocaleDateString();
            return scheduleDate === selectedDate;
        });
        setSelectedDateSchedules(filteredSchedules);
    }, [startDate, schedules]);

    const fetchNationalHolidays = () => {
        // Ganti URL_API dengan URL yang sesuai untuk mendapatkan data libur nasional
        fetch('URL_API')
            .then(response => response.json())
            .then(data => {
                // Jika menggunakan API, sesuaikan cara menyimpan data dengan struktur respons API
                setNationalHolidays(data);
            })
            .catch(error => console.error('Error fetching national holidays:', error));
    };

    const isHoliday = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return nationalHolidays.includes(formattedDate);
    };

    const handleDateClick = (date) => {
        if (isHoliday(date)) {
            alert('Ini adalah hari libur nasional!');
        }
        setStartDate(date);
    };

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
        setStartDate(new Date());
        setEndDate('');
        setModalIsOpen(false);
        alert('Data telah disimpan!');
    };

    return (
        <section>
            <NavbarUser />
            <div className='mx-20 text-left my-2'>
                <h1 className='text-3xl font-bold'>Calender</h1>
            </div>
            <div className="max-w-6xl mx-auto flex mt-6 border-black border">
                <div className="w-3/4 p-6 border-r border-black">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Daftar Jadwal</h2>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalIsOpen(true)}>Tambah</button>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Kegiatan</th>
                                <th className="text-left">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedDateSchedules.map((schedule, index) => (
                                <tr key={index}>
                                    <td>{schedule.task}</td>
                                    <td>{schedule.endDate.toLocaleString()}</td>
                                </tr>
                            ))}
                            {selectedDateSchedules.length === 0 && (
                                <tr>
                                    <td colSpan="2">Tidak ada jadwal untuk tanggal ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="w-1/4 p-6">
                    {/* <h2 className="text-2xl font-bold mb-4">Pilih Tanggal</h2> */}
                    <div className='w-full'>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => handleDateClick(date)}
                            inline
                            calendarClassName="full-width-calendar"
                        />
                    </div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Add Schedule Modal"
                >
                    <h2>Tambah Jadwal</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label>Kegiatan:</label>
                            <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} className="border rounded-md py-2 px-3" />
                        </div>
                        <div className="mb-4">
                            <label>Waktu Selesai (Format 24 Jam):</label>
                            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded-md py-2 px-3" />
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                    </form>
                </Modal>
            </div>
        </section>
    );
}

export default Taskform;
