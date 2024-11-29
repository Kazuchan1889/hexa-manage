import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import ip from "../ip";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";

const TableResign = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);

  const requestBody = {};

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  const apiUrlResign = `${ip}/api/resign/get`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(loadingAction.startLoading(true)); // Start loading
        const response = await axios.post(apiUrlResign, requestBody, config);
        console.log("Response Data:", response.data);
        setRows(response.data);
        setOriginalRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(loadingAction.startLoading(false)); // Stop loading
      }
    };

    fetchData(); // Call the function when the component mounts
  }, [dispatch]);

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) => {
      // Sesuaikan dengan kriteria pencarian Anda
      return row.nama.toLowerCase().includes(query.toLowerCase());
    });

    setRows(filteredRows);
    setPage(0);
  };

  const handleSearch = () => {
    searchInRows(search);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    setPage(0);

    if (query === "" || query === null) {
      // Jika kotak pencarian kosong, kembalikan ke data asli
      setRows(originalRows);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/6`;

    axios({
      url: api,
      method: "POST",
      responseType: "blob", // Respons diharapkan dalam bentuk blob (file)
      headers: {
        "Content-Type": "application/json", // Sesuaikan dengan tipe konten yang diterima oleh API
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Data Karyawan Resign.xlsx"); // Nama file yang ingin Anda unduh
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
    <div className="w-full h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Data Resign
          </Typography>
        </div>
      </div>
      <div className="flex justify-center items-center w-screen my-2">
        <Card className="w-[90%]">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center w-full mx-auto space-x-1">
                <div className="bg-gray-200 rounded-lg flex justify-start items-center w-[37.6%] border border-gray-400">
                  <SearchIcon style={{ fontSize: 25 }} />
                  <InputBase
                    placeholder="Search..."
                    onKeyPress={handleKeyPress}
                    onChange={handleSearchChange}
                    className="w-full"
                  />
                </div>
                <div className="flex rounded-lg">
                  <Button
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "#204684" }}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mx-auto">
                <div className="flex space-x-1">
                  <Button
                    size="small"
                    variant="contained"
                    style={{ backgroundColor: "#1E6D42" }}
                    onClick={handleExcel}
                  >
                    <DescriptionIcon className="text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col justify-between items-center rounded-xl mx-auto drop-shadow-xl w-full my-2">
        <Card className="w-[90%]">
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <CircularProgress />
              </div>
            ) : (
              <div className="rounded-lg overflow-y-auto drop-shadow-lg">
                <TableContainer
                  component={Paper}
                  style={{ backgroundColor: "#FFFFFF", width: "100%" }}
                >
                  <Table aria-label="simple table" size="small">
                    <TableHead style={{ backgroundColor: "#204684" }}>
                      <TableRow>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Name</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Divition</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">Position</p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">
                            Filled Date
                          </p>
                        </TableCell>
                        <TableCell align="center" className="w-[10%]">
                          <p className="text-white font-semibold">
                            Resign Date
                          </p>
                        </TableCell>
                        <TableCell align="center" className="w-[30%]">
                          <p className="text-white font-semibold">Reason</p>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="bg-gray-100">
                      {(rowsPerPage > 0
                        ? rows.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        : rows
                      ).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{row.nama}</TableCell>
                          <TableCell align="center">{row.divisi}</TableCell>
                          <TableCell align="center">{row.jabatan}</TableCell>
                          <TableCell align="center">
                            {row.tanggalmengajukan}
                          </TableCell>
                          <TableCell align="center">
                            {row.tanggalkeluar}
                          </TableCell>
                          <TableCell align="center">{row.alasan}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          <TablePagination
            rowsPerPageOptions={[15, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Jumlah Data"
          />
        </div>
      </div>
    </div>
  );
};

export default TableResign;
