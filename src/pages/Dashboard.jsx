import React from 'react'
import { Link } from 'react-router-dom'
import { Calculator, DollarSign, FunctionSquare, Ruler, ArrowRight } from 'lucide-react'

const tools = [
  {
    to: '/scientific',
    icon: Calculator,
    title: 'Scientific Calculator',
    desc: 'Trigonometry, logarithms, powers, factorials, memory functions, history and full keyboard support.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    to: '/currency',
    icon: DollarSign,
    title: 'Currency Converter',
    desc: 'Live exchange rates for 160+ currencies with instant conversion and a quick-swap control.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    to: '/equation',
    icon: FunctionSquare,
    title: 'Equation Solver',
    desc: 'Solve linear, quadratic and cubic equations with real & complex roots — plus a live graph.',
    color: 'from-fuchsia-500 to-purple-500',
  },
  {
    to: '/units',
    icon: Ruler,
    title: 'Unit Converter',
    desc: 'Convert length, weight, temperature and data storage units on the fly.',
    color: 'from-amber-500 to-orange-500',
  },
]

export default function Dashboard() {
  return (
    <div>
      <section className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          One toolkit. Every calculation.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
          A fast, offline-friendly, installable calculator suite — scientific computation,
          live currency conversion, equation solving and unit conversion in a single app.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-5">
        {tools.map(({ to, icon: Icon, title, desc, color }) => (
          <Link
            key={to}
            to={to}
            className="card p-5 group hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-md`}>
              <Icon size={20} />
            </div>
            <h3 className="font-bold text-lg mb-1.5">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            <div className="flex items-center gap-1 text-accent dark:text-accent-dark text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
              Open tool <ArrowRight size={15} />
            </div>
          </Link>
        ))}
      </section>

    </div>
  )
}
