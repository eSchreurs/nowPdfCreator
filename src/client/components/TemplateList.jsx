import React, { useState, useEffect } from 'react';
import './TemplateList.css';

export default function TemplateList({ service, onCreateNew, onEditTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, [service]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const templateList = await service.getTemplates();
      setTemplates(templateList);
    } catch (err) {
      setError('Failed to load templates: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (template) => {
    const templateName = typeof template.name === 'object' ? template.name.display_value : template.name;
    if (confirm(`Are you sure you want to delete "${templateName}"?`)) {
      try {
        await service.deleteTemplate(template.sys_id);
        await loadTemplates(); // Refresh the list
      } catch (err) {
        alert('Failed to delete template: ' + err.message);
      }
    }
  };

  const handleEdit = (template) => {
    onEditTemplate(template);
  };

  if (loading) {
    return (
      <div className="template-list">
        <div className="loading">Loading templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="template-list">
        <div className="error">{error}</div>
        <button onClick={loadTemplates} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="template-list">
      <div className="list-header">
        <h2>PDF Templates</h2>
        <button onClick={onCreateNew} className="create-button">
          + Create New Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="empty-state">
          <p>No templates found. Create your first PDF template!</p>
          <button onClick={onCreateNew} className="create-button-large">
            Create Your First Template
          </button>
        </div>
      ) : (
        <div className="templates-grid">
          {templates.map(template => {
            const templateName = typeof template.name === 'object' ? template.name.display_value : template.name;
            const templateDesc = typeof template.description === 'object' ? template.description.display_value : template.description;
            const sourceTable = typeof template.source_table === 'object' ? template.source_table.display_value : template.source_table;
            const createdOn = typeof template.created_on === 'object' ? template.created_on.display_value : template.created_on;
            const active = String(template.active) === 'true';

            return (
              <div key={typeof template.sys_id === 'object' ? template.sys_id.value : template.sys_id} className="template-card">
                <div className="template-header">
                  <h3>{templateName}</h3>
                  <span className={`status ${active ? 'active' : 'inactive'}`}>
                    {active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="template-info">
                  {templateDesc && <p className="description">{templateDesc}</p>}
                  <p className="source-table">Source Table: <strong>{sourceTable}</strong></p>
                  <p className="created-date">Created: {new Date(createdOn).toLocaleDateString()}</p>
                </div>

                <div className="template-actions">
                  <button 
                    onClick={() => handleEdit(template)} 
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(template)} 
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}