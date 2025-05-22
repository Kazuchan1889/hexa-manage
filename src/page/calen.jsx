import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import NavbarUser from "../feature/MobileNav";
import { CircularProgress } from "@mui/material"; // Import CircularProgress untuk indikator loading
import ip from "../ip";
import Sidebar from "../feature/Sidebar";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    borderRadius: "12px",
    border: "none",
    width: "500px",
    height: "700px",
  },
};

const apiURL = `${ip}/api/schedjul`;

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
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
  const [selectAll, setSelectAll] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State untuk cek apakah user admin
  const [loading, setLoading] = useState(false); // State untuk loading

  useEffect(() => {
    fetchEventsByKaryawanId();
    fetchEmployees();
    checkUserRole(); // Cek role user saat page dibuka
    deleteExpiredSchedules(); // Check for expired schedules

    // Optionally, you can set an interval to check for expired schedules every day
    const intervalId = setInterval(deleteExpiredSchedules, 24 * 60 * 60 * 1000); // Check every 24 hours

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const checkUserRole = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      const userData = JSON.parse(atob(accessToken.split(".")[1])); // Decode payload token
      const role = userData?.role; // Ambil role dari payload token

      if (role === "admin" || role === "head") {
        setIsAdmin(true); // Set state jika user admin atau head
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchEventsByKaryawanId = async () => {
    setLoading(true); // Mulai loading
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token not found.");
        setLoading(false); // Selesai loading
        return;
      }

      const userData = JSON.parse(atob(accessToken.split(".")[1]));
      const userId = userData?.id;

      if (!userId) {
        console.error("User ID not found in token.");
        setLoading(false); // Selesai loading
        return;
      }

      const response = await axios.get(
        `${apiURL}/scheduler/assigned/karyawan/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        }
      );

      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events by karyawan ID:", error);
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  const fetchEmployees = async () => {
    setLoading(true); // Mulai loading
    try {
      const response = await axios.get(`${ip}/api/karyawan/nama&id`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedKaryawan([]);
    } else {
      setSelectedKaryawan(
        employees.map((employee) => ({ value: employee.id, label: employee.nama }))
      );
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading saat submit
    try {
      const payload = {
        ...formData,
        tgl_mulai: selectedDate.toLocaleDateString("en-CA"),
        tgl_selesai: selectedDate.toLocaleDateString("en-CA"),
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
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); // Mulai loading saat delete
    try {
      await axios.delete(`${apiURL}/scheduler/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      fetchEventsByKaryawanId(); // Refresh the list after deletion
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  const handleEdit = (schedule) => {
    const selectedKaryawanOptions = schedule.karyawan
      ? schedule.karyawan.map((k) => ({ value: k.id, label: k.nama }))
      : [];
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
    setSelectAll(selectedKaryawanOptions.length === employees.length);
    setModalIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading saat update
    try {
      const payload = {
        ...formData,
        tanggal_mulai: selectedDate.toLocaleDateString("en-CA"),
        tanggal_selesai: selectedDate.toLocaleDateString("en-CA"),
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
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const deleteExpiredSchedules = async () => {
    const today = new Date(); // Get today's date
    const expiredSchedules = events.filter(event => new Date(event.tanggal_mulai) < today);

    for (const schedule of expiredSchedules) {
      await handleDelete(schedule.schedule_id); // Call delete function for each expired schedule
    }

    // After deletion, fetch the updated events
    fetchEventsByKaryawanId();
  };

  const selectedDateSchedules = events.filter(
    (event) => new Date(event.tanggal_mulai).toDateString() === selectedDate.toDateString()
  );

  const isDateHasEvents = (date) => {
    return events.some(
      (event) => new Date(event.tanggal_mulai).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="bg-[#11284E] text-white p-6 shadow-lg h-48">
          <h1 className="text-2xl font-bold">Schedule</h1>
          <div className="mt-4 flex justify-end items-center w-full pr-4 sm:pr-16">
            {isAdmin && (
              <button
                className="flex items-center px-2 py-1 rounded-[15px] bg-white text-blue-500 border border-blue-500 shadow-md hover:bg-blue-50"
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
                  setSelectAll(false);
                  setModalIsOpen(true);
                }}
              >
                <AddIcon size={20} className="text-blue-500" />
                <span>Add Schedule</span>
              </button>
            )}
          </div>

          <div className="container mx-auto px-2 sm:px-4 mt-6 flex flex-col lg:flex-row min-h-[580px] overflow-hidden">
            <div className="w-full lg:w-1/3 p-4 sm:p-6 rounded-l-xl bg-[#DFEBFE] border-b lg:border-b-0 lg:border-r border-gray-200 flex justify-center">
              <div className={`scale-100 sm:scale-125 transform ${isMobile ? 'translate-y-2' : 'translate-y-20 sm:translate-y-28'}`}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                  highlightDates={events.map((event) => new Date(event.tanggal_mulai))}
                  dayClassName={(date) => isDateHasEvents(date) ? "bg-blue-200" : undefined}
                />
              </div>
            </div>


            <div className="w-full lg:w-2/3 rounded-r-xl p-2 sm:p-4 md:p-6 bg-white flex flex-col min-w-0">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <CircularProgress />
                </div>
              ) : (
                <div className="space-y-4 overflow-auto h-80 sm:h-96">
                  {selectedDateSchedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-3 pr-3 sm:pl-4 sm:pr-4 py-2 sm:py-3 bg-gray-50 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-800">{schedule.judul}</h3>
                          <p className="text-sm sm:text-base text-gray-600">{schedule.deskripsi}</p>
                        </div>
                        {isAdmin && (
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 sm:px-3 rounded"
                              onClick={() => handleEdit(schedule)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 sm:px-3 rounded"
                              onClick={() => handleDelete(schedule.schedule_id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white w-[95%] sm:w-[1107px] h-[90%] sm:h-[650px] p-4 sm:p-6 rounded-lg shadow-lg flex items-center justify-center relative">
          <button
            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-600 hover:text-red-600"
            onClick={() => setModalIsOpen(false)}
          >
            <CloseIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
              {formData.id ? "Edit Schedule" : "Add Schedule"}
            </h2>
            <form onSubmit={formData.id ? handleUpdate : handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Title</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="block w-full border border-gray-300 rounded-lg py-1 sm:py-2 px-2 sm:px-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Description</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="block w-full border border-gray-300 rounded-lg py-1 sm:py-2 px-2 sm:px-3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Start Time</label>
                  <input
                    type="time"
                    value={formData.mulai}
                    onChange={(e) => setFormData({ ...formData, mulai: e.target.value })}
                    className="block w-full border border-gray-300 rounded-lg py-1 sm:py-2 px-2 sm:px-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">End Time</label>
                  <input
                    type="time"
                    value={formData.selesai}
                    onChange={(e) => setFormData({ ...formData, selesai: e.target.value })}
                    className="block w-full border border-gray-300 rounded-lg py-1 sm:py-2 px-2 sm:px-3"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Employees</label>
                <Select
                  isMulti
                  options={employees.map((employee) => ({
                    value: employee.id,
                    label: employee.nama,
                  }))}
                  value={selectedKaryawan}
                  onChange={setSelectedKaryawan}
                  className="w-full"
                />
                <div className="flex items-center mt-1 sm:mt-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="mr-1 sm:mr-2"
                  />
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Select All Employees</label>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#055817] hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-[15px] shadow"
                >
                  {formData.id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>

  );
};

export default CalendarComponent;
