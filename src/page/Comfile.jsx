import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ip from "../ip";
import NavbarUser from "../feature/NavbarUser";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Button
} from "@mui/material";

const apiURL = `${ip}/api/CompanyFile/list/other`; // Ganti dengan IP address Anda

const CompanyFilePage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiURL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("accessToken"),
          },
        });
        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddFileClick = () => {
    window.location.href = "/upfile";
  };

  const handleDownload = (base64File, fileName) => {
    const byteCharacters = atob(base64File);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
  
    // Menambahkan ekstensi file berdasarkan tipe file yang mungkin diupload
    let ext = 'jpg'; // Default ekstensi
    if (fileName.toLowerCase().endsWith('.pdf')) {
      ext = 'pdf';
    } else if (fileName.toLowerCase().endsWith('.docx')) {
      ext = 'docx';
    }
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${ext}`; // Menambahkan ekstensi ke nama file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-between my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Company Files
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddFileClick}
            style={{ alignSelf: 'center' }}
          >
            Add File
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center items-center w-screen my-2">
        <Card className="w-[90%]">
          <CardContent>
            <div className="max-h-72 rounded-lg overflow-y-auto drop-shadow-xl">
              <TableContainer component={Paper} style={{ backgroundColor: "#FFFFFF", width: "100%" }}>
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#204684" }}>
                    <TableRow>
                      <TableCell align="center" className="w-[40%]">
                        <p className="text-white font-semibold">Nama File</p>
                      </TableCell>
                      <TableCell align="center" className="w-[20%]">
                        <p className="text-white font-semibold">Uploader ID</p>
                      </TableCell>
                      <TableCell align="center" className="w-[20%]">
                        <p className="text-white font-semibold">Tanggal Upload</p>
                      </TableCell>
                      <TableCell align="center" className="w-[20%]">
                        <p className="text-white font-semibold">Download</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="bg-gray-100">
                    {files.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{file.nama_file}</TableCell>
                        <TableCell align="center">{file.uploader_id}</TableCell>
                        <TableCell align="center">{formatDate(file.tanggal_publish)}</TableCell>
                        <TableCell align="center">
                          <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => handleDownload(file.karyawan_file, file.nama_file)}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyFilePage;
