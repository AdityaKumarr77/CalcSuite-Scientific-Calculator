import React, { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Graph({ points, roots = [], height = 260 }) {
  const canvasRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !points || points.length === 0) return
    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    const isDark = theme === 'dark'
    const gridColor = isDark ? '#262b38' : '#e2e6ee'
    const axisColor = isDark ? '#5b6478' : '#9aa3b5'
    const lineColor = isDark ? '#5b7cfa' : '#4f6df5'
    const rootColor = isDark ? '#ff8080' : '#e0433a'

    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y).filter((y) => isFinite(y))
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const maxAbsY = Math.max(1, ...ys.map((y) => Math.abs(y)))
    const minY = -maxAbsY, maxY = maxAbsY

    const toPx = (x) => ((x - minX) / (maxX - minX)) * width
    const toPy = (y) => height - ((y - minY) / (maxY - minY)) * height

    // grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const gx = (i / 10) * width
      const gy = (i / 10) * height
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke()
    }

    // axes
    ctx.strokeStyle = axisColor
    ctx.lineWidth = 1.5
    const yZero = toPy(0)
    const xZero = toPx(0)
    ctx.beginPath(); ctx.moveTo(0, yZero); ctx.lineTo(width, yZero); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(xZero, 0); ctx.lineTo(xZero, height); ctx.stroke()

    // curve
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2.5
    ctx.beginPath()
    let started = false
    points.forEach((p) => {
      if (!isFinite(p.y)) { started = false; return }
      const px = toPx(p.x), py = toPy(Math.max(minY, Math.min(maxY, p.y)))
      if (!started) { ctx.moveTo(px, py); started = true } else { ctx.lineTo(px, py) }
    })
    ctx.stroke()

    // roots
    ctx.fillStyle = rootColor
    roots.forEach((r) => {
      const num = parseFloat(r)
      if (isNaN(num) || num < minX || num > maxX) return
      const px = toPx(num), py = toPy(0)
      ctx.beginPath()
      ctx.arc(px, py, 4.5, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [points, roots, theme, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px`, display: 'block', borderRadius: '12px' }}
      className="bg-slate-50 dark:bg-[#12141b] border border-slate-200 dark:border-slate-800"
    />
  )
}
