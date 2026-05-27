import { Link } from 'react-router-dom'
import { ProofTypeBadge } from './ProofBadge'
import { formatMathText } from '../utils/formatMathText'

const STUDY_SUGGESTIONS = {
  exchange_argument: { label: 'Exchange Argument problems', filter: 'proof_type=exchange_argument' },
  induction: { label: 'Induction-based problems', filter: 'proof_type=induction' },
  contradiction: { label: 'Contradiction proof problems', filter: 'proof_type=contradiction' },
  invariant: { label: 'Invariant-based problems', filter: 'proof_type=invariant' },
  reduction: { label: 'Reduction problems', filter: 'proof_type=reduction' },
  dp: { label: 'Dynamic Programming problems', filter: 'technique=dp' },
  greedy: { label: 'Greedy problems', filter: 'technique=greedy' },
}

export default function ComparisonView({ expertTrace, userTrace }) {
  const suggestion =
    STUDY_SUGGESTIONS[expertTrace.proof_type] ||
    (expertTrace.technique_tags?.[0] && STUDY_SUGGESTIONS[expertTrace.technique_tags[0]])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal inline-block" />
            Expert Reasoning
          </div>
          <div className="space-y-4">
            <Field label="Core Observation" value={expertTrace.core_observation} />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted font-mono">Proof:</span>
              <ProofTypeBadge type={expertTrace.proof_type} />
            </div>
            <Field label="Proof" value={expertTrace.proof_body} />
            <Field label="Why Naive Fails" value={expertTrace.why_naive_fails} />
          </div>
        </div>

        <div className="bg-card border border-teal/20 rounded-lg p-5">
          <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal/50 inline-block" />
            Your Reasoning
          </div>
          <div className="space-y-4">
            <Field label="What You Observed" value={userTrace.user_observation} />
            <Field label="What You Tried First" value={userTrace.user_naive_attempt} />
            <Field label="Your Approach" value={userTrace.user_approach} />
            <Field label="Your Justification" value={userTrace.user_proof_attempt} />
            {userTrace.time_spent_minutes && (
              <p className="text-xs text-muted font-mono">
                Time spent: {userTrace.time_spent_minutes} min
              </p>
            )}
          </div>
        </div>
      </div>

      {userTrace.ai_comparison && (
        <div className="bg-[#0d1f2d] border border-teal/25 rounded-lg p-6">
          <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-3">
            AI Analysis
          </div>
          <p className="text-sm text-off-white leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
            {formatMathText(userTrace.ai_comparison)}
          </p>
        </div>
      )}

      {userTrace.divergence_points?.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-5">
          <div className="text-xs font-mono font-semibold text-amber-400/70 uppercase tracking-widest mb-3">
            Where Your Reasoning Diverged
          </div>
          <ul className="space-y-2">
            {userTrace.divergence_points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-off-white">
                <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestion && (
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted font-mono mb-1">What to study next</p>
            <p className="text-sm text-off-white">
              Practice more{' '}
              <span className="text-teal font-medium">{suggestion.label}</span> to strengthen this pattern.
            </p>
          </div>
          <Link
            to={`/browse?${suggestion.filter}`}
            className="shrink-0 text-sm text-teal border border-teal/25 px-3 py-1.5 rounded hover:bg-teal/10 transition-colors font-mono ml-4"
          >
            Browse →
          </Link>
        </div>
      )}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted font-mono mb-1">{label}</p>
      {value ? (
        <p className="text-sm text-off-white leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
          {formatMathText(value)}
        </p>
      ) : (
        <span className="text-sm text-muted italic">not provided</span>
      )}
    </div>
  )
}
