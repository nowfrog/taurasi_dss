import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { INTERVENTIONS } from '../data/taurasi';
import { calculateInterventionCosts } from '../utils/calculations';

const OBJECTIVE_LABELS = {
  best_overall: "Best Overall",
  max_environmental: "Max Environmental",
  max_social: "Max Social",
  max_npv: "Max NPV"
};

export default function OptimalStrategy({
  budget,
  setBudget,
  objective,
  setObjective,
  objectives,
  results,
  currentState,
  allScenarios
}) {

  // Dati per grafico confronto scenari
  const scenarioComparisonData = allScenarios.map(scenario => ({
    scenario: OBJECTIVE_LABELS[scenario.objective],
    "MCEI": scenario.mcei || 0
  }));

  const mceiDelta = (results?.mcei || currentState.mcei) - currentState.mcei;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        3. Optimal Strategy Finder
      </h2>

      {/* Input Budget */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Enter Available Public Budget
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min={0}
          step={10000}
        />
      </div>

      {/* Select Obiettivo */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Select Optimization Objective
        </label>
        <select
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {objectives.map(obj => (
            <option key={obj.value} value={obj.value}>{obj.label}</option>
          ))}
        </select>
      </div>

      {/* Risultati */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-700 mb-2">Optimal Strategy Found</h3>

        {results?.selectedProjects?.length > 0 ? (
          <>
            <div className="space-y-2 mb-4">
              {results.selectedProjects.map(proj => {
                const costs = calculateInterventionCosts(proj);
                return (
                  <div key={proj.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium text-green-800">{proj.name}</span>
                    <span className="text-sm text-green-600">
                      {costs.totalCost.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Total Investment:</span>
              <span className="text-right font-medium">{results.totals?.totalCost?.toLocaleString()}</span>
              <span className="text-gray-500">New MCEI:</span>
              <span className="text-right font-bold text-blue-600">{results.mcei?.toFixed(2)}</span>
              <span className="text-gray-500">Improvement:</span>
              <span className={`text-right font-medium ${mceiDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mceiDelta >= 0 ? '+' : ''}{mceiDelta.toFixed(2)}%
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Budget insufficient for any intervention
          </div>
        )}
      </div>

      {/* Grafico Confronto Scenari */}
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium text-gray-700 mb-2">Scenario Comparison</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scenario" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="MCEI" fill="#3b82f6" name="MCEI" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabella Progetti Selezionati per Scenario */}
      <div className="border-t pt-4 mt-4 overflow-x-auto">
        <h3 className="font-medium text-gray-700 mb-2">Selected Projects by Scenario</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Project</th>
              {allScenarios.map(s => (
                <th key={s.objective} className="p-2 text-center">
                  {OBJECTIVE_LABELS[s.objective].split(' ')[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INTERVENTIONS.map(int => (
              <tr key={int.id} className="border-b">
                <td className="p-2">{int.name}</td>
                {allScenarios.map(scenario => (
                  <td key={scenario.objective} className="p-2 text-center">
                    {scenario.selectedProjects?.some(p => p.id === int.id)
                      ? <span className="text-green-600">&#10003;</span>
                      : <span className="text-gray-300">-</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
