import React, { useState, useEffect } from 'react';

const TUTORIAL_STEPS = [
  {
    title: "Welcome to H-SMA-CE DSS",
    description: "This Decision Support System helps municipalities plan their transition to a Circular Economy. Let's take a quick tour!",
    image: null,
    highlight: null
  },
  {
    title: "1. Current Circularity State",
    description: "The first section shows your municipality's current circularity performance. The MCEI (Municipal Circular Economy Index) aggregates 17 indicators across 6 domains: Green Enterprise, Sustainable Mobility, Biodiversity, Water Management, Collected Waste, and DECI.",
    image: null,
    highlight: "section-1"
  },
  {
    title: "2. What-If Scenario Simulation",
    description: "Select one or more interventions to simulate their impact on circularity. You'll see how each domain would change and the associated costs and benefits of the selected projects.",
    image: null,
    highlight: "section-2"
  },
  {
    title: "3. Optimal Strategy Finder",
    description: "Enter your available public budget and select an optimization objective. The system will automatically find the best combination of projects to maximize your goals within budget constraints.",
    image: null,
    highlight: "section-3"
  },
  {
    title: "Simulated Data Input",
    description: "Use the 'Simulate Year Data' button to enter hypothetical indicator values for a future year and see how the MCEI would change. This helps with scenario planning and target setting.",
    image: null,
    highlight: "simulate-button"
  },
  {
    title: "You're Ready!",
    description: "Start exploring your municipality's circular economy potential. Remember: you can revisit this tutorial anytime by clicking the help icon in the header.",
    image: null,
    highlight: null
  }
];

const STORAGE_KEY = 'hsma-ce-tutorial-completed';

export default function Tutorial({ forceShow = false, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      setCurrentStep(0);
      return;
    }

    // Check if tutorial was already completed
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setIsVisible(true);
    }
  }, [forceShow]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      {/* Highlight overlay for specific sections */}
      {step.highlight && (
        <div className="absolute inset-0 pointer-events-none">
          {/* This would highlight specific sections - simplified for demo */}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header Icon */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {isFirstStep ? (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ) : isLastStep ? (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-2xl font-bold text-white">{currentStep}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h2>
          <p className="text-gray-600 leading-relaxed">{step.description}</p>
        </div>

        {/* Visual hint for sections */}
        {step.highlight && step.highlight.startsWith('section') && (
          <div className="px-8 pb-6">
            <div className="flex justify-center gap-2">
              {['section-1', 'section-2', 'section-3'].map((sec, idx) => (
                <div
                  key={sec}
                  className={`w-16 h-12 rounded border-2 flex items-center justify-center text-xs font-medium transition-all ${
                    step.highlight === sec
                      ? 'border-blue-500 bg-blue-50 text-blue-600 scale-110'
                      : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 pb-4">
          {TUTORIAL_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-blue-500 w-6'
                  : idx < currentStep
                  ? 'bg-blue-300'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="px-8 py-4 bg-gray-50 border-t flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Skip tutorial
          </button>

          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition font-medium"
            >
              {isLastStep ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export function to reset tutorial (for testing)
export function resetTutorial() {
  localStorage.removeItem(STORAGE_KEY);
}
