// src/App.js
import React, { useState, useEffect } from 'react';
import FormCuti from './FormCuti';
import FormIzin from './FormIzin';
import Head from "../feature/Headbar";
import Sidebar from "../feature/Sidebar";
import NavbarUser from "../feature/MobileNav";

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
        <div className="bg-[#11284E] flex flex-col justify-center items-center text-white p-6 min-h-[14rem]">
          <h1 className="text-2xl font-bold mb-4 text-center">Request For Time off</h1>
          <div className="w-full max-w-2xl bg-[#D9D9D9] mx-auto rounded-t-[15px] flex flex-row items-center gap-3 p-4 justify-center">
            <button
              className={`w-1/2 py-3 rounded-[30px] border border-black text-xl font-bold text-center transition-colors ${selectedForm === 'cuti' ? 'bg-[#204682] text-white' : 'bg-white text-black'}`}
              onClick={() => setSelectedForm('cuti')}
            >
              Leave Form
            </button>
            <button
              className={`w-1/2 py-3 rounded-[30px] border border-black text-xl font-bold text-center transition-colors ${selectedForm === 'izin' ? 'bg-[#204682] text-white' : 'bg-white text-black'}`}
              onClick={() => setSelectedForm('izin')}
            >
              Permission Form
            </button>
          </div>
        </div>

        {/* Render form berdasarkan pilihan user */}
        <div className="w-full mx-auto flex justify-center px-4 py-6">
          <div className="w-full max-w-4xl">
            {selectedForm === 'cuti' ? <FormCuti /> : <FormIzin />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
