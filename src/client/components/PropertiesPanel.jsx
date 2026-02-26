import React from 'react';

export default function PropertiesPanel({ selectedElement, availableFields, onElementUpdate }) {
  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p className="no-selection">Select an element to edit its properties</p>
      </div>
    );
  }

  const handleChange = (property, value) => {
    onElementUpdate(selectedElement.id, { [property]: value });
  };

  const renderFieldSelect = () => (
    <div className="property-group">
      <label>Field Name:</label>
      <select 
        value={selectedElement.fieldName || ''}
        onChange={(e) => handleChange('fieldName', e.target.value)}
      >
        <option value="">Select Field</option>
        {availableFields.map(field => (
          <option key={field.element} value={field.element}>
            {field.column_label || field.element}
          </option>
        ))}
      </select>
    </div>
  );

  const renderContentInput = () => (
    <div className="property-group">
      <label>Content:</label>
      <textarea
        value={selectedElement.content || ''}
        onChange={(e) => handleChange('content', e.target.value)}
        rows={3}
      />
    </div>
  );

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      
      <div className="property-group">
        <label>Element Type:</label>
        <span className="element-type">{selectedElement.type}</span>
      </div>

      {/* Content/Field selection based on element type */}
      {selectedElement.type === 'field' && renderFieldSelect()}
      {(selectedElement.type === 'text' || selectedElement.type === 'barcode') && renderContentInput()}

      {/* Position and Size */}
      <div className="property-row">
        <div className="property-group">
          <label>X Position:</label>
          <input
            type="number"
            value={Math.round(selectedElement.x)}
            onChange={(e) => handleChange('x', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
        <div className="property-group">
          <label>Y Position:</label>
          <input
            type="number"
            value={Math.round(selectedElement.y)}
            onChange={(e) => handleChange('y', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
      </div>

      <div className="property-row">
        <div className="property-group">
          <label>Width:</label>
          <input
            type="number"
            value={Math.round(selectedElement.width)}
            onChange={(e) => handleChange('width', parseInt(e.target.value) || 20)}
            min="20"
          />
        </div>
        <div className="property-group">
          <label>Height:</label>
          <input
            type="number"
            value={Math.round(selectedElement.height)}
            onChange={(e) => handleChange('height', parseInt(e.target.value) || 20)}
            min="20"
          />
        </div>
      </div>

      {/* Text properties for text-based elements */}
      {(selectedElement.type === 'text' || selectedElement.type === 'field') && (
        <>
          <div className="property-group">
            <label>Font Size:</label>
            <input
              type="number"
              value={selectedElement.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value) || 12)}
              min="6"
              max="72"
            />
          </div>

          <div className="property-group">
            <label>Font Family:</label>
            <select 
              value={selectedElement.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Helvetica">Helvetica</option>
            </select>
          </div>
        </>
      )}

      {/* Color Properties */}
      <div className="property-group">
        <label>Color:</label>
        <input
          type="color"
          value={selectedElement.color}
          onChange={(e) => handleChange('color', e.target.value)}
        />
      </div>

      {selectedElement.type !== 'line' && (
        <div className="property-group">
          <label>Background Color:</label>
          <input
            type="color"
            value={selectedElement.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
        </div>
      )}

      {/* Border Properties */}
      <div className="property-group">
        <label>Border Width:</label>
        <input
          type="number"
          value={selectedElement.borderWidth}
          onChange={(e) => handleChange('borderWidth', parseInt(e.target.value) || 0)}
          min="0"
          max="10"
        />
      </div>

      {selectedElement.borderWidth > 0 && (
        <div className="property-group">
          <label>Border Color:</label>
          <input
            type="color"
            value={selectedElement.borderColor}
            onChange={(e) => handleChange('borderColor', e.target.value)}
          />
        </div>
      )}

      {/* Z-Index */}
      <div className="property-group">
        <label>Layer (Z-Index):</label>
        <input
          type="number"
          value={selectedElement.zIndex}
          onChange={(e) => handleChange('zIndex', parseInt(e.target.value) || 1)}
          min="1"
          max="100"
        />
      </div>
    </div>
  );
}