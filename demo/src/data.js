/**
 * Sample data for the circular Voronoi diagram demo
 * Hierarchical structure with regions and populations
 */
export const populationData = {
  name: "Population Distribution",
  children: [
    {
      name: "North America",
      value: 579000000,
      children: [
        { name: "USA", value: 331000000 },
        { name: "Canada", value: 38000000 },
        { name: "Mexico", value: 126000000 },
        { name: "Other", value: 84000000 }
      ]
    },
    {
      name: "Europe",
      value: 746000000,
      children: [
        { name: "Germany", value: 83000000 },
        { name: "UK", value: 67000000 },
        { name: "France", value: 65000000 },
        { name: "Italy", value: 60000000 },
        { name: "Spain", value: 47000000 },
        { name: "Other", value: 424000000 }
      ]
    },
    {
      name: "Asia",
      value: 4641000000,
      children: [
        { name: "China", value: 1402000000 },
        { name: "India", value: 1380000000 },
        { name: "Indonesia", value: 273000000 },
        { name: "Pakistan", value: 221000000 },
        { name: "Bangladesh", value: 165000000 },
        { name: "Japan", value: 126000000 },
        { name: "Other", value: 1074000000 }
      ]
    },
    {
      name: "Africa",
      value: 1340000000,
      children: [
        { name: "Nigeria", value: 206000000 },
        { name: "Ethiopia", value: 115000000 },
        { name: "Egypt", value: 102000000 },
        { name: "DR Congo", value: 90000000 },
        { name: "South Africa", value: 59000000 },
        { name: "Other", value: 768000000 }
      ]
    },
    {
      name: "South America",
      value: 430000000,
      children: [
        { name: "Brazil", value: 212000000 },
        { name: "Colombia", value: 50000000 },
        { name: "Argentina", value: 45000000 },
        { name: "Peru", value: 33000000 },
        { name: "Other", value: 90000000 }
      ]
    },
    {
      name: "Oceania",
      value: 42000000,
      children: [
        { name: "Australia", value: 25000000 },
        { name: "New Zealand", value: 5000000 },
        { name: "Other", value: 12000000 }
      ]
    }
  ]
};

/**
 * Alternative dataset for the circular Voronoi diagram demo
 * Based on industry sectors and market capitalization
 */
export const marketCapData = {
  name: "Global Market Sectors",
  children: [
    {
      name: "Technology",
      value: 12500,
      children: [
        { name: "Software", value: 4800 },
        { name: "Hardware", value: 3200 },
        { name: "Semiconductors", value: 2500 },
        { name: "IT Services", value: 2000 }
      ]
    },
    {
      name: "Healthcare",
      value: 8700,
      children: [
        { name: "Pharmaceuticals", value: 3500 },
        { name: "Medical Devices", value: 2200 },
        { name: "Biotech", value: 1800 },
        { name: "Healthcare Services", value: 1200 }
      ]
    },
    {
      name: "Financial",
      value: 9500,
      children: [
        { name: "Banking", value: 4200 },
        { name: "Insurance", value: 2800 },
        { name: "Asset Management", value: 1500 },
        { name: "Fintech", value: 1000 }
      ]
    },
    {
      name: "Consumer",
      value: 7800,
      children: [
        { name: "Retail", value: 2500 },
        { name: "Food & Beverage", value: 2000 },
        { name: "Apparel", value: 1800 },
        { name: "Entertainment", value: 1500 }
      ]
    },
    {
      name: "Industrial",
      value: 6500,
      children: [
        { name: "Manufacturing", value: 2800 },
        { name: "Aerospace", value: 1500 },
        { name: "Construction", value: 1200 },
        { name: "Transportation", value: 1000 }
      ]
    },
    {
      name: "Energy",
      value: 5200,
      children: [
        { name: "Oil & Gas", value: 2500 },
        { name: "Renewable Energy", value: 1500 },
        { name: "Utilities", value: 1200 }
      ]
    }
  ]
};
