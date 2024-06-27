import React, { useState } from 'react';
import axios from 'axios';
import ip from "../ip";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const Announcement = ({ onClick, onClose, fetchData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState('');

  const apiUrl = `${ip}/api/announcment`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();

    const today = new Date();
    const formatDate = today.toISOString().split('T')[0];

    const data = {
      title: title,
      description: description,
      tanggal_upload: formatDate,
      attachment: ''  
    };

    if (attachment) {
      const reader = new FileReader();
      reader.readAsDataURL(attachment);
      reader.onload = async () => {
        data.attachment = reader.result;
        await postAnnouncement(data);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to read attachment file",
        });
      };
    } else {
      await postAnnouncement(data);
    }
    // fetchData("");
  };

  const postAnnouncement = async (data) => {
    try {
      await axios.post(`${apiUrl}/post`, data, {
        headers: {
          'Authorization': localStorage.getItem('accessToken'),
          'Content-Type': 'application/json',
        },
      });
      setError('');
      setTitle('');
      setDescription('');
      setAttachment(null);
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Announcement Posted Successfully",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error posting announcement:', error);
      console.log(error.response);  // Log the response for better debugging

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to Post Announcement",
      });
    }
    // fetchData("");
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg drop-shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className='text-right'>
            <button onClick={onClose} className="focus:outline-none">
              <CloseIcon />
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-left">Post New Announcement</h1>
          <div className="mb-4">
            <label className="text-left block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
          </div>
          <div className="mb-4">
            <label className="text-left block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="mb-4">
            <label className="text-left block text-gray-700 text-sm font-bold mb-2" htmlFor="attachment">Attachment</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="attachment"
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
            />
          </div>
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Announcement;
