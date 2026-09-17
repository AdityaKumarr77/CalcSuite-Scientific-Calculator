import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Calculator, DollarSign, FunctionSquare, Ruler, Moon, Sun, Menu, X, LayoutGrid } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/scientific', label: 'Scientific', icon: Calculator },
  { to: '/currency', label: 'Currency', icon: DollarSign },
  { to: '/equation', label: 'Equation Solver', icon: FunctionSquare },
  { to: '/units', label: 'Unit Converter', icon: Ruler },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 dark:bg-[#0f1117]/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-indigo-400 flex items-center justify-center text-white font-bold shadow-md">
            &sum;
          </div>
          <div>
            <div className="font-extrabold text-[17px] leading-none tracking-tight">CalcSuite</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">All-in-one calculator toolkit</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            className="md:hidden w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
