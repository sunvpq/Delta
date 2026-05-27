import { Link } from 'react-router-dom'
import { ProofTypeBadge, DifficultyBadge, QualityBar } from '../components/ProofBadge'

const EXAMPLE_TRACE = {
  problem_id: '455A',
  problem_title: 'Boredom',
  difficulty_rating: 1500,
  technique_tags: ['dp', 'counting'],
  proof_type: 'reduction',
  proof_rigor: 'formal',
  core_observation:
    'Selecting any element with value v forces deletion of ALL elements with value v−1 and v+1. Therefore if we select value v, we gain v × count(v) points but cannot select v−1 or v+1. This is structurally identical to the House Robber problem.',
  key_insight:
    'Reduce to house robber DP: bucket elements by value, treat each distinct value v as a "house" worth v × count(v), and adjacent houses cannot both be taken.',
  quality_score: 0.95,
  quality_flags: [],
}

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-24">
      {/* Hero */}
      <div className="text-center mb-24">
        <h1
          className="text-8xl font-semibold tracking-tight mb-6"
          style={{
            background: 'linear-gradient(135deg, #e6edf3 30%, #8b949e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Delta
        </h1>

        <p className="text-2xl font-medium text-off-white mb-3 tracking-tight">
          What did the expert{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #00b4d8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            actually
          </span>{' '}
          think?
        </p>

        <p className="text-lg text-muted max-w-xl mx-auto leading-8 mt-5">
          Codeforces editorials hide expert reasoning in prose. Delta extracts it into a
          structured trace — core observation, proof type, why naive fails — so you learn
          the pattern, not just the answer.
        </p>

        <div className="flex items-center justify-center gap-3 mt-10">
          <Link
            to="/extract"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold text-navy overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-teal/20 hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #00b4d8 0%, #0090ad 100%)' }}
          >
            Extract a reasoning trace
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-80 group-hover:translate-x-0.5 transition-transform">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium text-off-white border border-border bg-card hover:border-teal/40 hover:bg-card-hover hover:-translate-y-px transition-all duration-200"
          >
            Browse the knowledge base
          </Link>
        </div>
      </div>

      {/* Example trace */}
      <div className="mb-8">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="h-px flex-1 max-w-[80px] bg-border" />
          <p className="text-sm font-mono text-muted uppercase tracking-[0.18em]">
            Example structured trace
          </p>
          <div className="h-px flex-1 max-w-[80px] bg-border" />
        </div>
        <ExampleCard trace={EXAMPLE_TRACE} />
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-24">
        <Feature
          icon="01"
          title="Paste any editorial"
          description="Paste raw editorial text and Claude extracts the structured reasoning — observation, proof type, proof body, why naive fails."
        />
        <Feature
          icon="02"
          title="Test your reasoning"
          description="Write your own reasoning attempt before looking at the expert's. Then see a side-by-side comparison with AI feedback."
        />
        <Feature
          icon="03"
          title="Browse by pattern"
          description="Filter the knowledge base by technique (greedy, DP, graph) or proof type (exchange argument, induction, invariant)."
        />
      </div>
    </main>
  )
}

function ExampleCard({ trace }) {
  return (
    <div
      className="max-w-2xl mx-auto rounded-xl p-px"
      style={{ background: 'linear-gradient(135deg, #30363d 0%, #21262d 60%, #30363d 100%)' }}
    >
      <div className="bg-card rounded-[11px] p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-muted">{trace.problem_id}</span>
              <DifficultyBadge rating={trace.difficulty_rating} />
            </div>
            <h3 className="font-semibold text-off-white text-lg">{trace.problem_title}</h3>
          </div>
          <ProofTypeBadge type={trace.proof_type} />
        </div>

        {/* Core Observation */}
        <div className="mb-4">
          <p className="text-xs font-mono text-teal/60 uppercase tracking-[0.16em] mb-2">
            Core Observation
          </p>
          <div className="border-l-2 border-teal/40 pl-3">
            <p className="text-base text-off-white/90 leading-relaxed">{trace.core_observation}</p>
          </div>
        </div>

        {/* Key Insight */}
        <div className="rounded-lg p-3.5 mb-4" style={{ background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.15)' }}>
          <p className="text-xs font-mono text-teal/60 uppercase tracking-[0.16em] mb-2">
            Key Insight
          </p>
          <p className="text-base text-off-white font-medium leading-relaxed">{trace.key_insight}</p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {trace.technique_tags.map((tag) => (
            <span
              key={tag}
              className="text-sm px-2.5 py-1 rounded-md font-mono text-teal/80"
              style={{ background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(0,180,216,0.15)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <QualityBar score={trace.quality_score} />
      </div>
    </div>
  )
}

function Feature({ icon, title, description }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-border/80 hover:bg-card-hover transition-all duration-200">
      <div className="text-sm font-mono text-teal/40 font-bold mb-4 tracking-widest">{icon}</div>
      <h3 className="font-semibold text-off-white mb-2 text-base tracking-tight">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  )
}
