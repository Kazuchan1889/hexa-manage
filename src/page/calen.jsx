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
  const [selectAll, setSelectAll] = useState(false); // State for 'Select All'

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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedKaryawan([]);
    } else {
      setSelectedKaryawan(employees.map((employee) => ({ value: employee.id, label: employee.nama })));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tgl_mulai: selectedDate.toLocaleDateString('en-CA'),
        tgl_selesai: selectedDate.toLocaleDateString('en-CA'),
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
      setSelectAll(false);
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
    setSelectAll(selectedKaryawanOptions.length === employees.length); // Check if all employees are selected
    setModalIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tanggal_mulai: selectedDate.toLocaleDateString('en-CA'),
        tanggal_selesai: selectedDate.toLocaleDateString('en-CA'),
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
      setSelectAll(false);
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
                setSelectAll(false); // Reset 'Select All' when adding new schedule
                setModalIsOpen(true);
              }}
            >
              Add
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto h-96">
            {selectedDateSchedules.map((schedule, index) => (
              <div key={index} className="border p-4 rounded-md shadow-md">
                <h3 className="text-lg font-bold text-left">{schedule.judul}</h3>
                <p className="text-left">{schedule.deskripsi}</p> {/* Deskripsi ditambahkan di sini */}
                <p className="text-left">{new Date(schedule.tanggal_mulai).toLocaleDateString()}</p>
                <p className="text-left">{schedule.mulai} - {schedule.selesai}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
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
                </div>
              </div>
            ))}
            {selectedDateSchedules.length === 0 && (
              <div>Tidak ada jadwal untuk tanggal ini.</div>
            )}
          </div>
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
          <h2 className="font-bold text-xl text-center">{formData.id ? "Edit Schedule" : "Add Schedule"}</h2>
          <form onSubmit={formData.id ? handleUpdate : handleSubmit}>
            <div className="mb-4">
              <label>Activity:</label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label>Description:</label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full border rounded p-2"
              ></textarea>
            </div>
            <div className="mb-4">
              <label>Start Time:</label>
              <input
                type="time"
                value={formData.mulai}
                onChange={(e) => setFormData({ ...formData, mulai: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label>End Time:</label>
              <input
                type="time"
                value={formData.selesai}
                onChange={(e) => setFormData({ ...formData, selesai: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label>Employee:</label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <label>Select All</label>
              </div>
              <Select
                isMulti
                value={selectedKaryawan}
                onChange={(selectedOptions) => setSelectedKaryawan(selectedOptions)}
                options={employees.map((employee) => ({
                  value: employee.id,
                  label: employee.nama,
                }))}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                {formData.id ? "Update" : "Add"}
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={() => setModalIsOpen(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </section>
  );
};

export default CalendarComponent;
