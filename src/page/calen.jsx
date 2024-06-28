// CalendarComponent.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import NavbarUser from "../feature/NavbarUser";
import ip from "../ip";

// Set the main application element for react-modal
Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

const apiURL = `${ip}/api/schedjul`;

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    judul: "",
    deskripsi: "",
    mulai: "",
    selesai: "",
    karyawan: [],
  });
  const [selectedKaryawan, setSelectedKaryawan] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEventsByKaryawanId();
    fetchEmployees();
  }, []);

  const fetchEventsByKaryawanId = async () => {
    try {
      const response = await axios.get(`${apiURL}/scheduler/assigned/karyawan/${39}`, {
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

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${ip}/api/karyawan/nama&id`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tgl_mulai: selectedDate.toISOString().split("T")[0],
        tgl_selesai: selectedDate.toISOString().split("T")[0],
        karyawan: selectedKaryawan.map((k) => k.value),
      };
      await axios.post(`${apiURL}/scheduler/post`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      fetchEventsByKaryawanId();
      setFormData({
        id: null,
        judul: "",
        deskripsi: "",
        mulai: "",
        selesai: "",
        karyawan: [],
      });
      setSelectedKaryawan([]);
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
      fetchEventsByKaryawanId();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (schedule) => {
    const selectedKaryawanOptions = schedule.karyawan ? schedule.karyawan.map((k) => ({ value: k.id, label: k.nama })) : [];
    setFormData({
      id: schedule.schedule_id,
      judul: schedule.judul,
      deskripsi: schedule.deskripsi,
      mulai: schedule.mulai,
      selesai: schedule.selesai,
      karyawan: selectedKaryawanOptions,
    });
    setSelectedDate(new Date(schedule.tanggal_mulai));
    setSelectedKaryawan(selectedKaryawanOptions);
    setModalIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tanggal_mulai: selectedDate.toISOString().split("T")[0],
        tanggal_selesai: selectedDate.toISOString().split("T")[0],
        karyawan: selectedKaryawan.map((k) => k.value),
      };
      await axios.patch(`${apiURL}/scheduler/patch/${formData.id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      fetchEventsByKaryawanId();
      setFormData({
        id: null,
        judul: "",
        deskripsi: "",
        mulai: "",
        selesai: "",
        karyawan: [],
      });
      setSelectedKaryawan([]);
      setModalIsOpen(false);
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
            <h2 className="text-2xl font-bold">Schedule</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setFormData({
                  id: null,
                  judul: "",
                  deskripsi: "",
                  mulai: "",
                  selesai: "",
                  karyawan: [],
                });
                setSelectedKaryawan([]);
                setModalIsOpen(true);
              }}
            >
              Add
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-center">Activity</th>
                <th className="text-center">Date</th>
                <th className="text-center">Hour</th>
                <th className="text-center">Action</th>
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
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                      onClick={() => handleEdit(schedule)}
                    >
                      Edit
                    </button>
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
          style={customStyles}
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel={formData.id ? "Edit Schedule Modal" : "Add Schedule Modal"}
        >
          <h2 className="font-bold text-xl text-center">{formData.id ? "Edit Jadwal" : "Tambah Jadwal"}</h2>
          <form onSubmit={formData.id ? handleUpdate : handleSubmit}>
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
            <div className="mb-4">
              <label>Karyawan:</label>
              <Select
                options={employees.map((employee) => ({ value: employee.id, label: employee.nama }))}
                isMulti
                value={selectedKaryawan}
                onChange={(selectedOptions) => setSelectedKaryawan(selectedOptions)}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {formData.id ? "Update" : "Submit"}
            </button>
          </form>
        </Modal>
      </div>
    </section>
  );
};

export default CalendarComponent;