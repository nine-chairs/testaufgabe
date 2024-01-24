import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from '../Calendar/Calendar';
import useViewModel from './viewModel';

const Calculator: React.FC = () => {

  const viewModel = useViewModel()

  return (
    <div>
      <label>
        Cart Value (in euros):
        <input
          type="number"
          value={viewModel.state.cartValueInput}
          onChange={(e) => viewModel.handleInputChange(e, 'cartValueInput')}
          min="0"
        />
      </label>
      <br />
      <label>
        Delivery Distance (in meters):
        <input
          type="number"
          value={viewModel.state.deliveryDistanceInput}
          onChange={(e) => viewModel.handleInputChange(e, 'deliveryDistanceInput')}
          min="0"
        />
      </label>
      <br />
      <label>
        Number of items:
        <input
          type="number"
          value={viewModel.state.numberOfItemsInput}
          onChange={(e) => viewModel.handleInputChange(e, 'numberOfItemsInput')}
          min="0"
        />
      </label>
      <br />
      <label>
        Date and Time:
        <Calendar
          selectedDate={new Date(viewModel.state.dateTime)}
          onDateChange={viewModel.handleDateChange}
          onFocus={viewModel.handleDatepickerFocus}
          onBlur={viewModel.handleDateBlur}
          onReset={viewModel.resetDateTime}
        />
      </label>
      <br />
      <button onClick={viewModel.calculateDeliveryFee}>Calculate Fee</button>
      <br />
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
