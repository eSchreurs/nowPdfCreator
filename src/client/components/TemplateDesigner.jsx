import React, { useState, useEffect } from 'react';
import ElementToolbox from './ElementToolbox.jsx';
import CanvasArea from './CanvasArea.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import './TemplateDesigner.css';

export default function TemplateDesigner({ template, service, onSave, onCancel }) {
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    source_table: '',
    page_width: 595,
    page_height: 842,
    active: true
  });
  
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAvailableTables();
    
    if (template) {
      // Load existing template
      const name = typeof template.name === 'object' ? template.name.display_value : template.name;
      const description = typeof template.description === 'object' ? template.description.display_value : template.description;
      const sourceTable = typeof template.source_table === 'object' ? template.source_table.display_value : template.source_table;
      
      setTemplateData({
        name: name || '',
        description: description || '',
        source_table: sourceTable || '',
        page_width: parseInt(template.page_width) || 595,
        page_height: parseInt(template.page_height) || 842,
        active: String(template.active) === 'true'
      });

      if (sourceTable) {
        loadTableFields(sourceTable);
      }

      loadTemplateElements();
    }
  }, [template, service]);

  const loadAvailableTables = async () => {
    try {
      const tables = await service.getAvailableTables();
      setAvailableTables(tables);
    } catch (err) {
      console.error('Failed to load tables:', err);
    }
  };

  const loadTableFields = async (tableName) => {
    try {
      const fields = await service.getTableFields(tableName);
      setAvailableFields(fields);
    } catch (err) {
      console.error('Failed to load fields:', err);
    }
  };

  const loadTemplateElements = async () => {
    if (!template?.sys_id) return;
    
    try {
      const elementData = await service.getTemplateElements(template.sys_id);
      const processedElements = elementData.map(el => ({
        id: typeof el.sys_id === 'object' ? el.sys_id.value : el.sys_id,
        type: typeof el.element_type === 'object' ? el.element_type.display_value : el.element_type,
        fieldName: typeof el.field_name === 'object' ? el.field_name.display_value : el.field_name,
        content: typeof el.content === 'object' ? el.content.display_value : el.content,
        x: parseFloat(el.x_position) || 0,
        y: parseFloat(el.y_position) || 0,
        width: parseFloat(el.width) || 100,
        height: parseFloat(el.height) || 20,
        fontSize: parseInt(el.font_size) || 12,
        fontFamily: typeof el.font_family === 'object' ? el.font_family.display_value : el.font_family || 'Arial',
        color: typeof el.color === 'object' ? el.color.display_value : el.color || '#000000',
        backgroundColor: typeof el.background_color === 'object' ? el.background_color.display_value : el.background_color,
        borderWidth: parseInt(el.border_width) || 0,
        borderColor: typeof el.border_color === 'object' ? el.border_color.display_value : el.border_color || '#000000',
        zIndex: parseInt(el.z_index) || 1
      }));
      setElements(processedElements);
    } catch (err) {
      console.error('Failed to load template elements:', err);
    }
  };

  const handleTemplateChange = (field, value) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'source_table' && value) {
      loadTableFields(value);
      setAvailableFields([]);
    }
  };

  const handleAddElement = (elementType) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: elementType,
      x: 50,
      y: 50,
      width: elementType === 'text' ? 200 : 100,
      height: elementType === 'text' ? 30 : 20,
      content: elementType === 'text' ? 'New Text' : '',
      fieldName: '',
      fontSize: 12,
      fontFamily: 'Arial',
      color: '#000000',
      backgroundColor: '',
      borderWidth: 0,
      borderColor: '#000000',
      zIndex: 1
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  const handleElementUpdate = (elementId, updates) => {
    setElements(prev => 
      prev.map(el => el.id === elementId ? { ...el, ...updates } : el)
    );
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => ({ ...prev, ...updates }));
    }
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  const handleElementDelete = (elementId) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!templateData.name.trim()) {
        throw new Error('Template name is required');
      }
      if (!templateData.source_table.trim()) {
        throw new Error('Source table is required');
      }

      let savedTemplate;
      
      if (template) {
        // Update existing template
        await service.updateTemplate(template.sys_id, templateData);
        savedTemplate = template;
      } else {
        // Create new template
        const result = await service.createTemplate(templateData);
        savedTemplate = result.result;
      }

      // Save elements
      const elementsToSave = elements.map(el => ({
        element_type: el.type,
        field_name: el.fieldName,
        content: el.content,
        x_position: el.x,
        y_position: el.y,
        width: el.width,
        height: el.height,
        font_size: el.fontSize,
        font_family: el.fontFamily,
        color: el.color,
        background_color: el.backgroundColor,
        border_width: el.borderWidth,
        border_color: el.borderColor,
        z_index: el.zIndex
      }));

      await service.saveTemplateElements(savedTemplate.sys_id, elementsToSave);
      
      onSave();
    } catch (err) {
      setError('Failed to save template: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="template-designer">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>&times;</button>
        </div>
      )}
      
      <div className="designer-header">
        <div className="template-settings">
          <input
            type="text"
            placeholder="Template Name"
            value={templateData.name}
            onChange={(e) => handleTemplateChange('name', e.target.value)}
            className="template-name-input"
          />
          
          <input
            type="text"
            placeholder="Description"
            value={templateData.description}
            onChange={(e) => handleTemplateChange('description', e.target.value)}
            className="template-desc-input"
          />
          
          <select
            value={templateData.source_table}
            onChange={(e) => handleTemplateChange('source_table', e.target.value)}
            className="table-select"
          >
            <option value="">Select Source Table</option>
            {availableTables.map(table => (
              <option key={table.name} value={table.name}>
                {table.label || table.name}
              </option>
            ))}
          </select>
        </div>

        <div className="designer-actions">
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>

      <div className="designer-content">
        <ElementToolbox onAddElement={handleAddElement} />
        
        <CanvasArea
          elements={elements}
          selectedElement={selectedElement}
          pageWidth={templateData.page_width}
          pageHeight={templateData.page_height}
          onElementSelect={handleElementSelect}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
        />
        
        <PropertiesPanel
          selectedElement={selectedElement}
          availableFields={availableFields}
          onElementUpdate={handleElementUpdate}
        />
      </div>
    </div>
  );
}