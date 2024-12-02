import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";
import AnnouncementEdit from './AnnouncementEdit';
import { useDispatch, useSelector } from "react-redux"; // import dispatch and useSelector
import { loadingAction } from "../store/store"; // import loading action
import Loading from "../page/Loading"; // import Loading component

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const apiUrl = `${ip}/api/announcment`;
  const isUserAdmin = localStorage.getItem("role");

  // Dispatch and loading state
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading); // Get loading state from redux

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    dispatch(loadingAction.startLoading(true)); // Start loading
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
    } finally {
      dispatch(loadingAction.startLoading(false)); // Stop loading
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
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

  const renderDownloadButton = (attachment) => {
    if (attachment && attachment.trim() !== '') {
      return (
        <a
          href={attachment}
          download
          className="flex items-center justify-center bg-white border border-green-500 px-4 py-2 mt-2 rounded text-green-500"
          title="Download Attachment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v7.586l2.707-2.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 11.586V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M4 14a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      );
    }
    return null;
  };

  // Render loading component when loading is true
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 rounded-lg">
      <div className="sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold mb-4">Assingment</h1>
      </div>
      <div id="announcement-list" className="h-[12rem] mb-2 overflow-scroll">
        {announcements.map((announcement, index) => (
          <div key={index} className="flex items-start bg-white p-4 rounded-xl border border-gray-400 mb-4 shadow">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-semibold">{announcement.title}</h2>
              <p className="text-left">{announcement.description}</p>
            </div>
            <div className="flex flex-col items-end justify-between ml-auto">
              <p>{formatDate(announcement.tanggal_upload)}</p>
              <div className="flex space-x-2">
                {renderDownloadButton(announcement.attachment)}
                {isUserAdmin === "admin" && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                      onClick={() => setEditAnnouncement(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
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
