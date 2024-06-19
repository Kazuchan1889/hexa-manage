import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";
import AnnouncementEdit from './AnnouncementEdit';

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const apiUrl = `${ip}/api/announcment`;
  const isUserAdmin = localStorage.getItem("role");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${apiUrl}/get`, {
        headers: {
          'Authorization': accessToken,
          'Content-Type': 'application/json'
        }
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero based
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`${apiUrl}/delete/${id}`, {
        headers: {
          'Authorization': accessToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('Announcement deleted successfully');
      fetchAnnouncements(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 h-[23rem]">
      <h1 className="text-xl font-bold mb-4">Announcement</h1>
      <div id="announcement-list" className="h-[12rem] mb-2 overflow-scroll">
        {announcements.map((announcement, index) => (
          <div key={index} className="bg-white p-4 rounded-xl drop-shadow-lg border">
            <h2 className="text-2xl font-semibold">{announcement.title}</h2>
            <p>{announcement.description}</p>
            <p>{formatDate(announcement.tanggal_upload)}</p>
            {announcement.attachment && (
              <div>
                <a href={announcement.attachment} download className="text-blue-500">
                  View Attachment
                </a>
              </div>
            )}
            {isUserAdmin === "admin" && (
              <>
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-4 mr-2 rounded"
                  onClick={() => setEditAnnouncement(announcement)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
                  onClick={() => handleDelete(announcement.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {editAnnouncement && (
        <AnnouncementEdit
          announcement={editAnnouncement}
          onClose={() => setEditAnnouncement(null)}
          onUpdate={fetchAnnouncements}
        />
      )}
    </div>
  );
};

export default AnnouncementList;
