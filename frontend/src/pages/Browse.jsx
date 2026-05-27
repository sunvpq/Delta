import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getTraces } from '../api'
import TraceCard from '../components/TraceCard'

const TECHNIQUES = [
  'greedy', 'dp', 'binary_search', 'graph', 'bfs', 'dfs',
  'math', 'sorting', 'two_pointers', 'segment_tree',
  'hash_map', 'strings', 'implementation', 'number_theory',
]

const PROOF_TYPES = [
  'exchange_argument', 'induction', 'contradiction',
  'invariant', 'reduction', 'complexity_bound', 'other',
]

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [traces, setTraces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedTechniques, setSelectedTechniques] = useState(
    searchParams.get('technique') ? [searchParams.get('technique')] : []
  )
  const [proofType, setProofType] = useState(searchParams.get('proof_type') || '')
  const [minRating, setMinRating] = useState(searchParams.get('min_rating') || '')
  const [maxRating, setMaxRating] = useState(searchParams.get('max_rating') || '')

  const fetchTraces = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = {}
      if (search) params.search = search
      if (selectedTechniques.length === 1) params.technique = selectedTechniques[0]
      if (proofType) params.proof_type = proofType
      if (minRating) params.min_rating = parseInt(minRating)
      if (maxRating) params.max_rating = parseInt(maxRating)
      const { data } = await getTraces(params)
      setTraces(data)
    } catch {
      setError('Failed to load traces.')
    } finally {
      setIsLoading(false)
    }
  }, [search, selectedTechniques, proofType, minRating, maxRating])

  useEffect(() => {
    const timer = setTimeout(fetchTraces, 300)
    return () => clearTimeout(timer)
  }, [fetchTraces])

  const toggleTechnique = (t) =>
    setSelectedTechniques((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-semibold text-off-white mb-1">
          Knowledge Base
        </h1>
        <p className="text-sm text-muted">
          Browse structured reasoning traces — filter by technique, proof type, or difficulty.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filter sidebar */}
        <aside className="w-52 shrink-0 space-y-6">
          <div>
            <label className="block text-xs font-mono text-teal/70 uppercase tracking-widest mb-3">
              Search
            </label>
            <input
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-off-white placeholder-muted focus:outline-none focus:border-teal/50"
              placeholder="insight, technique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <p className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-3">Technique</p>
            <div className="space-y-1.5">
              {TECHNIQUES.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTechniques.includes(t)}
                    onChange={() => toggleTechnique(t)}
                    className="accent-teal"
                  />
                  <span className={`text-xs font-mono transition-colors ${
                    selectedTechniques.includes(t) ? 'text-teal' : 'text-muted group-hover:text-off-white'
                  }`}>
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-3">Proof Type</p>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="proof_type"
                  checked={proofType === ''}
                  onChange={() => setProofType('')}
                  className="accent-teal"
                />
                <span className="text-xs font-mono text-muted">All</span>
              </label>
              {PROOF_TYPES.map((pt) => (
                <label key={pt} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="proof_type"
                    checked={proofType === pt}
                    onChange={() => setProofType(pt)}
                    className="accent-teal"
                  />
                  <span className={`text-xs font-mono transition-colors ${
                    proofType === pt ? 'text-teal' : 'text-muted group-hover:text-off-white'
                  }`}>
                    {pt.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-3">
              Difficulty Range
            </p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="w-full bg-card border border-border rounded px-2 py-1.5 text-xs text-off-white font-mono focus:outline-none focus:border-teal/50"
                placeholder="800"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />
              <span className="text-muted text-xs">–</span>
              <input
                type="number"
                className="w-full bg-card border border-border rounded px-2 py-1.5 text-xs text-off-white font-mono focus:outline-none focus:border-teal/50"
                placeholder="3500"
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSearch('')
              setSelectedTechniques([])
              setProofType('')
              setMinRating('')
              setMaxRating('')
            }}
            className="w-full text-xs text-muted hover:text-off-white font-mono py-1 transition-colors"
          >
            Clear filters
          </button>
        </aside>

        {/* Trace grid */}
        <div className="flex-1 min-w-0">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {!isLoading && !error && traces.length === 0 && (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <p className="text-muted font-mono text-sm">No traces found.</p>
              <p className="text-muted text-xs mt-1">Try clearing filters or extracting a new trace.</p>
            </div>
          )}

          {!isLoading && traces.length > 0 && (
            <>
              <p className="text-xs text-muted font-mono mb-4">
                {traces.length} trace{traces.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {traces.map((trace) => (
                  <TraceCard key={trace.id} trace={trace} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
