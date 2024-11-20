import React, { useState } from "react";
import EditDataKaryawan from "./EditDataKaryawan"; // Import halaman EditDataKaryawan

const ViewItem = ({ label, value }) => (
  <div className="flex items-center mb-3">
    <p className="w-3/4 text-left mr-24 whitespace-nowrap">{label}:</p>
    <input style={textStyle} value={value || ""} readOnly />
  </div>
);

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "auto",
};

const popupStyle = {
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "600px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
};

const textStyle = {
  fontSize: "1rem",
  fontWeight: "normal",
  border: "none",
  borderBottom: "1px solid #ccc",
  padding: "0",
  margin: "0",
  width: "calc(100% - 80px)",
  textAlign: "left",
  outline: "none",
};

const DetailKaryawan = ({ karyawan, onClose, fetchData, rows, setRows }) => {
  const [isEditMode, setIsEditMode] = useState(false); // State untuk mengatur mode edit
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // State untuk mengatur row yang dipilih

  const handleEditClick = () => {
    setIsEditMode(!isEditMode); // Toggle antara mode detail dan edit
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        {isEditMode ? (
          <EditDataKaryawan
            data={karyawan}
            onClose={() => setIsEditMode(false)}
            rows={rows}
            selectedRowIndex={selectedRowIndex}
            setRows={setRows}
            fetchData={fetchData}
          />
        ) : (
          <div className="justify-center items-center">
            <h3 className="text-xl my-4">Detail Profile</h3>
            <div className="flex my-4 items-center">
              <img
                alt=""
                src={karyawan?.dokumen}
                className="h-20 w-20 rounded-full cursor-pointer mx-1"
              />
            </div>
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <ViewItem label="Nomor Induk Karyawan" value={karyawan?.nikid} />
              <ViewItem label="Name" value={karyawan?.nama} />
              <ViewItem label="Email" value={karyawan?.email} />
              <ViewItem label="Phone Number" value={karyawan?.notelp} />
              <ViewItem label="Date of Entry" value={karyawan?.tglmasuk} />
              <ViewItem label="Exit Date" value={karyawan?.tglkeluar} />
              <ViewItem label="Date of Birth" value={karyawan?.dob} />
              <ViewItem label="Gender" value={karyawan?.gender} />
              <ViewItem label="Marital status" value={karyawan?.maritalstatus} />
              <ViewItem label="Religion" value={karyawan?.religion} />
              <ViewItem label="Level" value={karyawan?.level} />
              <ViewItem label="Bank Account" value={karyawan?.bankacc} />
              <ViewItem label="Bank Account Name" value={karyawan?.bankaccname} />
              <ViewItem label="Work Location" value={karyawan?.lokasikerja} />
              <ViewItem label="Adress" value={karyawan?.alamat} />
              <ViewItem label="Position" value={karyawan?.jabatan} />
              <ViewItem label="Divition" value={karyawan?.divisi} />
              <ViewItem label="Status" value={karyawan?.status} />
              <ViewItem label="NIK (KTP)" value={karyawan?.nik} />
              <ViewItem label="NPWP" value={karyawan?.npwp} />
              <ViewItem
                label="Leave Allowance (independent)"
                value={karyawan?.cutimandiri}
              />
              <ViewItem
                label="Leave Allowance (together)"
                value={karyawan?.cutibersama}
              />
              <ViewItem label="Role" value={karyawan?.role} />
            </div>
          </div>
        )}
        <div className="flex mt-5">
          <button
            onClick={handleEditClick}
            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg mr-2"
          >
            <p className="text-white font-semibold">{isEditMode ? "View" : "Edit"}</p>
          </button>
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            <p className="text-white font-semibold">Close</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailKaryawan;
