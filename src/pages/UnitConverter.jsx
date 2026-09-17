import React, { useMemo, useState } from 'react'

const CATEGORIES = {
  Length: {
    base: 'm',
    units: {
      Millimeter: 0.001, Centimeter: 0.01, Meter: 1, Kilometer: 1000,
      Inch: 0.0254, Foot: 0.3048, Yard: 0.9144, Mile: 1609.34,
    },
  },
  Weight: {
    base: 'kg',
    units: {
      Milligram: 0.000001, Gram: 0.001, Kilogram: 1, Tonne: 1000,
      Ounce: 0.0283495, Pound: 0.453592,
    },
  },
  Temperature: { special: true },
  Data: {
    base: 'B',
    units: {
      Bit: 0.125, Byte: 1, Kilobyte: 1024, Megabyte: 1024 ** 2,
      Gigabyte: 1024 ** 3, Terabyte: 1024 ** 4,
    },
  },
}

function convertTemp(value, from, to) {
  let celsius
  if (from === 'Celsius') celsius = value
  else if (from === 'Fahrenheit') celsius = (value - 32) * (5 / 9)
  else celsius = value - 273.15

  if (to === 'Celsius') return celsius
  if (to === 'Fahrenheit') return celsius * (9 / 5) + 32
  return celsius + 273.15
}

export default function UnitConverter() {
  const [category, setCategory] = useState('Length')
  const def = CATEGORIES[category]
  const unitNames = def.special ? ['Celsius', 'Fahrenheit', 'Kelvin'] : Object.keys(def.units)

  const [from, setFrom] = useState(unitNamesForInit(category))
  const [to, setTo] = useState(unitNamesForInit(category, 1))
  const [value, setValue] = useState('1')

  function unitNamesForInit(cat, idx = 0) {
    const c = CATEGORIES[cat]
    const names = c.special ? ['Celsius', 'Fahrenheit', 'Kelvin'] : Object.keys(c.units)
    return names[idx] || names[0]
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setFrom(unitNamesForInit(cat, 0))
    setTo(unitNamesForInit(cat, 1))
  }

  const result = useMemo(() => {
    const v = parseFloat(value)
    if (isNaN(v)) return null
    if (def.special) return convertTemp(v, from, to)
    const base = v * def.units[from]
    return base / def.units[to]
  }, [value, from, to, category])

  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Unit Converter</h2>

        <div className="flex flex-wrap gap-2 mb-5">
          {Object.keys(CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold border transition ${
                category === cat
                  ? 'bg-accent text-white border-accent'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Value</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input-field mb-4 text-lg font-semibold"
        />

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-field">
              {unitNames.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="input-field">
              {unitNames.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-[#12141b] border border-slate-200 dark:border-slate-800 p-5 text-center">
          {result !== null ? (
            <div className="text-3xl font-extrabold">
              {Number(result.toFixed(6)).toLocaleString()} <span className="text-lg font-semibold text-slate-500">{to}</span>
            </div>
          ) : (
            <div className="text-sm text-slate-400">Enter a value to convert</div>
          )}
        </div>
      </div>
    </div>
  )
}
