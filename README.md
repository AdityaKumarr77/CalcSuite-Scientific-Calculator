# CalcSuite

A scalable, multi-tool calculator web application built with **React + Vite + Tailwind CSS**.

**Designed and Developed by Aditya Kumar Jha**

## Features

### 🧮 Scientific Calculator
- Trigonometric functions (sin, cos, tan + inverses) with DEG/RAD mode
- Logarithms (log, ln), square root, powers (x², xʸ), factorial, 1/x
- Memory functions (M+, MR, MC)
- Calculation history (persisted via `localStorage`)
- Full keyboard support

### 💱 Currency Converter
- Live exchange rates for 160+ currencies 

### 📐 Equation Solver
- Solves **linear**, **quadratic**, and **cubic** equations
- Returns real *and* complex roots (Cardano's method for cubics)
- Live canvas-rendered function graph with root markers

### 📏 Unit Converter
- Length, Weight, Temperature, and Data storage conversions

### 🌓 Theming
- Auto-detects the device's OS-level light/dark preference on load
- Manual toggle overrides the system preference; choice persists across sessions
- Automatically re-syncs to the system theme if the user hasn't manually overridden it

## Tech Stack
- **React 18** — component architecture
- **Vite** — fast dev server & build tooling
- **React Router** — client-side routing between tools
- **Tailwind CSS** — utility-first styling with dark mode
- **lucide-react** — icon set
- **Context API** — shared theme state
- **Canvas API** — dependency-free function graphing
- **localStorage** — offline-friendly persistence for history, theme, and cached FX rates

## Project Structure
```
calc-suite/
├── src/
│   ├── components/       # Navbar, Footer, Graph (canvas plotter)
│   ├── context/           # ThemeContext (auto + manual dark/light mode)
│   ├── pages/              # Dashboard, ScientificCalculator, CurrencyConverter, EquationSolver, UnitConverter
│   ├── utils/              # calcEngine.js (expression evaluator), equationSolver.js (Cardano's method)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```



Developed and Owned By:- Aditya Kumar Jha 

@ copyright 2026 All rights reserved.
