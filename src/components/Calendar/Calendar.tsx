import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
  onFocus: () => void;
  onBlur: () => void;
  onReset: () => void; // New callback for resetting the date and time
}

const CustomDatePicker: React.FC<CalendarProps> = ({ selectedDate, onDateChange, onFocus, onBlur, onReset }) => {
  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        onFocus={onFocus}
        onBlur={onBlur}
        showTimeSelect
        timeFormat="HH:mm"
        dateFormat="yyyy-MM-dd HH:mm"
      />
      <button onClick={onReset}>X</button> {/* Reset button */}
    </div>
  );
};

export default CustomDatePicker;
