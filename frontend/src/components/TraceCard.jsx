import { Link } from 'react-router-dom'
import { ProofTypeBadge, DifficultyBadge, QualityBar } from './ProofBadge'

export default function TraceCard({ trace }) {
  return (
    <Link
      to={`/traces/${trace.id}`}
      className="block bg-card border border-border rounded-lg p-5 hover:border-teal/40 hover:bg-card-hover transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted">{trace.problem_id || '—'}</span>
            <DifficultyBadge rating={trace.difficulty_rating} />
          </div>
          <h3 className="text-sm font-semibold text-off-white group-hover:text-teal transition-colors truncate">
            {trace.problem_title || 'Untitled Problem'}
          </h3>
        </div>
        <ProofTypeBadge type={trace.proof_type} />
      </div>

      {trace.key_insight && (
        <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3 font-mono">
          {trace.key_insight}
        </p>
      )}

      {trace.technique_tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {trace.technique_tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded bg-teal/10 text-teal/80 font-mono"
            >
              {tag}
            </span>
          ))}
          {trace.technique_tags.length > 5 && (
            <span className="text-xs text-muted">+{trace.technique_tags.length - 5}</span>
          )}
        </div>
      )}

      <QualityBar score={trace.quality_score} />
    </Link>
  )
}
