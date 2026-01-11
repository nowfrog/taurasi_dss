import React, { useState, useMemo } from 'react';
import { INDICATORS, DOMAIN_COLORS, DOMAIN_NAMES, BENCHMARKS, PCA_RESULTS, POLARITY, DOMAIN_INDICATORS } from '../data/taurasi';

// Funzioni di calcolo inline per evitare dipendenze circolari
const Z_SCORE_CAP = 6.0; // Limiti teorici basati sulla PCA

function calculateZScore(value, mean, std, polarity) {
  if (std === 0 || std < 0.0000001) return 0;
  let z = polarity * ((value - mean) / std);
  if (z > Z_SCORE_CAP) z = Z_SCORE_CAP;
  if (z < -Z_SCORE_CAP) z = -Z_SCORE_CAP;
  return z;
}

function normalizeMinMax(rawValue, L, U) {
  let norm = ((rawValue - L) / (U - L)) * 100;
  if (norm < 0) norm = 0;
  if (norm > 100) norm = 100;
  return norm;
}

function calculateIndicatorContribution(zScore, loadings, variance) {
  let contribution = 0;
  for (let f = 0; f < 3; f++) {
    contribution += zScore * loadings[f] * variance[f];
  }
  return contribution;
}

export default function SimulatedDataForm({ isOpen, onClose, currentState }) {
  // Stato per i valori simulati degli indicatori
  const [simulatedValues, setSimulatedValues] = useState(() =>
    INDICATORS.reduce((acc, ind) => {
      acc[ind.id] = ind.value;
      return acc;
    }, {})
  );

  const [yearLabel, setYearLabel] = useState("2025");

  // Calcola i risultati con i valori simulati
  const simulatedResults = useMemo(() => {
    // Calcola z-scores per i valori simulati
    const zScores = INDICATORS.map((ind) => {
      return calculateZScore(
        simulatedValues[ind.id],
        ind.mean,
        ind.std,
        POLARITY[ind.id]
      );
    });

    // Calcola domini
    const { loadings, variance } = PCA_RESULTS;
    const domains = {};

    for (const [domainCode, indicatorIds] of Object.entries(DOMAIN_INDICATORS)) {
      let domainValue = 0;
      for (const id of indicatorIds) {
        const idx = id - 1;
        const contribution = calculateIndicatorContribution(
          zScores[idx],
          loadings[idx],
          variance
        );
        domainValue += contribution;
      }
      domains[domainCode] = domainValue;
    }

    // Calcola MCEI
    const mceiRaw = Object.values(domains).reduce((sum, val) => sum + val, 0);

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

    return {
      domains: normalizedDomains,
      mcei: mceiNormalized
    };
  }, [simulatedValues]);

  const handleValueChange = (indicatorId, value) => {
    setSimulatedValues(prev => ({
      ...prev,
      [indicatorId]: parseFloat(value) || 0
    }));
  };

  const resetToBaseline = () => {
    setSimulatedValues(
      INDICATORS.reduce((acc, ind) => {
        acc[ind.id] = ind.value;
        return acc;
      }, {})
    );
  };

  const mceiDelta = simulatedResults.mcei - currentState.mcei;

  if (!isOpen) return null;

  // Raggruppa indicatori per dominio
  const indicatorsByDomain = {};
  for (const ind of INDICATORS) {
    if (!indicatorsByDomain[ind.domain]) {
      indicatorsByDomain[ind.domain] = [];
    }
    indicatorsByDomain[ind.domain].push(ind);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Simulated Year Data Input</h2>
              <p className="text-blue-100 text-sm">Enter hypothetical values to see how the MCEI would change</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Year Input */}
        <div className="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600">Simulation Year:</label>
            <input
              type="text"
              value={yearLabel}
              onChange={(e) => setYearLabel(e.target.value)}
              className="px-3 py-1 border rounded w-24 text-center font-medium"
            />
          </div>
          <button
            onClick={resetToBaseline}
            className="text-sm px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
          >
            Reset to Baseline (2022)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(indicatorsByDomain).map(([domain, indicators]) => (
              <div
                key={domain}
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: DOMAIN_COLORS[domain].main }}
              >
                <div
                  className="px-4 py-2 flex items-center gap-2"
                  style={{ backgroundColor: DOMAIN_COLORS[domain].light }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: DOMAIN_COLORS[domain].main }}
                  />
                  <h3 className="font-medium text-gray-800">{DOMAIN_NAMES[domain]}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {indicators.map(ind => {
                    const currentVal = simulatedValues[ind.id];
                    const baselineVal = ind.value;
                    const delta = currentVal - baselineVal;
                    const deltaPercent = baselineVal !== 0 ? (delta / baselineVal) * 100 : 0;

                    return (
                      <div key={ind.id} className="space-y-1">
                        <label className="text-sm text-gray-600 block">
                          {ind.name}
                          <span className="text-gray-400 ml-1">({ind.unit})</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="any"
                            value={currentVal}
                            onChange={(e) => handleValueChange(ind.id, e.target.value)}
                            className="flex-1 px-3 py-1.5 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="text-xs text-gray-400 w-20">
                            Base: {baselineVal.toFixed(2)}
                          </span>
                          {Math.abs(delta) > 0.001 && (
                            <span className={`text-xs font-medium w-16 text-right ${delta > 0 ? (ind.polarity > 0 ? 'text-green-600' : 'text-red-600') : (ind.polarity > 0 ? 'text-red-600' : 'text-green-600')}`}>
                              {deltaPercent > 0 ? '+' : ''}{deltaPercent.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-3 gap-8">
              {/* Baseline MCEI */}
              <div className="text-center">
                <div className="text-sm text-gray-500">Baseline (2022)</div>
                <div className="text-2xl font-bold text-gray-700">{currentState.mcei.toFixed(2)}</div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Simulated MCEI */}
              <div className="text-center">
                <div className="text-sm text-gray-500">Simulated ({yearLabel})</div>
                <div className="text-2xl font-bold text-blue-600">{simulatedResults.mcei.toFixed(2)}</div>
                {Math.abs(mceiDelta) > 0.01 && (
                  <div className={`text-sm font-medium ${mceiDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mceiDelta > 0 ? '+' : ''}{mceiDelta.toFixed(2)} points
                  </div>
                )}
              </div>
            </div>

            {/* Domain Results */}
            <div className="flex gap-2">
              {Object.entries(simulatedResults.domains).map(([key, value]) => {
                const delta = value - currentState.domains[key];
                return (
                  <div
                    key={key}
                    className="text-center px-2 py-1 rounded"
                    style={{ backgroundColor: DOMAIN_COLORS[key].light }}
                  >
                    <div className="text-xs text-gray-500">{key}</div>
                    <div className="text-sm font-bold" style={{ color: DOMAIN_COLORS[key].main }}>
                      {value.toFixed(1)}
                    </div>
                    {Math.abs(delta) > 0.1 && (
                      <div className={`text-xs ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
