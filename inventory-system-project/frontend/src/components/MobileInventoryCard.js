import React from 'react';
import StepperInput from './StepperInput';

const MobileInventoryCard = ({ item, isLowStock, hasPendingChange, onInputChange }) => {
  const remaining = item.remaining || 0;
  const lowStock = isLowStock(remaining);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 ${
        hasPendingChange ? 'border-l-4 border-l-yellow-400 bg-yellow-50' : 'border-gray-200'
      }`}
    >
      {/* Header: name, unit, remaining */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1 mr-3">
          <h4 className="text-base font-semibold text-gray-900 truncate">{item.name}</h4>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
            {item.unit}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className={`text-lg font-bold ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
            {remaining}
          </span>
          <span className="block text-xs text-gray-500">Remaining</span>
          {lowStock && (
            <span className="inline-block mt-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-medium">
              LOW STOCK
            </span>
          )}
        </div>
      </div>

      {/* 2x2 Stepper Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StepperInput
          label="Beginning"
          value={item.beginning}
          onChange={(val) => onInputChange(item.id, 'beginning', val)}
        />
        <StepperInput
          label="In"
          value={item.in}
          onChange={(val) => onInputChange(item.id, 'in', val)}
        />
        <StepperInput
          label="Out"
          value={item.out}
          onChange={(val) => onInputChange(item.id, 'out', val)}
        />
        <StepperInput
          label="Spoilage"
          value={item.spoilage}
          onChange={(val) => onInputChange(item.id, 'spoilage', val)}
        />
      </div>

      {/* Footer: Total Inventory */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500">Total Inventory</span>
        <span className="text-sm font-bold text-gray-800">{item.totalInventory || 0}</span>
      </div>
    </div>
  );
};

export default MobileInventoryCard;
