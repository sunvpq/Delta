import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractTrace, saveTrace } from '../api'
import ReasoningSchema from '../components/ReasoningSchema'
import { QualityBar } from '../components/ProofBadge'

export default function Extract() {
  const navigate = useNavigate()
  const [editorialText, setEditorialText] = useState('')
  const [problemUrl, setProblemUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [trace, setTrace] = useState(null)

  const handleExtract = async () => {
    if (!editorialText.trim()) return
    setIsLoading(true)
    setError(null)
    setTrace(null)
    try {
      const { data } = await extractTrace(editorialText, problemUrl)
      setTrace(data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Extraction failed. Check your API key and try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!trace) return
    setIsSaving(true)
    try {
      const { data } = await saveTrace(trace)
      navigate(`/traces/${data.id}`)
    } catch (err) {
      setError('Failed to save. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-semibold text-off-white mb-1">
          Extract Reasoning Trace
        </h1>
        <p className="text-sm text-muted">
          Paste a Codeforces editorial and extract the structured expert reasoning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-teal/70 uppercase tracking-widest mb-2">
              Editorial Text
            </label>
            <textarea
              className="w-full h-72 bg-card border border-border rounded-lg px-4 py-3 text-sm text-off-white placeholder-muted font-mono focus:outline-none focus:border-teal/50 resize-none"
              placeholder="Paste the editorial text here..."
              value={editorialText}
              onChange={(e) => setEditorialText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-teal/70 uppercase tracking-widest mb-2">
              Codeforces Problem URL{' '}
              <span className="text-muted normal-case">(optional — for auto-fetching metadata)</span>
            </label>
            <input
              className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-off-white placeholder-muted font-mono focus:outline-none focus:border-teal/50"
              placeholder="https://codeforces.com/problemset/problem/1/A"
              value={problemUrl}
              onChange={(e) => setProblemUrl(e.target.value)}
            />
          </div>

          <button
            onClick={handleExtract}
            disabled={!editorialText.trim() || isLoading}
            className="w-full py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Reading the expert's mind...
              </span>
            ) : (
              'Extract Reasoning'
            )}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Right — Output */}
        <div>
          {!trace && !isLoading && (
            <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl">
              <div className="text-center p-8">
                <p className="text-4xl mb-3 opacity-30">⟨/⟩</p>
                <p className="text-sm text-muted font-mono">
                  Structured trace will appear here
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted font-mono">Extracting reasoning...</p>
              </div>
            </div>
          )}

          {trace && !isLoading && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-mono font-semibold text-teal/70 uppercase tracking-widest">
                  Extracted Trace
                </h2>
                <span className="text-xs text-muted font-mono">All fields are editable</span>
              </div>

              {/* Problem metadata */}
              {(trace.problem_title || trace.problem_id) && (
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-1">Problem</p>
                    <p className="text-sm text-off-white">
                      {trace.problem_id && <span className="text-muted mr-2 font-mono">{trace.problem_id}</span>}
                      {trace.problem_title}
                    </p>
                  </div>
                  {trace.difficulty_rating && (
                    <div>
                      <p className="text-xs font-mono text-teal/70 uppercase tracking-widest mb-1">Rating</p>
                      <p className="text-sm font-mono text-off-white">{trace.difficulty_rating}</p>
                    </div>
                  )}
                </div>
              )}

              <ReasoningSchema trace={trace} editable onChange={setTrace} />

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 bg-teal/10 border border-teal/25 text-teal font-semibold rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save to Knowledge Base'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
  )
}
