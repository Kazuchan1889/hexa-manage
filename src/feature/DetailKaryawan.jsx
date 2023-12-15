import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
  overflow: "auto", // Enable scrolling
};

const popupStyle = {
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "600px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Center the items horizontally
  justifyContent: "center", // Center the items vertically
  margin: "0 auto", // Center the popup horizontally
};

const textStyle = {
  fontSize: "1rem",
  fontWeight: "normal",
  border: "none",
  borderBottom: "1px solid #ccc",
  padding: "0",
  margin: "0",
  width: "calc(100% - 80px)", // Adjust the width based on your needs
  textAlign: "left",
  outline: "none",
};

const DetailKaryawan = ({ karyawan, onClose }) => {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <div className="justify-center items-center">
          <h3 className="text-xl my-4">Detail Profile</h3>
          <div className="flex my-4 items-center">
            <img
              alt=""
              src={karyawan?.dokumen}
              className="h-20 w-20 rounded-full cursor-pointer mx-1"
            />
          </div>
        </div>
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <ViewItem label="Nomor Induk Karyawan" value={karyawan?.nikid} />
          <ViewItem label="Nama" value={karyawan?.nama} />
          <ViewItem label="Email" value={karyawan?.email} />
          <ViewItem label="No. Telp" value={karyawan?.notelp} />
          <ViewItem label="Tanggal Masuk" value={karyawan?.tglmasuk} />
          <ViewItem label="Tanggal Keluar" value={karyawan?.tglkeluar} />
          <ViewItem label="Tanggal Lahir" value={karyawan?.dob} />
          <ViewItem label="Jenis Kelamin" value={karyawan?.gender} />
          <ViewItem label="Tanggal Masuk" value={karyawan?.tglMasuk} />
          <ViewItem label="Status Pernikahan" value={karyawan?.maritalstatus} />
          <ViewItem label="Agama" value={karyawan?.religion} />
          <ViewItem label="Level" value={karyawan?.level} />
          <ViewItem label="Bank Account" value={karyawan?.bankacc} />
          <ViewItem label="Bank Account Name" value={karyawan?.bankaccname} />
          <ViewItem label="Lokasi Kerja" value={karyawan?.lokasikerja} />
          <ViewItem label="Alamat" value={karyawan?.alamat} />
          <ViewItem label="Jabatan" value={karyawan?.jabatan} />
          <ViewItem label="Divisi" value={karyawan?.divisi} />
          <ViewItem label="Status" value={karyawan?.status} />
          <ViewItem label="NIK (KTP)" value={karyawan?.nik} />
          <ViewItem label="NPWP" value={karyawan?.npwp} />
          <ViewItem
            label="Jatah Cuti (Mandiri)"
            value={karyawan?.cutimandiri}
          />
          <ViewItem
            label="Jatah Cuti (Bersama)"
            value={karyawan?.cutibersama}
          />
          <ViewItem label="Role" value={karyawan?.role} />
        </div>
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded-lg mt-5"
        >
          <p className="text-white font-semibold">Close</p>
        </button>
      </div>
    </div>
  );
};

export default DetailKaryawan;
