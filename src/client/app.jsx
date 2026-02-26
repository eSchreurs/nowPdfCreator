import React, { useState, useEffect } from 'react';
import TemplateDesigner from './components/TemplateDesigner.jsx';
import TemplateList from './components/TemplateList.jsx';
import { TemplateService } from './services/TemplateService.js';
import './app.css';

export default function App() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateService] = useState(() => new TemplateService());

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setCurrentView('designer');
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView('designer');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTemplate(null);
  };

  return (
    <div className="pdf-template-app">
      <header className="app-header">
        <h1>PDF Template Builder</h1>
        {currentView === 'designer' && (
          <button onClick={handleBackToList} className="back-button">
            ← Back to Templates
          </button>
        )}
      </header>

      <main className="app-main">
        {currentView === 'list' ? (
          <TemplateList 
            service={templateService}
            onCreateNew={handleCreateNew}
            onEditTemplate={handleEditTemplate}
          />
        ) : (
          <TemplateDesigner 
            template={selectedTemplate}
            service={templateService}
            onSave={handleBackToList}
            onCancel={handleBackToList}
          />
        )}
      </main>
    </div>
  );
}