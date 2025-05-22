import React, { useState, useEffect } from "react";
import axios from "axios";
import ip from "../ip";
import AnnouncementEdit from "./AnnouncementEdit";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";

// Modal component to display detailed announcement
const AnnouncementDetailModal = ({ announcement, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center">{announcement.title}</h2>
        {announcement.photo && (
          <div className="mt-4">
            <img src={announcement.photo} alt="Announcement" className="w-full h-auto rounded" />
          </div>
        )}
        <p className="mt-4">{announcement.description}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // State for selected announcement for modal
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

  // Function to handle "Read more" click to open modal
  const handleReadMore = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedAnnouncement(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 rounded-lg h-max-[20rem]">
      <div
        id="announcement-list"
        className="h-[12rem] max-h-[20rem] overflow-auto space-y-4"
      >
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => {
            const descriptionPreview = announcement.description.split(" ").slice(0, 10).join(" "); // Get the first 10 words
            const isLongDescription = announcement.description.split(" ").length > 10; // Check if description is longer than 10 words
            return (
              <div
                key={index}
                className="flex flex-col lg:flex-row items-start bg-white p-4 rounded-xl border border-gray-300 space-y-2 lg:space-y-0"
              >
                <div className="flex-1 pr-0 lg:pr-4">
                  <h2 className="text-left text-sm lg:text-md font-semibold">
                    {announcement.title}
                  </h2>
                  <p className="text-left text-xs lg:text-sm text-gray-600">
                    {descriptionPreview}
                    {isLongDescription && (
                      <button
                        onClick={() => handleReadMore(announcement)}
                        className="text-blue-500 text-xs lg:text-sm ml-2"
                      >
                        Read more
                      </button>
                    )}
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
            );
          })
        ) : (
          <div className="text-center text-gray-500 text-xs lg:text-sm mt-4">
            No assignments today
          </div>
        )}
      </div>

      {/* Modal for Announcement Detail */}
      {selectedAnnouncement && (
        <AnnouncementDetailModal
          announcement={selectedAnnouncement}
          onClose={closeModal}
        />
      )}

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
