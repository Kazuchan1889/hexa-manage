import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const apiUrl = `${ip}/api/announcment`;

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
      console.log(response.data)
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Announcement List</h1>
      <div id="announcement-list" className="mb-8">
        {announcements.map((announcement, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-md mb-4">
            <h2 className="text-2xl font-semibold">{announcement.title}</h2>
            <p>{announcement.description}</p>
            <p>{formatDate(announcement.tanggal_upload)}</p>
            {announcement.attachment && (
              <a href={announcement.attachment} download className="text-blue-500">
                View Attachment
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementList;
