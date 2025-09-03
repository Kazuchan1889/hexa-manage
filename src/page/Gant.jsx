import React, { useState, useEffect } from "react";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import NavbarUser from "../feature/MobileNav"; // pastikan path sesuai
import Sidebar from "../feature/Sidebar"; // pastikan path sesuai

const GanttChart = () => {
  const [tasks, setTasks] = useState([
    {
      name: "Task A",
      description: "Deskripsi A",
      start: "2025-05-01",
      end: "2025-05-10",
      assignedTo: "Alan",
      color: "bg-blue-500",
    },
    {
      name: "Task B",
      description: "Deskripsi B",
      start: "2025-05-05",
      end: "2025-06-15",
      assignedTo: "Bella",
      color: "bg-green-500",
    },
  ]);

  const [scrollX, setScrollX] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    assignedTo: "",
  });

  // Deteksi apakah device mobile (contoh sederhana)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Start date tetap 1 Mei 2025 (bisa diubah sesuai kebutuhan)
  const startDate = new Date("2025-05-01");
  const now = new Date();

  // Cari tanggal akhir task paling jauh
  const maxTaskDate = tasks.length
    ? tasks.reduce((max, task) => {
        const taskEnd = parseISO(task.end);
        return taskEnd > max ? taskEnd : max;
      }, startDate)
    : startDate;

  // Tentukan endDate, pakai maxTaskDate kalau lebih jauh dari akhir bulan ini
  const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // akhir bulan ini
  const endDate = maxTaskDate > defaultEndDate ? maxTaskDate : defaultEndDate;

  const totalDays = differenceInDays(endDate, startDate) + 1;
  const daysArray = Array.from({ length: totalDays }, (_, i) =>
    addDays(startDate, i)
  );

  const getLeftPercent = (date) => {
    const diff = differenceInDays(parseISO(date), startDate);
    return (diff / totalDays) * 100;
  };

  const getWidthPercent = (start, end) => {
    const width = differenceInDays(parseISO(end), parseISO(start)) + 1;
    return (width / totalDays) * 100;
  };

  const handleAddTask = () => {
    const task = {
      ...newTask,
      color: "bg-pink-500",
    };
    setTasks([...tasks, task]);
    setShowModal(false);
    setNewTask({ name: "", description: "", start: "", end: "", assignedTo: "" });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-primary overflow-hidden">
      {isMobile ? <NavbarUser /> : <Sidebar isMobile={isMobile} />}
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="bg-[#11284E] text-white p-6 shadow-lg h-48">
          <h1 className="text-2xl font-bold mb-4">Gantt Chart</h1>

          <button
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setShowModal(true)}
          >
            New Task
          </button>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          <div className="overflow-x-auto relative border border-gray-300">
            <div
              className="flex sticky top-0 z-10 bg-white"
              style={{ transform: `translateX(-${scrollX}px)` }}
            >
              {daysArray.map((day, idx) => (
                <div
                  key={idx}
                  className="min-w-[80px] text-center border-r border-gray-200 p-1"
                >
                  <div className="text-xs text-gray-600">{format(day, "MMM")}</div>
                  <div className="text-sm font-medium">{format(day, "d")}</div>
                </div>
              ))}
            </div>

            <div className="relative" style={{ minWidth: `${totalDays * 80}px` }}>
              {tasks.map((task, idx) => (
                <div key={idx} className="relative h-12 border-b border-gray-200">
                  <div
                    className={`absolute h-full ${task.color} rounded`}
                    style={{
                      left: `${getLeftPercent(task.start)}%`,
                      width: `${getWidthPercent(task.start, task.end)}%`,
                      minWidth: "40px", // minimal lebar supaya tidak terlalu kecil
                    }}
                    title={`${task.name}: ${task.description}`}
                  ></div>
                  <div
                    className="absolute top-1 text-xs text-white px-2"
                    style={{ left: `${getLeftPercent(task.start)}%` }}
                  >
                    {task.name} ({task.assignedTo})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Add New Task</h2>
              <input
                className="w-full border p-2 mb-2"
                placeholder="Title"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
              <textarea
                className="w-full border p-2 mb-2"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full border p-2 mb-2"
                value={newTask.start}
                onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}
              />
              <input
                type="date"
                className="w-full border p-2 mb-2"
                value={newTask.end}
                onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}
              />
              <input
                className="w-full border p-2 mb-4"
                placeholder="Assigned To"
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleAddTask}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttChart;
