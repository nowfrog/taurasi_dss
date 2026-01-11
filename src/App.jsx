import React, { useState, useMemo } from 'react';
import { MUNICIPALITY_DATA, INTERVENTIONS, OPTIMIZATION_OBJECTIVES } from './data/taurasi';
import { calculateCurrentState, runSimulation, runOptimization, calculateAllOptimizationScenarios, calculateInterventionCosts } from './utils/calculations';
import CurrentState from './components/CurrentState';
import WhatIfSimulation from './components/WhatIfSimulation';
import OptimalStrategy from './components/OptimalStrategy';
import './index.css';

export default function App() {
  // Stato simulazione What-If
  const [activeInterventions, setActiveInterventions] = useState([]);

  // Stato ottimizzazione
  const [budget, setBudget] = useState(230000);
  const [objective, setObjective] = useState("max_npv");

  // Calcola stato attuale
  const currentState = useMemo(() => calculateCurrentState(), []);

  // Calcola simulazione
  const simulationResults = useMemo(() => {
    if (activeInterventions.length === 0) return null;
    return runSimulation(activeInterventions, INTERVENTIONS);
  }, [activeInterventions]);

  // Calcola interventi con costi
  const interventionsWithCosts = useMemo(() => {
    return INTERVENTIONS.map(int => ({
      ...int,
      costs: calculateInterventionCosts(int)
    }));
  }, []);

  // Calcola ottimizzazione
  const optimizationResults = useMemo(() => {
    return runOptimization(budget, objective, INTERVENTIONS);
  }, [budget, objective]);

  // Calcola tutti gli scenari per il grafico
  const allScenarios = useMemo(() => {
    return calculateAllOptimizationScenarios(budget, INTERVENTIONS);
  }, [budget]);

  const toggleIntervention = (id) => {
    setActiveInterventions(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            H-SMA-CE: Decision Support System for Circular Economy Transition
          </h1>
          <p className="text-gray-600">Municipality of {MUNICIPALITY_DATA.name}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sezione 1: Stato Attuale */}
          <CurrentState
            currentState={currentState}
          />

          {/* Sezione 2: Simulazione What-If */}
          <WhatIfSimulation
            interventions={interventionsWithCosts}
            activeInterventions={activeInterventions}
            toggleIntervention={toggleIntervention}
            currentState={currentState}
            simulationResults={simulationResults}
          />

          {/* Sezione 3: Strategia Ottimale */}
          <OptimalStrategy
            budget={budget}
            setBudget={setBudget}
            objective={objective}
            setObjective={setObjective}
            objectives={OPTIMIZATION_OBJECTIVES}
            results={optimizationResults}
            currentState={currentState}
            allScenarios={allScenarios}
          />

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          PNRR - Missione 4, Componente 2, Investimento 1.1 - Bando PRIN 2022
        </div>
      </footer>
    </div>
  );
}
