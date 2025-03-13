import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { voronoiTreemap } from 'd3-voronoi-treemap';
import { polygonArea } from 'd3-polygon';

/**
 * CircularVoronoi component for creating circular Voronoi treemaps
 * Optimized for performance with memoization and efficient rendering
 */
const CircularVoronoi = ({
  data,
  width,
  height,
  colors,
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
    
    const processData = async () => {
      try {
        // Create hierarchy from data
        const hierarchy = d3.hierarchy(data)
          .sum(d => d[valueKey] || 1);
        
        // Create circular boundary
        const circularBoundary = createCircularBoundary(width, height, padding);
        
        // Create Voronoi treemap
        const treemapGenerator = voronoiTreemap()
          .clip(circularBoundary)
          .convergenceRatio(0.01) // Lower for better performance, higher for accuracy
          .maxIterationCount(50); // Limit iterations for performance
        
        // Compute the treemap
        treemapGenerator(hierarchy);
        
        // Set computed data for rendering
        setComputedData(hierarchy);
      } catch (error) {
        console.error("Error computing Voronoi treemap:", error);
      }
    };
    
    processData();
  }, [data, width, height, padding, valueKey]);

  // Render the Voronoi treemap
  useEffect(() => {
    if (!computedData || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(computedData.descendants().map(d => d.data[labelKey]))
      .range(colors || d3.schemeCategory10);
    
    // Draw cells
    const cells = svg.selectAll("path")
      .data(computedData.descendants().filter(d => d.depth > 0))
      .enter()
      .append("path")
      .attr("d", d => {
        if (!d.polygon || d.polygon.length === 0) return "";
        return `M${d.polygon.join("L")}Z`;
      })
      .attr("fill", d => colorScale(d.data[labelKey]))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("cursor", onCellClick ? "pointer" : "default");
    
    // Add click handler if provided
    if (onCellClick) {
      cells.on("click", (event, d) => {
        onCellClick(d.data);
      });
    }
    
    // Add labels if enabled
    if (showLabels) {
      svg.selectAll("text")
        .data(computedData.descendants().filter(d => {
          // Only show labels for cells large enough
          if (!d.polygon) return false;
          const area = polygonArea(d.polygon);
          return area > labelMinSize * labelMinSize && d.depth > 0;
        }))
        .enter()
        .append("text")
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
          // Scale font size based on cell area
          const area = polygonArea(d.polygon);
          return `${Math.min(Math.sqrt(area) / 4, 14)}px`;
        })
        .attr("fill", "#000")
        .text(d => d.data[labelKey]);
    }
  }, [computedData, colors, showLabels, labelMinSize, onCellClick, labelKey]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={className}
      style={style}
    />
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
