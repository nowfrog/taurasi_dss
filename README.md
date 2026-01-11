# H-SMA-CE: Decision Support System for Circular Economy Transition

A React web application that implements the Decision Support System (DSS) H-SMA-CE for the circular economy transition of the Municipality of Taurasi.

## Features

### 1. Current Circularity State
- Displays the current MCEI (Municipal Circular Economy Index) normalized (0-100)
- Radar chart showing performance across 6 domains:
  - Green Enterprise (GE)
  - Sustainable Mobility (SM)
  - Biodiversity Resource Saving (BRS)
  - Water Management (WM)
  - Collected Waste (CW)
  - Digitalization/Efficiency/Competition/Innovation (DECI)
- Progress bars for each domain performance

### 2. What-If Scenario Simulation
- Select from 6 available interventions:
  - Community Composting
  - Rainwater Harvesting
  - Bike Paths
  - Packaging Hub
  - E-waste Hub
  - Sustainable Wineries
- Real-time calculation of simulated MCEI
- Visual comparison between current and simulated domain values
- Cost/benefit analysis for selected interventions

### 3. Optimal Strategy Finder
- Input available public budget
- Select optimization objective:
  - Best Overall (Goal Programming)
  - Max Environmental Benefits
  - Max Social Benefits
  - Max NPV (Economic)
- Automatic selection of optimal project combination
- Comparison of all 4 optimization scenarios

## Technology Stack

- **React 19** - UI Framework
- **Vite** - Build Tool
- **Recharts** - Charting Library
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  components/
    CurrentState.jsx      # Section 1: Current state display
    WhatIfSimulation.jsx  # Section 2: What-if scenario simulation
    OptimalStrategy.jsx   # Section 3: Optimal strategy finder
  data/
    taurasi.js           # Hardcoded Taurasi municipality data
  utils/
    calculations.js      # DSS calculation logic
  App.jsx               # Main application component
  index.css             # Tailwind CSS styles
```

## Data Source

All data is based on the Municipality of Taurasi (2022) including:
- Population demographics
- Waste management statistics
- Water management data
- DECI domain indicators
- PCA results and benchmark values

## License

PNRR - Missione 4, Componente 2, Investimento 1.1 - Bando PRIN 2022
