import { Link } from 'react-router-dom'
import { ProofTypeBadge, DifficultyBadge, QualityBar } from './ProofBadge'

export default function TraceCard({ trace }) {
  return (
    <Link
      to={`/traces/${trace.id}`}
      className="group block bg-card border border-border rounded-xl p-5 hover:border-teal/30 hover:bg-card-hover transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-black/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-muted">{trace.problem_id || '—'}</span>
            <DifficultyBadge rating={trace.difficulty_rating} />
          </div>
          <h3 className="text-base font-semibold text-off-white group-hover:text-teal transition-colors duration-150 truncate tracking-tight">
            {trace.problem_title || 'Untitled Problem'}
          </h3>
        </div>
        <ProofTypeBadge type={trace.proof_type} />
      </div>

      {/* Key insight */}
      {trace.key_insight && (
        <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3 font-mono">
          {trace.key_insight}
        </p>
      )}

      {/* Tags */}
      {trace.technique_tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {trace.technique_tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md font-mono text-teal/70"
              style={{ background: 'rgba(0,180,216,0.07)', border: '1px solid rgba(0,180,216,0.14)' }}
            >
              {tag}
            </span>
          ))}
          {trace.technique_tags.length > 5 && (
            <span className="text-xs text-muted font-mono">+{trace.technique_tags.length - 5}</span>
          )}
        </div>
      )}

      <QualityBar score={trace.quality_score} />
    </Link>
  )
}
