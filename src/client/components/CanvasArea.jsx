import React, { useState, useRef, useEffect } from 'react';

export default function CanvasArea({ 
  elements, 
  selectedElement, 
  pageWidth, 
  pageHeight, 
  onElementSelect, 
  onElementUpdate, 
  onElementDelete 
}) {
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragState) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - dragState.offsetX;
        const y = e.clientY - rect.top - dragState.offsetY;
        
        onElementUpdate(dragState.elementId, {
          x: Math.max(0, Math.min(x, pageWidth - dragState.elementWidth)),
          y: Math.max(0, Math.min(y, pageHeight - dragState.elementHeight))
        });
      }
      
      if (resizeState) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newWidth = Math.max(20, x - resizeState.startX);
        const newHeight = Math.max(20, y - resizeState.startY);
        
        onElementUpdate(resizeState.elementId, {
          width: Math.min(newWidth, pageWidth - resizeState.startX),
          height: Math.min(newHeight, pageHeight - resizeState.startY)
        });
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      setResizeState(null);
    };

    if (dragState || resizeState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState, pageWidth, pageHeight, onElementUpdate]);

  const handleElementMouseDown = (e, element) => {
    e.stopPropagation();
    onElementSelect(element);
    
    const rect = canvasRef.current.getBoundingClientRect();
    setDragState({
      elementId: element.id,
      offsetX: e.clientX - rect.left - element.x,
      offsetY: e.clientY - rect.top - element.y,
      elementWidth: element.width,
      elementHeight: element.height
    });
  };

  const handleResizeMouseDown = (e, element) => {
    e.stopPropagation();
    setResizeState({
      elementId: element.id,
      startX: element.x,
      startY: element.y
    });
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      onElementSelect(null);
    }
  };

  const handleKeyDown = (e) => {
    if (selectedElement && e.key === 'Delete') {
      onElementDelete(selectedElement.id);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, onElementDelete]);

  const renderElement = (element) => {
    const isSelected = selectedElement?.id === element.id;
    
    const elementStyle = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      color: element.color,
      backgroundColor: element.backgroundColor || 'transparent',
      border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor}` : 'none',
      zIndex: element.zIndex,
      cursor: 'move',
      userSelect: 'none'
    };

    let content = '';
    switch (element.type) {
      case 'text':
        content = element.content || 'Text';
        break;
      case 'field':
        content = element.fieldName ? `{${element.fieldName}}` : '{field}';
        break;
      case 'image':
        content = '🖼️ Image';
        break;
      case 'table':
        content = '📊 Table';
        break;
      case 'line':
        elementStyle.borderTop = `${Math.max(1, element.borderWidth)}px solid ${element.color}`;
        elementStyle.height = Math.max(1, element.borderWidth);
        break;
      case 'rectangle':
        elementStyle.border = `${Math.max(1, element.borderWidth)}px solid ${element.color}`;
        break;
      case 'barcode':
        content = '|||||||||||';
        break;
      default:
        content = element.type;
    }

    return (
      <div
        key={element.id}
        style={elementStyle}
        className={`canvas-element ${isSelected ? 'selected' : ''}`}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
      >
        {element.type !== 'line' && content}
        
        {isSelected && (
          <>
            <div className="selection-outline" />
            <div 
              className="resize-handle"
              onMouseDown={(e) => handleResizeMouseDown(e, element)}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="canvas-container">
      <div className="canvas-toolbar">
        <span>Canvas: {pageWidth}×{pageHeight}px</span>
        {selectedElement && (
          <button 
            onClick={() => onElementDelete(selectedElement.id)}
            className="delete-element-btn"
          >
            Delete Selected
          </button>
        )}
      </div>
      
      <div 
        ref={canvasRef}
        className="canvas"
        style={{ width: pageWidth, height: pageHeight }}
        onClick={handleCanvasClick}
      >
        {elements.map(renderElement)}
      </div>
    </div>
  );
}