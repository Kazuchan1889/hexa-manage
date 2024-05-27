import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";

const AddCompanyProfile = () => {
  const [formData, setFormData] = useState({
    logo: '',
    company_name: '',
    company_pnumber: '',
    email: '',
    address: '',
    province: '',
    city: '',
    industry: '',
    company_size: '',
    npwp_lama: '',
    npwp_baru: '',
    company_taxable_date: '',
    taxperson_npwp: '',
    taxperson_npwp_16_digit: '',
    hq_initial: '',
    hq_code: '',
    show_branch_name: false,
    umr: '',
    umr_province: '',
    umr_city: '',
    bpjs_ketenagakerjaan: '',
    jkk: ''
  });

  useEffect(() => {
    // Fetch data dari backend dengan header Authorization
    const apiUrl = `${ip}/api/perusahaan/get`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios.get(apiUrl, { headers })
      .then(response => {
        console.log(response);
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setFormData({
            logo: data.logo || '',
            company_name: data.company_name || '',
            company_pnumber: data.company_pnumber || '',
            email: data.email || '',
            address: data.address || '',
            province: data.province || '',
            city: data.city || '',
            industry: data.industry || '',
            company_size: data.company_size || '',
            npwp_lama: data.npwp_lama || '',
            npwp_baru: data.npwp_baru || '',
            company_taxable_date: data.company_taxable_date || '',
            taxperson_npwp: data.taxperson_npwp || '',
            taxperson_npwp_16_digit: data.taxperson_npwp_16_digit || '',
            hq_initial: data.hq_initial || '',
            hq_code: data.hq_code || '',
            show_branch_name: data.show_branch_name || false,
            umr: data.umr || '',
            umr_province: data.umr_province || '',
            umr_city: data.umr_city || '',
            bpjs_ketenagakerjaan: data.bpjs_ketenagakerjaan || '',
            jkk: data.jkk || ''
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = `${ip}/api/perusahaan/post`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios.post(apiUrl, formData, { headers })
      .then(response => {
        console.log(response.data);
        alert('Data berhasil ditambahkan');
      })
      .catch(error => {
        console.error('Error posting data:', error);
        alert('Gagal menambahkan data');
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Add Company Profile</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block font-semibold">{key.replace(/_/g, ' ')}:</label>
              {key === 'show_branch_name' ? (
                <input 
                  type="checkbox" 
                  name={key} 
                  checked={formData[key]} 
                  onChange={handleChange} 
                  className="mt-1"
                />
              ) : (
                <input 
                  type="text" 
                  name={key} 
                  value={formData[key]} 
                  onChange={handleChange} 
                  className="mt-1 p-2 w-full border rounded"
                />
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default AddCompanyProfile;
