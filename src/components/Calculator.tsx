import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles

const Calculator: React.FC = () => {
  const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [cartValueInput, setCartValueInput] = useState<string>('');
  const [deliveryDistanceInput, setDeliveryDistanceInput] = useState<string>('');
  const [numberOfItemsInput, setNumberOfItemsInput] = useState<string>('');
  const [finalDeliveryFee, setFinalDeliveryFee] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [dateTime, setDateTime] = useState<string>(getCurrentDateTime());
  const [isDatepickerOpen, setIsDatepickerOpen] = useState<boolean>(false);
  const [isDateSelected, setIsDateSelected] = useState<boolean>(false);

  useEffect(() => {
    // Update date and time every second only if the datepicker is not open and a date is not selected
    const intervalId = setInterval(() => {
      if (!isDatepickerOpen && !isDateSelected) {
        setDateTime(getCurrentDateTime());
      }
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [isDatepickerOpen, isDateSelected]);

  const handleDateChange = (date: Date | null) => {
    // Update date state when the date is selected
    if (date) {
      setDateTime(date.toISOString());
      setIsDateSelected(true);
    }
  };

  const handleDateBlur = () => {
    // Reset isDateSelected when the datepicker loses focus (closed without selecting a date)
    setIsDateSelected(false);
  };

  const parseInputValue = (value: string): number => {
    // Replace commas with dots and then parse the value
    const normalizedValue = value.replace(',', '.');
    return parseFloat(normalizedValue);
  };

  const calculateDeliveryFee = () => {
    const parsedCartValue = parseInputValue(cartValueInput);
    const parsedDeliveryDistance = parseInputValue(deliveryDistanceInput);
    const parsedNumberOfItems = parseInputValue(numberOfItemsInput);

    // Check if cart value is equal to or more than 200€
    if (parsedCartValue >= 200) {
      setFinalDeliveryFee(0); // Delivery is free
      setTotalPrice(parsedCartValue);
      return;
    }

    let totalFee = 0;

    // 1. Add surcharge if cart value is less than 10
    if (parsedCartValue < 10) {
      const surcharge = 10 - parsedCartValue;
      totalFee += surcharge;
    }

    // 2. Calculate the distance fee
    let distanceFee = parsedDeliveryDistance <= 1000 ? 2 : 2 + Math.ceil((parsedDeliveryDistance - 1000) / 500);
    distanceFee = Math.max(distanceFee, 1); // Ensure the minimum fee is 1€
    totalFee += distanceFee;

    // 3. Add surcharge based on the number of items
    const numberOfItemsSurcharge = Math.max(parsedNumberOfItems - 4, 0) * 0.5;
    totalFee += numberOfItemsSurcharge;

    // 4. Add bulk fee for more than 12 items
    if (parsedNumberOfItems > 12) {
      totalFee += 1.2;
    }

    // 5. Ensure the total fee does not exceed 15€
    totalFee = Math.min(totalFee, 15);

    // 6. Apply time-based surcharge if day is Friday and time is from 3 to 7
    const selectedDateTime = new Date(dateTime.replace("T", " "));
    const dayOfWeek = selectedDateTime.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    const hours = selectedDateTime.getHours();

    if (dayOfWeek === 5 && hours >= 15 && hours <= 19) {
      totalFee *= 1.2; // Multiply the total fee by 1.2x
    }

    // 7. Ensure the total fee does not exceed 15€
    totalFee = Math.min(totalFee, 15);

    // Update the state with the calculated fee
    totalFee = parseFloat(totalFee.toFixed(2));
    setFinalDeliveryFee(totalFee);

    let totalPrice = totalFee + parsedCartValue;
    totalPrice = parseFloat(totalPrice.toFixed(2));
    setTotalPrice(totalPrice);
  };

  return (
    <div>
      <label>
        Cart Value (in euros):
        <input
          type="number"
          value={cartValueInput}
          onChange={(e) => setCartValueInput(e.target.value)}
        />
      </label>
      <br />
      <label>
        Delivery Distance (in meters):
        <input
          type="number"
          value={deliveryDistanceInput}
          onChange={(e) => setDeliveryDistanceInput(e.target.value)}
        />
      </label>
      <br />
      <label>
        Number of items:
        <input
          type="number"
          value={numberOfItemsInput}
          onChange={(e) => setNumberOfItemsInput(e.target.value)}
        />
      </label>
      <br />
      <label>
        Date and Time:
        <DatePicker
          selected={new Date(dateTime)}
          onChange={handleDateChange}
          onFocus={() => setIsDatepickerOpen(true)}
          onBlur={handleDateBlur}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="yyyy-MM-dd HH:mm"
        />
      </label>
      <br />
      <button onClick={calculateDeliveryFee}>Calculate Fee</button>
      <br />
      {finalDeliveryFee !== null && (
        <div>
          <strong>Delivery Fee:</strong> {finalDeliveryFee} euros <br />
          <strong>Total:</strong> {totalPrice} euros
        </div>
      )}
    </div>
  );
};

export default Calculator;
