import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTrace, submitUserTrace, getUserTrace, getOrCreateSessionId } from '../api'
import ReasoningSchema from '../components/ReasoningSchema'
import UserTraceForm from '../components/UserTraceForm'
import ComparisonView from '../components/ComparisonView'
import { ProofTypeBadge, DifficultyBadge } from '../components/ProofBadge'

export default function TraceDetail() {
  const { id } = useParams()
  const [trace, setTrace] = useState(null)
  const [userTrace, setUserTrace] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const sessionId = getOrCreateSessionId()

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const [traceRes] = await Promise.all([getTrace(id)])
        setTrace(traceRes.data)
        try {
          const utRes = await getUserTrace(id, sessionId)
          setUserTrace(utRes.data)
        } catch {
          // no user trace yet — that's fine
        }
      } catch {
        setError('Trace not found.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const { data } = await submitUserTrace(id, { ...formData, session_id: sessionId })
      setUserTrace(data)
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail || 'Submission failed. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/browse" className="text-teal text-sm hover:underline">
          ← Back to Browse
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link to="/browse" className="text-xs text-muted hover:text-teal font-mono transition-colors">
          ← Browse
        </Link>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {trace.problem_id && (
                <span className="text-xs font-mono text-muted">{trace.problem_id}</span>
              )}
              <DifficultyBadge rating={trace.difficulty_rating} />
            </div>
            <h1 className="text-2xl font-mono font-semibold text-off-white">
              {trace.problem_title || 'Untitled Problem'}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ProofTypeBadge type={trace.proof_type} />
            {trace.problem_url && (
              <a
                href={trace.problem_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-teal border border-teal/25 px-2.5 py-1 rounded hover:bg-teal/10 transition-colors font-mono"
              >
                CF ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Expert Reasoning */}
      <section className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xs font-mono font-semibold text-teal/70 uppercase tracking-widest mb-6">
          Expert Reasoning Trace
        </h2>
        <ReasoningSchema trace={trace} />
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-mono text-muted uppercase tracking-widest">
          Test Your Reasoning
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* User trace form or comparison */}
      {userTrace ? (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-teal inline-block" />
            <h2 className="text-sm font-mono font-semibold text-teal/70 uppercase tracking-widest">
              Your Reasoning vs Expert
            </h2>
          </div>
          <ComparisonView expertTrace={trace} userTrace={userTrace} />
        </section>
      ) : (
        <section className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Write out your reasoning before looking at the expert's. Be honest — the AI
            comparison is most useful when you commit to an answer.
          </p>
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-3 text-sm text-red-400 mb-4">
              {submitError}
            </div>
          )}
          <UserTraceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </section>
      )}
    </main>
  )
}
