import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarModalProps {
  selectedDateTime: Date | null;
  onDateTimeSelect: (selectedDate: Date) => void;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  selectedDateTime,
  onDateTimeSelect,
  onClose,
}) => {
  const [localSelectedDateTime, setLocalSelectedDateTime] = useState<Date | null>(selectedDateTime);

  useEffect(() => {
    // Update local state when the selectedDateTime prop changes
    setLocalSelectedDateTime(selectedDateTime);
  }, [selectedDateTime]);

  const handleDateTimeSelect = (date: Date | null) => {
    setLocalSelectedDateTime(date);
  };

  const handleSave = () => {
    if (localSelectedDateTime) {
      onDateTimeSelect(localSelectedDateTime);
    }
    onClose();
  };

  return (
    <div>
      <div>
        <DatePicker
          selected={localSelectedDateTime}
          onChange={handleDateTimeSelect}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CalendarModal;
