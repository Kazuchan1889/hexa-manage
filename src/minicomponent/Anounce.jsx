import React, { useState } from 'react';

function Announcement() {
  const [announcementText, setAnnouncementText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Function to handle announcement submission
  const handleSubmit = () => {
    if (!announcementText.trim()) {
      alert('Please enter an announcement!');
      return;
    }
    setAnnouncements(prevAnnouncements => [...prevAnnouncements, { text: announcementText, attachments }]);
    setAnnouncementText('');
    setAttachments([]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="text-xl font-semibold border-b-2 border-indigo-600 mb-4">
        Announcement
      </div>
      
      {/* Display announcements with border and scroll if exceeds container height */}
      <div className="overflow-y-auto max-h-60 w-full">
        {announcements.map((announcement, index) => (
          <div key={index} className="border border-gray-300 p-4 mb-4">
            <div>{announcement.text}</div>
            {announcement.attachments.map((attachment, idx) => (
              <img key={idx} src={attachment} alt={`Attachment ${idx + 1}`} className="max-w-full mt-2" />
            ))}
          </div>
        ))}
      </div>

      {/* Text area for submitting announcement */}
      <textarea
        value={announcementText}
        onChange={e => setAnnouncementText(e.target.value)}
        placeholder="Enter your announcement here..."
        className="border border-gray-300 p-2 mb-4 w-full"
        rows="4"
      />

      {/* Button to upload attachment */}
      <input type="file" multiple onChange={e => setAttachments([...attachments, ...e.target.files])} className="mb-4"/>

      {/* Button to submit announcement */}
      <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </div>
  );
}

export default Announcement;
