import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Menu as MenuIcon, HomeOutlined, Settings, DashboardOutlined, Inventory2Outlined, ReceiptOutlined, LayersOutlined, PersonOutline } from '@mui/icons-material';

const menuItems = [
    {
        id: 1,
        icons: <HomeOutlined fontSize="large" />,
        label: 'Dashboard'
    },
    {
        id: 2,
        icons: <Inventory2Outlined fontSize="large" />,
        label: 'Form',
        dropdown: [
            { id: 21, label: 'Product A' },
            { id: 22, label: 'Product B' },
            { id: 23, label: 'Product C' }
        ]
    },
    {
        id: 3,
        icons: <DashboardOutlined fontSize="large" />,
        label: 'Master Data',
        dropdown: [
            { id: 31, label: 'Overview' },
            { id: 32, label: 'Analytics' },
            { id: 33, label: 'Reports' }
        ]
    },
    {
        id: 4,
        icons: <Settings fontSize="large" />,
        label: 'Schedule'
    },
    {
        id: 5,
        icons: <LayersOutlined fontSize="large" />,
        label: 'User Managment'
    }
];

export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const [activeItem, setActiveItem] = useState(1);
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleDropdownToggle = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    return (
        <nav className={`shadow-md py-2 flex flex-col duration-500 bg-[#204682] text-white ${open ? 'w-60' : 'w-16'}`}>
            {/* Header */}
            <div className='px-2 py-2 flex justify-end'>
                <IconButton onClick={() => setOpen(!open)}>
                    <MenuIcon fontSize='large' className={`text-white duration-500 ${!open && 'rotate-180'}`} />
                </IconButton>
            </div>
            <div className='px-3 py-2 h-20 flex justify-center'>
                <img
                    src="/logo-login.png"
                    className={`${open ? 'w-auto' : 'w-0'} rounded-md`}
                    alt="logo"
                    href="/dashboard"
                ></img>
                {/* <img alt="Logo" className={`${open ? 'w-10' : 'w-0'} rounded-md`} /> */}
            </div>
            <div className='flex items-center gap-2 px-3 py-2'>
                <PersonOutline fontSize="large" />
                <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
                    <p>Saheb</p>
                </div>
            </div>
            {/* Body */}
            <ul className='flex-1'>
                {menuItems.map((item) => {
                    const isActive = activeItem === item.id;
                    const hasDropdown = item.dropdown && item.dropdown.length > 0;
                    const isDropdownOpen = openDropdown === item.id;

                    return (
                        <li
                            key={item.id}
                            className={`px-3 py-2 my-2 duration-300 cursor-pointer flex flex-col gap-2 relative group
                            ${isActive && !hasDropdown ? 'bg-[#D9D9D9] text-[#204682]' : 'hover:bg-blue-800'}`}
                        >
                            {/* Main menu item */}
                            <div
                                onClick={() => hasDropdown ? handleDropdownToggle(item.id) : setActiveItem(item.id)}
                                className='flex items-center gap-2'
                            >
                                <div>{item.icons}</div>
                                <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
                                    {item.label}
                                </p>
                                {hasDropdown && (
                                    <span className='ml-auto'>{isDropdownOpen ? '-' : '+'}</span>
                                )}
                            </div>

                            {/* Dropdown items */}
                            {hasDropdown && isDropdownOpen && (
                                <ul className={`pl-8 mt-2 flex flex-col gap-1 ${!open && 'hidden'}`}>
                                    {item.dropdown.map((dropdownItem) => (
                                        <li
                                            key={dropdownItem.id}
                                            className={`py-1 hover:bg-blue-700 rounded-md cursor-pointer
                                            ${activeItem === dropdownItem.id ? 'bg-[#D9D9D9] text-[#204682]' : ''}`}
                                            onClick={() => setActiveItem(dropdownItem.id)}
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
}
