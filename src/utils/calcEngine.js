// Safe scientific-expression evaluator (no eval of arbitrary global scope).
// Supports + - * / ^ ! % parentheses, trig (deg/rad aware), log, ln, sqrt, pi, e.

export function factorial(n) {
  if (n < 0 || Math.floor(n) !== n) return NaN
  if (n > 170) return Infinity
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

export function trimNumber(n) {
  if (typeof n !== 'number' || !isFinite(n)) return String(n)
  if (Math.abs(n) > 0 && (Math.abs(n) < 1e-9 || Math.abs(n) >= 1e15)) {
    return n.toExponential(8).replace(/\.?0+e/, 'e')
  }
  let s = n.toFixed(10)
  s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '' || s === '-0') s = '0'
  return s
}

export function formatExprForDisplay(e) {
  return e
    .replaceAll('*', '\u00d7')
    .replaceAll('/', '\u00f7')
    .replaceAll('sqrt(', '\u221a(')
    .replaceAll('asin(', 'sin\u207b\u00b9(')
    .replaceAll('acos(', 'cos\u207b\u00b9(')
    .replaceAll('atan(', 'tan\u207b\u00b9(')
}

export function evaluateExpression(raw, angleMode = 'deg') {
  let e = raw.replaceAll('\u03c0', 'PI_CONST').replaceAll('%', '/100')

  const opens = (e.match(/\(/g) || []).length
  const closes = (e.match(/\)/g) || []).length
  for (let i = 0; i < opens - closes; i++) e += ')'

  // resolve factorials repeatedly (numbers only, left-to-right)
  let guard = 0
  while (/\d+(\.\d+)?!/.test(e) && guard < 50) {
    e = e.replace(/(\d+(\.\d+)?)!/, (m, num) => String(factorial(parseFloat(num))))
    guard++
  }

  const body = e.replaceAll('^', '**')

  const toRad = (x) => (angleMode === 'deg' ? (x * Math.PI) / 180 : x)
  const fromRad = (x) => (angleMode === 'deg' ? (x * 180) / Math.PI : x)

  // eslint-disable-next-line no-new-func
  const fn = new Function(
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'PI_CONST', 'e',
    'return (' + body + ')'
  )

  return fn(
    (x) => Math.sin(toRad(x)),
    (x) => Math.cos(toRad(x)),
    (x) => Math.tan(toRad(x)),
    (x) => fromRad(Math.asin(x)),
    (x) => fromRad(Math.acos(x)),
    (x) => fromRad(Math.atan(x)),
    (x) => Math.log10(x),
    (x) => Math.log(x),
    (x) => Math.sqrt(x),
    Math.PI,
    Math.E
  )
}
