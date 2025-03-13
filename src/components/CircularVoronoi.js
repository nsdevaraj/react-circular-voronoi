import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import { voronoiTreemap } from 'd3-voronoi-treemap';
import { polygonArea } from 'd3-polygon';
 
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
    
    renderVoronoi();
  }, [data, width, height, padding, valueKey, currentLevel, isTransitioning]);

  // Handle drill down
  const drillDown = (node) => {
    if (node.children && node.children.length > 0) {
      setIsTransitioning(true);
      setHistory([...history, currentLevel]);
      setCurrentLevel(node);
      setTimeout(() => setIsTransitioning(false), 500);
    } else if (onCellClick) {
      onCellClick(node);
    }
  };

  // Handle drill up
  const drillUp = () => {
    if (history.length > 0) {
      setIsTransitioning(true);
      const previousLevel = history[history.length - 1];
      setCurrentLevel(previousLevel);
      setHistory(history.slice(0, -1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Compute Voronoi cells using d3-delaunay
  const computeVoronoiCells = (nodes, boundary) => {
    // Generate initial positions for nodes
    nodes.forEach((node, i) => {
      // Position nodes in a circle
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) / 4;
      node.x = width / 2 + radius * Math.cos(angle);
      node.y = height / 2 + radius * Math.sin(angle);
      node.weight = node[valueKey] || 1;
    });
    
    // Iteratively adjust positions to match weights
    const iterations = 50;
    for (let iter = 0; iter < iterations; iter++) {
      // Compute Voronoi diagram using Delaunay triangulation
      const points = nodes.map(d => [d.x, d.y]);
      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, width, height]);
      
      // Get polygons for each point
      const polygons = nodes.map((_, i) => {
        const polygon = [...voronoi.cellPolygon(i)];
        // Remove the duplicated closing point that Delaunay adds
        polygon.pop();
        return polygon;
      });
      
      // Calculate centroids and areas
      nodes.forEach((node, i) => {
        if (polygons[i] && polygons[i].length > 0) {
          // Calculate centroid
          let cx = 0, cy = 0;
          polygons[i].forEach(point => {
            cx += point[0];
            cy += point[1];
          });
          cx /= polygons[i].length;
          cy /= polygons[i].length;
          
          // Move node toward centroid
          node.x = node.x * 0.7 + cx * 0.3;
          node.y = node.y * 0.7 + cy * 0.3;
          
          // Store polygon for rendering
          node.polygon = polygons[i];
        }
      });
    }
    
    return nodes;
  };

  // Render the Voronoi treemap
  const renderVoronoi = () => {
    if (!currentLevel || !svgRef.current) return;
    
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
    
    // Create circular boundary
    const boundary = createCircularBoundary(width, height, padding);
    
    // Prepare data for Voronoi computation
    const nodes = currentLevel.children ? 
      currentLevel.children.map(child => ({...child})) : 
      [];
    
    // Compute Voronoi cells
    const cells = computeVoronoiCells(nodes, boundary);
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(cells.map(d => d[labelKey]))
      .range(colors);
    
    // Draw cells
    g.selectAll("path")
      .data(cells)
      .enter()
      .append("path")
      .attr("d", d => {
        if (!d.polygon || d.polygon.length === 0) return "";
        return `M${d.polygon.join("L")}Z`;
      })
      .attr("fill", d => colorScale(d[labelKey]))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("cursor", d => d.children && d.children.length > 0 ? "pointer" : "default")
      .on("click", (event, d) => drillDown(d))
      .append("title")
      .text(d => `${d[labelKey]}: ${d[valueKey].toLocaleString()}`);
    
    // Add labels if enabled
    if (showLabels) {
      g.selectAll("text.label")
        .data(cells)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => {
          if (!d.polygon) return 0;
          // Find centroid
          const x = d.polygon.reduce((sum, point) => sum + point[0], 0) / d.polygon.length;
          return x;
        })
        .attr("y", d => {
          if (!d.polygon) return 0;
          // Find centroid
          const y = d.polygon.reduce((sum, point) => sum + point[1], 0) / d.polygon.length;
          return y;
        })
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", d => {
          if (!d.polygon) return "8px";
          // Calculate polygon area
          const area = polygonArea(d.polygon);
          return `${Math.min(Math.sqrt(area) / 4, 14)}px`;
        })
        .attr("fill", "#000")
        .attr("pointer-events", "none")
        .text(d => d[labelKey]);
    }
    
    // Add transition effect
    if (isTransitioning) {
      g.attr("opacity", 0)
        .transition()
        .duration(500)
        .attr("opacity", 1);
    }
  };

  // Reset to root level
  const resetToRoot = () => {
    setIsTransitioning(true);
    setCurrentLevel(data);
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
