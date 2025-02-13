import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import {
    Menu as MenuIcon,
    HomeOutlined,
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
const menuItems = [
    {
        id: 1,
        icons: <HomeOutlined fontSize="large" />,
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        id: 2,
        icons: <Inventory2Outlined fontSize="large" />,
        label: "Form",
        dropdown: [
            { id: 21, label: "Time Off", path: "/Form" },
            { id: 22, label: "Reimburse", path: "/reimburst" },
            { id: 23, label: "Resign", path: "/resign" },
            { id: 24, label: "Overtime", path: "/OverUser" },
            { id: 25, label: "Report", path: "/laporan" },
        ],
    },
    {
        id: 3,
        icons: <DashboardOutlined fontSize="large" />,
        label: "Master Data",
        dropdown: [
            { id: 31, label: "Attendance", path: "/masterabsen" },
            { id: 32, label: "Permit", path: "/masterizin" },
            { id: 33, label: "Time Off", path: "/mastercuti" },
            { id: 34, label: "Reimburse", path: "/masterreimburst" },
            { id: 35, label: "Resign", path: "/masterresign" },
            { id: 36, label: "Report", path: "/masterlaporan" },
            { id: 37, label: "Geotech", path: "/geotech" },
            { id: 38, label: "Overtime", path: "/Over" },
        ],
    },
    {
        id: 4,
        icons: <Settings fontSize="large" />,
        label: "Schedule",
        path: "/Cal",
    },
    {
        id: 5,
        icons: <LayersOutlined fontSize="large" />,
        label: "User Management",
        dropdown: [
            { id: 39, label: "User Managment", path: "/UserDataManagement" },
            { id: 40, label: "Role", path: "/addrole" },

        ],
    },
];

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const [activeItem, setActiveItem] = useState(1);
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ logo: '' });
    

    const [userData, setUserData] = useState({
        nama: "",
        dokumen: null,
        jabatan: "",
        cutimandiri: ""
    });

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
                    cutimandiri: userData.cutimandiri || ""
                });
                localStorage.setItem("cutimandiri", userData.cutimandiri);
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
            setFormData(prevState => ({
              ...prevState,
              logo: data.logo || '',
            }));
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

    return (
        <nav className={`shadow-md py-2 flex flex-col duration-500 bg-[#204682] overflow-auto text-white ${open ? "w-60" : "w-16"}`}>
            {/* Header */}
            <div className="px-2 py-2 flex justify-end">
                <IconButton onClick={() => setOpen(!open)}>
                    <MenuIcon fontSize="medium" className={`text-white duration-500 ${!open && "rotate-180"}`} />
                </IconButton>
            </div>

            <div className="px-3 py-2 h-20 flex justify-center">
                <img src={formData.logo} className={`${open ? "w-auto" : "w-0"} rounded-md`} alt="logo" />
            </div>

            <div className="flex items-center gap-2 px-2 py-2">
                <Avatar>
                    <img src={userData.dokumen} alt="User Profile" />
                </Avatar>
                <div className={`flex-1 items-center leading-5 ${!open && "w-0 translate-x-24"} duration-500 overflow-hidden`}>
                    <div className="flex w-full justify-between">
                        <p className="text-left">{userData.nama}</p>
                        <EditIcon />
                    </div>
                </div>
            </div>

            {/* Menu */}
            <ul className="flex-1">
                {menuItems.map((item) => {
                    const isActive = activeItem === item.id;
                    const hasDropdown = item.dropdown && item.dropdown.length > 0;
                    const isDropdownOpen = openDropdown === item.id;

                    return (
                        <li key={item.id} className={`px-3 py-2 my-2 duration-300 cursor-pointer flex flex-col gap-2 relative group
                  ${isActive && !hasDropdown ? "bg-[#D9D9D9] text-[#204682]" : "hover:bg-blue-800"}`}
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
                                <p className={`${!open && "w-0 translate-x-24"} duration-500 overflow-hidden`}>
                                    {item.label}
                                </p>
                                {hasDropdown && (
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
