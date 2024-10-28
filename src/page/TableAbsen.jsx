import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { loadingAction } from "../store/store"; // Importing Redux action
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import SettingHoliday from "../feature/SettingHoliday";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Card, CardContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ip from "../ip";
import PatchStatus from "../feature/PatchStatus";
import Loading from "../page/Loading"; // Importing Loading component

const TableAbsen = () => {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTimeSettingOpen, setIsTimeSettingOpen] = useState(false);
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [timeMasuk, setTimeMasuk] = useState(null);
  const [timeKeluar, setTimeKeluar] = useState(null);
  const [selectedToleransi, setSelectedToleransi] = useState(null);
  const operation = localStorage.getItem("operation");
  const apiURLAbsenKaryawan = `${ip}/api/absensi/get/data/dated`;
  const apiURLSettingJam = `${ip}/api/absensi/update/seting`;

  const dispatch = useDispatch(); // Using dispatch from Redux
  const loading = useSelector((state) => state.loading.isLoading); // Accessing loading state from Redux

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(loadingAction.startLoading(true)); // Dispatch loading start
      try {
        const response = await axios.post(apiURLAbsenKaryawan, { date: selectedDate }, config);
        setRows(response.data);
        setOriginalRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(loadingAction.startLoading(false)); // Dispatch loading end
      }
    };

    fetchData();
  }, [selectedDate, dispatch]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    setPage(0);
    if (!query) {
      setRows(originalRows);
    }
  };

  const handleSearch = () => {
    const filteredRows = originalRows.filter((row) =>
      row.nama.toLowerCase().includes(search.toLowerCase())
    );
    setRows(filteredRows);
    setPage(0);
  };

  if (loading) {
    return <Loading />; // Show loading state if data is being fetched
  }

  function Base64Image({ base64String }) {
    // Buat URL untuk base64 data
    const imageUrl = `data:image/jpeg;base64,${base64String}`;

    return <img src={imageUrl} alt="Gambar" style={{ maxWidth: '100px', maxHeight: '100px' }} />;
}

  return (
    <div className="w-full h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>Data Absensi</Typography>
        </div>
      </div>
      <div className="flex justify-center items-center w-screen my-2">
        <Card className="w-[90%]">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center w-full mx-auto space-x-1">
                <div className="bg-gray-200 rounded-lg flex justify-start items-center w-2/5 border border-gray-400">
                  <SearchIcon style={{ fontSize: 25 }} />
                  <InputBase
                    placeholder="Search..."
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    onChange={handleSearchChange}
                    className="w-full"
                  />
                </div>
                <div className="flex rounded-lg space-x-1">
                  <Button size="small" variant="text" onClick={() => setIsDateFilterOpen(true)}>
                    <CalendarMonthIcon className="text-black" />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "#204684" }}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  <Dialog open={isDateFilterOpen} onClose={() => setIsDateFilterOpen(false)}>
                    <DialogTitle>Pilih Tanggal</DialogTitle>
                    <DialogContent>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={selectedDate}
                          onChange={(date) => {
                            setSelectedDate(date);
                            setIsDateFilterOpen(false);
                          }}
                          renderInput={(params) => (
                            <div className="w-64 mt-2">
                              <input
                                {...params.inputProps}
                                className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                          )}
                        />
                      </LocalizationProvider>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col justify-between items-center my-2 rounded-xl mx-auto drop-shadow-xl">
        <Card className="w-[90%]">
          <CardContent>
            <div className="max-h-72 rounded-lg overflow-y-auto drop-shadow-lg">
              <TableContainer component={Paper} style={{ width: "100%" }}>
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#204684" }}>
                    <TableRow>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Nama</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Jam Masuk</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Jam Pulang</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Tanggal</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Photo</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Status</p>
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
                    )
                      .sort((a, b) => a.nama.localeCompare(b.nama))
                      .map((row, index) => {
                        const jamMasukRow = new Date(`1970-01-01T${row.masuk}:00`);
                        const jamKeluarRow = new Date(`1970-01-01T${row.keluar}:00`);
                        const isLateMasuk = jamMasukRow > timeMasuk;
                        const isLateKeluar = jamKeluarRow > timeKeluar;

                        return (
                          <TableRow key={index}>
                            <TableCell align="center">{row.nama}</TableCell>
                            <TableCell 
                              align="center" 
                              style={{ color: isLateMasuk ? 'red' : 'black' }}
                            >
                              {row.masuk}
                            </TableCell>
                            <TableCell 
                              align="center" 
                              style={{ color: isLateKeluar ? 'red' : 'black' }}
                            >
                              {row.keluar}
                            </TableCell>
                            <TableCell align="center">{row.date}</TableCell>
                            <TableCell align="center">
                                  <img 
                                    src={row.fotomasuk} 
                                    alt="Foto Masuk" 
                                    style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                                  />
                                </TableCell>
                            <TableCell align="center" className="flex items-center">
                              <PatchStatus string={row.status} id={row.id} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
            labelRowsPerPage="Jumlah Data"
          />
        </div>
      </div>
      {isHolidayOpen && <SettingHoliday onClose={() => setIsHolidayOpen(false)} />}
    </div>
  );
};

export default TableAbsen;
