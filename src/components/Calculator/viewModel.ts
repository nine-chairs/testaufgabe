import { useState, useEffect } from 'react';

interface ViewModelState {
  cartValueInput: number;
  deliveryDistanceInput: number;
  numberOfItemsInput: number;
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
    cartValueInput: 0,
    deliveryDistanceInput: 0,
    numberOfItemsInput: 0,
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

  const calculateDeliveryFee = () => {
    const cartValue = state.cartValueInput;
    const deliveryDistance = state.deliveryDistanceInput;
    const numberOfItems = state.numberOfItemsInput;

    if (cartValue >= 200) {
      setState((prev) => ({ ...prev, finalDeliveryFee: 0, totalPrice: cartValue }));
      return;
    }

    let finalFee = 0;

    if (cartValue < 10) {
      const surcharge = 10 - cartValue;
      finalFee += surcharge;
    }

    let distanceFee = deliveryDistance <= 1000 ? 2 : 2 + Math.ceil((deliveryDistance - 1000) / 500);
    distanceFee = Math.max(distanceFee, 1);
    finalFee += distanceFee;

    const numberOfItemsSurcharge = Math.max(numberOfItems - 4, 0) * 0.5;
    finalFee += numberOfItemsSurcharge;

    if (numberOfItems > 12) {
      finalFee += 1.2;
    }

    const selectedDateTime = new Date(state.dateTime.replace("T", " "));
    const dayOfWeek = selectedDateTime.getDay();
    const hours = selectedDateTime.getHours();

    if (dayOfWeek === 5 && hours >= 15 && hours <= 18) {
      finalFee *= 1.2;
    }

    // rush hour condition
    finalFee = Math.min(finalFee, 15);

    const roundedFinalFee = Math.round(finalFee * 100) / 100;
    const roundedTotalPrice = Math.round((finalFee + cartValue) * 100) / 100;

    setState((prev) => ({
      ...prev,
      finalDeliveryFee: roundedFinalFee,
      totalPrice: roundedTotalPrice,
    }));
  };

  const handleFloatInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ViewModelState) => {
    const { value } = e.target;
  
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, '');
  
    // Split the input into integer and decimal parts
    const [integerPart, decimalPart] = numericValue.split('.');
  
    // Format the input to have at most two decimal places
    const formattedValue = decimalPart !== undefined ? `${integerPart}.${decimalPart.slice(0, 2)}` : integerPart;
  
    // Update the input field value directly
    e.target.value = formattedValue;
  
    // Update the state
    setState((prev) => ({ ...prev, [key]: parseFloat(formattedValue) }));
  };
  
  

  const handleIntegerInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ViewModelState) => {
    const { value } = e.target;
    const numericValue = parseInt(value);
    setState((prev) => ({ ...prev, [key]: numericValue }));
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
      state.cartValueInput > 0 &&
      state.deliveryDistanceInput > 0 &&
      state.numberOfItemsInput > 0
    );
  };

  return {
    state,
    calculateDeliveryFee,
    handleFloatInputChange,
    handleIntegerInputChange,
    handleDateChange,
    handleDatepickerFocus,
    handleDateBlur,
    resetDateTime,
    areAllInputsFilled,
  };
};

export default useViewModel;