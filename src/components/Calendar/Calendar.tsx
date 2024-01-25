import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css'

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
  onFocus: () => void;
  onBlur: () => void;
  onReset: () => void; // New callback for resetting the date and time
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, onFocus, onBlur, onReset }) => {
  return (
    <div>

      <button onClick={onReset}>X</button>

      <DatePicker
        className='datePicker'
        selected={selectedDate}
        onChange={onDateChange}
        onFocus={onFocus}
        onBlur={onBlur}
        showTimeSelect
        timeFormat="HH:mm"
        dateFormat="dd/MM/yy  HH:mm"
      />


    </div>
  );
};

export default Calendar;
