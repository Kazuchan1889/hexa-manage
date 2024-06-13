import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import NavbarUser from "../feature/NavbarUser";
import ip from "../ip";
const apiURL = `${ip}/api/schedjul`;

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    mulai: "",
    selesai: "",
  });

  useEffect(() => {
    fetchEventsByKaryawanId(); // Mengambil jadwal berdasarkan ID karyawan saat komponen dimuat
  }, []);

  const fetchEventsByKaryawanId = async () => {
    try {
      const response = await axios.get(`${apiURL}/scheduler/assigned/karyawan/${39}`, {  // Ganti dengan ID karyawan yang sesuai
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tgl_mulai: selectedDate.toISOString().split("T")[0], // Format YYYY-MM-DD
        tgl_selesai: selectedDate.toISOString().split("T")[0], // Format YYYY-MM-DD
      };
      await axios.post(`${apiURL}/scheduler/post`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      fetchEventsByKaryawanId(); // Memuat ulang jadwal setelah menambahkan jadwal baru
      setFormData({
        judul: "",
        deskripsi: "",
        mulai: "",
        selesai: "",
      });
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiURL}/scheduler/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      fetchEventsByKaryawanId(); // Memuat ulang jadwal setelah menghapus jadwal
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const selectedDateSchedules = events.filter(
    (event) => new Date(event.tanggal_mulai).toDateString() === selectedDate.toDateString()
  );

  const isDateHasEvents = (date) => {
    return events.some((event) => new Date(event.tanggal_mulai).toDateString() === date.toDateString());
  };

  return (
    <section>
      <NavbarUser />
      <div className="mx-20 text-left my-2">
        <h1 className="text-3xl font-bold">Calendar</h1>
      </div>
      <div className="max-w-6xl mx-auto flex mt-6 border border-black">
        <div className="w-3/4 p-6 border-r border-black">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Daftar Jadwal</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setModalIsOpen(true)}
            >
              Tambah
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Kegiatan</th>
                <th className="text-left">Tanggal</th>
                <th className="text-left">Jam</th>
                <th className="text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {selectedDateSchedules.map((schedule, index) => (
                <tr key={index}>
                  <td>{schedule.judul}</td>
                  <td>{new Date(schedule.tanggal_mulai).toLocaleDateString()}</td>
                  <td>{schedule.mulai} - {schedule.selesai}</td>
                  <td>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      onClick={() => handleDelete(schedule.schedule_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {selectedDateSchedules.length === 0 && (
                <tr>
                  <td colSpan="4">Tidak ada jadwal untuk tanggal ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-1/4 p-6">
          <div className="w-full">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => handleDateChange(date)}
              inline
              calendarClassName="full-width-calendar"
              dayClassName={(date) => (isDateHasEvents(date) ? "bg-blue-200" : undefined)}
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
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="border rounded-md py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label>Deskripsi:</label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="border rounded-md py-2 px-3 w-full"
              />
            </div>
            <div className="mb-4">
              <label>Waktu Mulai:</label>
              <input
                type="time"
                value={formData.mulai}
                onChange={(e) => setFormData({ ...formData, mulai: e.target.value })}
                className="border rounded-md py-2 px-3 w-full"
              />
            </div>
            <div className="mb-4">
              <label>Waktu Selesai:</label>
              <input
                type="time"
                value={formData.selesai}
                onChange={(e) => setFormData({ ...formData, selesai: e.target.value })}
                className="border rounded-md py-2 px-3 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </Modal>
      </div>
    </section>
  );
};

export default CalendarComponent;
