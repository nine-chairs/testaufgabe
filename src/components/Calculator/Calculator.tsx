import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from '../Calendar/Calendar';
import useViewModel from './viewModel';
import './Calculator.css'

const Calculator: React.FC = () => {

  const viewModel = useViewModel()

  return (
    <div className='calculatorContainer'>
      <div className='inputContainer'>
        <div className='inputLabelContainer'>
          <label>
            Cart Value:
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            type="number"
            value={viewModel.state.cartValueInput}
            onChange={(e) => viewModel.handleInputChange(e, 'cartValueInput')}
            min="0"
          />
        </div>
      </div>

      <div className='inputContainer'>
        <div className='inputLabelContainer'>
          <label>
            Distance:
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            type="number"
            value={viewModel.state.deliveryDistanceInput}
            onChange={(e) => viewModel.handleInputChange(e, 'deliveryDistanceInput')}
            min="0"
          />
        </div>
      </div>

      <div className='inputContainer'>
        <div className='inputLabelContainer'>
          <label>
            No. of Items:
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            type="number"
            value={viewModel.state.numberOfItemsInput}
            onChange={(e) => viewModel.handleInputChange(e, 'numberOfItemsInput')}
            min="0"
          />
        </div>
      </div>

      <div className='inputContainer'>
        <div className='inputLabelContainer'>
          <label>
            Time:
          </label>


        </div>
        <div className='inputFieldContainer'>
          <Calendar
            selectedDate={new Date(viewModel.state.dateTime)}
            onDateChange={viewModel.handleDateChange}
            onFocus={viewModel.handleDatepickerFocus}
            onBlur={viewModel.handleDateBlur}
            onReset={viewModel.resetDateTime}
          />
        </div>
      </div>

      <div className='buttonContainer'>
        <button
          className='calculateFeeButton'
          onClick={viewModel.calculateDeliveryFee}>
          Calculate Fee
        </button>
      </div>



      {viewModel.state.finalDeliveryFee !== null && (
        <div>
          <strong>Delivery Fee:</strong> {viewModel.state.finalDeliveryFee} euros <br />
          <strong>Total:</strong> {viewModel.state.totalPrice} euros
        </div>
      )}
    </div>
  );
};

export default Calculator;
