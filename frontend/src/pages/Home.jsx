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
    <main className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-mono font-semibold text-off-white mb-4 tracking-tight">
          Delta
        </h1>
        <p className="text-xl text-muted mb-2">
          What did the expert <span className="text-teal font-medium">actually</span> think?
        </p>
        <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed mt-4">
          Codeforces editorials hide expert reasoning in prose. Delta extracts it into a
          structured trace — core observation, proof type, why naive fails — so you can learn
          the pattern, not just the answer.
        </p>

        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            to="/extract"
            className="px-6 py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal-dim transition-colors text-sm"
          >
            Extract a reasoning trace
          </Link>
          <Link
            to="/browse"
            className="px-6 py-3 bg-card border border-border text-off-white rounded-lg hover:border-teal/40 transition-colors text-sm"
          >
            Browse the knowledge base
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs font-mono text-muted uppercase tracking-widest text-center mb-6">
          Example structured trace
        </p>
        <ExampleCard trace={EXAMPLE_TRACE} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
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
    <div className="bg-card border border-border rounded-xl p-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted">{trace.problem_id}</span>
            <DifficultyBadge rating={trace.difficulty_rating} />
          </div>
          <h3 className="font-semibold text-off-white">{trace.problem_title}</h3>
        </div>
        <ProofTypeBadge type={trace.proof_type} />
      </div>

      <div className="border-l-2 border-teal pl-4 mb-4">
        <p className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-1">Core Observation</p>
        <p className="text-sm text-off-white leading-relaxed">{trace.core_observation}</p>
      </div>

      <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 mb-4">
        <p className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-1">Key Insight</p>
        <p className="text-sm text-off-white font-medium">{trace.key_insight}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        {trace.technique_tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-teal/10 text-teal font-mono">
            {tag}
          </span>
        ))}
      </div>

      <QualityBar score={trace.quality_score} />
    </div>
  )
}

function Feature({ icon, title, description }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="text-2xl font-mono text-teal/30 font-bold mb-3">{icon}</div>
      <h3 className="font-semibold text-off-white mb-2 text-sm">{title}</h3>
      <p className="text-xs text-muted leading-relaxed">{description}</p>
    </div>
  )
}
