import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "../ip";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    // Fetch data dari backend dengan header Authorization
    const apiUrl = `${ip}/api/perusahaan/get`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios.get(apiUrl, { headers })
      .then(response => {
        console.log(response)
        setCompanyData(response.data); // Mengatur data yang diterima dari backend ke state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  if (!companyData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        <img src={companyData.logo} alt="Company Logo" className="w-32 h-32 object-cover mb-4"/>
        <h1 className="text-2xl font-bold mb-2">{companyData.company_name}</h1>
        <p className="text-gray-700">{companyData.industry}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <strong>Phone Number:</strong>
            <p>{companyData.company_pnumber}</p>
          </div>
          <div>
            <strong>Email:</strong>
            <p>{companyData.email}</p>
          </div>
          <div>
            <strong>Address:</strong>
            <p>{companyData.address}</p>
          </div>
          <div>
            <strong>Province:</strong>
            <p>{companyData.province}</p>
          </div>
          <div>
            <strong>City:</strong>
            <p>{companyData.city}</p>
          </div>
          <div>
            <strong>Company Size:</strong>
            <p>{companyData.company_size}</p>
          </div>
          <div>
            <strong>Old NPWP:</strong>
            <p>{companyData.npwp_lama}</p>
          </div>
          <div>
            <strong>New NPWP:</strong>
            <p>{companyData.npwp_baru}</p>
          </div>
          <div>
            <strong>Company Taxable Date:</strong>
            <p>{companyData.company_taxable_date}</p>
          </div>
          <div>
            <strong>Taxperson NPWP:</strong>
            <p>{companyData.taxperson_npwp}</p>
          </div>
          <div>
            <strong>Taxperson NPWP 16 Digit:</strong>
            <p>{companyData.taxperson_npwp_16_digit}</p>
          </div>
          <div>
            <strong>HQ Initial:</strong>
            <p>{companyData.hq_initial}</p>
          </div>
          <div>
            <strong>HQ Code:</strong>
            <p>{companyData.hq_code}</p>
          </div>
          <div>
            <strong>Show Branch Name:</strong>
            <p>{companyData.show_branch_name}</p>
          </div>
          <div>
            <strong>UMR:</strong>
            <p>{companyData.umr}</p>
          </div>
          <div>
            <strong>UMR Province:</strong>
            <p>{companyData.umr_province}</p>
          </div>
          <div>
            <strong>UMR City:</strong>
            <p>{companyData.umr_city}</p>
          </div>
          <div>
            <strong>BPJS Ketenagakerjaan:</strong>
            <p>{companyData.bpjs_ketenagakerjaan}</p>
          </div>
          <div>
            <strong>JKK:</strong>
            <p>{companyData.jkk}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
