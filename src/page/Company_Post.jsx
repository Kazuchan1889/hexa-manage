import React, { useState, useEffect, useRef } from 'react';
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
    hq_initial: '',
    hq_code: '',
    show_branch_name: false,
    bpjs_ketenagakerjaan: '',
    jumlah_karyawan: '' // Added field for number of employees
  });

  const fileInputRef = useRef(null);

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
            hq_initial: data.hq_initial || '',
            hq_code: data.hq_code || '',
            show_branch_name: data.show_branch_name || false,
            bpjs_ketenagakerjaan: data.bpjs_ketenagakerjaan || ''
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prevState => ({
        ...prevState,
        logo: reader.result
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = `${ip}/api/perusahaan/update`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    try {
      const response = await axios.patch(apiUrl, formData, { headers });
      console.log(response.data);
      alert('Data berhasil ditambahkan');
    } catch (error) {
      console.error('Error posting data:', error);
      alert('Gagal menambahkan data');
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-4">
        <img 
          src={formData.logo} 
          alt="Company Logo" 
          className="mx-auto w-24 h-24 rounded-full object-cover cursor-pointer"
          onClick={handleLogoClick} 
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Add Company Profile</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.keys(formData).map((key) => (
            key !== 'logo' && key !== 'company_name' && (
              <div key={key}>
                <label className="block font-semibold text-left">{key.replace(/_/g, ' ')}:</label>
                {key === 'show_branch_name' ? (
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key]}
                    onChange={handleChange}
                    className="mt-1"
                  />
                ) : key === 'jumlah_karyawan' ? (
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    readOnly
                    className="mt-1 p-2 w-full border rounded bg-gray-100 drop-shadow-md"
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded drop-shadow-md"
                  />
                )}
              </div>
            )
          ))}
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default AddCompanyProfile;
