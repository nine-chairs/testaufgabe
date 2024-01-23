import React, { useState, useEffect } from 'react';

const Calculator: React.FC = () => {
  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes}`;
  };

  const [cartValueInput, setCartValueInput] = useState<string>('');
  const [deliveryDistanceInput, setDeliveryDistanceInput] = useState<string>('');
  const [numberOfItemsInput, setNumberOfItemsInput] = useState<string>('');
  const [finalDeliveryFee, setFinalDeliveryFee] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [time, setTimeInput] = useState<string>(getCurrentTime());

  useEffect(() => {
    // Update time every second
    const intervalId = setInterval(() => {
      setTimeInput(getCurrentTime());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    const hours = now.getHours();

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
        Time:
        <input
          type="text"
          value={time}
          readOnly
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
