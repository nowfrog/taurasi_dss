import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { DOMAIN_COLORS, DOMAIN_NAMES } from '../data/taurasi';

export default function CurrentState({ currentState, simulationResults }) {
  const { domains, mcei } = currentState;
  const hasSimulation = simulationResults !== null;

  const radarData = Object.entries(domains).map(([key, value]) => ({
    domain: DOMAIN_NAMES[key],
    domainKey: key,
    Current: value,
    Simulated: hasSimulation ? simulationResults.domains[key] : value,
    fullMark: 100,
    color: DOMAIN_COLORS[key].main
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        1. Current Circularity State
      </h2>

      {/* MCEI Gauge */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-baseline gap-4">
          <div>
            <div className="text-4xl font-bold text-blue-600">{mcei.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Current</div>
          </div>
          {hasSimulation && (
            <>
              <div className="text-2xl text-gray-400">→</div>
              <div>
                <div className="text-4xl font-bold text-green-600">{simulationResults.mcei.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Simulated</div>
              </div>
            </>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-1">General Circularity Index</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2 relative">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 absolute"
            style={{ width: `${Math.min(mcei, 100)}%` }}
          />
          {hasSimulation && (
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500 absolute opacity-70"
              style={{ width: `${Math.min(simulationResults.mcei, 100)}%` }}
            />
          )}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
            <Radar
              name="Current"
              dataKey="Current"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
            {hasSimulation && (
              <Radar
                name="Simulated"
                dataKey="Simulated"
                stroke="#16a34a"
                fill="#22c55e"
                fillOpacity={0.3}
              />
            )}
            {hasSimulation && <Legend wrapperStyle={{ fontSize: 11 }} />}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Domain List */}
      <div className="mt-4 space-y-2">
        <h3 className="font-medium text-gray-700">Domain Performances</h3>
        {Object.entries(domains).map(([key, value]) => {
          const simValue = hasSimulation ? simulationResults.domains[key] : null;
          const delta = simValue !== null ? simValue - value : 0;

          return (
            <div key={key} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: DOMAIN_COLORS[key].main }}
                />
                <span className="text-sm text-gray-600">{DOMAIN_NAMES[key]}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2 relative">
                  <div
                    className="h-2 rounded-full absolute"
                    style={{
                      width: `${Math.min(value, 100)}%`,
                      backgroundColor: DOMAIN_COLORS[key].main
                    }}
                  />
                  {hasSimulation && (
                    <div
                      className="h-2 rounded-full absolute opacity-60"
                      style={{
                        width: `${Math.min(simValue, 100)}%`,
                        backgroundColor: '#22c55e'
                      }}
                    />
                  )}
                </div>
                <span className="text-sm font-medium w-12 text-right">{value.toFixed(1)}</span>
                {hasSimulation && Math.abs(delta) > 0.1 && (
                  <span className={`text-xs font-medium w-10 ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
