import React, { useState } from 'react'

const Calculator: React.FC = () => {
  const [cartValueInput, setCartValueInput] = useState<string>('')
  const [deliveryDistanceInput, setDeliveryDistanceInput] = useState<string>('')
  const [numberOfItemsInput, setNumberOfItemsInput] = useState<string>('')
  const [finalFee, setFinalFee] = useState<number | null>(null)

  const parseInputValue = (value: string): number => {
    // Replace commas with dots and then parse the value
    const normalizedValue = value.replace(',', '.')
    return parseFloat(normalizedValue)
  }

  const calculateFee = () => {
    const parsedCartValue = parseInputValue(cartValueInput)
    const parsedDeliveryDistance = parseInputValue(deliveryDistanceInput)
    const parsedNumberOfItems = parseInputValue(numberOfItemsInput)

    // Check if cart value is equal to or more than 200€
    if (parsedCartValue >= 200) {
      setFinalFee(0) // Delivery is free
      return
    }

    // Calculate the distance fee
    let distanceFee: number
    if (parsedDeliveryDistance <= 1000) {
      distanceFee = 2
    } else {
      // Calculate additional fee for every 500 meters beyond the first kilometer
      distanceFee = 2 + Math.ceil((parsedDeliveryDistance - 1000) / 500)
      // Ensure the minimum fee is 1€
      distanceFee = Math.max(distanceFee, 1)
    }

    // Calculate the total fee including cart value, distance fee, and surcharges
    let totalFee = parsedCartValue + distanceFee

    // Add surcharge if cart value is less than 10
    if (parsedCartValue < 10) {
      const surcharge = 10 - parsedCartValue
      totalFee += surcharge
    }

    // Add surcharge based on the number of items
    const numberOfItemsSurcharge = Math.max(parsedNumberOfItems - 4, 0) * 0.5
    totalFee += numberOfItemsSurcharge

    // Add bulk fee for more than 12 items
    if (parsedNumberOfItems > 12) {
      totalFee += 1.2
    }

    // Ensure the total fee does not exceed 15€
    totalFee = Math.min(totalFee, 15)

    // Update the state with the calculated fee
    setFinalFee(totalFee)
  }

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
      <button onClick={calculateFee}>Calculate Fee</button>
      <br />
      {finalFee !== null && (
        <div>
          <strong>Final Fee:</strong> {finalFee} euros
        </div>
      )}
    </div>
  )
}

export default Calculator
