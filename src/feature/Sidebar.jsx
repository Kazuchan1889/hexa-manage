import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import {
    Menu as MenuIcon,
    Settings,
    DashboardOutlined,
    Inventory2Outlined,
    LayersOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import ip from "../ip";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AttachMoneyOutlined } from "@mui/icons-material";


const menuItems = [
    {
        id: 1,
        icons: <img src="/Home.png" alt="Dashboard" className="w-6 h-6 mr-3 object-contain" />,
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        id: 2,
        icons: <img src="/Form.png" alt="Dashboard" className="w-5 h-5 mr-4  object-contain" />,
        label: "Form",
        dropdown: [
            { id: 21, label: "Time Off", path: "/Form" },
            { id: 22, label: "Reimburse", path: "/reimburst" },
            { id: 23, label: "Resign", path: "/resign" },
            { id: 24, label: "Overtime", path: "/OverUser" },
            { id: 25, label: "Report form", path: "/laporan" },
            { id: 25, label: "Activity", path: "/key" },
        ],
    },
    {
        id: 3,
        icons: <img src="/Master.png" alt="Dashboard" className="w-5 h-5 mr-4  object-contain" />,
        label: "Master Data",
        dropdown: [
            { id: 31, label: "Attendance", path: "/masterabsen" },
            { id: 32, label: "Permit", path: "/masterizin" },
            { id: 33, label: "Time Off", path: "/mastercuti" },
            // { id: 34, label: "Reimburse", path: "/masterreimburst" },
            { id: 35, label: "Resign", path: "/masterresign" },
            { id: 36, label: "Report", path: "/masterlaporan" },
            { id: 37, label: "Geotech", path: "/geotech" },
            { id: 38, label: "Overtime", path: "/Over" },
            { id: 38, label: "Employe Tracker", path: "/Masterkey" },
        ],
    },
    {
        id: 4,
        icons: <img src="/Schedule.png" alt="Dashboard" className="w-5 h-5 mr-4  object-contain" />,
        label: "Schedule",
        path: "/Cal",
    },
    {
        id: 5,
        icons: <img src="/User.png" alt="Dashboard" className="w-5 h-5 mr-4  object-contain" />,
        label: "User Management",
        dropdown: [
            { id: 39, label: "User Managment", path: "/UserDataManagement" },
            { id: 40, label: "Role", path: "/addrole" },
        ],
    },
    {
        id: 6,
        icons: <AttachMoneyOutlined fontSize="large" />, // Ganti ikon jika kamu mau
        label: "Finance",
        dropdown: [
            { id: 41, label: "Reimburse", path: "/masterreimburst" },
            { id: 42, label: "Payroll", path: "/masterpayroll" },
        ],
    },
];


const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const [activeItem, setActiveItem] = useState(1);
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ logo: '' });
    const role = localStorage.getItem("role");


    const [userData, setUserData] = useState({
        nama: "",
        dokumen: null,
        jabatan: "",
        cutimandiri: "",
        status: ""
    });
    const [loading, setLoading] = useState(true); // State untuk memantau loading

    useEffect(() => {
        const apiUrl = `${ip}/api/karyawan/get/data/self`;
        const headers = {
            Authorization: localStorage.getItem("accessToken"),
        };

        axios
            .get(apiUrl, { headers })
            .then((response) => {
                const userData = response.data[0];
                checkRequiredProperties(userData, ["alamat", "email", "notelp", "nik", "bankname", "bankacc", "maritalstatus"]);
                setUserData({
                    nama: userData.nama || "",
                    dokumen: userData.dokumen || null,
                    jabatan: userData.jabatan || "",
                    cutimandiri: userData.cutimandiri || "",
                    status: userData.status || ""
                });
                localStorage.setItem("cutimandiri", userData.cutimandiri);
                setLoading(false); // Set loading ke false setelah data ter-fetch
            })
            .catch((error) => {
                console.error("Error", error);
                Swal.fire({
                    icon: "error",
                    title: "Data Not Available",
                    text: "User data is not available. Please check your internet connection or try again later.",
                });
            });
    }, []);
    const checkRequiredProperties = (data, requiredProperties) => {
        const emptyProperties = requiredProperties.filter(property => !data[property]);
        if (emptyProperties.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete User Data",
                text: `Please fill out all required user data fields: ${emptyProperties.join(", ")}`,
            });
        }
    };
    //logo
    const fetchData = async () => {
        try {
            const apiUrl = `${ip}/api/perusahaan/get`;
            const headers = {
                Authorization: localStorage.getItem("accessToken"),
            };

            const companyResponse = await axios.get(apiUrl, { headers });
            if (companyResponse.data && companyResponse.data.length > 0) {
                const data = companyResponse.data[0];
                setFormData(prevState => {
                    if (!prevState.logo) {
                        return {
                            ...prevState,
                            logo: data.logo || '',
                        };
                    }
                    return prevState;
                });
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    };
    fetchData();

    // Fungsi untuk menangani navigasi
    const handleMenuItemClick = (item) => {
        if (item.path) {
            navigate(item.path);
            setActiveItem(item.id);
            setOpenDropdown(null);
        }
    };

    const handleDropdownToggle = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const filteredMenuItems = menuItems
        .map(item => {
            // Jika role "head" dan item Master Data, filter hanya menu tertentu
            if (item.label === "Master Data" && role === "head") {
                const allowedForHead = ["Attendance", "Time Off", "Permit", "Report"];
                const filteredDropdown = item.dropdown.filter(subItem =>
                    allowedForHead.includes(subItem.label)
                );
                return { ...item, dropdown: filteredDropdown };
            }

            return item;
        })
        .filter(item => {
            // Jika role bukan admin/head, sembunyikan Master Data dan User Management
            if ((item.label === "User Management" || item.label === "Master Data") &&
                role !== "admin" && role !== "head") {
                return false;
            }

            // Jika role head, sembunyikan User Management
            if (item.label === "User Management" && role === "head") {
                return false;
            }

            // Jika role finance, sembunyikan Master Data
            if (item.label === "Master Data" && role === "finance") {
                return false;
            }

            // Tampilkan Finance hanya untuk role finance
            if (item.label === "Finance") {
                return role === "finance";
            }

            // Default: tampilkan
            return true;
        });


    return (
        <nav className={`shadow-md py-2 flex flex-col duration-500 bg-[#204682] overflow-auto text-white ${open ? "w-60" : "w-16"}`}>
            {/* Header */}
            {/* <IconButton onClick={() => setOpen(!open)}> */}
            <div className="flex items-center mb-4 ml-4">
                <img src={formData.logo} className={`${open ? "w-auto h-12" : "w-0"} rounded-md`} alt="logo" />
                {/* <MenuIcon fontSize="medium" className={`text-white duration-500 ${!open && "rotate-180"}`} /> */}
            </div>
            {/* </IconButton> */}




            <div className="flex-col mb-3 bg-[#11284E] rounded-md gap-2 mx-2 px-2 py-2">
                <div className="flex ml-1 items-center">
                    <Avatar className="w-4 h-4">
                        {loading ? (
                            <div className="w-10 h-10 bg-gray-500 rounded-full animate-pulse"></div> // Skeleton untuk gambar
                        ) : (
                            <img src={userData.dokumen} alt="User Profile" />
                        )}
                    </Avatar>
                    <div className="flex w-full justify-between">
                        <p className="text-left font-semibold text-lg ml-2">
                            {loading ? (
                                <div className="w-36 h-6 bg-gray-500 rounded animate-pulse"></div> // Skeleton untuk nama
                            ) : (
                                userData.nama
                            )}
                        </p>
                        <EditIcon />
                    </div>
                </div>
                <div className="text-left ml-1 mt-3.5 text-[16px] font-sm font-semibold">
                    {loading ? (
                        <div className="w-28 h-4 bg-gray-500 rounded animate-pulse"></div> // Skeleton untuk jabatan
                    ) : (
                        userData.jabatan
                    )}
                </div>
                <div className="text-left ml-1 text-[16px]">
                    {loading ? (
                        <div className="w-24 h-4 bg-gray-500 rounded animate-pulse mt-4"></div> // Skeleton untuk status
                    ) : (
                        userData.status
                    )}
                </div>
                <div className="text-left ml-1 text-[16px]">
                    Hexaon Business Mitrasindo
                </div>

                <div className={`flex-1 items-center leading-5 ${!open && "w-0 translate-x-24"} duration-500 overflow-hidden`}></div>
            </div>

            {/* Menu */}
            <ul className="flex-1">
                {filteredMenuItems.map((item) => {
                    const isActive = activeItem === item.id;
                    const hasDropdown = item.dropdown && item.dropdown.length > 0;
                    const isDropdownOpen = openDropdown === item.id;

                    return (
                        <li key={item.id} className={`px-4 py-2 my-2 duration-300 cursor-pointer flex flex-col relative group
                  ${isActive && !hasDropdown ? " text-[#ffffff]" : "hover:bg-[#3973CF]"}`}
                            onClick={() => handleMenuItemClick(item)}
                        >
                            {/* Main menu item */}
                            <div
                                onClick={() => {
                                    if (hasDropdown) {
                                        handleDropdownToggle(item.id);
                                    } else {
                                        handleMenuItemClick(item);
                                    }
                                }}
                                className="flex items-center gap-2"
                            >
                                <div>{item.icons}</div>
                                <p className={`${!open && "w-0 translate-x-24"} text-xs lg:text-[16px] font-semibold duration-500 overflow-hidden`}>
                                    {item.label}
                                </p>
                                {hasDropdown && open && (
                                    <span className="ml-auto">{isDropdownOpen ? "-" : "+"}</span>
                                )}
                            </div>

                            {/* Dropdown items */}
                            {hasDropdown && isDropdownOpen && (
                                <ul className={`pl-8 mt-2 flex flex-col gap-1 ${!open && "hidden"}`}>
                                    {item.dropdown.map((dropdownItem) => (
                                        <li
                                            key={dropdownItem.id}
                                            className={`py-1 hover:bg-blue-700 rounded-md cursor-pointer
                          ${activeItem === dropdownItem.id ? "bg-[#D9D9D9] text-[#204682]" : ""}`}
                                            onClick={() => handleMenuItemClick(dropdownItem)}
                                        >
                                            {dropdownItem.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Sidebar;
