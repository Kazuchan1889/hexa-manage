//AL.J V3
import React, { useEffect, useState } from "react";
import axios from "axios";
import ip from "../ip";
import NavbarUser from "../feature/NavbarUser";

const AbsensiPage = () => {
  const [absensiList, setAbsensiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const headers = {
    Authorization: localStorage.getItem("accessToken"),
  };

  useEffect(() => {
    const fetchAbsensiList = async () => {
      try {
        const response = await axios.get(`${ip}/api/weekendabsensi/get/list`, { headers });
        setAbsensiList(response.data);
      } catch (error) {
        console.error("Error fetching absensi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbsensiList();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await axios.patch(`${ip}/api/weekendabsensi/patch/list/${id}`, { status }, { headers });
      setAbsensiList((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (error) {
      console.error("Error updating absensi status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ip}/api/weekendabsensi/delete/${id}`, { headers });
      setAbsensiList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting absensi:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const pendingAbsensi = absensiList.filter((item) => !item.status);
  const approvedAbsensi = absensiList.filter((item) => item.status);
//AL.J V3
  return (
    <div className="container mx-auto p-4">
      <NavbarUser />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Absensi Weekend</h1>
        <button
          onClick={() => setShowHistory((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showHistory ? "Back to Main" : "View History"}
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : showHistory ? (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Nama</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {approvedAbsensi.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">{formatDate(item.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Nama</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Tanggal</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingAbsensi.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">{formatDate(item.date)}</td>
                <td className="px-4 py-2">{item.status ? "Approved" : "Pending"}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleApproval(item.id, true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(item.id, false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AbsensiPage;
