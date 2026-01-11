import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Cell } from 'recharts';
import { DOMAIN_COLORS, DOMAIN_NAMES } from '../data/taurasi';

export default function CurrentState({ currentState }) {
  const { domains, mcei } = currentState;

  const radarData = Object.entries(domains).map(([key, value]) => ({
    domain: DOMAIN_NAMES[key],
    domainKey: key,
    value: value,
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
        <div className="text-4xl font-bold text-blue-600">{mcei.toFixed(2)}</div>
        <div className="text-sm text-gray-500">General Circularity Index</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(mcei, 100)}%` }}
          />
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
              dataKey="value"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Domain List */}
      <div className="mt-4 space-y-2">
        <h3 className="font-medium text-gray-700">Domain Performances</h3>
        {Object.entries(domains).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: DOMAIN_COLORS[key].main }}
              />
              <span className="text-sm text-gray-600">{DOMAIN_NAMES[key]}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(value, 100)}%`,
                    backgroundColor: DOMAIN_COLORS[key].main
                  }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">{value.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
