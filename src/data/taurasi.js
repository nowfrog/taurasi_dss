// ============================================
// DATI MUNICIPALI DI TAURASI (2022)
// ============================================
export const MUNICIPALITY_DATA = {
  name: "Taurasi",
  typology: "Hill Borgo",
  year: 2022,

  // Demografia
  population: 2210,
  population_20_64: 1348,
  population_25_64: 1326,

  // Waste Management (tonnellate/anno)
  totalMSW: 743,           // Total MSW Generated
  sortedMSW: 505,          // Sorted MSW Collected
  unsortedMSW: 239,        // Unsorted MSW Collected
  hazardousWaste: 14,      // Hazardous Waste
  historicalExpenditure: 465757,  // €/anno
  standardExpenditure: 327994,    // €/anno

  // Water Management (1000 m³/anno)
  waterFed: 335,           // Water Fed into Network
  waterSupplied: 100,      // Water Supplied

  // DECI Domain
  digitalServices: 3,
  lowEducationPop: 395,    // Pop. 25-64 with low education
  employedPeople: 683,     // Employed (20-64)
  lowProductivityEmployees: 19,  // Ventile

  // Green Enterprise
  totalFirms: 1030,
  agriFirmsWithUAA: 20,

  // Sustainable Mobility
  highEmissionRate: 25.97,  // %

  // Biodiversity
  cohesionFunds: 0  // €/anno (2022)
};

// ============================================
// RISULTATI PCA (già calcolati)
// ============================================
export const PCA_RESULTS = {
  // Varianze spiegate dalle 3 componenti (%)
  variance: [56.34, 16.15, 16.09],

  // Eigenvalues
  eigenvalues: [4.089581, 4.10885, 2.935819],

  // Loadings per i 17 indicatori (dopo rotazione Varimax e correzione polarità)
  loadings: [
    // [Loading_C1, Loading_C2, Loading_C3]
    [0.381003, 0.89459, -0.213684],   // 1. GE: Agri firms ratio
    [0.751384, 0.00685, -0.752621],   // 2. SM: High emission rate
    [0.337724, -0.149784, -0.599481], // 3. BRS: Cohesion funds
    [0.949673, 0.144157, -0.215842],  // 4. WM: Water input per capita
    [0.949382, 0.081859, -0.167123],  // 5. WM: Supplied water per capita
    [0.755817, 0.44174, -0.431606],   // 6. WM: Water leaks
    [0.911477, 0.173475, -0.277172],  // 7. CW: MSW per capita
    [0.732725, -0.524156, -0.034115], // 8. CW: MSW sorted ratio
    [0.94613, 0.089762, -0.262476],   // 9. CW: Sorted MSW per capita
    [0.776967, 0.420059, -0.284928],  // 10. CW: Unsorted MSW per capita
    [-0.003182, 0.910167, -0.068535], // 11. CW: Hazardous waste
    [0.955296, 0.09236, -0.255403],   // 12. CW: Historical expenditure
    [0.969793, 0.154722, -0.193228],  // 13. CW: Standard expenditure
    [0.784335, 0.681912, 0.335528],   // 14. DECI: Digital accessibility
    [0.932145, 0.255729, -0.27122],   // 15. DECI: Low education
    [0.955551, 0.15061, -0.029688],   // 16. DECI: Employment rate
    [-0.115961, -0.110706, 1.093224]  // 17. DECI: Low-productivity employees
  ]
};

// ============================================
// INDICATORI CALCOLATI (2022)
// ============================================
export const INDICATORS = [
  {
    id: 1,
    domain: "GE",
    domainName: "Green Enterprise",
    name: "Agricultural firms with UAA / total firms",
    value: 1.941748,  // (20/1030)*100
    unit: "%",
    mean: 2.068023,
    std: 0.103416,
    zScore: -1.221045,
    polarity: 1,  // più è meglio
    min: 1.941748,
    max: 2.200957
  },
  {
    id: 2,
    domain: "SM",
    domainName: "Sustainable Mobility",
    name: "High emission motorisation rate",
    value: 25.97,
    unit: "%",
    mean: 22.764167,
    std: 11.237664,
    zScore: -0.285276,  // già con polarità applicata
    polarity: -1,  // meno è meglio
    min: 0,
    max: 29.63
  },
  {
    id: 3,
    domain: "BRS",
    domainName: "Biodiversity Resource Saving",
    name: "Cohesion funds for environmental projects (€/ab)",
    value: 0,
    unit: "€/ab",
    mean: 286.023822,
    std: 601.740422,
    zScore: -0.475328,
    polarity: 1,
    min: 0,
    max: 1361.122222
  },
  {
    id: 4,
    domain: "WM",
    domainName: "Water Management",
    name: "Water input per capita",
    value: 0.151584,  // 335/2210
    unit: "1000 m³/ab",
    mean: 0.148779,
    std: 0.002638,
    zScore: -1.0631,  // già con polarità
    polarity: -1,
    min: 0.145413,
    max: 0.151584
  },
  {
    id: 5,
    domain: "WM",
    domainName: "Water Management",
    name: "Supplied water per capita",
    value: 0.045249,  // 100/2210
    unit: "1000 m³/ab",
    mean: 0.0445,
    std: 0.000688,
    zScore: -1.089341,
    polarity: -1,
    min: 0.043578,
    max: 0.045249
  },
  {
    id: 6,
    domain: "WM",
    domainName: "Water Management",
    name: "Water leaks",
    value: 0.701493,  // (335-100)/335
    unit: "ratio",
    mean: 0.700891,
    std: 0.00086,
    zScore: -0.699336,
    polarity: -1,
    min: 0.7,
    max: 0.702065
  },
  {
    id: 7,
    domain: "CW",
    domainName: "Collected Waste",
    name: "MSW per capita",
    value: 336.199095,  // 743/2.210 * 1000
    unit: "kg/ab/anno",
    mean: 330.389081,
    std: 13.852706,
    zScore: -0.419414,  // già con polarità
    polarity: -1,
    min: 315.137615,
    max: 349.333333
  },
  {
    id: 8,
    domain: "CW",
    domainName: "Collected Waste",
    name: "MSW sorted / MSW",
    value: 67.967699,  // 505/743 * 100
    unit: "%",
    mean: 67.674634,
    std: 0.415852,
    zScore: 0.704733,
    polarity: 1,
    min: 67.248908,
    max: 68.235294
  },
  {
    id: 9,
    domain: "CW",
    domainName: "Collected Waste",
    name: "Sorted MSW per capita",
    value: 228.506787,  // 505/2.210 * 1000
    unit: "kg/ab/anno",
    mean: 223.611316,
    std: 10.064476,
    zScore: 0.486411,
    polarity: 1,
    min: 211.926606,
    max: 236
  },
  {
    id: 10,
    domain: "CW",
    domainName: "Collected Waste",
    name: "Unsorted MSW per capita",
    value: 108.144796,  // 239/2.210 * 1000
    unit: "kg/ab/anno",
    mean: 106.689563,
    std: 4.217835,
    zScore: -0.345019,  // già con polarità
    polarity: -1,
    min: 102.752294,
    max: 113.333333
  },
  {
    id: 11,
    domain: "CW",
    domainName: "Collected Waste",
    name: "Collected hazardous waste",
    value: 6.334842,  // 14/2.210 * 1000
    unit: "kg/ab/anno",
    mean: 8.029456,
    std: 1.32589,
    zScore: 1.278096,  // già con polarità
    polarity: -1,
    min: 6.334842,
    max: 10
  },
  {
    id: 12,
    domain: "CW",
    domainName: "Collected Waste",
    name: "Per capita historical expenditure for waste",
    value: 210.749774,  // 465757/2210
    unit: "€/ab",
    mean: 207.401387,
    std: 6.087996,
    zScore: 0.549998,
    polarity: 1,
    min: 200.154128,
    max: 214.588
  },
  {
    id: 13,
    domain: "CW",
    domainName: "Collected Waste",
    name: "Per capita standard expenditure for waste",
    value: 148.413575,  // 327994/2210
    unit: "€/ab",
    mean: 140.880187,
    std: 10.464623,
    zScore: 0.719891,
    polarity: 1,
    min: 126.850917,
    max: 152.029333
  },
  {
    id: 14,
    domain: "DECI",
    domainName: "Digitalization/Efficiency/Competition/Innovation",
    name: "Accessibility of local government digital properties",
    value: 3,
    unit: "number",
    mean: 0.75,
    std: 1.38873,
    zScore: 1.620185,
    polarity: 1,
    min: 0,
    max: 3
  },
  {
    id: 15,
    domain: "DECI",
    domainName: "Digitalization/Efficiency/Competition/Innovation",
    name: "Population 25-64 with low education (%)",
    value: 29.788839,  // 395/1326 * 100
    unit: "%",
    mean: 30.177511,
    std: 0.405766,
    zScore: 0.957874,  // già con polarità
    polarity: -1,
    min: 29.777778,
    max: 30.657492
  },
  {
    id: 16,
    domain: "DECI",
    domainName: "Digitalization/Efficiency/Competition/Innovation",
    name: "Employment rate (20-64)",
    value: 50.667656,  // 683/1348 * 100
    unit: "%",
    mean: 49.208315,
    std: 1.794727,
    zScore: 0.813127,
    polarity: 1,
    min: 46.35064,
    max: 50.667656
  },
  {
    id: 17,
    domain: "DECI",
    domainName: "Digitalization/Efficiency/Competition/Innovation",
    name: "Low-productivity employees (ventile)",
    value: 19,
    unit: "ventile",
    mean: 16.083333,
    std: 7.889339,
    zScore: -0.369697,  // già con polarità
    polarity: -1,
    min: 0,
    max: 20
  }
];

// ============================================
// BENCHMARK PER NORMALIZZAZIONE (L=worst, U=best)
// ============================================
export const BENCHMARKS = {
  MCEI: { L: -303.872855, U: 303.872855, nIndicators: 17 },
  GE: { L: -73.699993, U: 73.699993, nIndicators: 1 },
  SM: { L: -73.699993, U: 73.699993, nIndicators: 1 },
  BRS: { L: -73.699993, U: 73.699993, nIndicators: 1 },
  WM: { L: -127.652132, U: 127.652132, nIndicators: 3 },
  CW: { L: -194.991853, U: 194.991853, nIndicators: 7 },
  DECI: { L: -147.399986, U: 147.399986, nIndicators: 4 }
};

// ============================================
// INTERVENTI (6 progetti)
// ============================================
export const INTERVENTIONS = [
  {
    id: 1,
    name: "Community Composting",
    shortName: "P1",
    description: "Sistema di compostaggio comunitario per la frazione organica dei rifiuti",
    mainImpact: "-0.13 kg/ab MSW",
    publicSharePercentage: 50,
    // Coefficienti unitari (driver: organico = MSW * 0.35)
    coefficients: {
      cost: 1136,        // €/tonnellata organico
      revenue: 298,      // €/tonnellata organico
      envBenefit: 124,   // €/tonnellata organico
      socBenefit: 79.6,  // €/tonnellata organico
      npv: 1123          // €/tonnellata organico
    },
    driver: "organic",  // organico = MSW * 0.35
    impacts: [
      { indicator: 7, type: "subtract", value: 0.13 }  // MSW per capita
    ]
  },
  {
    id: 2,
    name: "Rainwater Harvesting",
    shortName: "P2",
    description: "Sistema di raccolta e riutilizzo delle acque piovane",
    mainImpact: "-60% water indicators",
    publicSharePercentage: 80,
    coefficients: {
      cost: 643,         // €/abitante
      revenue: 52,       // €/abitante
      envBenefit: 0.064, // €/abitante
      socBenefit: 36.73, // €/abitante
      npv: 385.6         // €/abitante
    },
    driver: "population",
    impacts: [
      { indicator: 4, type: "multiply", value: 0.4 },  // Water input
      { indicator: 5, type: "multiply", value: 0.4 },  // Supplied water
      { indicator: 6, type: "multiply", value: 0.4 }   // Water leaks
    ]
  },
  {
    id: 3,
    name: "Bike Paths",
    shortName: "P3",
    description: "Costruzione di piste ciclabili per la mobilità sostenibile",
    mainImpact: "-7.79 pp emissions",
    publicSharePercentage: 80,
    coefficients: {
      cost: 97,          // €/abitante
      revenue: 25.45,    // €/abitante
      envBenefit: 12.78, // €/abitante
      socBenefit: 11.42, // €/abitante
      npv: 125.6         // €/abitante
    },
    driver: "population",
    impacts: [
      { indicator: 2, type: "subtract", value: 7.79 }  // High emission rate
    ]
  },
  {
    id: 4,
    name: "Packaging Hub",
    shortName: "P4",
    description: "Hub per il riciclo degli imballaggi",
    mainImpact: "+1 firm, -0.05 kg/ab MSW",
    publicSharePercentage: 65,
    coefficients: {
      cost: 333,         // €/tonnellata MSW
      revenue: 112,      // €/tonnellata MSW
      envBenefit: 22.77, // €/tonnellata MSW
      socBenefit: 17.84, // €/tonnellata MSW
      npv: 68.95         // €/tonnellata MSW
    },
    driver: "msw",
    impacts: [
      { indicator: 1, type: "newFirm", value: 1 },     // Agri firms ratio
      { indicator: 7, type: "subtract", value: 0.05 }  // MSW per capita
    ]
  },
  {
    id: 5,
    name: "E-waste Hub",
    shortName: "P5",
    description: "Hub per la raccolta e riciclo dei RAEE",
    mainImpact: "+1 firm, -0.003 kg/ab MSW, +11.83 €/ab hist.exp.",
    publicSharePercentage: 60,
    coefficients: {
      cost: 160,         // €/abitante
      revenue: 143,      // €/abitante
      envBenefit: 19.38, // €/abitante
      socBenefit: 14.1,  // €/abitante
      npv: 114.4         // €/abitante
    },
    driver: "population",
    impacts: [
      { indicator: 1, type: "newFirm", value: 1 },      // Agri firms ratio
      { indicator: 7, type: "subtract", value: 0.003 }, // MSW per capita
      { indicator: 12, type: "add", value: 11.83 }      // Historical expenditure
    ]
  },
  {
    id: 6,
    name: "Sustainable Wineries",
    shortName: "P6",
    description: "Conversione delle aziende vinicole verso pratiche sostenibili",
    mainImpact: "-3.9 pp emissions, -0.39 kg/ab MSW",
    publicSharePercentage: 50,
    coefficients: {
      cost: 342849,      // €/impresa agricola
      revenue: 242899,   // €/impresa agricola
      envBenefit: 27525, // €/impresa agricola
      socBenefit: 61000, // €/impresa agricola
      npv: 428840        // €/impresa agricola
    },
    driver: "agriFirms",  // Solo se agriFirms > 0
    impacts: [
      { indicator: 2, type: "subtract", value: 3.9 },  // High emission rate
      { indicator: 7, type: "subtract", value: 0.39 }  // MSW per capita
    ]
  }
];

// ============================================
// POLARITÀ INDICATORI (per z-score)
// 1 = più è meglio, -1 = meno è meglio
// ============================================
export const POLARITY = {
  1: 1,   // Agri firms ratio - più è meglio
  2: -1,  // High emission - meno è meglio
  3: 1,   // Cohesion funds - più è meglio
  4: -1,  // Water input - meno è meglio
  5: -1,  // Supplied water - meno è meglio
  6: -1,  // Water leaks - meno è meglio
  7: -1,  // MSW per capita - meno è meglio
  8: 1,   // MSW sorted ratio - più è meglio
  9: 1,   // Sorted MSW per capita - più è meglio
  10: -1, // Unsorted MSW - meno è meglio
  11: -1, // Hazardous waste - meno è meglio
  12: 1,  // Historical expenditure - più è meglio
  13: 1,  // Standard expenditure - più è meglio
  14: 1,  // Digital accessibility - più è meglio
  15: -1, // Low education - meno è meglio
  16: 1,  // Employment rate - più è meglio
  17: -1  // Low-productivity - meno è meglio
};

// ============================================
// MAPPING INDICATORI → DOMINI
// ============================================
export const DOMAIN_INDICATORS = {
  GE: [1],
  SM: [2],
  BRS: [3],
  WM: [4, 5, 6],
  CW: [7, 8, 9, 10, 11, 12, 13],
  DECI: [14, 15, 16, 17]
};

// ============================================
// OBIETTIVI OTTIMIZZAZIONE
// ============================================
export const OPTIMIZATION_OBJECTIVES = [
  { value: "best_overall", label: "Best Overall (Goal Programming)" },
  { value: "max_environmental", label: "Max Environmental Benefits" },
  { value: "max_social", label: "Max Social Benefits" },
  { value: "max_npv", label: "Max NPV (Economic)" }
];

// Pesi per Goal Programming (Best Overall)
export const GOAL_PROGRAMMING_WEIGHTS = {
  environmental: 1,
  social: 2,
  npv: 2
};
