import "./App.css";
import DashboardAdmin from "./page/DashboardAdmin";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardUser from "./page/DashboardUser";
import FormIzin from "./page/FormIzin";
import Login from "./page/Login";
import FormReimburst from "./page/FormReimburst";
import FormCuti from "./page/FormCuti";
import FormResign from "./page/FormResign";
import AccountSettings from "./page/SettingUser";
import LaporanKegiatan from "./page/LaporanKegiatan";
import TableIzin from "./page/TableAproIzin";
import Dashboard from "./page/Dashboard";
import Payroll from "./page/Payroll";
import AuthInterceptor from "./feature/AuthInterceptor";
import TableDataKaryawan from "./page/TableDataKaryawan";
import TableAproIzin from "./page/TableAproIzin";
import TableApprovalCuti from "./page/TableApprovalCuti";
import TableApprovalReimburst from "./page/TableApprovalReimburst";
import TableAbsen from "./page/TableAbsen";
import TableLaporanKegiatan from "./page/TableLaporanKegiatan";
import TablePayroll from "./page/TablePayroll";
import TableResign from "./page/TableResign";
import Overtime from "./page/Overtime";
import { createTheme, ThemeProvider } from "@mui/material";
import LiveAttendance from "./page/LiveAttendance";
import AccountSettingUser from "./page/AccountSettingUser";
import Timeoff from "./page/Timeoff";
import Povertime from "./page/Formovertime";
function App() {
  // Untuk mengganti color primary
  const theme = createTheme({
    palette: {
      primary: {
        main: "#204684",
      },
    },
  });
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthInterceptor />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/izin" element={<FormIzin />} />
          <Route path="/reimburst" element={<FormReimburst />} />
          <Route path="/cuti" element={<FormCuti />} />
          <Route path="/resign" element={<FormResign />} />
          <Route path="laporan" element={<LaporanKegiatan />} />
          <Route path="/setting" element={<AccountSettings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/masterizin" element={<TableAproIzin />} />
          <Route path="/masterkaryawan" element={<TableDataKaryawan />} />
          <Route path="/mastercuti" element={<TableApprovalCuti />} />
          <Route path="/masterabsen" element={<TableAbsen />} />
          <Route path="/masterreimburst" element={<TableApprovalReimburst />} />
          <Route path="/masterlaporan" element={<TableLaporanKegiatan />} />
          <Route path="/masterpayroll" element={<TablePayroll />} />
          <Route path="/masterresign" element={<TableResign />} />
          <Route path="/LiveAttendance" element={<LiveAttendance />} />
          <Route path="/AccountSetting" element={<AccountSettingUser />} />
          <Route path="/Timeoff" element={<Timeoff />} />
          <Route path="/Over" element={<Overtime />} />
          <Route path="/pover" element={<Povertime />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
