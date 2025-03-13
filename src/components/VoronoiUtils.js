/**
 * Utility functions for Voronoi treemap calculations
 * Based on Will Chase's Observable notebook implementation
 */

import * as d3 from 'd3';

/**
 * Creates a circular boundary for the Voronoi diagram
 * @param {number} width - Width of the SVG
 * @param {number} height - Height of the SVG
 * @param {number} padding - Padding from the edges
 * @returns {Array} Array of points defining the circular boundary
 */
export const createCircularBoundary = (width, height, padding = 5) => {
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

/**
 * Computes Voronoi cells for a set of nodes within a boundary
 * @param {Array} nodes - Array of data nodes
 * @param {number} width - Width of the SVG
 * @param {number} height - Height of the SVG
 * @param {string} valueKey - Key for the value property in data nodes
 * @returns {Array} Array of nodes with computed polygons
 */
export const computeVoronoiCells = (nodes, width, height, valueKey = 'value') => {
  if (!nodes || nodes.length === 0) return [];
  
  // Create a Voronoi generator
  const voronoi = d3.voronoi()
    .extent([[0, 0], [width, height]]);
  
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
    // Compute Voronoi diagram
    const diagram = voronoi(nodes.map(d => [d.x, d.y]));
    
    // Get polygons
    const polygons = diagram.polygons();
    
    // Calculate centroids and areas
    nodes.forEach((node, i) => {
      if (polygons[i]) {
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

/**
 * Clips a polygon to a circular boundary
 * @param {Array} polygon - Array of points defining a polygon
 * @param {Array} boundary - Array of points defining the boundary
 * @returns {Array} Clipped polygon
 */
export const clipPolygonToCircle = (polygon, boundary) => {
  if (!polygon || !boundary) return [];
  
  // Use d3's polygon clipping
  return d3.polygonClip(polygon, boundary);
};

/**
 * Calculates the area of a polygon
 * @param {Array} polygon - Array of points defining a polygon
 * @returns {number} Area of the polygon
 */
export const calculatePolygonArea = (polygon) => {
  if (!polygon || polygon.length < 3) return 0;
  return Math.abs(d3.polygonArea(polygon));
};

/**
 * Finds the centroid of a polygon
 * @param {Array} polygon - Array of points defining a polygon
 * @returns {Object} Centroid coordinates {x, y}
 */
export const findPolygonCentroid = (polygon) => {
  if (!polygon || polygon.length === 0) return { x: 0, y: 0 };
  
  let x = 0, y = 0;
  polygon.forEach(point => {
    x += point[0];
    y += point[1];
  });
  
  return {
    x: x / polygon.length,
    y: y / polygon.length
  };
};
