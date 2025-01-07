import React, { useState, useEffect } from "react";
import axios from "axios";
import ip from "../ip";
import AnnouncementEdit from "./AnnouncementEdit";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const apiUrl = `${ip}/api/announcment`;
  const isUserAdmin = localStorage.getItem("role");

  // Redux dispatch and loading state
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    dispatch(loadingAction.startLoading(true));
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${apiUrl}/get`, {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      dispatch(loadingAction.startLoading(false));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}-${month < 10 ? "0" + month : month}-${year}`;
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${apiUrl}/delete/${id}`, {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      });
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const renderDownloadButton = (attachment) => {
    if (attachment && attachment.trim() !== "") {
      return (
        <a
          href={attachment}
          download
          className="flex items-center justify-center bg-white border border-green-500 px-3 py-1 mt-2 rounded text-green-500 text-xs lg:text-sm"
          title="Download Attachment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 lg:h-5 lg:w-5"
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 rounded-lg">
      <div className="sticky top-0 bg-white z-10 shadow-md p-2 mb-4">
        <h1 className="text-lg lg:text-xl font-bold">Assignment</h1>
      </div>
      <div
        id="announcement-list"
        className="h-[12rem] max-h-[20rem] overflow-auto space-y-4"
      >
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-start bg-white p-4 rounded-xl border border-gray-300 shadow-md space-y-2 lg:space-y-0"
            >
              <div className="flex-1 pr-0 lg:pr-4">
                <h2 className="text-sm lg:text-lg font-semibold">
                  {announcement.title}
                </h2>
                <p className="text-xs lg:text-sm text-gray-600">
                  {announcement.description}
                </p>
              </div>
              <div className="flex flex-col items-start lg:items-end space-y-2">
                <p className="text-xs lg:text-sm text-gray-500">
                  {formatDate(announcement.tanggal_upload)}
                </p>
                <div className="flex space-x-2">
                  {renderDownloadButton(announcement.attachment)}
                  {isUserAdmin === "admin" && (
                    <>
                      <button
                        className="bg-blue-500 text-white text-xs lg:text-sm px-3 py-1 rounded"
                        onClick={() => setEditAnnouncement(announcement)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white text-xs lg:text-sm px-3 py-1 rounded"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-xs lg:text-sm mt-4">
            No assignments today
          </div>
        )}
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
