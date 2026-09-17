// Polynomial equation solver for degree 1–3, returns real/complex roots as strings,
// plus a sampled point-set for graphing y = f(x).

function fmt(n) {
  if (Math.abs(n) < 1e-9) return '0'
  return Number(n.toFixed(6)).toString()
}

function complexToString(re, im) {
  if (Math.abs(im) < 1e-9) return fmt(re)
  const sign = im >= 0 ? '+' : '-'
  return `${fmt(re)} ${sign} ${fmt(Math.abs(im))}i`
}

export function solveLinear(a, b) {
  if (a === 0) return { roots: [], note: b === 0 ? 'Infinite solutions (0 = 0)' : 'No solution (contradiction)' }
  return { roots: [fmt(-b / a)] }
}

export function solveQuadratic(a, b, c) {
  if (a === 0) return solveLinear(b, c)
  const d = b * b - 4 * a * c
  if (d > 0) {
    const sq = Math.sqrt(d)
    return { roots: [fmt((-b + sq) / (2 * a)), fmt((-b - sq) / (2 * a))], discriminant: d }
  } else if (d === 0) {
    return { roots: [fmt(-b / (2 * a))], discriminant: d }
  } else {
    const re = -b / (2 * a)
    const im = Math.sqrt(-d) / (2 * a)
    return { roots: [complexToString(re, im), complexToString(re, -im)], discriminant: d }
  }
}

// Cardano's method for depressed cubic, handles real-coefficient cubics fully.
export function solveCubic(a, b, c, d) {
  if (a === 0) return solveQuadratic(b, c, d)
  // normalize: x^3 + Bx^2 + Cx + D = 0
  const B = b / a, C = c / a, D = d / a
  const p = C - (B * B) / 3
  const q = (2 * B * B * B) / 27 - (B * C) / 3 + D
  const shift = B / 3

  const roots = []
  const discriminant = (q * q) / 4 + (p * p * p) / 27

  if (Math.abs(discriminant) < 1e-9) {
    if (Math.abs(p) < 1e-9) {
      roots.push(-shift)
    } else {
      const u = Math.cbrt(-q / 2)
      roots.push(2 * u - shift, -u - shift)
    }
  } else if (discriminant > 0) {
    const sqrtDisc = Math.sqrt(discriminant)
    const u = Math.cbrt(-q / 2 + sqrtDisc)
    const v = Math.cbrt(-q / 2 - sqrtDisc)
    const realRoot = u + v - shift
    const reOther = -(u + v) / 2 - shift
    const imOther = (Math.sqrt(3) / 2) * (u - v)
    return {
      roots: [fmt(realRoot), complexToString(reOther, imOther), complexToString(reOther, -imOther)],
    }
  } else {
    // three distinct real roots (casus irreducibilis) via trigonometric method
    const r = Math.sqrt(-(p * p * p) / 27)
    const phi = Math.acos(-q / (2 * r))
    const m = 2 * Math.sqrt(-p / 3)
    for (let k = 0; k < 3; k++) {
      roots.push(m * Math.cos((phi + 2 * Math.PI * k) / 3) - shift)
    }
  }

  return { roots: [...new Set(roots.map((r) => fmt(r)))] }
}

export function solvePolynomial(coeffs) {
  // coeffs = [a, b, c, d] highest degree first, trailing zero-degree not stripped by caller
  const trimmed = [...coeffs]
  while (trimmed.length > 1 && trimmed[0] === 0) trimmed.shift()

  switch (trimmed.length) {
    case 2:
      return { degree: 1, ...solveLinear(trimmed[0], trimmed[1]) }
    case 3:
      return { degree: 2, ...solveQuadratic(trimmed[0], trimmed[1], trimmed[2]) }
    case 4:
      return { degree: 3, ...solveCubic(trimmed[0], trimmed[1], trimmed[2], trimmed[3]) }
    default:
      return { degree: 0, roots: [], note: 'Only linear, quadratic and cubic equations are supported' }
  }
}

export function samplePoints(coeffs, range = 10, steps = 200) {
  const evalAt = (x) => coeffs.reduce((acc, c, i) => acc + c * Math.pow(x, coeffs.length - 1 - i), 0)
  const pts = []
  const step = (2 * range) / steps
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step
    pts.push({ x, y: evalAt(x) })
  }
  return pts
}
