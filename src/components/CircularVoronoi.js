import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3'; 
import { voronoiTreemap } from 'd3-voronoi-treemap';
import { polygonArea } from 'd3-polygon';

/**
 * CircularVoronoi component for creating circular Voronoi treemaps
 * Displays hierarchical data in a circular layout with optimized visualization
 */
const CircularVoronoi = ({
  data,
  width,
  height,
  colors = d3.schemeCategory10,
  padding = 5,
  valueKey = 'value',
  labelKey = 'name',
  showLabels = true,
  labelMinSize = 10,
  onCellClick = null,
  className = '',
  style = {},
}) => {
  const svgRef = useRef(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [history, setHistory] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [computedData, setComputedData] = useState(null);
  
  // Create a circular boundary for the Voronoi diagram
  const createCircularBoundary = (width, height, padding) => {
    const radius = Math.min(width, height) / 2 - padding;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create a circular polygon with many points for smooth appearance
    const numPoints = 100;
    const circle = [];
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      circle.push([
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      ]);
    }
    
    return circle;
  };

  // Process data and compute Voronoi treemap
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    // Initialize with root data if no current level is set
    if (!currentLevel) {
      setCurrentLevel(data);
      setHistory([]);
    }
    
    const computeTreemap = async () => {
      try {
        // Create hierarchy from the current level data
        const hierarchy = d3.hierarchy(currentLevel)
          .sum(d => d[valueKey] || 1);
          
        // Create circular boundary
        const circularBoundary = createCircularBoundary(width, height, padding);
        
        // Create Voronoi treemap generator
        const treemapGenerator = voronoiTreemap()
          .clip(circularBoundary)
          .convergenceRatio(0.01) // Lower for better performance, higher for accuracy
          .maxIterationCount(50); // Limit iterations for performance
        
        // Compute the treemap
        await treemapGenerator(hierarchy);
        
        // Store computed data
        setComputedData(hierarchy);
      } catch (error) {
        console.error("Error computing Voronoi treemap:", error);
      }
    };
    
    computeTreemap();
  }, [currentLevel, data, width, height, padding, valueKey]);

  // Handle drill down
  const drillDown = (node) => {
    if (node.children && node.children.length > 0) {
      setIsTransitioning(true);
      setHistory([...history, currentLevel]);
      setCurrentLevel(node.data);
      setComputedData(null); // Reset computed data for new level
      setTimeout(() => setIsTransitioning(false), 500);
    } else if (onCellClick) {
      onCellClick(node.data);
    }
  };

  // Handle drill up
  const drillUp = () => {
    if (history.length > 0) {
      setIsTransitioning(true);
      const previousLevel = history[history.length - 1];
      setCurrentLevel(previousLevel);
      setComputedData(null); // Reset computed data
      setHistory(history.slice(0, -1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Render the Voronoi treemap
  useEffect(() => {
    if (!computedData || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Create a group for the visualization
    const g = svg.append("g");
    
    // Add back button if we have history
    if (history.length > 0) {
      svg.append("circle")
        .attr("cx", 40)
        .attr("cy", 40)
        .attr("r", 30)
        .attr("fill", "#f8f9fa")
        .attr("stroke", "#333")
        .attr("cursor", "pointer")
        .on("click", drillUp);
      
      svg.append("text")
        .attr("x", 40)
        .attr("y", 45)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", "#333")
        .attr("cursor", "pointer")
        .text("↩")
        .on("click", drillUp);
    }
    
    // Create title for current level
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text(currentLevel[labelKey] || "Root");
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(computedData.descendants().filter(d => d.depth > 0).map(d => d.data[labelKey]))
      .range(colors);
    
    // Draw cells - only draw cells below the root
    g.selectAll("path")
      .data(computedData.descendants().filter(d => d.depth > 0))
      .enter()
      .append("path")
      .attr("d", d => {
        if (!d.polygon || d.polygon.length === 0) return "";
        return `M${d.polygon.join("L")}Z`;
      })
      .attr("fill", d => colorScale(d.data[labelKey]))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("cursor", d => d.children && d.children.length > 0 ? "pointer" : "default")
      .on("click", (event, d) => drillDown(d))
      .append("title")
      .text(d => `${d.data[labelKey]}: ${d.data[valueKey].toLocaleString()}`);
    
    // Add labels if enabled
    if (showLabels) {
      g.selectAll("text.label")
        .data(computedData.descendants().filter(d => {
          // Only show labels for cells large enough
          if (!d.polygon) return false;
          const area = polygonArea(d.polygon);
          return area > labelMinSize * labelMinSize && d.depth > 0;
        }))
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => {
          if (!d.polygon) return 0;
          // Calculate proper centroid using d3-polygon
          const centroid = d3.polygonCentroid(d.polygon);
          return centroid[0];
        })
        .attr("y", d => {
          if (!d.polygon) return 0;
          // Calculate proper centroid using d3-polygon
          const centroid = d3.polygonCentroid(d.polygon);
          return centroid[1];
        })
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", d => {
          if (!d.polygon) return "8px";
          // Calculate polygon area
          const area = polygonArea(d.polygon);
          // Scale font size based on area, with constraints
          return `${Math.min(Math.sqrt(area) / 4, 14)}px`;
        })
        .attr("fill", "#000")
        .attr("pointer-events", "none")
        .text(d => d.data[labelKey]);
    }
    
    // Add transition effect
    if (isTransitioning) {
      g.attr("opacity", 0)
        .transition()
        .duration(500)
        .attr("opacity", 1);
    }
  }, [computedData, history, currentLevel, labelKey, valueKey, colors, width, height, showLabels, labelMinSize, isTransitioning]);

  // Reset to root level
  const resetToRoot = () => {
    setIsTransitioning(true);
    setCurrentLevel(data);
    setComputedData(null);
    setHistory([]);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className={`circular-voronoi-container ${className}`} style={style}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="circular-voronoi-svg"
      />
      {history.length > 0 && (
        <button 
          className="reset-button"
          onClick={resetToRoot}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            padding: '5px 10px',
            background: '#f8f9fa',
            border: '1px solid #333',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset to Root
        </button>
      )}
    </div>
  );
};

CircularVoronoi.propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  colors: PropTypes.array,
  padding: PropTypes.number,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  showLabels: PropTypes.bool,
  labelMinSize: PropTypes.number,
  onCellClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CircularVoronoi;
