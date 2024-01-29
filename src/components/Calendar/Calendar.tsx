import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css'

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, }) => {
  return (
    <>
      <DatePicker
        className='datePicker'
        data-test-id="orderTime"
        selected={selectedDate}
        onChange={onDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        dateFormat="dd/MM/yy      HH:mm"
        aria-label="Select Time and Date"
      />
    </>
  );
};

export default Calendar;
