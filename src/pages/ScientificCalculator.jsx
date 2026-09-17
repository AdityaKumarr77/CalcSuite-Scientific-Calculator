import React, { useEffect, useState } from 'react'
import { Delete } from 'lucide-react'
import { evaluateExpression, formatExprForDisplay, trimNumber } from '../utils/calcEngine.js'

const HISTORY_KEY = 'calcsuite-sci-history'

export default function ScientificCalculator() {
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState('0')
  const [angleMode, setAngleMode] = useState('deg')
  const [memory, setMemory] = useState(0)
  const [justEvaluated, setJustEvaluated] = useState(false)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-50)))
  }, [history])

  const append = (val) => {
    let base = expr
    if (justEvaluated) {
      const isOperator = ['+', '-', '*', '/', '^'].includes(val)
      base = isOperator ? result : ''
      setJustEvaluated(false)
    }
    const next = base + val
    setExpr(next)
    setResult(next.length ? '' : '0')
  }

  const wrap = (prefix, suffix) => {
    let next
    if (justEvaluated) { next = prefix + result + suffix; setJustEvaluated(false) }
    else if (!expr.length) next = prefix + suffix
    else next = prefix + expr + suffix
    setExpr(next)
    setResult('')
  }

  const clearAll = () => { setExpr(''); setResult('0'); setJustEvaluated(false) }

  const backspace = () => {
    if (justEvaluated) { clearAll(); return }
    const next = expr.slice(0, -1)
    setExpr(next)
    setResult(next.length ? result : '0')
  }

  const negate = () => {
    if (justEvaluated) {
      const r = result.startsWith('-') ? result.slice(1) : '-' + result
      setResult(r); setExpr(r); return
    }
    if (!expr.length) return
    setExpr('-(' + expr + ')')
  }

  const compute = () => {
    if (!expr.trim()) return
    try {
      const val = evaluateExpression(expr, angleMode)
      if (typeof val !== 'number' || Number.isNaN(val)) throw new Error('bad')
      const formatted = trimNumber(val)
      setHistory((h) => [...h, { expr, result: formatted }])
      setResult(formatted)
      setJustEvaluated(true)
    } catch {
      setResult('Error')
      setJustEvaluated(true)
    }
  }

  const handleMemory = (type) => {
    let current
    try { current = justEvaluated ? parseFloat(result) : evaluateExpression(expr || '0', angleMode) }
    catch { current = NaN }
    if (type === 'mc') setMemory(0)
    else if (type === 'mr') append(trimNumber(memory))
    else if (type === 'm+' && !Number.isNaN(current)) setMemory((m) => m + current)
  }

  useEffect(() => {
    const handler = (ev) => {
      const k = ev.key
      if (/[0-9]/.test(k)) return append(k)
      if (k === '.') return append('.')
      if (['+', '-', '*', '/'].includes(k)) return append(k)
      if (k === '(') return append('(')
      if (k === ')') return append(')')
      if (k === '^') return append('^')
      if (k === 'Enter' || k === '=') { ev.preventDefault(); return compute() }
      if (k === 'Backspace') return backspace()
      if (k === 'Escape') return clearAll()
      if (k === '%') return append('%')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const Key = ({ children, className = 'key-btn', ...props }) => (
    <button className={className} {...props}>{children}</button>
  )

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr] items-start">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex gap-1 bg-slate-100 dark:bg-[#1e2230] p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setAngleMode('deg')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${angleMode === 'deg' ? 'bg-accent text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >DEG</button>
            <button
              onClick={() => setAngleMode('rad')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${angleMode === 'rad' ? 'bg-accent text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >RAD</button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{memory !== 0 ? `M = ${trimNumber(memory)}` : ''}</div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#12141b] px-4 py-4 mb-4 min-h-[100px] flex flex-col justify-end gap-1">
          <div className="text-sm text-slate-400 dark:text-slate-500 text-right break-all min-h-[18px]">
            {expr ? formatExprForDisplay(expr) : '\u00A0'}
          </div>
          <div className="text-right font-semibold text-3xl md:text-4xl break-all">{result}</div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          <Key className="key-danger" onClick={clearAll}>AC</Key>
          <Key className="key-danger" onClick={backspace}><Delete size={16} className="mx-auto" /></Key>
          <Key className="key-func" onClick={() => append('(')}>(</Key>
          <Key className="key-func" onClick={() => append(')')}>)</Key>
          <Key className="key-op" onClick={() => append('/')}>&divide;</Key>

          <Key className="key-func" onClick={() => append('sin(')}>sin</Key>
          <Key className="key-func" onClick={() => append('cos(')}>cos</Key>
          <Key className="key-func" onClick={() => append('tan(')}>tan</Key>
          <Key className="key-func" onClick={() => append('\u03c0')}>&pi;</Key>
          <Key className="key-op" onClick={() => append('*')}>&times;</Key>

          <Key className="key-func" onClick={() => append('asin(')}>sin&#8315;&sup1;</Key>
          <Key className="key-func" onClick={() => append('acos(')}>cos&#8315;&sup1;</Key>
          <Key className="key-func" onClick={() => append('atan(')}>tan&#8315;&sup1;</Key>
          <Key className="key-func" onClick={() => append('e')}>e</Key>
          <Key className="key-op" onClick={() => append('-')}>&minus;</Key>

          <Key className="key-func" onClick={() => append('log(')}>log</Key>
          <Key className="key-func" onClick={() => append('ln(')}>ln</Key>
          <Key className="key-func" onClick={() => append('sqrt(')}>&radic;</Key>
          <Key className="key-func" onClick={() => append('^2')}>x&sup2;</Key>
          <Key className="key-op" onClick={() => append('+')}>+</Key>

          <Key onClick={() => append('7')}>7</Key>
          <Key onClick={() => append('8')}>8</Key>
          <Key onClick={() => append('9')}>9</Key>
          <Key className="key-func" onClick={() => append('^')}>x&#8319;</Key>
          <Key className="key-func" onClick={() => append('!')}>n!</Key>

          <Key onClick={() => append('4')}>4</Key>
          <Key onClick={() => append('5')}>5</Key>
          <Key onClick={() => append('6')}>6</Key>
          <Key className="key-func" onClick={() => wrap('1/(', ')')}>1/x</Key>
          <Key className="key-func" onClick={() => append('%')}>%</Key>

          <Key onClick={() => append('1')}>1</Key>
          <Key onClick={() => append('2')}>2</Key>
          <Key onClick={() => append('3')}>3</Key>
          <Key className="key-func" onClick={() => handleMemory('mc')}>MC</Key>
          <Key className="key-func" onClick={() => handleMemory('mr')}>MR</Key>

          <Key onClick={() => append('0')}>0</Key>
          <Key onClick={() => append('.')}>.</Key>
          <Key className="key-func" onClick={negate}>&plusmn;</Key>
          <Key className="key-func" onClick={() => handleMemory('m+')}>M+</Key>
          <Key className="key-op col-span-2" onClick={compute} style={{ gridColumn: 'span 2' }}>=</Key>
        </div>
      </div>

      <div className="card p-4 max-h-[520px] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">History</h3>
          <button
            onClick={() => setHistory([])}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >Clear</button>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {history.length === 0 && (
            <div className="text-xs text-slate-400 text-center py-8">No calculations yet</div>
          )}
          {[...history].reverse().map((item, i) => (
            <button
              key={i}
              onClick={() => { setExpr(item.result); setResult(item.result); setJustEvaluated(true) }}
              className="text-left rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1e2a] px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <div className="text-[11px] text-slate-400 break-all">{formatExprForDisplay(item.expr)} =</div>
              <div className="text-sm font-bold break-all">{item.result}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
