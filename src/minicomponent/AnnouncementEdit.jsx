import React, { useState } from 'react';
import axios from 'axios';
import ip from "../ip";

const AnnouncementEdit = ({ announcement, onClose, onUpdate }) => {
  const [title, setTitle] = useState(announcement.title);
  const [description, setDescription] = useState(announcement.description);
  const [attachment, setAttachment] = useState(announcement.attachment);
  const [tanggalUpload, setTanggalUpload] = useState(announcement.tanggal_upload);
  const [AnnouncementID, setAnnouncementID] = useState(announcement.id);
  const apiUrl = `${ip}/api/announcment`;

  const handleEdit = async () => {
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const today = new Date();
      const formatDate = today.toISOString().split('T')[0];

      const payload = {
        title,
        description,
        attachment,
        tanggal_upload: formatDate,
        id: AnnouncementID,
      };

      await axios.patch(`${apiUrl}/patch`, payload, {
        headers: {
          'Authorization': accessToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('Announcement edited successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error editing announcement:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
      <div className="bg-white p-4 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Announcement</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files[0])}
          className="border p-2 w-full mb-4"
        />
        
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleEdit}
        >
          Save Changes
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AnnouncementEdit;