import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ip from "../ip";
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
  Typography
} from "@mui/material";

const apiURL = `${ip}/api/CompanyFile`; // Ganti dengan IP address Anda

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-y-hidden">
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Company Files
          </Typography>
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
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Nama</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">ID</p>
                      </TableCell>
                      <TableCell align="center" className="w-[30%]">
                        <p className="text-white font-semibold">Nama File</p>
                      </TableCell>
                      <TableCell align="center" className="w-[30%]">
                        <p className="text-white font-semibold">File</p>
                      </TableCell>
                      <TableCell align="center" className="w-[20%]">
                        <p className="text-white font-semibold">Tanggal</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="bg-gray-100">
                    {files.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{file.nama}</TableCell>
                        <TableCell align="center">{file.id}</TableCell>
                        <TableCell align="center">{file.nama_file}</TableCell>
                        <TableCell align="center">{file.karyawan_file}</TableCell>
                        <TableCell align="center">{file.tanggal}</TableCell>
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
