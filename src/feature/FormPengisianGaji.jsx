import React, { useState, useEffect } from "react";
import axios from "axios";
import ip from "../ip";
import Typography from '@mui/material/Typography';
import { TextField, MenuItem, InputAdornment, Button, Menu } from "@mui/material";

const FormPengisianGaji = ({isOpen, onClose, requestBody, setRequestBody, formType, setFormType, setformValid}) =>{

    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [rows,setRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState();
    const [selectedFormula, setSelectedFormula] = useState("");
    const [isMonthValidBulanan, setisMonthValidBulanan] = useState(false);
    const [isMonthValidTHR, setisMonthValidTHR] = useState(false);
    const [isYearValidBulanan, setisYearValidBulanan] = useState(false);
    const [isYearValidTHR, setisYearValidTHR] = useState(false);
    const [isbpjsValid, setisbpjsValid] = useState(false);
    const [isbjpsValid, setisbjpsValid] = useState(false);
    const [isph21ValidBulanan, setisph21ValidBulanan] = useState(false);
    const [isph21ValidTHR, setisph21ValidTHR] = useState(false);
    const [isFormulaValid, setisFormulaValid] = useState(false);
    const [isBonusValid, setisBonusValid] = useState(false);
    const [formDataBulanan, setFormDataBulanan] = useState({
        bpjs:0,
        bjps:0,
        ph21:0,
    })
    const [formDataTHR, setFormDataTHR] = useState({
        ph21:0,
        bonus:0,
    })
   const [formDataBulananCompleted, setformDataBulananCompleted] = useState(false);
    const apiRumus=`${ip}/api/payroll/get/formula`;

    const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("accessToken"),
        }
      };
    
      const fetchData = async () => {
        try {
          const response = await axios.get(apiRumus, config);
          setRows(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      useEffect(() => {
        fetchData();
      }, [])

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
      };
    
    const months = [
        'All',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const monthsIndex = {
        All : null,
        January : 1,
        February : 2,
        March : 3,
        April : 4,
        May : 5,
        June : 6,
        July : 7,
        August : 8,
        September : 9,
        October : 10,
        November : 11,
        December : 12,
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
    };

    const handleFormulaChange = (event) => {
        setSelectedFormula(event.target.value);
        console.log(event.target.value)
    };

    const formatedValue = (number) => {
        return number?parseInt(number, 10).toLocaleString('id-ID'):0;
    };

    const handleInputChangeBulanan = (e,value) => {
        const { name } = e.target;
        const date = new Date();
        setFormDataBulanan({
          ...formDataBulanan,
          [name]: isNaN(value)?parseInt(value,10):value,
        });
          setformDataBulananCompleted(true);
        // setRequestBody({...requestBody,formDataBulanan});
    };

    useEffect(() => {
      // This useEffect will run whenever setFormDataBulananCompleted changes
      setRequestBody({ ...requestBody, formDataBulanan,formDataTHR,year: selectedYear,months: selectedMonth, formulaId: selectedFormula});
      console.log(formDataBulanan,selectedMonth,selectedYear,formDataTHR,selectedFormula);
      
    }, [formDataBulanan,selectedMonth,selectedYear,selectedFormula,formDataTHR]);

    const handleInputChangeTHR = (e,value) => {
        const { name } = e.target;
        setFormDataTHR({
          ...formDataTHR,
          [name]: isNaN(value)?parseInt(value,10):value,
        });
        setRequestBody({...requestBody,formDataTHR});
    };
    
    const handleMenuOpen = (event, index) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const switchForm = (string) => {
        setFormType(string);
        console.log(formType);
    };

    const CheckFormValid = () => {
      if(( 
        isFormulaValid && 
        isMonthValidBulanan && 
        isYearValidBulanan && 
        isbjpsValid && 
        isbpjsValid && 
        isph21ValidBulanan && formType==='Bulanan') ||
        (
        isMonthValidTHR &&
        isBonusValid &&
        isYearValidTHR &&
        isph21ValidTHR && formType==='THR') ){
        setformValid(true);
      }else
      setformValid(false);
    }
    CheckFormValid();
return(
    <div>
        <div className="flex items-center justify-between space-y-5">
            <Typography>Form Pengisian Payroll </Typography>
            <Button
                size='small'
                variant='outlined'
                onClick={(event) => handleMenuOpen(event)}
                >
                  {formType === 'Bulanan' ? (
                    <Typography variant="button">Bulanan</Typography>
                  ) : (
                    <Typography variant="button">THR</Typography>
                  )}
            </Button>
            <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => switchForm('Bulanan')}><p className='text-gray-500'>Bulanan</p></MenuItem>
                    <MenuItem onClick={() => switchForm('THR')}><p className='text-gray-500'>THR</p></MenuItem>
                </Menu>
        </div>
        <div className="overflow-y-auto pt-4 space-y-4">
            {formType === "Bulanan" && (
                <div className="space-y-4">
                <TextField
                    label="Bulan"
                    variant="outlined"
                    fullWidth
                    select
                    value={selectedMonth}
                    onChange={(e) => {
                      handleMonthChange(e);
                      setisMonthValidBulanan(!!e.target.value); // Set validation status based on whether a month is selected
                    }}
                    error={!isMonthValidBulanan}
                    helperText={!isMonthValidBulanan && 'Wajib Diisi'}
                  >
                    {months.map((month) => (
                        <MenuItem key={month} value={monthsIndex[month]}>
                            {month}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Tahun"
                    variant="outlined"
                    fullWidth
                    value={selectedYear}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      handleYearChange(numericValue);
                      setisYearValidBulanan(!!numericValue); // Set validation status based on whether a year is entered
                      console.log(!!numericValue);
                    }}
                    error={!isYearValidBulanan}
                    helperText={!isYearValidBulanan && 'Please enter a valid year'}
                  />
                <TextField
                    label="Rumus"
                    variant="outlined"
                    select
                    fullWidth
                    value={selectedFormula}
                    onChange={(e) => {
                      handleFormulaChange(e);
                      setisFormulaValid(!!e.target.value); // Set validation status based on whether a formula is selected
                    }}
                    error={!isFormulaValid}
                    helperText={!isFormulaValid && 'Wajib Diisi'}
                  >
                    {rows && rows.map((formula,index) => (
                        <MenuItem key={index} value={formula.id}>
                            {formula.rumus_nama}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                  label="BPJS"
                  fullWidth
                  value={formatedValue(formDataBulanan.bpjs)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChangeBulanan(e,numericValue);
                    setisbpjsValid(!!numericValue);
                  }}
                  name="bpjs"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                  }}
                  error={!isbpjsValid}
                  helperText={!isbpjsValid && 'Wajib Diisi'}
                    />
                <TextField
                  label="BJPS"
                  fullWidth
                  value={formatedValue(formDataBulanan.bjps)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChangeBulanan(e,numericValue);
                    setisbjpsValid(!!numericValue);
                  }}
                  name="bjps"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                  }}
                  error={!isbjpsValid}
                  helperText={!isbpjsValid && 'Wajib Diisi'}
                />
                <TextField
                  label="PH21"
                  fullWidth
                  value={formatedValue(formDataBulanan.ph21)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChangeBulanan(e,numericValue);
                    setisph21ValidBulanan(!!numericValue);
                  }}
                  name="ph21"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                  }}
                  error={!isph21ValidBulanan}
                  helperText={!isph21ValidBulanan && 'Wajib Di isi'}
                />
                </div>
                 )}
                 {formType === "THR" && (
                 <div className="space-y-4">
                    <TextField
                    label="Bulan"
                    variant="outlined"
                    fullWidth
                    select
                    value={selectedMonth}
                    onChange={(e) => {
                      handleMonthChange(e);
                      setisMonthValidTHR(!!e.target.value); // Set validation status based on whether a month is selected
                    }}
                    error={!isMonthValidTHR}
                    helperText={!isMonthValidTHR && 'Wajib Diisi'}
                  >
                    {months.map((month) => (
                        <MenuItem key={month} value={monthsIndex[month]}>
                            {month}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Tahun"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={selectedYear}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      handleYearChange(numericValue);
                      setisYearValidTHR(!!numericValue); // Set validation status based on whether a year is entered
                    }}
                    error={!isYearValidTHR}
                    helperText={!isYearValidTHR && 'Wajib Diisi'}
                  />
                    
                <TextField
                  label="Bonus"
                  fullWidth
                  value={formatedValue(formDataTHR.bonus)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChangeTHR(e,numericValue);
                    setisBonusValid(!!numericValue)
                  }}
                  error={!isBonusValid}
                  helperText={!isBonusValid && 'Wajib Diisi'}
                  name="bonus"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                  }}
                />
                 <TextField
                  label="PH21"
                  fullWidth
                  value={formatedValue(formDataTHR.ph21)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChangeTHR(e,numericValue);
                    setisph21ValidTHR(!!numericValue);
                  }}
                  name="ph21"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                  }}
                  error={!isph21ValidTHR}
                  helperText={!isph21ValidTHR && 'Wajib Di isi'}
                />
                </div>
                 )}
            </div>
        </div>
);
};

export default FormPengisianGaji;

