function ViewData({  }) {
  //Untuk mengatur setting pada slider
  return (
    <div className="flex flex-col items-start w-full">
    <div className="flex flex-col items-start text-left">
      <div className="text-xl">
        Cuti Tahunan Balance
        <svg
          viewBox="0 0 1024 1024"
          fill="currentColor"
          height="1em"
          width="1em"
        >
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
          <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
        </svg>
      </div>
      <div className="text-2xl font-semibold">
        10 Days
      </div>
    </div>
    <div className="flex flex-col items-start text-left">
      <div className="text-xl">
        Jumlah Izin Digunakan 
        <svg
          viewBox="0 0 1024 1024"
          fill="currentColor"
          height="1em"
          width="1em"
        >
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
          <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
        </svg>
      </div>
      <div className="text-2xl font-semibold">
        0 Days
      </div>
    </div>
  </div>
  
  );
}
export default ViewData;