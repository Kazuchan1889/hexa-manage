import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TablePagination,
  Paper,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import ip from "../ip";
import NavbarUser from "../feature/NavbarUser";
import Sidebar from "../feature/Sidebar";
import Headb from "../feature/Headbar";

function Payroll() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const apiUrl = `${ip}/api/payroll/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setTableData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCheckClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleDownloadPayroll = (id) => {
    const api = `${ip}/api/export/slipgaji/pdf/${id}`;

    axios({
      url: api,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Slip Payroll.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="flex flex-col flex-1 overflow-auto">
        <Headb />
        <div className="h-full w-full mx-auto">
          <div className="mt-3 rounded-xl w-[90%] mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <Typography variant="h5">History Payroll</Typography>
            </div>
            <TableContainer className="rounded-md" component={Paper}>
              <Table>
                <TableHead style={{ backgroundColor: "#204684" }}>
                  <TableRow>
                    <TableCell size="small">
                      <Typography
                        variant="body2"
                        className="font-semibold text-white text-center"
                      >
                        Bulan
                      </Typography>
                    </TableCell>
                    <TableCell size="small">
                      <Typography
                        variant="body2"
                        className="font-semibold text-white text-center"
                      >
                        Gaji Bersih
                      </Typography>
                    </TableCell>
                    <TableCell size="small">
                      <Typography
                        variant="body2"
                        className="font-semibold text-white text-center"
                      >
                        Potongan
                      </Typography>
                    </TableCell>
                    <TableCell size="small">
                      <Typography
                        variant="body2"
                        className="font-semibold text-white text-center"
                      >
                        Gaji yang diterima
                      </Typography>
                    </TableCell>
                    <TableCell size="small">
                      <Typography
                        variant="body2"
                        className="font-semibold text-white text-center"
                      >
                        Slip Gaji
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell size="small">
                          <div className="text-center">
                            {row.month},{row.year}
                          </div>
                        </TableCell>
                        <TableCell size="small">
                          <div className="text-center">{row.gaji}</div>
                        </TableCell>
                        <TableCell size="small">
                          <div className="text-center">{row.potongan}</div>
                        </TableCell>
                        <TableCell size="small">
                          <div className="text-center">{row.nominal}</div>
                        </TableCell>
                        <TableCell size="small">
                          <div className="text-center">
                            <Button
                              size="small"
                              variant="text"
                              color="primary"
                              onClick={() => handleDownloadPayroll(row.id)}
                            >
                              <DownloadIcon className="text-gray-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payroll;
