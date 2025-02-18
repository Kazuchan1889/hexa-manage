// src/App.js
import React, { useState, useEffect } from 'react';
import FormCuti from './FormCuti';
import FormIzin from './FormIzin';
import Head from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";
import NavbarUser from "../feature/NavbarUser";

function App() {
  const [selectedForm, setSelectedForm] = useState('cuti');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="flex flex-col flex-1 overflow-auto">
        <Head />
        {/* Center Content with Search Bar and Buttons */}
        <div className="bg-[#11284E] justify-center items-center text-white p-6 h-56">
          <h1 className="text-2xl font-bold mb-20 text-center">Request For Time off</h1>
          <div className="w-full h-3/4 mt-20 bg-[#D9D9D9] mx-auto rounded-t-[15px] flex flex-row items-center gap-3 p-4  justify-center">
            <button
              className={`w-1/2 h-1/2 rounded-[30px] text-xl font-bold text-center ${selectedForm === 'cuti' ? 'bg-[#204682] text-white-700' : ' text-black'}`}
              onClick={() => setSelectedForm('cuti')}
            >
              Leave Form
            </button>
            <button
              className={`w-1/2 h-1/2 rounded-[30px] text-xl font-bold text-center ${selectedForm === 'izin' ? 'bg-[#204682] text-white-700' : ' text-black'}`}
              onClick={() => setSelectedForm('izin')}
            >
              Permission Form
            </button>

          </div>

          {/* Render form berdasarkan pilihan user */}
          <div className="w-full mx-auto flex justify-center gap-3">
            {selectedForm === 'cuti' ? <FormCuti /> : <FormIzin />}
          </div>
          <div className="mt-4 flex justify-center items-center space-x-4">
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
