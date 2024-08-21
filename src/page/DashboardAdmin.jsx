import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogContent,
  Alert,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import { CloudDownload } from "@mui/icons-material";

import ip from "../ip";
import NavbarUser from "../feature/NavbarUser";

function LaporanKegiatan() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileBase64s, setUploadedFileBase64s] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadAlert, setUploadAlert] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const [formData, setFormData] = useState({
    lokasi: "",
    keterangan: "",
    time: "",
    tanggal: "",
    jenis: "",
  });

  useEffect(() => {
    // Fetch Laporan Data
    const apiUrl = `${ip}/api/laporan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    setLoading(true);

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        setTableData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });

    // Fetch Scheduler Data
    const schedulerApiUrl = `${ip}/api/schedjul/assigned`;
    axios
      .get(schedulerApiUrl, { headers })
      .then((response) => {
        const data = response.data;
        setScheduleData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleFileUpload = (acceptedFiles) => {
    const newUploadedFiles = [...uploadedFiles, ...acceptedFiles];
    setUploadedFiles(newUploadedFiles);

    const newFileBase64s = acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });
    setUploadedFileBase64s(newFileBase64s);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      });

      if (filteredFiles.length > 0) {
        handleFileUpload(filteredFiles);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.jenis === "Keluar kantor" && uploadedFiles.length === 0) {
      return setUploadAlert(true);
    }

    const requestBody = {
      lokasi: formData.lokasi,
      keterangan: formData.keterangan,
      jenis: formData.jenis,
      time: formData.time,
      tanggal: formData.tanggal,
      dokumen: uploadedFileBase64s.map((reader) => reader.result),
    };

    const apiSubmit = `${ip}/api/laporan/post`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    axios
      .post(apiSubmit, requestBody, { headers })
      .then((response) => {
        console.log(response);
        setUploadedFiles([]);
        setUploadedFileBase64s([]);
        Swal.fire({
          icon: "success",
          title: "Submit Sukses",
          text: response.data,
          customClass: {
            container: "z-30",
          },
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Submit Gagal",
          text: "error",
          customClass: {
            container: "z-30",
          },
        });
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "jenis" && value === "Keluar kantor") {
      setShowUploadFile(true);
    } else {
      setShowUploadFile(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderCharts = () => (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} w-full`}>
      <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
        <ChartDataKehadiranUser />
      </div>
      <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
        <ChartDataKehadiran />
      </div>
      <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
        <ChartDataGender />
      </div>
      <div className="flex items-center justify-center drop-shadow-lg bg-white p-4 rounded-xl border h-[23rem]">
        <ChartDataKaryawan />
      </div>
    </div>
  );

  return (
    <div className="w-screen h-fit lg:h-screen xl:overflow-x-hidden bg-primary">
      <NavbarUser />
      <div className="flex flex-col h-fit lg:h-screen w-screen">
        <div className="w-[95%] mx-auto flex flex-col h-fit lg:h-screen">
          <div className="flex flex-col lg:flex-row justify-between w-full">
            <div className="drop-shadow-lg bg-home px-5 py-5 my-5 rounded-md w-full">
              <ProfileDashboard />
            </div>
            {!checkOperation.includes("SELF_ABSENSI") && !isMobile && (
              <div className="drop-shadow-lg bg-white p-5 rounded-md w-full lg:w-[48%]">
                <div className="flex justify-center items-center h-full">
                  <ChartDataKaryawan />
                  <ChartDataKehadiran />
                </div>
              </div>
            )}
          </div>
          {checkOperation.includes("SELF_ABSENSI") ? (
            <div className="flex flex-col w-full">
              <div className="w-full flex justify-center gap-4 mb-4">
                {renderCharts()}
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] lg:w-[22%] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white p-2">Today's Absences</h2>
                  <ul className="space-y-4">
                    {absentEmployees.map((employee, index) => (
                      <li key={index} className="flex items-center space-x-4 border p-2 rounded-lg">
                        <img src={employee.photo} alt={employee.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-semibold">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.reason}</p>
                          <p className="text-sm text-gray-600">{employee.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] lg:w-[53%]">
                  <div className="h-[80%] mb-2 overflow-y-auto">
                    <AnnouncementList />
                  </div>
                  <div className="h-[20%] flex justify-center items-center">
                    <Button size="large" variant="contained" style={{ backgroundColor: "#1E6D42" }} onClick={() => setTambahFormOpen(true)}>
                      Add Announcement
                    </Button>
                  </div>
                </div>
                <div className="drop-shadow-lg bg-white p-6 rounded-xl border h-[23rem] lg:w-[22%]">
                  <div className="sticky top-0 bg-white p-2 z-10">
                    <h2 className="text-xl font-bold">Upcoming Schedule</h2>
                  </div>
                  <div className="h-[calc(100%-2.5rem)] overflow-y-auto">
                    <ul className="space-y-4 mt-4">
                      {scheduleItems.map((item, index) => (
                        <li key={index} className="border p-4 rounded-lg shadow-sm">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.date}</p>
                          <p className="text-sm text-gray-600">{item.time}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {isTambahFormOpen && <Announcment onClose={() => setTambahFormOpen(false)} />}
      <div className={`fixed bottom-5 right-10 p-3 z-50 duration-0 ${isBubbleOpen ? "bg-blue-500 rounded-lg w-40 min-h-24" : "bg-blue-500 flex rounded-full items-center justify-center"}`}>
        <IconButton onClick={() => setIsBubbleOpen(!isBubbleOpen)}>
          {isBubbleOpen ? <CloseIcon style={{ color: "white" }} /> : <MenuIcon style={{ color: "white" }} />}
        </IconButton>
        {isBubbleOpen && (
          <div className="flex flex-col gap-2 mt-2 p-3 rounded-lg">
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/masterlaporan"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              Laporan Karyawan
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/companyfile"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              File
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.location.href = "/Asset"} style={{ backgroundColor: "#FFFFFF", color: "black" }}>
              Asset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardAdmin;
