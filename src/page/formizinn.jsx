// src/App.js
import React, { useState } from 'react';
import FormCuti from './FormCuti';
import FormIzin from './FormIzin';
import NavbarUser from "../feature/NavbarUser";

function App() {
  const [selectedForm, setSelectedForm] = useState('cuti');

  return (
    <div className="h-screen">
      <NavbarUser />
      <div className="flex justify-end space-x-0 w-full">
        {/* Render button selection di dalam form */}
        <button
          className={`px-4 py-2 w-full text-center  ${selectedForm === 'cuti' ? 'bg-[#F3F4F6] text-gray-700' : 'bg-white text-black'}`}
          onClick={() => setSelectedForm('cuti')}
        >
          Leave Form
        </button>
        <button
          className={`px-4 py-2 w-full text-center  ${selectedForm === 'izin' ? 'bg-[#F3F4F6] text-gray-700' : 'bg-white text-black'}`}
          onClick={() => setSelectedForm('izin')}
        >
          Permission Form
        </button>
      </div>

      {/* Render form berdasarkan pilihan user */}
      <div className='h-full w-full mx-auto'>
        {selectedForm === 'cuti' ? <FormCuti /> : <FormIzin />}
      </div>
    </div>
  );
}

export default App;
