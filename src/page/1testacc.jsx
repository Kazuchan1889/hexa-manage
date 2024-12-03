import React, { useEffect, useState } from "react";
import axios from "axios";
import ip from "../ip";

const AbsensiPage = () => {
  const [absensiList, setAbsensiList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menambahkan headers dengan Authorization dari localStorage
  const headers = {
    Authorization: localStorage.getItem("accessToken"),
};
  // Fetch list of weekend absensi
  useEffect(() => {
    const fetchAbsensiList = async () => {
      try {
        const response = await axios.get(`${ip}/api/weekendabsensi/get/list`, { headers }); // Menambahkan headers di sini
        setAbsensiList(response.data);
      } catch (error) {
        console.error("Error fetching absensi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbsensiList();
  }, []);

  // Handle approve or reject action
  const handleApproval = async (id, status) => {
    try {
      await axios.patch(`${ip}/api/weekendabsensi/patch/list/${id}`, { status }, { headers }); // Menambahkan headers di sini
      setAbsensiList(prevList =>
        prevList.map(item =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (error) {
      console.error("Error updating absensi status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ip}/api/weekendabsensi/delete/${id}`, { headers }); // Menambahkan headers di sini
      setAbsensiList(prevList => prevList.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting absensi:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Absensi Weekend</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Nama</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Tanggal</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {absensiList.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.username}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">{item.date}</td>
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
