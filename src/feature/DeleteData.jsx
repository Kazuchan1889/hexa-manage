import React from 'react';

const DeleteConfirmation = ({ onClose, onConfirm }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded shadow-lg relative z-10">
        <p className="mb-4">Apakah Anda yakin ingin menghapus data ini?</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Hapus
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
