import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import 'dayjs/locale/id'; // Menyesuaikan dengan bahasa lokal Anda

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const renderHeader = () => {
    const dateFormat = "MMMM YYYY";
    return (
      <div className="flex justify-between">
        <Button onClick={prevMonth}>&#8249;</Button>
        <span>{currentMonth.format(dateFormat)}</span>
        <Button onClick={nextMonth}>&#8250;</Button>
      </div>
    );
  };

  const renderDays = () => {
    dayjs.locale('id'); // Menggunakan bahasa lokal
    const days = dayjs.weekdaysShort().map(day => (
      <div key={day} className="text-center">
        {day}
      </div>
    ));
    return <div className="flex justify-between mt-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = currentMonth.startOf('month');
    const monthEnd = currentMonth.endOf('month');
    const startDate = monthStart.startOf('week');
    const endDate = monthEnd.endOf('week');

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(
          <div key={day} className="text-center">
            {day.format('D')}
          </div>
        );
        day = day.add(1, 'day');
      }
      rows.push(
        <div key={day} className="flex justify-between">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="flex flex-col mt-2">{rows}</div>;
  };

  const prevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  return (
    <div className="mx-auto max-w-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;