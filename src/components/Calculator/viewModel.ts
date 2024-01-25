import { useState, useEffect } from 'react';

interface ViewModelState {
  cartValueInput: string;
  deliveryDistanceInput: string;
  numberOfItemsInput: string;
  finalDeliveryFee: number | null;
  totalPrice: number | null;
  dateTime: string;
  isDatepickerOpen: boolean;
  isDateSelected: boolean;
}

const useViewModel = () => {
  const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initialState: ViewModelState = {
    cartValueInput: '',
    deliveryDistanceInput: '',
    numberOfItemsInput: '',
    finalDeliveryFee: null,
    totalPrice: null,
    dateTime: getCurrentDateTime(),
    isDatepickerOpen: false,
    isDateSelected: false,
  };

  const [state, setState] = useState<ViewModelState>(initialState);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!state.isDatepickerOpen && !state.isDateSelected) {
        setState((prev) => ({ ...prev, dateTime: getCurrentDateTime() }));
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [state.isDatepickerOpen, state.isDateSelected]);

  const parseInputValue = (value: string): number => {
    const normalizedValue = value.replace(',', '.');
    return parseFloat(normalizedValue);
  };

  const calculateDeliveryFee = () => {
    const parsedCartValue = parseInputValue(state.cartValueInput);
    const parsedDeliveryDistance = parseInputValue(state.deliveryDistanceInput);
    const parsedNumberOfItems = parseInputValue(state.numberOfItemsInput);

    if (parsedCartValue >= 200) {
      setState((prev) => ({ ...prev, finalDeliveryFee: 0, totalPrice: parsedCartValue }));
      return;
    }

    let totalFee = 0;

    if (parsedCartValue < 10) {
      const surcharge = 10 - parsedCartValue;
      totalFee += surcharge;
    }

    let distanceFee = parsedDeliveryDistance <= 1000 ? 2 : 2 + Math.ceil((parsedDeliveryDistance - 1000) / 500);
    distanceFee = Math.max(distanceFee, 1);
    totalFee += distanceFee;

    const numberOfItemsSurcharge = Math.max(parsedNumberOfItems - 4, 0) * 0.5;
    totalFee += numberOfItemsSurcharge;

    if (parsedNumberOfItems > 12) {
      totalFee += 1.2;
    }

    totalFee = Math.min(totalFee, 15);

    const selectedDateTime = new Date(state.dateTime.replace("T", " "));
    const dayOfWeek = selectedDateTime.getDay();
    const hours = selectedDateTime.getHours();

    if (dayOfWeek === 5 && hours >= 15 && hours <= 18) {
      totalFee *= 1.2;
    }

    totalFee = Math.min(totalFee, 15);

    totalFee = parseFloat(totalFee.toFixed(2));
    setState((prev) => ({
      ...prev,
      finalDeliveryFee: totalFee,
      totalPrice: totalFee + parsedCartValue,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ViewModelState) => {
    const { value } = e.target;
  
    // Ensure the input is a non-negative number before updating the state
    const sanitizedValue = value
      .replace(/[^0-9.-]/g, '') // Remove non-numeric characters except dots and minus signs
      .replace(/^-/, ''); // Remove leading minus sign, if any
  
    setState((prev) => ({ ...prev, [key]: sanitizedValue }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setState((prev) => ({ ...prev, dateTime: date.toISOString(), isDateSelected: true }));
    }
  };

  const handleDatepickerFocus = () => {
    setState((prev) => ({ ...prev, isDatepickerOpen: true }));
  };

  const handleDateBlur = () => {
    setState((prev) => ({ ...prev, isDateSelected: false }));
  };

  const resetDateTime = () => {
    setState((prev) => ({ ...prev, dateTime: getCurrentDateTime() }));
  };

  const areAllInputsFilled = () => {
    return (
      state.cartValueInput.trim() !== '' &&
      state.deliveryDistanceInput.trim() !== '' &&
      state.numberOfItemsInput.trim() !== ''
    );
  };

  return {
    state,
    calculateDeliveryFee,
    handleInputChange,
    handleDateChange,
    handleDatepickerFocus,
    handleDateBlur,
    resetDateTime,
    areAllInputsFilled,
  };
};

export default useViewModel;