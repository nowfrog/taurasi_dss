import {
  MUNICIPALITY_DATA,
  PCA_RESULTS,
  INDICATORS,
  BENCHMARKS,
  POLARITY,
  DOMAIN_INDICATORS,
  GOAL_PROGRAMMING_WEIGHTS
} from '../data/taurasi';

// ============================================
// NORMALIZZAZIONE MIN-MAX (0-100)
// ============================================
export function normalizeMinMax(rawValue, L, U) {
  // Normalizzazione senza cap a 0-100
  // I valori possono superare 100 se il valore simulato supera i bounds storici
  const norm = ((rawValue - L) / (U - L)) * 100;
  return norm;
}

// ============================================
// CALCOLO Z-SCORE (con clamping ai bounds storici)
// ============================================
export function calculateZScore(value, mean, std, polarity, min = null, max = null) {
  if (std === 0 || std < 0.0000001) return 0;

  // CLAMP: limita il valore ai bounds storici prima di calcolare lo z-score
  // Questo evita z-scores estremi quando i valori simulati escono dalla serie storica
  let valueClamped = value;
  if (min !== null && max !== null) {
    valueClamped = Math.max(min, Math.min(max, value));
  }

  // Calcola z-score con polarità
  const z = polarity * ((valueClamped - mean) / std);
  return z;
}

// ============================================
// CALCOLO CONTRIBUTO INDICATORE
// Contributo = z × (load1 × var1 + load2 × var2 + load3 × var3)
// ============================================
export function calculateIndicatorContribution(zScore, loadings, variance) {
  let contribution = 0;
  for (let f = 0; f < 3; f++) {
    contribution += zScore * loadings[f] * variance[f];
  }
  return contribution;
}

// ============================================
// CALCOLO DOMINI
// Domain = Σ contributi indicatori del dominio
// ============================================
export function calculateDomains(zScores) {
  const { loadings, variance } = PCA_RESULTS;
  const domains = {};

  for (const [domainCode, indicatorIds] of Object.entries(DOMAIN_INDICATORS)) {
    let domainValue = 0;
    for (const id of indicatorIds) {
      const idx = id - 1; // 0-based index
      const contribution = calculateIndicatorContribution(
        zScores[idx],
        loadings[idx],
        variance
      );
      domainValue += contribution;
    }
    domains[domainCode] = domainValue;
  }

  return domains;
}

// ============================================
// CALCOLO MCEI (Somma dei 6 domini)
// ============================================
export function calculateMCEI(domains) {
  return Object.values(domains).reduce((sum, val) => sum + val, 0);
}

// ============================================
// CALCOLO STATO ATTUALE
// ============================================
export function calculateCurrentState() {
  // Usa z-scores già calcolati negli indicatori
  const zScores = INDICATORS.map(ind => ind.zScore);

  const domains = calculateDomains(zScores);
  const mceiRaw = calculateMCEI(domains);

  // Normalizza domini e MCEI
  const normalizedDomains = {
    GE: normalizeMinMax(domains.GE, BENCHMARKS.GE.L, BENCHMARKS.GE.U),
    SM: normalizeMinMax(domains.SM, BENCHMARKS.SM.L, BENCHMARKS.SM.U),
    BRS: normalizeMinMax(domains.BRS, BENCHMARKS.BRS.L, BENCHMARKS.BRS.U),
    WM: normalizeMinMax(domains.WM, BENCHMARKS.WM.L, BENCHMARKS.WM.U),
    CW: normalizeMinMax(domains.CW, BENCHMARKS.CW.L, BENCHMARKS.CW.U),
    DECI: normalizeMinMax(domains.DECI, BENCHMARKS.DECI.L, BENCHMARKS.DECI.U)
  };

  const mceiNormalized = normalizeMinMax(mceiRaw, BENCHMARKS.MCEI.L, BENCHMARKS.MCEI.U);

  return {
    domains: normalizedDomains,
    domainsRaw: domains,
    mcei: mceiNormalized,
    mceiRaw
  };
}

// ============================================
// CALCOLO DRIVER PER INTERVENTO
// ============================================
function getDriverValue(driver) {
  const { population, totalMSW, agriFirmsWithUAA } = MUNICIPALITY_DATA;

  switch (driver) {
    case "population":
      return population;
    case "msw":
      return totalMSW;
    case "organic":
      return totalMSW * 0.35;  // 35% del MSW è organico
    case "agriFirms":
      return agriFirmsWithUAA;
    default:
      return 0;
  }
}

// ============================================
// CALCOLO COSTI E BENEFICI INTERVENTI
// ============================================
export function calculateInterventionCosts(intervention) {
  const driver = getDriverValue(intervention.driver);

  // Se è Sustainable Wineries e non ci sono imprese agricole, ritorna 0
  if (intervention.driver === "agriFirms" && driver === 0) {
    return {
      totalCost: 0,
      publicCost: 0,
      privateCost: 0,
      revenue: 0,
      envBenefit: 0,
      socBenefit: 0,
      npv: 0
    };
  }

  const { coefficients, publicSharePercentage } = intervention;

  const totalCost = coefficients.cost * driver;
  const publicCost = totalCost * (publicSharePercentage / 100);
  const privateCost = totalCost - publicCost;
  const revenue = coefficients.revenue * driver;
  const envBenefit = coefficients.envBenefit * driver;
  const socBenefit = coefficients.socBenefit * driver;
  const npv = coefficients.npv * driver;

  return {
    totalCost: Math.round(totalCost),
    publicCost: Math.round(publicCost),
    privateCost: Math.round(privateCost),
    revenue: Math.round(revenue),
    envBenefit: Math.round(envBenefit),
    socBenefit: Math.round(socBenefit),
    npv: Math.round(npv)
  };
}

// ============================================
// SIMULAZIONE WHAT-IF
// ============================================
export function runSimulation(activeInterventions, interventions) {
  // Copia indicatori baseline
  const simulatedIndicators = INDICATORS.map(ind => ({
    ...ind,
    simulatedValue: ind.value
  }));

  // Conta nuove imprese
  let newFirms = 0;

  // Applica impatti degli interventi attivi
  for (const intervention of interventions) {
    if (!activeInterventions.includes(intervention.id)) continue;

    // Skip Sustainable Wineries se non ci sono imprese agricole
    if (intervention.driver === "agriFirms" && MUNICIPALITY_DATA.agriFirmsWithUAA === 0) {
      continue;
    }

    for (const impact of intervention.impacts) {
      const idx = impact.indicator - 1;

      switch (impact.type) {
        case "subtract":
          simulatedIndicators[idx].simulatedValue -= impact.value;
          break;
        case "add":
          simulatedIndicators[idx].simulatedValue += impact.value;
          break;
        case "multiply":
          simulatedIndicators[idx].simulatedValue *= impact.value;
          break;
        case "newFirm":
          newFirms += impact.value;
          break;
      }
    }
  }

  // Aggiorna indicatore 1 se ci sono nuove imprese
  if (newFirms > 0) {
    const totalFirms = MUNICIPALITY_DATA.totalFirms + newFirms;
    const agriFirms = MUNICIPALITY_DATA.agriFirmsWithUAA + newFirms;
    simulatedIndicators[0].simulatedValue = (agriFirms / totalFirms) * 100;
  }

  // Ricalcola z-scores per indicatori modificati
  // NON usa clamping per le simulazioni degli interventi predefiniti
  // (il clamping è usato solo nel form di input manuale per valori estremi)
  const simulatedZScores = simulatedIndicators.map((ind) => {
    if (ind.simulatedValue !== ind.value) {
      return calculateZScore(
        ind.simulatedValue,
        ind.mean,
        ind.std,
        POLARITY[ind.id]
        // Niente min/max = niente clamping
      );
    }
    return ind.zScore;  // Mantieni z-score originale se non modificato
  });

  // Calcola domini e MCEI simulati
  const domains = calculateDomains(simulatedZScores);
  const mceiRaw = calculateMCEI(domains);

  // Normalizza
  const normalizedDomains = {
    GE: normalizeMinMax(domains.GE, BENCHMARKS.GE.L, BENCHMARKS.GE.U),
    SM: normalizeMinMax(domains.SM, BENCHMARKS.SM.L, BENCHMARKS.SM.U),
    BRS: normalizeMinMax(domains.BRS, BENCHMARKS.BRS.L, BENCHMARKS.BRS.U),
    WM: normalizeMinMax(domains.WM, BENCHMARKS.WM.L, BENCHMARKS.WM.U),
    CW: normalizeMinMax(domains.CW, BENCHMARKS.CW.L, BENCHMARKS.CW.U),
    DECI: normalizeMinMax(domains.DECI, BENCHMARKS.DECI.L, BENCHMARKS.DECI.U)
  };

  const mceiNormalized = normalizeMinMax(mceiRaw, BENCHMARKS.MCEI.L, BENCHMARKS.MCEI.U);

  // Calcola totali costi/benefici
  let totals = {
    totalCost: 0,
    publicCost: 0,
    privateCost: 0,
    revenue: 0,
    envBenefit: 0,
    socBenefit: 0,
    npv: 0
  };

  for (const intervention of interventions) {
    if (activeInterventions.includes(intervention.id)) {
      const costs = calculateInterventionCosts(intervention);
      totals.totalCost += costs.totalCost;
      totals.publicCost += costs.publicCost;
      totals.privateCost += costs.privateCost;
      totals.revenue += costs.revenue;
      totals.envBenefit += costs.envBenefit;
      totals.socBenefit += costs.socBenefit;
      totals.npv += costs.npv;
    }
  }

  return {
    domains: normalizedDomains,
    domainsRaw: domains,
    mcei: mceiNormalized,
    mceiRaw,
    simulatedIndicators,
    totals
  };
}

// ============================================
// OTTIMIZZAZIONE MULTI-OBIETTIVO
// ============================================
export function runOptimization(budget, objective, interventions) {
  const numProjects = interventions.length;
  const allCombinations = Math.pow(2, numProjects);

  // Calcola costi per ogni progetto
  const projectCosts = interventions.map(int => calculateInterventionCosts(int));

  // Fase 1: Trova valori ideali per Goal Programming
  let idealEnv = 0, idealSoc = 0, idealNPV = 0;

  for (let combo = 0; combo < allCombinations; combo++) {
    let pubCost = 0;
    let totEnv = 0, totSoc = 0, totNPV = 0;

    for (let i = 0; i < numProjects; i++) {
      if ((combo >> i) & 1) {
        pubCost += projectCosts[i].publicCost;
        totEnv += projectCosts[i].envBenefit;
        totSoc += projectCosts[i].socBenefit;
        totNPV += projectCosts[i].npv;
      }
    }

    if (pubCost <= budget) {
      if (totEnv > idealEnv) idealEnv = totEnv;
      if (totSoc > idealSoc) idealSoc = totSoc;
      if (totNPV > idealNPV) idealNPV = totNPV;
    }
  }

  // Fase 2: Trova combinazione ottima
  let bestValue = -Infinity;
  let bestCombo = [];
  let bestResults = null;

  for (let combo = 0; combo < allCombinations; combo++) {
    const active = [];
    let pubCost = 0;
    let totEnv = 0, totSoc = 0, totNPV = 0;

    for (let i = 0; i < numProjects; i++) {
      if ((combo >> i) & 1) {
        active.push(interventions[i].id);
        pubCost += projectCosts[i].publicCost;
        totEnv += projectCosts[i].envBenefit;
        totSoc += projectCosts[i].socBenefit;
        totNPV += projectCosts[i].npv;
      }
    }

    if (pubCost > budget) continue;

    let currentValue;

    switch (objective) {
      case "best_overall": {
        // Goal Programming: minimizza distanza percentuale dall'ideale
        const { environmental: wEnv, social: wSoc, npv: wNPV } = GOAL_PROGRAMMING_WEIGHTS;
        const diffEnv = idealEnv > 0 ? (totEnv - idealEnv) / idealEnv : 0;
        const diffSoc = idealSoc > 0 ? (totSoc - idealSoc) / idealSoc : 0;
        const diffNPV = idealNPV > 0 ? (totNPV - idealNPV) / idealNPV : 0;
        currentValue = wEnv * diffEnv + wSoc * diffSoc + wNPV * diffNPV;
        break;
      }
      case "max_environmental":
        currentValue = totEnv;
        break;
      case "max_social":
        currentValue = totSoc;
        break;
      case "max_npv":
        currentValue = totNPV;
        break;
      default:
        currentValue = 0;
    }

    if (currentValue > bestValue) {
      bestValue = currentValue;
      bestCombo = active;
    }
  }

  // Calcola risultati per la combinazione ottima
  if (bestCombo.length > 0) {
    bestResults = runSimulation(bestCombo, interventions);
    bestResults.selectedProjects = interventions.filter(int => bestCombo.includes(int.id));
  } else {
    bestResults = {
      domains: {},
      mcei: 0,
      totals: { totalCost: 0, publicCost: 0, revenue: 0, envBenefit: 0, socBenefit: 0, npv: 0 },
      selectedProjects: []
    };
  }

  return bestResults;
}

// ============================================
// CALCOLA TUTTI E 4 GLI SCENARI DI OTTIMIZZAZIONE
// ============================================
export function calculateAllOptimizationScenarios(budget, interventions) {
  const objectives = ["best_overall", "max_environmental", "max_social", "max_npv"];

  return objectives.map(objective => {
    const result = runOptimization(budget, objective, interventions);
    return {
      objective,
      ...result
    };
  });
}
