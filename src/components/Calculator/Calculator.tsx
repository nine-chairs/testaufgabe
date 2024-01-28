import React from 'react';
import useViewModel from './viewModel';
import Calendar from '../Calendar/Calendar';
import 'react-datepicker/dist/react-datepicker.css';
import './Calculator.css'
import reset from '../../images/reset.svg'

const Calculator: React.FC = () => {

  const viewModel = useViewModel()

  return (
    <div className='calculatorWrapper'>
      <div className='inputWrapper'>
        <div className='inputLabelContainer'>
          <label>
            Cart Value
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            type="number"
            value={viewModel.state.cartValueInput}
            onChange={(e) => viewModel.handleFloatInputChange(e, 'cartValueInput')}
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
          <label>
            Distance
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            type="number"
            value={viewModel.state.deliveryDistanceInput}
            onChange={(e) => viewModel.handleIntegerInputChange(e, 'deliveryDistanceInput')}
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
          <label>
            No. of Items
          </label>
        </div>
        <div className='inputFieldContainer'>
          <input
            className='inputField'
            type="number"
            value={viewModel.state.numberOfItemsInput}
            onChange={(e) => viewModel.handleIntegerInputChange(e, 'numberOfItemsInput')}
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div className='inputWrapper'>
        <div className='inputLabelContainer'>
          <label>
            Time
          </label>
          <button className='resetTimeButton' onClick={viewModel.resetDateTime}>
            <img className='resetIcon' src={reset} alt={'reset-time'} />
          </button>
        </div>
        <div className='inputFieldContainer'>
          <Calendar
            selectedDate={new Date(viewModel.state.dateTime)}
            onDateChange={viewModel.handleDateChange}
            onFocus={viewModel.handleDatepickerFocus}
            onBlur={viewModel.handleDateBlur}
          />
        </div>
      </div>

      <div className='buttonContainer'>
        <button
          className={`calculateFeeButton ${viewModel.areAllInputsFilled() ? '' : 'disabledButton'}`}
          onClick={viewModel.calculateDeliveryFee}
          disabled={!viewModel.areAllInputsFilled()}
        >
          <text>
            CALCULATE PRICE
          </text>
        </button>
      </div>

      {viewModel.state.finalDeliveryFee !== null && (
        <div className='outputWrapper'>
          <div className='outputContainer'>
            <div className='outputLabelContainer'>
              <label>
                Delivery Fee:
              </label>
            </div>
            <div className='outputValueContainer'>
              <output>
                {viewModel.state.finalDeliveryFee} €
              </output>
            </div>
          </div>
          <div className='outputContainer'>
            <div className='outputLabelContainer'>
              <label>
                Total Price:
              </label>
            </div>
            <div className='outputValueContainer'>
              <output className='totalPriceOutput'>
                {viewModel.state.totalPrice} €
              </output>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default Calculator;
