import { useState, useEffect } from 'react'

interface ViewModelState {
  cartValue: number
  deliveryDistance: number
  numberOfItems: number
  dateTime: string
  finalDeliveryFee: number | null
  totalPrice: number | null
  isTimeIntervalUpdating: boolean,
}

const useViewModel = () => {
  // getting the time and date from the browser
  const getCurrentDateTime = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const initialState: ViewModelState = {
    cartValue: 0,
    deliveryDistance: 0,
    numberOfItems: 0,
    dateTime: getCurrentDateTime(),
    finalDeliveryFee: null,
    totalPrice: null,
    isTimeIntervalUpdating: true,
  }

  const [state, setState] = useState<ViewModelState>(initialState)

  // make sure that the time updates every second
  const updateTimeInterval = () => {
    const intervalId = setInterval(() => {
      if (state.isTimeIntervalUpdating) {
        setState((prev) => ({ ...prev, dateTime: getCurrentDateTime() }))
        console.log('tik-tak')
      }
    }, 1000)
    return () => clearInterval(intervalId)
  }

  useEffect(updateTimeInterval, [state.isTimeIntervalUpdating])

  // function which calculates the delivery fee
  const calculateDeliveryFee = () => {
    const cartValue = state.cartValue
    const deliveryDistance = state.deliveryDistance
    const numberOfItems = state.numberOfItems

    // the delivery is free when cart value is equal or more than 200
    if (cartValue >= 200) {
      setState((prev) => ({ ...prev, finalDeliveryFee: 0, totalPrice: cartValue }))
      return
    }

    let finalFee = 0

    // if the cart value is less than 10, a surcharge is added (difference between the cart value and 10)
    if (cartValue < 10) {
      const surcharge = 10 - cartValue
      finalFee += surcharge
    }

    // calculating the distance fee
    let distanceFee = deliveryDistance <= 1000 ? 2 : 2 + Math.ceil((deliveryDistance - 1000) / 500)
    distanceFee = Math.max(distanceFee, 1)
    finalFee += distanceFee

    // calculating the surcharge if number of items is five or more
    const numberOfItemsSurcharge = Math.max(numberOfItems - 4, 0) * 0.5
    finalFee += numberOfItemsSurcharge
    if (numberOfItems > 12) {
      finalFee += 1.2
    }

    // calculating the fee during the friday rush
    const selectedDateTime = new Date(state.dateTime.replace("T", " "))
    const dayOfWeek = selectedDateTime.getDay()
    const hours = selectedDateTime.getHours()
    if (dayOfWeek === 5 && hours >= 15 && hours <= 18) {
      finalFee *= 1.2
    }

    // the delivery fee can never be more than 15
    finalFee = Math.min(finalFee, 15)

    const roundedFinalFee = Math.round(finalFee * 100) / 100
    const roundedTotalPrice = Math.round((finalFee + cartValue) * 100) / 100

    setState((prev) => ({
      ...prev,
      finalDeliveryFee: roundedFinalFee,
      totalPrice: roundedTotalPrice,
    }))
  }

  // parsing values from input fields which expect floats (cart value)
  const handleFloatInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ViewModelState) => {
    let { value } = e.target
    if (value === '') {
      value = '0'
    }
    const [integerPart, decimalPart] = value.split('.')
    let formattedFloatValue = integerPart + (decimalPart ? `.${decimalPart.slice(0, 2)}` : '')
    formattedFloatValue = formattedFloatValue.replace(/^0+(?=\d*\.\d)/, '')
    e.target.value = formattedFloatValue
    const formattedNumericValue = parseFloat(formattedFloatValue.replace(',', '.'))
    setState((prev) => ({ ...prev, [key]: formattedNumericValue }))
  }

  // parsing values from input fields which expect integers (distance, number of items)
  const handleIntegerInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ViewModelState) => {
    let { value } = e.target
    if (value === '') {
      value = '0'
    }
    const integerPart = value.split('.')[0]
    const formattedIntegerValue = integerPart.replace(/^0+(?=\d)/, '')
    e.target.value = formattedIntegerValue
    const formattedNumericValue = parseInt(formattedIntegerValue)
    setState((prev) => ({ ...prev, [key]: formattedNumericValue }))
  }


  // function that sets the delivery time and date
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setState((prev) => ({ ...prev, dateTime: date.toISOString(), isTimeIntervalUpdating: false }))
    }
  }

  // function that resets the delivery time and date 
  const resetDateTime = () => {
    setState((prev) => ({ ...prev, dateTime: getCurrentDateTime(), isTimeIntervalUpdating: true }))
    console.log('hey you')
    console.log(state.isTimeIntervalUpdating)
  }

  // make sure if all input fields are filled in order to enable the 'calculate price' button
  const areAllInputsFilled = () => {
    return (
      state.cartValue > 0 &&
      state.deliveryDistance > 0 &&
      state.numberOfItems > 0
    )
  }

  return {
    state,
    calculateDeliveryFee,
    handleFloatInputChange,
    handleIntegerInputChange,
    handleDateChange,
    resetDateTime,
    areAllInputsFilled,
  }
}

export default useViewModel