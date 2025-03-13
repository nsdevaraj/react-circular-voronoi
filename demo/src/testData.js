/**
 * Additional test data for the circular Voronoi diagram
 * More complex hierarchical structure to test drill-down functionality
 */
export const techCompaniesData = {
  name: "Technology Companies",
  value: 8500,
  children: [
    {
      name: "Software",
      value: 3500,
      children: [
        {
          name: "Enterprise",
          value: 1800,
          children: [
            { name: "Microsoft", value: 800 },
            { name: "Oracle", value: 500 },
            { name: "SAP", value: 300 },
            { name: "Salesforce", value: 200 }
          ]
        },
        {
          name: "Consumer",
          value: 1200,
          children: [
            { name: "Google", value: 600 },
            { name: "Meta", value: 400 },
            { name: "Snap", value: 100 },
            { name: "Twitter", value: 100 }
          ]
        },
        {
          name: "Gaming",
          value: 500,
          children: [
            { name: "EA", value: 150 },
            { name: "Activision", value: 150 },
            { name: "Ubisoft", value: 100 },
            { name: "Take-Two", value: 100 }
          ]
        }
      ]
    },
    {
      name: "Hardware",
      value: 2800,
      children: [
        {
          name: "Consumer Electronics",
          value: 1500,
          children: [
            { name: "Apple", value: 800 },
            { name: "Samsung", value: 400 },
            { name: "Sony", value: 200 },
            { name: "LG", value: 100 }
          ]
        },
        {
          name: "Computer Hardware",
          value: 800,
          children: [
            { name: "Dell", value: 300 },
            { name: "HP", value: 250 },
            { name: "Lenovo", value: 150 },
            { name: "ASUS", value: 100 }
          ]
        },
        {
          name: "Networking",
          value: 500,
          children: [
            { name: "Cisco", value: 250 },
            { name: "Juniper", value: 100 },
            { name: "Huawei", value: 100 },
            { name: "Nokia", value: 50 }
          ]
        }
      ]
    },
    {
      name: "Semiconductors",
      value: 1200,
      children: [
        {
          name: "Processors",
          value: 700,
          children: [
            { name: "Intel", value: 300 },
            { name: "AMD", value: 200 },
            { name: "ARM", value: 150 },
            { name: "NVIDIA", value: 50 }
          ]
        },
        {
          name: "Memory",
          value: 300,
          children: [
            { name: "Micron", value: 120 },
            { name: "SK Hynix", value: 100 },
            { name: "Samsung", value: 80 }
          ]
        },
        {
          name: "Specialized",
          value: 200,
          children: [
            { name: "TSMC", value: 100 },
            { name: "Qualcomm", value: 60 },
            { name: "Broadcom", value: 40 }
          ]
        }
      ]
    },
    {
      name: "Services",
      value: 1000,
      children: [
        {
          name: "Cloud",
          value: 600,
          children: [
            { name: "AWS", value: 300 },
            { name: "Azure", value: 200 },
            { name: "GCP", value: 100 }
          ]
        },
        {
          name: "Consulting",
          value: 400,
          children: [
            { name: "Accenture", value: 150 },
            { name: "IBM", value: 150 },
            { name: "Deloitte", value: 100 }
          ]
        }
      ]
    }
  ]
};

/**
 * Test data with very deep nesting to test drill-down performance
 */
export const deepNestedData = {
  name: "Root",
  value: 10000,
  children: Array.from({ length: 5 }, (_, i) => ({
    name: `Level 1 - ${i+1}`,
    value: 2000,
    children: Array.from({ length: 4 }, (_, j) => ({
      name: `Level 2 - ${i+1}.${j+1}`,
      value: 500,
      children: Array.from({ length: 3 }, (_, k) => ({
        name: `Level 3 - ${i+1}.${j+1}.${k+1}`,
        value: 166,
        children: Array.from({ length: 2 }, (_, l) => ({
          name: `Level 4 - ${i+1}.${j+1}.${k+1}.${l+1}`,
          value: 83,
          children: Array.from({ length: 2 }, (_, m) => ({
            name: `Level 5 - ${i+1}.${j+1}.${k+1}.${l+1}.${m+1}`,
            value: 41
          }))
        }))
      }))
    }))
  }))
};

/**
 * Test data with uneven distribution to test algorithm robustness
 */
export const unevenDistributionData = {
  name: "Uneven Distribution",
  value: 10000,
  children: [
    {
      name: "Very Large",
      value: 7000,
      children: [
        { name: "Large Child 1", value: 4000 },
        { name: "Large Child 2", value: 3000 }
      ]
    },
    {
      name: "Medium",
      value: 2000,
      children: [
        { name: "Medium Child 1", value: 1200 },
        { name: "Medium Child 2", value: 800 }
      ]
    },
    {
      name: "Small",
      value: 800,
      children: [
        { name: "Small Child 1", value: 500 },
        { name: "Small Child 2", value: 300 }
      ]
    },
    {
      name: "Tiny",
      value: 200,
      children: [
        { name: "Tiny Child 1", value: 120 },
        { name: "Tiny Child 2", value: 50 },
        { name: "Tiny Child 3", value: 30 }
      ]
    }
  ]
};
