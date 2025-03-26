// import { useEffect } from "react";
// const { ipcRenderer } = window.require("electron");

const titlebar = () => {
//   useEffect(() => {
//     document.querySelector(".minimize").addEventListener("click", () => {
//       ipcRenderer.send("window-minimize");
//     });

//     document.querySelector(".maximize").addEventListener("click", () => {
//       ipcRenderer.send("window-maximize");
//     });

//     document.querySelector(".close").addEventListener("click", () => {
//       ipcRenderer.send("window-close");
//     });
//   }, []);

  return (
    <div className="flex items-center justify-between w-full h-10 bg-[#153162] text-white px-3 fixed top-0 left-0">
      {/* Bagian Kiri: Logo & Nama App */}
      <div className="flex items-center space-x-2 select-none -webkit-app-region-drag">
        <img src="./public/IconP.png" className="w-5 h-5" alt="App Icon" />
        <span className="text-sm font-semibold">HexaSuite</span>
      </div>

      {/* Bagian Kanan: Tombol Kontrol */}
      <div className="flex space-x-2">
        <button className="minimize w-10 h-10 flex items-center justify-center hover:bg-gray-700">
          ─
        </button>
        <button className="maximize w-10 h-10 flex items-center justify-center hover:bg-gray-700">
          🗖
        </button>
        <button className="close w-10 h-10 flex items-center justify-center hover:bg-red-600">
          ✕
        </button>
      </div>
    </div>
  );
};

export default titlebar;