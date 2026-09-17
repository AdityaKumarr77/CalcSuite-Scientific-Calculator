import React, { useEffect, useState } from 'react'
import { ArrowLeftRight, RefreshCw } from 'lucide-react'

const POPULAR = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CNY', 'SGD', 'AED', 'CHF', 'ZAR']
const CACHE_KEY = 'calcsuite-fx-cache'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

export default function CurrencyConverter() {
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [amount, setAmount] = useState('1')
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const fetchRates = async (base, force = false) => {
    setError('')
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
        if (cached && cached.base === base && Date.now() - cached.time < CACHE_TTL) {
          setRates(cached.rates)
          setUpdatedAt(cached.time)
          return
        }
      } catch {}
    }
    setLoading(true)
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${base}`)
      const data = await res.json()
      if (data.result !== 'success') throw new Error('API error')
      setRates(data.rates)
      setUpdatedAt(Date.now())
      localStorage.setItem(CACHE_KEY, JSON.stringify({ base, rates: data.rates, time: Date.now() }))
    } catch (e) {
      setError('Could not fetch live rates. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRates(from) }, [from])

  const swap = () => { setFrom(to); setTo(from) }

  const converted = (() => {
    const amt = parseFloat(amount)
    if (!rates || !rates[to] || isNaN(amt)) return null
    return (amt * rates[to]).toLocaleString(undefined, { maximumFractionDigits: 4 })
  })()

  const rate = rates && rates[to] ? rates[to] : null
  const currencies = rates ? Object.keys(rates).sort() : POPULAR

  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">Currency Converter</h2>
          <button
            onClick={() => fetchRates(from, true)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field mb-4 text-lg font-semibold"
          placeholder="Enter amount"
        />

        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-field">
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={swap}
            className="mb-0.5 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:brightness-110 transition"
            aria-label="Swap currencies"
          >
            <ArrowLeftRight size={16} />
          </button>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="input-field">
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {error && <div className="text-sm text-rose-500 mb-3">{error}</div>}

        <div className="min-w-0 overflow-hidden rounded-xl bg-slate-50 dark:bg-[#12141b] border border-slate-200 dark:border-slate-800 p-5 text-center">
          {loading ? (
            <div className="text-sm text-slate-400">Fetching live rates...</div>
          ) : converted ? (
            <>
              <div className="break-all text-2xl sm:text-3xl font-extrabold">{converted} <span className="break-normal text-lg font-semibold text-slate-500">{to}</span></div>
              <div className="text-xs text-slate-400 mt-2">
                1 {from} = {rate ? rate.toFixed(4) : '—'} {to}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400">Enter an amount to convert</div>
          )}
        </div>

        {updatedAt && (
          <div className="text-[11px] text-slate-400 text-center mt-3">
            Rates last updated {new Date(updatedAt).toLocaleTimeString()}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mt-5">
          {POPULAR.filter((c) => c !== from).slice(0, 8).map((c) => (
            <button
              key={c}
              onClick={() => setTo(c)}
              className={`text-xs font-semibold py-2 rounded-lg border transition ${
                to === c
                  ? 'bg-accent text-white border-accent'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
