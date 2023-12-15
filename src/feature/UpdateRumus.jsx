import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Card, CardContent, Button, Typography, }from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import InputAdornment from '@mui/material/InputAdornment';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2';
import ip from '../ip';

const UpdateRumus = ({isOpen,onClose, selectedData, selectedRowIndex, setRows, fetchData, rows }) => { 
  // console.log(isOpen)
const [formData, setFormData] = useState({
  nama: selectedData.rumus_nama || '',
  izin: selectedData.rumus_izin || '',
  alpha: selectedData.rumus_alpha || '',
  sakit: selectedData.rumus_sakit || '',
  telat: selectedData.rumus_telat || '',
  laporan: selectedData.rumus_laporan || '',
  TK: selectedData.tunjangan_kehadiran || '',
  TR: selectedData.tunjangan_kerajinan || '',
  TT: selectedData.tunjangan_transport || '',
});

useEffect(() => {
  setFormData({
  nama: selectedData.rumus_nama,
  izin: selectedData.rumus_izin,
  alpha: selectedData.rumus_alpha,
  sakit: selectedData.rumus_sakit,
  telat: selectedData.rumus_telat,
  laporan: selectedData.rumus_laporan,
  TK: selectedData.tunjangan_kehadiran,
  TR: selectedData.tunjangan_kerajinan,
  TT: selectedData.tunjangan_transport,
});
  console.log(formData);
},[selectedData]);
    
const handleInputChange = (e,value) => {
  const { name} = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

const apiUpdateRumus = `${ip}/api/payroll/update/formula/${selectedData.id}`;

const formatedValue = (number) => {
  
    return number?parseInt(number, 10).toLocaleString('id-ID'):0;
  } 

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
      ...formData,
    };

    axios
      .post(apiUpdateRumus, requestBody)
      .then((response) => {
        const updatedRows = [...rows];
        updatedRows[selectedRowIndex] = response.data;
        setRows(updatedRows);
        onClose();
        Swal.fire({
          icon: 'success',
          title: 'Rumus Berhasil Terupdate',
          customClass: {
            container: 'z-30',
          },
        });
        console.log(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message || 'Input Yang Dimasukan Tidak Valid',
          customClass: {
            container: 'z-30',
          },
        });
        console.error('error updating data', error);
      })
      .finally(() => fetchData());
      console.log(requestBody);
  };

const handleClose = () => {
    onClose();
};

return (
  <Modal open={isOpen || false} onClose={onClose}>
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
                    <Typography variant="h6">Update Rumus Payroll</Typography>
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
                value={formData.nama}
                onChange={(e)=> handleInputChange(e,e.target.value)}
                name='nama'
              />
              <div className="flex justify-evenly space-x-2 my-2">
                <TextField 
                  label="Rumus Alpha"
                  fullWidth
                  value={formData.alpha}
                  onChange={(e)=> handleInputChange(e,e.target.value)}
                  name='alpha'
                />
                <TextField 
                  label="Rumus Izin"
                  fullWidth
                  value={formData.izin}
                  onChange={(e)=> handleInputChange(e,e.target.value)}
                  name='izin'
                />
              </div>
              <div className="flex justify-evenly space-x-2 my-2">
                <TextField 
                  label="Rumus Sakit"
                  fullWidth
                  value={formData.sakit}
                  onChange={(e)=> handleInputChange(e,e.target.value)}
                  name='sakit'
                />
                <TextField 
                  label="Rumus Telat"
                  fullWidth
                  value={formData.telat}
                  onChange={handleInputChange}
                  name='telat'
                />
              </div>
              <div className="flex justify-evenly space-x-2 my-2">
                <TextField 
                  label="Rumus Laporan"
                  fullWidth
                  value={formData.laporan}
                  onChange={(e)=> handleInputChange(e,e.target.value)}
                  name='laporan'
                />
                <TextField
                  label="Tunjangan Kehadiran"
                  fullWidth
                  value={formatedValue(formData.TK)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChange(e,numericValue);
                  }}
                  name="TK"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                  }}
                />
              </div>
              <div className="flex justify-evenly space-x-2 my-2">
                <TextField
                    label="Tunjangan Kerajinan"
                    fullWidth
                    value={formatedValue(formData.TR)}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange(e,numericValue);
                    }}
                    name='TR'
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                    }}
                />
                <TextField
                  label="Tunjangan Transportasi"
                  fullWidth
                  value={formatedValue(formData.TT)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChange(e,numericValue);
                  }}
                  name='TT'
                  InputProps={{
                  startAdornment:
                    <InputAdornment position="start">
                      Rp.
                    </InputAdornment>
                    ,
                  }}
                />
              </div>
              <div className="mt-3">
                <Button
                  size="small" 
                  variant="contained" 
                  onClick={handleSubmit}
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
export default UpdateRumus;