import React, { useState } from 'react';

const StepperInput = ({ value, onChange, min = 0, label }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const numericValue = Number(value) || 0;

  const handleDecrement = () => {
    const next = Math.max(min, numericValue - 1);
    onChange(next);
  };

  const handleIncrement = () => {
    onChange(numericValue + 1);
  };

  const handleValueClick = () => {
    setEditValue(numericValue === 0 ? '' : String(numericValue));
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(editValue, 10);
    if (isNaN(parsed) || parsed < min) {
      onChange(min);
    } else {
      onChange(parsed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div>
      {label && (
        <span className="block text-xs font-medium text-gray-500 mb-1">{label}</span>
      )}
      <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
        <button
          type="button"
          onClick={handleDecrement}
          className="flex items-center justify-center w-11 h-11 text-white text-lg font-bold shrink-0 active:opacity-70 select-none"
          style={{ backgroundColor: '#68448C' }}
          aria-label={`Decrease ${label || 'value'}`}
        >
          &minus;
        </button>

        {isEditing ? (
          <input
            type="number"
            min={min}
            className="w-full h-11 text-center text-base font-semibold border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={handleValueClick}
            className="w-full h-11 text-center text-base font-semibold border-x border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-text"
          >
            {numericValue}
          </button>
        )}

        <button
          type="button"
          onClick={handleIncrement}
          className="flex items-center justify-center w-11 h-11 text-white text-lg font-bold shrink-0 active:opacity-70 select-none"
          style={{ backgroundColor: '#68448C' }}
          aria-label={`Increase ${label || 'value'}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default StepperInput;
