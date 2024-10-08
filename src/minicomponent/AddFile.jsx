import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ip from "../ip";
import CloseIcon from "@mui/icons-material/Close";

const AddFile = ({ onClick, onClose, fetchData }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [base64File, setBase64File] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [message, setMessage] = useState('');
  const [namaFile, setNamaFile] = useState('');

  const handleFileUpload = async (acceptedFiles) => {
    const maxSizeInBytes = 5000000; // 5 MB
    const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSizeInBytes);

    if (oversizedFiles.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'File Too Big',
        text: 'File size exceeds the limit of 5 MB',
      });
      return;
    }

    const file = acceptedFiles[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    setFileExtension(fileExtension);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUploadedFile(file);
      setBase64File(reader.result.split(',')[1]); // Ensure only the base64 string is set
    };
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (acceptedFiles) => {
      const allowedExtensions = ['pdf', 'docx', 'png', 'jpg', 'jpeg'];
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      });

      if (filteredFiles.length === 1) {
        handleFileUpload(filteredFiles);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please upload a single file with pdf, docx, png, jpg, or jpeg extension.',
        });
      }
    },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    if (!uploadedFile) {
      setMessage('Please select a file to upload');
      return;
    }
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const accessToken = localStorage.getItem('accessToken');
    const id = getIdFromToken(accessToken);

    if (!id) {
      setMessage('Invalid access token');
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
      };

      const payload = {
        userId: id,
        karyawan_file: base64File,
        nama_file: `${namaFile}.${fileExtension}`, // Include the file extension in the file name
        tanggal_publish: formattedDate,
        access_list: [id], // Ensure this is an array of integers
      };

      await axios.post(
        `${ip}/api/Companyfile/list/company/upload`,
        payload,
        config
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "File Added!",
      });
      // Redirect to /companyfile after form submission
      // window.location.href = '/companyfile';
      // setMessage('File uploaded successfully');
    } catch (error) {
      // setMessage(error.response ? error.response.data.error : 'Error uploading file');
      Swal.fire({
        icon: "error",
        title: "error",
        text: "File Can't Added!",
      })
    }
    fetchData("");
  };

  const getIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      setMessage('Invalid access token');
      return null;
    }
  };

  return (
    <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
          <div className='flex'>
            <h2 className="text-2xl font-bold text-center text-gray-700 m-auto">Upload File</h2>
            <button onClick={onClose} className="focus:outline-none">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer text-center">
              <input {...getInputProps()} />
              <p>Drag & drop your file here, or click to select one</p>
              <p className="text-xs text-gray-500">Accepted file types: .png, .jpg, .jpeg, .pdf, .docx</p>
            </div>
            {uploadedFile && <p className="text-center text-gray-700">{uploadedFile.name}</p>}
            <input
              type="text"
              placeholder="Nama File"
              value={namaFile}
              onChange={(e) => setNamaFile(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Upload
            </button>
          </form>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddFile;
