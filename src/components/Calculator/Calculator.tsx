import React from 'react'
import useViewModel from './viewModel'
import Calendar from '../Calendar/Calendar'
import 'react-datepicker/dist/react-datepicker.css'
import './Calculator.css'
import reset from '../../images/reset-icon.svg'

const Calculator: React.FC = () => {

  const viewModel = useViewModel()

  return (
    <div className='calculatorWrapper'>
      <div className='inputWrapper'>
        <div className='inputLabelContainer'>
          <label htmlFor='cartValue'>
            Cart Value
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            data-test-id="cartValue"
            type="number"
            value={viewModel.state.cartValue === 0 ? '' : viewModel.state.cartValue}
            onChange={(e) => viewModel.handleFloatInputChange(e, 'cartValue')}
            min="0"
            placeholder="0,00"
          />
          <div className='unitContainer'>
            <output>€</output>
          </div>
        </div>
      </div>

      <div className='inputWrapper'>
        <div className='inputLabelContainer'>
          <label htmlFor='deliveryDistance'>
            Distance
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            data-test-id="deliveryDistance"
            type="number"
            value={viewModel.state.deliveryDistance === 0 ? '' : viewModel.state.deliveryDistance}
            onChange={(e) => viewModel.handleIntegerInputChange(e, 'deliveryDistance')}
            min="0"
            placeholder="0"
          />
          <div className='unitContainer'>
            <output>m</output>
          </div>
        </div>
      </div>

      <div className='inputWrapper'>
        <div className='inputLabelContainer'>
          <label htmlFor='numberOfItems'>
            No. of Items
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            data-test-id="numberOfItems"
            type="number"
            value={viewModel.state.numberOfItems === 0 ? '' : viewModel.state.numberOfItems}
            onChange={(e) => viewModel.handleIntegerInputChange(e, 'numberOfItems')}
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div className='inputWrapper'>
        <div className='inputLabelContainer'>
          <label htmlFor='orderTime'>
            Time
          </label>
          <button
            className='resetTimeButton'
            onClick={viewModel.resetDateTime}
            aria-label="Reset Selected Time and Date"
          >
            <img className='resetIcon' src={reset} alt={'Reset selected time and date button'} />
          </button>
        </div>
        <div className='inputFieldContainer'>
          <Calendar
            selectedDate={new Date(viewModel.state.dateTime)}
            onDateChange={viewModel.handleDateChange}
          />
        </div>
      </div>

      <div className='buttonContainer'>
        <button
          className={`calculateFeeButton ${viewModel.areAllInputsFilled() ? '' : 'disabledButton'}`}
          onClick={viewModel.calculateDeliveryFee}
          disabled={!viewModel.areAllInputsFilled()}
          aria-label="Calculate Price"
        >
          CALCULATE PRICE
        </button>
      </div>

      {viewModel.state.finalDeliveryFee !== null && (
        <div className='outputWrapper'>
          <div className='outputContainer'>
            <div className='outputLabelContainer'>
              <label htmlFor='deliveryFee'>
                Delivery Fee
              </label>
            </div>
            <div className='outputValueContainer'>
              <output data-test-id='fee'>
                {viewModel.state.finalDeliveryFee?.toFixed(2)} €
              </output>
            </div>
          </div>
          <div className='outputContainer'>
            <div className='outputLabelContainer'>
              <label htmlFor='totalPrice'>
                Total Price
              </label>
            </div>
            <div className='outputValueContainer'>
              <output className='totalPriceOutput' data-test-id='totalPrice'>
                {viewModel.state.totalPrice?.toFixed(2)} €
              </output>
            </div>
          </div>
        </div>
      )
      }
    </div >
  )
}

export default Calculator
