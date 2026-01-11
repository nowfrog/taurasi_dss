import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DOMAIN_NAMES = {
  GE: "Green Enterprise",
  SM: "Sustainable Mobility",
  BRS: "Biodiversity",
  WM: "Water Mgmt",
  CW: "Collected Waste",
  DECI: "DECI"
};

export default function WhatIfSimulation({
  interventions,
  activeInterventions,
  toggleIntervention,
  currentState,
  simulationResults
}) {

  const simDomains = simulationResults?.domains || currentState.domains;
  const simMCEI = simulationResults?.mcei || currentState.mcei;
  const totals = simulationResults?.totals || {};

  // Dati per grafico confronto
  const comparisonData = Object.keys(currentState.domains).map(key => ({
    domain: DOMAIN_NAMES[key],
    Current: currentState.domains[key],
    Simulated: simDomains[key]
  }));

  // Calcola delta
  const mceiDelta = simMCEI - currentState.mcei;
  const mceiDeltaPercent = currentState.mcei > 0
    ? ((mceiDelta / currentState.mcei) * 100).toFixed(2)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        2. What-If Scenario Simulation
      </h2>

      {/* Checkbox Interventi */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Select Interventions to Simulate:</p>
        <div className="space-y-2">
          {interventions.map(int => (
            <label
              key={int.id}
              className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={activeInterventions.includes(int.id)}
                onChange={() => toggleIntervention(int.id)}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                disabled={int.driver === "agriFirms" && int.costs.totalCost === 0}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">{int.name}</span>
                  <span className="text-sm text-gray-500">
                    {int.costs.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{int.mainImpact}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Risultati Simulazione */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Current MCEI</div>
            <div className="text-xl font-bold text-gray-700">{currentState.mcei.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-sm text-gray-500">Simulated MCEI</div>
            <div className="text-xl font-bold text-blue-600">{simMCEI.toFixed(2)}</div>
            {mceiDelta !== 0 && (
              <div className={`text-xs ${mceiDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mceiDelta > 0 ? '+' : ''}{mceiDeltaPercent}%
              </div>
            )}
          </div>
        </div>

        {/* Grafico Confronto */}
        {activeInterventions.length > 0 && (
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="domain" type="category" width={80} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Current" fill="#94a3b8" name="Current" />
                <Bar dataKey="Simulated" fill="#3b82f6" name="Simulated" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Riepilogo Costi */}
        {activeInterventions.length > 0 && (
          <div className="space-y-1 text-sm border-t pt-3">
            <h4 className="font-medium text-gray-700">Scenario Costs & Benefits</h4>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Total Cost:</span>
              <span className="text-right font-medium">{totals.totalCost?.toLocaleString()}</span>
              <span className="text-gray-500">Public Cost:</span>
              <span className="text-right">{totals.publicCost?.toLocaleString()}</span>
              <span className="text-gray-500">Private Cost:</span>
              <span className="text-right">{totals.privateCost?.toLocaleString()}</span>
              <span className="text-gray-500">Revenue:</span>
              <span className="text-right text-green-600">{totals.revenue?.toLocaleString()}</span>
              <span className="text-gray-500">Environmental Benefits:</span>
              <span className="text-right text-green-600">{totals.envBenefit?.toLocaleString()}</span>
              <span className="text-gray-500">Social Benefits:</span>
              <span className="text-right text-green-600">{totals.socBenefit?.toLocaleString()}</span>
              <span className="text-gray-500 font-medium">NPVe:</span>
              <span className="text-right font-bold text-blue-600">{totals.npv?.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
