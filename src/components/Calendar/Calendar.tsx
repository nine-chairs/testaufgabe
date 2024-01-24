import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, onFocus, onBlur }) => (
  <DatePicker
    selected={selectedDate}
    onChange={onDateChange}
    onFocus={onFocus}
    onBlur={onBlur}
    showTimeSelect
    timeFormat="HH:mm"
    dateFormat="yyyy-MM-dd HH:mm"
  />
);

export default Calendar;
