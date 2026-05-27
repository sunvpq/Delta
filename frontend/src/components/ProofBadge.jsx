const PROOF_COLORS = {
  exchange_argument: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  induction: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  contradiction: 'bg-red-500/15 text-red-400 border-red-500/25',
  invariant: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  reduction: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  complexity_bound: 'bg-teal/15 text-teal border-teal/25',
  other: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
}

const RIGOR_COLORS = {
  formal: 'bg-emerald-500/15 text-emerald-400',
  intuitive: 'bg-yellow-500/15 text-yellow-400',
  assertion: 'bg-red-500/15 text-red-400',
}

export function ProofTypeBadge({ type }) {
  if (!type) return null
  const color = PROOF_COLORS[type] || PROOF_COLORS.other
  const label = type.replace(/_/g, ' ')
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${color}`}>
      {label}
    </span>
  )
}

export function ProofRigorBadge({ rigor }) {
  if (!rigor) return null
  const color = RIGOR_COLORS[rigor] || RIGOR_COLORS.assertion
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${color}`}>
      {rigor}
    </span>
  )
}

export function DifficultyBadge({ rating }) {
  if (!rating) return <span className="text-xs text-muted font-mono">unrated</span>

  let color
  if (rating < 1200) color = 'text-emerald-400'
  else if (rating < 1800) color = 'text-yellow-400'
  else if (rating < 2400) color = 'text-orange-400'
  else color = 'text-red-400'

  return <span className={`text-xs font-mono font-semibold ${color}`}>{rating}</span>
}

export function QualityBar({ score }) {
  if (score == null) return null
  const pct = Math.round(score * 100)
  let color
  if (pct >= 70) color = 'bg-emerald-500'
  else if (pct >= 40) color = 'bg-yellow-500'
  else color = 'bg-red-500'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted font-mono w-8 text-right">{pct}%</span>
    </div>
  )
}
