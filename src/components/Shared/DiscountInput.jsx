import React from 'react';
import './Shared.css';

const DiscountInput = ({ discount, onChange }) => {
  const handleTypeChange = (e) => {
    onChange({
      ...discount,
      type: e.target.value,
      value: e.target.value === 'none' ? 0 : discount.value
    });
  };

  const handleValueChange = (e) => {
    const value = parseFloat(e.target.value);
    onChange({
      ...discount,
      value: isNaN(value) ? 0 : value
    });
  };

  const formatValue = (value) => {
    if (value === 0) return '';
    return value.toString();
  };

  return (
    <div className="discount-input">
      <select
        value={discount.type}
        onChange={handleTypeChange}
        className="discount-type"
      >
        <option value="none">No Discount</option>
        <option value="percentage">Percentage</option>
        <option value="flat">Flat Amount</option>
      </select>
      
      {discount.type !== 'none' && (
        <div className="discount-value-container">
          {discount.type === 'percentage' ? (
            <div className="percentage-input">
              <input
                type="number"
                min="0"
                max="100"
                value={formatValue(discount.value)}
                onChange={handleValueChange}
                className="discount-value"
                placeholder="0"
                onFocus={(e) => e.target.select()}
              />
              <span className="discount-unit">%</span>
            </div>
          ) : (
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formatValue(discount.value)}
                onChange={handleValueChange}
                className="discount-value"
                placeholder="0.00"
                onFocus={(e) => e.target.select()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscountInput;