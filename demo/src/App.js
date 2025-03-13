import React, { useState } from 'react';
import CircularVoronoi from '../../src/components/CircularVoronoi';
import { populationData, marketCapData } from './data';
import './App.css';

const App = () => {
  const [dataset, setDataset] = useState('population');
  const [showLabels, setShowLabels] = useState(true);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  
  // Color schemes
  const populationColors = [
    '#ff9e6d', '#86cbff', '#c2e5a0', '#fff686', '#ff86b1', '#8686ff',
    '#f97b6b', '#74c7b8', '#d4a4eb', '#a6a6a6'
  ];
  
  const marketColors = [
    '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949',
    '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
  ];
  
  const handleDatasetChange = (e) => {
    setDataset(e.target.value);
  };
  
  const handleShowLabelsChange = () => {
    setShowLabels(!showLabels);
  };
  
  const handleCellClick = (data) => {
    console.log('Leaf cell clicked:', data);
    alert(`Clicked leaf node: ${data.name} - Value: ${data.value.toLocaleString()}`);
  };
  
  return (
    <div className="app-container">
      <header>
        <h1>React Circular Voronoi Demo</h1>
        <p>Interactive visualization with level drill-down functionality</p>
      </header>
      
      <div className="controls">
        <div className="control-group">
          <label>Dataset:</label>
          <select value={dataset} onChange={handleDatasetChange}>
            <option value="population">Global Population</option>
            <option value="market">Market Sectors</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={showLabels} 
              onChange={handleShowLabelsChange} 
            />
            Show Labels
          </label>
        </div>
        
        <div className="control-group">
          <label>Size:</label>
          <div className="size-controls">
            <button onClick={() => {
              setWidth(Math.max(400, width - 100));
              setHeight(Math.max(400, height - 100));
            }}>-</button>
            <span>{width}x{height}</span>
            <button onClick={() => {
              setWidth(Math.min(1200, width + 100));
              setHeight(Math.min(1200, height + 100));
            }}>+</button>
          </div>
        </div>
      </div>
      
      <div className="visualization-container">
        <CircularVoronoi
          data={dataset === 'population' ? populationData : marketCapData}
          width={width}
          height={height}
          colors={dataset === 'population' ? populationColors : marketColors}
          showLabels={showLabels}
          labelMinSize={15}
          onCellClick={handleCellClick}
          valueKey="value"
          labelKey="name"
          padding={10}
        />
      </div>
      
      <div className="instructions">
        <h2>Instructions</h2>
        <ul>
          <li>Click on cells to drill down into that category</li>
          <li>Use the back button (↩) to navigate up one level</li>
          <li>Use the "Reset to Root" button to return to the top level</li>
          <li>Toggle between datasets using the dropdown menu</li>
          <li>Show or hide labels with the checkbox</li>
          <li>Adjust the size of the visualization with the + and - buttons</li>
        </ul>
      </div>
      
      <footer>
        <p>React Circular Voronoi Library - Based on Will Chase's Observable implementation</p>
      </footer>
    </div>
  );
};

export default App;
