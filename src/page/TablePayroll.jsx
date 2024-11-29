import { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Card, CardContent, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import InputBase from "@mui/material/InputBase";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ip from "../ip";
import CreatePayroll from "../feature/CreatePayroll";
import SettingRumusPayroll from "../feature/SettingRumusPayroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../store/store";
import Loading from "../page/Loading";

const TablePayroll = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);

  dispatch(loadingAction.startLoading(false));

  if (loading) {
    return <Loading />;
  }

  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSettingRumusPayrollOpen, setIsSettingRumusPayrollOpen] =
    useState(false);
  const [isCreatePayrollOpen, setIsCreatePayrollOpen] = useState(false);
  const operation = localStorage.getItem("operation");

  const apiURLPayroll = `${ip}/api/payroll/get`;

  const monthsIndex = {
    All: null,
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const requestBody = {
    year: selectedYear,
    month: monthsIndex[selectedMonth],
    search: search,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  function fetchData() {
    axios
      .post(apiURLPayroll, requestBody, config)
      .then((response) => {
        setRows(response.data);
        setOriginalRows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) => {
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
      setRows(originalRows);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const openSettingRumusPayroll = () => {
    setIsSettingRumusPayrollOpen(true);
  };

  const closeSettingRumusPayroll = () => {
    setIsSettingRumusPayrollOpen(false);
  };

  const openCreatePayroll = () => {
    setIsCreatePayrollOpen(true);
  };

  const closeCreatePayroll = () => {
    setIsCreatePayrollOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 15));
    setPage(0);
  };

  const handleDownloadPayroll = (id, file) => {
    const api = `${ip}/api/export/slipgaji/${file}/${id}`;

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
        link.setAttribute("download", `Slip Payroll.${file}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/5`;

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
        link.setAttribute("download", "Data Payroll.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0);
  };

  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="w-full h-screen bg-gray-100 overflow-y-auto">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Payroll Data
          </Typography>
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
                    onKeyPress={handleKeyPress}
                    onChange={handleSearchChange}
                    fullWidth
                  />
                </div>
                <TextField
                  select
                  label="Month"
                  value={selectedMonth}
                  size="small"
                  onChange={handleMonthChange}
                  variant="outlined"
                  className="w-1/6 text-left"
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="number"
                  label="Year"
                  size="small"
                  className="w-1/6"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                ></TextField>
                <Button
                  variant="contained"
                  size="small"
                  style={{ backgroundColor: "#204684" }}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
              <div className="flex items-center justify-between mx-auto">
                <div className="flex space-x-1">
                  <Button
                    disabled={!operation.includes("UPDATE_PAYROLL")}
                    size="small"
                    variant="contained"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {operation.includes("ADD_PAYROLL") && (
                      <MenuItem
                        onClick={openCreatePayroll}
                        onClose={handleClose}
                      >
                        <AddIcon
                          className="text-gray-500"
                          style={{ marginRight: "8px" }}
                        />
                        Create Payroll
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={openSettingRumusPayroll}
                      onClose={handleClose}
                    >
                      <SettingsIcon
                        className="text-gray-500"
                        style={{ marginRight: "8px" }}
                      />
                      Payroll Formula Settings
                    </MenuItem>
                  </Menu>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleExcel}
                    style={{ backgroundColor: "#1E6D42" }}
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
            <div className="max-w-full rounded-md overflow-y-auto drop-shadow-lg">
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
                        <p className="text-white font-semibold">Position</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Month</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Bank Account Number</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Nominal Salary</p>
                      </TableCell>
                      <TableCell align="center" className="w-[10%]">
                        <p className="text-white font-semibold">Salary slip</p>
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
                    ).map((rows, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{rows.nama}</TableCell>
                        <TableCell align="center">{rows.jabatan}</TableCell>
                        <TableCell align="center">
                          {rows.month},{rows.year}
                        </TableCell>
                        <TableCell align="center">{rows.rekening}</TableCell>
                        <TableCell align="center">{rows.nominal}</TableCell>
                        <TableCell align="center">
                          <div className="flex justify-evenly">
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() =>
                                handleDownloadPayroll(rows.id, "xlsx")
                              }
                            >
                              <FontAwesomeIcon
                                className="text-green-700"
                                icon={faFileExcel}
                              />
                            </Button>
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() =>
                                handleDownloadPayroll(rows.id, "pdf")
                              }
                            >
                              <FontAwesomeIcon
                                className="text-red-700"
                                icon={faFilePdf}
                              />
                            </Button>
                          </div>
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
      <SettingRumusPayroll
        isOpen={isSettingRumusPayrollOpen}
        onClose={closeSettingRumusPayroll}
      />
      <CreatePayroll
        isOpen={isCreatePayrollOpen}
        onClose={closeCreatePayroll}
      />
    </div>
  );
};

export default TablePayroll;
