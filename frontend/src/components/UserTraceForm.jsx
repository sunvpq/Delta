import { useState } from 'react'

const STEPS = [
  {
    field: 'user_observation',
    label: 'Step 1: What was your key observation when you first read the problem?',
    placeholder: 'What was the insight that made you think you could solve it?',
  },
  {
    field: 'user_naive_attempt',
    label: 'Step 2: What did you try first, and why did it fail?',
    placeholder: 'Brute force? Wrong greedy? What was the counterexample?',
  },
  {
    field: 'user_approach',
    label: 'Step 3: How did you arrive at the correct approach?',
    placeholder: 'What algorithm or technique did you choose and why?',
  },
  {
    field: 'user_proof_attempt',
    label: 'Step 4: Can you justify why your solution is correct?',
    placeholder: 'Attempt a proof — even informal is fine.',
  },
]

export default function UserTraceForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    user_observation: '',
    user_naive_attempt: '',
    user_approach: '',
    user_proof_attempt: '',
    time_spent_minutes: '',
  })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      time_spent_minutes: form.time_spent_minutes ? parseInt(form.time_spent_minutes) : null,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {STEPS.map(({ field, label, placeholder }) => (
        <div key={field}>
          <label className="block text-sm font-medium text-off-white mb-2">{label}</label>
          <textarea
            className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-sm text-off-white placeholder-muted focus:outline-none focus:border-teal/50 resize-none min-h-[100px]"
            placeholder={placeholder}
            value={form[field]}
            onChange={set(field)}
            rows={4}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-off-white mb-2">
          How long did you spend on this problem?
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            className="w-24 bg-navy border border-border rounded px-3 py-2 text-sm text-off-white font-mono focus:outline-none focus:border-teal/50"
            placeholder="0"
            value={form.time_spent_minutes}
            onChange={set('time_spent_minutes')}
          />
          <span className="text-sm text-muted">minutes</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-teal text-navy font-semibold rounded-lg hover:bg-teal-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Generating comparison...' : 'Submit My Reasoning'}
      </button>
    </form>
  )
}
