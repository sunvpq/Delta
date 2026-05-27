const PROOF_COLORS = {
  exchange_argument: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  induction:         'bg-purple-500/10 text-purple-400 border-purple-500/20',
  contradiction:     'bg-red-500/10 text-red-400 border-red-500/20',
  invariant:         'bg-blue-500/10 text-blue-400 border-blue-500/20',
  reduction:         'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  complexity_bound:  'bg-teal/10 text-teal border-teal/20',
  other:             'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

const RIGOR_COLORS = {
  formal:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  intuitive: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  assertion: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export function ProofTypeBadge({ type }) {
  if (!type) return null
  const color = PROOF_COLORS[type] || PROOF_COLORS.other
  const label = type.replace(/_/g, ' ')
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono border tracking-wide shrink-0 ${color}`}>
      {label}
    </span>
  )
}

export function ProofRigorBadge({ rigor }) {
  if (!rigor) return null
  const color = RIGOR_COLORS[rigor] || RIGOR_COLORS.assertion
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono border ${color}`}>
      {rigor}
    </span>
  )
}

export function DifficultyBadge({ rating }) {
  if (!rating) return <span className="text-xs text-muted font-mono">unrated</span>

  let color
  if (rating < 1200)      color = 'text-emerald-400'
  else if (rating < 1800) color = 'text-yellow-400'
  else if (rating < 2400) color = 'text-orange-400'
  else                    color = 'text-red-400'

  return (
    <span className={`text-xs font-mono font-semibold tabular-nums ${color}`}>
      {rating}
    </span>
  )
}

export function QualityBar({ score }) {
  if (score == null) return null
  const pct = Math.round(score * 100)

  let barStyle
  if (pct >= 70)      barStyle = { background: 'linear-gradient(90deg, #10b981, #34d399)' }
  else if (pct >= 40) barStyle = { background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }
  else                barStyle = { background: 'linear-gradient(90deg, #ef4444, #f87171)' }

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, ...barStyle }} />
      </div>
      <span className="text-xs text-muted font-mono tabular-nums w-7 text-right">{pct}%</span>
    </div>
  )
}
