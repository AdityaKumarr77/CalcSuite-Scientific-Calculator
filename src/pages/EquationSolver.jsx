import React, { useMemo, useState } from 'react'
import { solvePolynomial, samplePoints } from '../utils/equationSolver.js'
import Graph from '../components/Graph.jsx'

const DEGREES = [
  { key: 1, label: 'Linear', form: 'ax + b = 0', fields: ['a', 'b'] },
  { key: 2, label: 'Quadratic', form: 'ax\u00b2 + bx + c = 0', fields: ['a', 'b', 'c'] },
  { key: 3, label: 'Cubic', form: 'ax\u00b3 + bx\u00b2 + cx + d = 0', fields: ['a', 'b', 'c', 'd'] },
]

export default function EquationSolver() {
  const [degree, setDegree] = useState(2)
  const [coeffs, setCoeffs] = useState({ a: '1', b: '0', c: '-1', d: '0' })
  const [solved, setSolved] = useState(null)

  const activeDef = DEGREES.find((d) => d.key === degree)

  const handleChange = (field, value) => setCoeffs((c) => ({ ...c, [field]: value }))

  const solve = () => {
    const values = activeDef.fields.map((f) => parseFloat(coeffs[f] || '0'))
    const padded = degree === 1 ? [0, 0, ...values] : degree === 2 ? [0, ...values] : values
    const res = solvePolynomial(padded)
    setSolved({ ...res, coeffsUsed: padded })
  }

  const points = useMemo(() => {
    if (!solved) return []
    const range = Math.max(4, ...solved.realRoots.map((root) => Math.abs(root) * 1.4 + 1))
    return samplePoints(solved.coeffsUsed, range)
  }, [solved])

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="card p-6">
        <h2 className="font-bold text-lg mb-1">Equation Solver</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Solve linear, quadratic, or cubic equations — including complex roots.
        </p>

        <div className="flex gap-2 mb-5">
          {DEGREES.map((d) => (
            <button
              key={d.key}
              onClick={() => { setDegree(d.key); setSolved(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${
                degree === d.key
                  ? 'bg-accent text-white border-accent'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="text-center font-mono text-sm mb-5 text-slate-500 dark:text-slate-400">
          {activeDef.form}
        </div>

        <div className={`grid gap-3 mb-5`} style={{ gridTemplateColumns: `repeat(${activeDef.fields.length}, 1fr)` }}>
          {activeDef.fields.map((f) => (
            <div key={f}>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">{f}</label>
              <input
                type="number"
                value={coeffs[f]}
                onChange={(e) => handleChange(f, e.target.value)}
                className="input-field text-center font-semibold"
              />
            </div>
          ))}
        </div>

        <button onClick={solve} className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:brightness-110 transition">
          Solve Equation
        </button>

        {solved && (
          <div className="mt-5 rounded-xl bg-slate-50 dark:bg-[#12141b] border border-slate-200 dark:border-slate-800 p-4">
            {solved.roots.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">{solved.note}</div>
            ) : (
              <>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase">
                  {solved.roots.length > 1 ? 'Roots' : 'Root'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {solved.roots.map((r, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent dark:text-accent-dark font-mono text-sm font-semibold">
                      x{solved.roots.length > 1 ? i + 1 : ''} = {r}
                    </span>
                  ))}
                </div>
                {solved.realRoots.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase">
                      X-axis intersections ({solved.realRoots.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {solved.realRoots.map((root, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-300 font-mono text-sm font-semibold">
                          ({root.toFixed(6).replace(/\.?0+$/, '')}, 0)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-sm mb-3">Function graph</h3>
        {solved && points.length ? (
          <Graph points={points} roots={solved.realRoots} height={320} />
        ) : (
          <div className="h-[320px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-sm text-slate-400">
            Solve an equation to see its graph
          </div>
        )}
        <p className="text-xs text-slate-400 mt-3">
          Red dots mark every real x-axis intersection; complex roots are listed above but are not plotted.
        </p>
      </div>
    </div>
  )
}
