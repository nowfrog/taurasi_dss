import React, { useState, useMemo } from 'react';
import { MUNICIPALITY_DATA, INTERVENTIONS, OPTIMIZATION_OBJECTIVES } from './data/taurasi';
import { calculateCurrentState, runSimulation, runOptimization, calculateAllOptimizationScenarios, calculateInterventionCosts } from './utils/calculations';
import CurrentState from './components/CurrentState';
import WhatIfSimulation from './components/WhatIfSimulation';
import OptimalStrategy from './components/OptimalStrategy';
import SimulatedDataForm from './components/SimulatedDataForm';
import Tutorial from './components/Tutorial';
import './index.css';

export default function App() {
  // Stato simulazione What-If
  const [activeInterventions, setActiveInterventions] = useState([]);

  // Stato ottimizzazione
  const [budget, setBudget] = useState(230000);
  const [objective, setObjective] = useState("max_npv");

  // Stato form dati simulati
  const [isSimulatedDataFormOpen, setIsSimulatedDataFormOpen] = useState(false);

  // Stato tutorial
  const [showTutorial, setShowTutorial] = useState(false);

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
      {/* Tutorial */}
      <Tutorial forceShow={showTutorial} onClose={() => setShowTutorial(false)} />

      {/* Form Dati Simulati */}
      <SimulatedDataForm
        isOpen={isSimulatedDataFormOpen}
        onClose={() => setIsSimulatedDataFormOpen(false)}
        currentState={currentState}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                H-SMA-CE: Decision Support System for Circular Economy Transition
              </h1>
              <p className="text-gray-600">Municipality of {MUNICIPALITY_DATA.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsSimulatedDataFormOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Simulate Year Data
              </button>
              <button
                onClick={() => setShowTutorial(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Show Tutorial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sezione 1: Stato Attuale */}
          <CurrentState
            currentState={currentState}
            simulationResults={simulationResults}
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
