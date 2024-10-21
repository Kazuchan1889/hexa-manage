import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    logo: '',
    company_name: '',
    company_phone_number: '',
    email: '',
    address: '',
    province: '',
    city: '',
    industry: '',
    company_size: '',
    jumlah_karyawan: '' // Added field for number of employees
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${ip}/api/perusahaan/get`;
        const headers = {
          Authorization: localStorage.getItem("accessToken"),
        };

        const companyResponse = await axios.get(apiUrl, { headers });
        if (companyResponse.data && companyResponse.data.length > 0) {
          const data = companyResponse.data[0];
          setFormData(prevState => ({
            ...prevState,
            logo: data.logo || '',
            company_name: data.company_name || '',
            company_phone_number: data.company_pnumber || '',
            email: data.email || '',
            address: data.address || '',
            province: data.province || '',
            city: data.city || '',
            industry: data.industry || '',
            company_size: data.company_size || '',
          }));
        }

        // Fetch the number of employees
        const jumlahKaryawanResponse = await axios.get(`${ip}/api/perusahaan/jumlah`, { headers });
        if (jumlahKaryawanResponse.data && jumlahKaryawanResponse.data.length > 0) {
          setFormData(prevState => ({
            ...prevState,
            jumlah_karyawan: jumlahKaryawanResponse.data[0].jumlah_karyawan || '0'
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg">
      <div className="text-center mb-4">
        <img src={formData.logo} alt="Company Logo" className="mx-auto w-24 h-24 rounded-full object-cover" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Company Profile</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block font-semibold text-left">{key.replace(/_/g, ' ')}:</label>
            {key === 'show_branch_name' ? (
              <input 
                type="checkbox" 
                name={key} 
                checked={formData[key]} 
                readOnly 
                className="mt-1"
              />
            ) : (
              <input 
                type="text" 
                name={key} 
                value={formData[key]} 
                readOnly 
                className="mt-1 p-2 w-full border rounded bg-gray-100 drop-shadow-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyProfile;
