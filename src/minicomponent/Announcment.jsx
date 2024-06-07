import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";

const Announcement = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const apiUrl = `${ip}/api/announcment`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError('Title is required');
      return;
    }

    const today = new Date();
    const formatDate = today.toISOString().split('T')[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tanggal_upload', formatDate);
    
    if (attachment) {
      const reader = new FileReader();
      reader.readAsDataURL(attachment);
      reader.onload = async () => {
        formData.append('attachment', reader.result);
        await postAnnouncement(formData);
      };
    } else {
      await postAnnouncement(formData);
    }
  };

  const postAnnouncement = async (formData) => {
    try {
      await axios.post(`${apiUrl}/post`, formData, {
        headers: {
          'Authorization': localStorage.getItem('accessToken'),
          'Content-Type': 'application/json'
        }
      });
      setMessage('Announcement posted successfully');
      setError('');
      setTitle('');
      setDescription('');
      setAttachment(null);
    } catch (error) {
      console.error('Error posting announcement:', error);
      console.log(error.response);  // Log the response for better debugging
      setMessage('');
      setError(error.response?.data || 'Failed to post announcement');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Announcements</h1>

      {error && <div className="mb-4 text-red-500">{error}</div>}
      {message && <div className="mb-4 text-green-500">{message}</div>}

      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Post New Announcement</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attachment">Attachment</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="attachment"
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
            />
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Announcement;
