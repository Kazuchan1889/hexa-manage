import React, { useState, useEffect } from 'react';
import { TextField } from "@mui/material";
const UserSummary = () => {
    const date = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    return (
        <div >
            <div className='flex mx-2 justify-between border-b-2 pb-2 border-gray-300'>
                <TextField
                    type="number"
                    label="Year"
                    size="small"
                    className="w-1/6"
                // value={selectedYear} 
                // onChange={(e) => setSelectedYear(e.target.value)}
                ></TextField>
                <h1>
                    {date}
                </h1>
            </div>
            <div className='flex mx-4 my-2 justify-between'>
                <div>
                    <h1 className='font-bold'>Total Attendance</h1>
                    <h2 className='text-center'>5 days</h2>
                </div>
                <div>
                    <h1 className='font-bold'>Total Overtime</h1>
                    <h2 className='text-center'>5 hours</h2>
                </div>
                <div>
                    <h1 className='font-bold'>Total Day Off</h1>
                    <h2 className='text-center'>5 days</h2>
                </div>
            </div>
        </div>
    );
}

export default UserSummary;
