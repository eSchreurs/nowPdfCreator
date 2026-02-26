import React from 'react';

const ELEMENT_TYPES = [
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'field', label: 'Field', icon: '📋' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'table', label: 'Table', icon: '📊' },
  { type: 'line', label: 'Line', icon: '📏' },
  { type: 'rectangle', label: 'Rectangle', icon: '▭' },
  { type: 'barcode', label: 'Barcode', icon: '||||||' }
];

export default function ElementToolbox({ onAddElement }) {
  return (
    <div className="element-toolbox">
      <h3>Elements</h3>
      <div className="toolbox-items">
        {ELEMENT_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            className="toolbox-item"
            onClick={() => onAddElement(type)}
            title={`Add ${label}`}
          >
            <span className="toolbox-icon">{icon}</span>
            <span className="toolbox-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}