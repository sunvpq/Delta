const SUPERSCRIPT_MAP = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  'n': 'ⁿ', 'k': 'ᵏ', 'm': 'ᵐ', 'i': 'ⁱ',
  '+': '⁺', '-': '⁻',
}

function toSuperscript(exp) {
  return exp.split('').map((c) => SUPERSCRIPT_MAP[c] ?? c).join('')
}

export function formatMathText(text) {
  if (!text) return text
  // Replace X^Y where Y is digits and/or letters (e.g. 2^n, 10^5, n^2, 2^32)
  return text.replace(/(\S+?)\^([a-zA-Z0-9+\-]+)/g, (_, base, exp) => {
    return base + toSuperscript(exp)
  })
}
