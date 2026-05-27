import { ProofTypeBadge, ProofRigorBadge, DifficultyBadge, QualityBar } from './ProofBadge'
import { formatMathText } from '../utils/formatMathText'

function MathText({ value, fallback = '—' }) {
  if (!value) return <span>{fallback}</span>
  return <span style={{ whiteSpace: 'pre-wrap' }}>{formatMathText(value)}</span>
}

function Section({ label, children, accent = false }) {
  return (
    <div className={`border-l-2 pl-4 ${accent ? 'border-teal' : 'border-border'}`}>
      <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-2">
        {label}
      </div>
      <div className="text-sm text-off-white leading-relaxed">{children}</div>
    </div>
  )
}

export default function ReasoningSchema({ trace, editable = false, onChange }) {
  const set = (field) => (e) => onChange?.({ ...trace, [field]: e.target.value })
  const setArr = (field) => (e) =>
    onChange?.({ ...trace, [field]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })

  if (editable) {
    return (
      <div className="space-y-6">
        <EditField
          label="Core Observation"
          value={trace.core_observation || ''}
          onChange={set('core_observation')}
          multiline
          accent
        />

        <div className="flex gap-4 flex-wrap">
          <EditSelect
            label="Proof Type"
            value={trace.proof_type || ''}
            onChange={set('proof_type')}
            options={[
              'exchange_argument', 'induction', 'contradiction',
              'invariant', 'reduction', 'complexity_bound', 'other',
            ]}
          />
          <EditSelect
            label="Proof Rigor"
            value={trace.proof_rigor || ''}
            onChange={set('proof_rigor')}
            options={['formal', 'intuitive', 'assertion']}
          />
        </div>

        <EditField
          label="Why It Works (Proof)"
          value={trace.proof_body || ''}
          onChange={set('proof_body')}
          multiline
        />

        <EditField
          label="Why Naive Fails"
          value={trace.why_naive_fails || ''}
          onChange={set('why_naive_fails')}
          multiline
        />

        <EditField
          label="Key Insight (one sentence)"
          value={trace.key_insight || ''}
          onChange={set('key_insight')}
          highlight
        />

        <div>
          <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-2">
            Techniques (comma-separated)
          </div>
          <input
            className="w-full bg-navy border border-border rounded px-3 py-2 text-sm text-off-white font-mono focus:outline-none focus:border-teal/50"
            value={(trace.technique_tags || []).join(', ')}
            onChange={setArr('technique_tags')}
            placeholder="greedy, sorting, dp..."
          />
        </div>

        <div>
          <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-2">
            Quality Score
          </div>
          <QualityBar score={trace.quality_score} />
          {(trace.quality_flags || []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {trace.quality_flags.map((flag) => (
                <span key={flag} className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                  {flag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Section label="Core Observation" accent>
        <p><MathText value={trace.core_observation} /></p>
      </Section>

      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <div className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-1">Proof Type</div>
          <ProofTypeBadge type={trace.proof_type} />
        </div>
        <div>
          <div className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-1">Rigor</div>
          <ProofRigorBadge rigor={trace.proof_rigor} />
        </div>
        {trace.difficulty_rating && (
          <div>
            <div className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-1">Rating</div>
            <DifficultyBadge rating={trace.difficulty_rating} />
          </div>
        )}
      </div>

      <Section label="Why It Works">
        <p><MathText value={trace.proof_body} /></p>
      </Section>

      <Section label="Why Naive Fails">
        <p><MathText value={trace.why_naive_fails} /></p>
      </Section>

      {trace.key_insight && (
        <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
          <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-2">
            Key Insight
          </div>
          <p className="text-base text-off-white font-medium leading-relaxed"><MathText value={trace.key_insight} /></p>
        </div>
      )}

      {(trace.technique_tags || []).length > 0 && (
        <div>
          <div className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-2">Techniques</div>
          <div className="flex flex-wrap gap-1.5">
            {trace.technique_tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-teal/10 text-teal font-mono border border-teal/15">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-2">Quality Score</div>
        <QualityBar score={trace.quality_score} />
        {(trace.quality_flags || []).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {trace.quality_flags.map((flag) => (
              <span key={flag} className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EditField({ label, value, onChange, multiline = false, highlight = false }) {
  const base =
    'w-full bg-navy border border-border rounded px-3 py-2 text-sm text-off-white focus:outline-none focus:border-teal/50 resize-none'
  return (
    <div className={highlight ? 'bg-teal/5 border border-teal/20 rounded-lg p-4' : ''}>
      <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-2">
        {label}
      </div>
      {multiline ? (
        <textarea
          className={`${base} min-h-[80px]`}
          value={value}
          onChange={onChange}
          rows={3}
        />
      ) : (
        <input className={base} value={value} onChange={onChange} />
      )}
    </div>
  )
}

function EditSelect({ label, value, onChange, options }) {
  return (
    <div>
      <div className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-2">
        {label}
      </div>
      <select
        className="bg-navy border border-border rounded px-3 py-2 text-sm text-off-white font-mono focus:outline-none focus:border-teal/50"
        value={value}
        onChange={onChange}
      >
        <option value="">— select —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  )
}
