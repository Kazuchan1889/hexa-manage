import React, { useState } from "react";
import { Modal, Card, CardContent, Button, Typography, TextField, InputAdornment } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import ip from "../ip";
import Swal from "sweetalert2";

const CreateRumusPayroll = ({ isOpen, onClose, setReload, reload }) => {
  const [nama, setNama] = useState('');
  const [alpha, setAlpha] = useState('');
  const [izin,setIzin] = useState('');
  const [laporan,setLaporan] = useState('');
  const [sakit,setSakit] = useState('');
  const [telat,setTelat] = useState('');
  const [tunjanganKehadiran,setTunjanganKehadiran] = useState(0);
  const [tunjanganKerajinan,setTunjanganKerajinan] = useState(0);
  const [tunjanganTransportasi,setTunjanganTransportasi] = useState(0);
  const apiCreateRumusPayroll = `${ip}/api/payroll/add/formula`

  const formatedValue = (number) => {
    return number?parseInt(number, 10).toLocaleString('id-ID'):0;
  }

  const handleCreate = () => {
    // Lakukan sesuatu dengan nilai rumus, misalnya simpan ke server
    const requestBody = {
      nama,
      izin,
      alpha,
      sakit,
      telat,
      laporan,
      TK : tunjanganKehadiran,
      TR : tunjanganKerajinan,
      TT :tunjanganTransportasi,
    };
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("accessToken"),
      }
    };

    axios.post(apiCreateRumusPayroll,requestBody,config)
    .then(response => { 
    Swal.fire({
      icon: 'success',
      title: 'Rumus berhasil dibuat!',
      customClass:{
        container:'z-30',
      }
    });
    console.log(response.data)
    // Setelah berhasil membuat rumus, tutup overlay
    setReload(prevReload => prevReload + 1);
    console.log(reload);
    onClose();
  })
  .catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message || 'Input Yang Dimasukan Tidak Valid',
      customClass:{
        container:'z-30',
      }
    });
    console.error(error)
  })
  };

  const handleClose = () => {
    // Tutup overlay
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div
        className="w-2/5 h-96"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card className="h-full" style={{overflowY : 'auto'}}>
          <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Typography variant="h6">Buat Rumus Payroll</Typography>
                </div>
                <div className="flex items-center">
                    <Button
                        size="small"
                        variant="text"
                        onClick={handleClose}
                    >
                        <CloseIcon className="text-gray-500"/>
                    </Button>
                </div>
            </div>
            <div>
              <Typography variant='subtitle2' className='text-gray-500'>Variable Yang Valid :</Typography>
            </div>
            <div className='flex items-center justify-between mb-5'>
              <div className='flex flex-col text-left w-1/2'>
                <Typography variant='caption' className='text-gray-500'>GP : Gaji Pokok </Typography>
                <Typography variant='caption' className='text-gray-500'>TK : Tunjangan Kehadiran </Typography>
                <Typography variant='caption' className='text-gray-500'>TR : Tunjangan Kerajinan </Typography>
                <Typography variant='caption' className='text-gray-500'>TT : Tunjangan Transportasi </Typography>
              </div>
              <div className='flex flex-col text-left w-1/2'>
                <Typography variant='caption' className='text-gray-500'>JI : Jumlah Izin </Typography>
                <Typography variant='caption' className='text-gray-500'>JS : Jumlah Sakit </Typography>
                <Typography variant='caption' className='text-gray-500'>JT : Jumlah Telat </Typography>
                <Typography variant='caption' className='text-gray-500'>JL : Jumlah Laporan </Typography>
                <Typography variant='caption' className='text-gray-500'>JA : Jumlah Alpha </Typography>
              </div>
            </div>
              <TextField
                label="Nama Rumus"
                fullWidth
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
              <div className="flex justify-evenly space-x-2 my-2">
                <TextField 
                  label="Rumus Alpha"
                  fullWidth
                  value={alpha}
                  onChange={(e) => setAlpha(e.target.value)}
                />
                <TextField 
                  label="Rumus Izin"
                  fullWidth
                  value={izin}
                  onChange={(e) => setIzin(e.target.value)}
                />
              </div>
              <div className="flex justify-evenly space-x-2 my-2">
                <TextField 
                  label="Rumus Sakit"
                  fullWidth
                  value={sakit}
                  onChange={(e) => setSakit(e.target.value)}
                />
                <TextField 
                  label="Rumus Telat"
                  fullWidth
                  value={telat}
                  onChange={(e) => setTelat(e.target.value)}
                />
              </div>
              <div className="flex justify-evenly space-x-2 my-2">
                <TextField 
                  label="Rumus Laporan"
                  fullWidth
                  value={laporan}
                  onChange={(e) => setLaporan(e.target.value)}
                />
                <TextField
                  label="Tunjangan Kehadiran"
                  fullWidth
                  value={formatedValue(tunjanganKehadiran)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setTunjanganKehadiran(numericValue);
                  }}
                  InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Rp.
                    </InputAdornment>
                    ),
                  }}
              />
              </div>
              <div className="flex justify-evenly space-x-2 my-2">
                <TextField
                    label="Tunjangan Kerajinan"
                    fullWidth
                    value={formatedValue(tunjanganKerajinan)}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      setTunjanganKerajinan(numericValue);
                    }}
                    InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Rp.
                      </InputAdornment>
                      ),
                    }}
                />
                <TextField
                  label="Tunjangan Transportasi"
                  fullWidth
                  value={formatedValue(tunjanganTransportasi)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setTunjanganTransportasi(numericValue);
                  }}
                  InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Rp.
                    </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mt-3">
                <Button
                  size="small" 
                  variant="contained" 
                  onClick={handleCreate}
                >
                  Create
                </Button>
              </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
};

export default CreateRumusPayroll;
