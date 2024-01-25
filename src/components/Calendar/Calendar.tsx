import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css'

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, onFocus, onBlur }) => {
  return (
    <>
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
    </>
  );
};

export default Calendar;
