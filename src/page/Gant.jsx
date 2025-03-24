import React, { useEffect, useState, useRef } from "react";

const TaskList = ({ tasks, rowHeights, setRowHeights, headerRef }) => {
    const rowRefs = useRef([]);

    useEffect(() => {
        const heights = rowRefs.current.map((ref) => ref?.offsetHeight || 40);
        setRowHeights(heights);
    }, [tasks]);

    const [newTask, setNewTask] = useState({ 
        title: "", 
        assigned: "", 
        start: "", 
        due: "", 
        duration: 0, 
        progress: "0%", 
        color: "#4287f5" // Default color
    });
    
    const addTask = () => {
        const duration = Math.ceil((new Date(newTask.due) - new Date(newTask.start)) / (1000 * 60 * 60 * 24));
        setTasks([...tasks, { ...newTask, duration, progress: "0%" }]);
        setShowModal(false);
    };

    return (
        <div className="w-1/3 border-r bg-white">
            <table className="w-full text-left text-sm">
                <thead ref={headerRef} className="sticky top-0 bg-gray-200 z-10 h-12">
                    <tr>
                        <th className="p-2">Task Title</th>
                        <th className="p-2">Assigned To</th>
                        <th className="p-2">Start Date</th>
                        <th className="p-2">Due Date</th>
                        <th className="p-2">Duration</th>
                        <th className="p-2">% Complete</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index} ref={(el) => (rowRefs.current[index] = el)} className="border-b">
                            <td className="p-2 font-semibold">{task.title}</td>
                            <td className="p-2">{task.assigned}</td>
                            <td className="p-2">{task.start}</td>
                            <td className="p-2">{task.due}</td>
                            <td className="p-2">{task.duration}</td>
                            <td className="p-2">{task.progress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const GanttChart = ({ tasks, dates, rowHeights, headerHeight }) => {
    return (
        <div className="w-2/3 overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-gray-200 z-10" style={{ height: headerHeight }}>
                    <tr>
                        {dates.map((date, index) => (
                            <th key={index} className="min-w-[150px] text-center text-sm font-bold border-r">
                                <div>{date.toDateString().slice(0, 3)}</div>
                                <div>{date.toDateString().slice(4, 10)}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index} className="border-b" style={{ height: rowHeights[index] || 40 }}>
                            {dates.map((date, dateIndex) => {
                                const taskStart = new Date(task.start);
                                const taskEnd = new Date(task.due);
                                taskEnd.setHours(23, 59, 59, 999); // Pastikan mencakup seluruh hari terakhir

                                const isActive = taskStart.getTime() <= date.getTime() && taskEnd.getTime() >= date.getTime();

                                return (
                                    <td
                                        key={dateIndex}
                                        className={`min-w-[150px] ${isActive ? "bg-blue-500" : "bg-gray-100"} border-r`}
                                    ></td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

const Gant = () => {
    const [dates, setDates] = useState([]);
    const [tasks, setTasks] = useState([
        
    ]);
    const [rowHeights, setRowHeights] = useState([]);
    const [headerHeight, setHeaderHeight] = useState(48);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", assigned: "", start: "", due: "", duration: 0, progress: "0%" });
    const headerRef = useRef(null);
    const assignedOptions = ["Juan", "Allan", "Kenzie", "Priscilla"];

    useEffect(() => {
        generateDates();
    }, []);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [tasks]);

    const generateDates = () => {
        const today = new Date();
        const days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i);
            return date;
        });
        setDates(days);
    };

    const addTask = () => {
        const duration = Math.ceil((new Date(newTask.due) - new Date(newTask.start)) / (1000 * 60 * 60 * 24))+ 1;
        setTasks([...tasks, { ...newTask, duration, progress: "0%" }]);
        setShowModal(false);
    };
    

    return (
        <div className="flex flex-col p-4 w-full h-screen">
            <div className="flex w-full border-b bg-gray-100 justify-between p-2">
                <div className="w-1/3 bg-gray-200 p-2 font-bold">Tasks</div>
                <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setShowModal(true)}>Add</button>
            </div>
            <div className="flex w-full">
                <TaskList tasks={tasks} rowHeights={rowHeights} setRowHeights={setRowHeights} headerRef={headerRef} />
                <GanttChart tasks={tasks} dates={dates} rowHeights={rowHeights} headerHeight={headerHeight} />
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">Add Task</h2>
                        <input className="w-full p-2 border mb-2" placeholder="Title" onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                        <select className="w-full p-2 border mb-2" onChange={(e) => setNewTask({ ...newTask, assigned: e.target.value })}>
                            {assignedOptions.map((name) => <option key={name}>{name}</option>)}
                        </select>
                        <input className="w-full p-2 border mb-2" type="date" onChange={(e) => setNewTask({ ...newTask, start: e.target.value })} />
                        <input className="w-full p-2 border mb-2" type="date" onChange={(e) => setNewTask({ ...newTask, due: e.target.value })} />
                        <button className="bg-green-500 text-white p-2 rounded w-full" onClick={addTask}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gant;
