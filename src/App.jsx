import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScientificCalculator from './pages/ScientificCalculator.jsx'
import CurrencyConverter from './pages/CurrencyConverter.jsx'
import EquationSolver from './pages/EquationSolver.jsx'
import UnitConverter from './pages/UnitConverter.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scientific" element={<ScientificCalculator />} />
          <Route path="/currency" element={<CurrencyConverter />} />
          <Route path="/equation" element={<EquationSolver />} />
          <Route path="/units" element={<UnitConverter />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
