import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const extractTrace = (editorialText, problemUrl) =>
  api.post('/extract', {
    editorial_text: editorialText,
    problem_url: problemUrl || null,
  })

export const saveTrace = (traceData) => api.post('/traces', traceData)

export const getTraces = (params = {}) => api.get('/traces', { params })

export const getTrace = (id) => api.get(`/traces/${id}`)

export const submitUserTrace = (traceId, userTrace) =>
  api.post(`/traces/${traceId}/user-trace`, userTrace)

export const getUserTrace = (traceId, sessionId) =>
  api.get(`/traces/${traceId}/user-trace/${sessionId}`)

export function getOrCreateSessionId() {
  let sid = localStorage.getItem('delta_session_id')
  if (!sid) {
    sid = crypto.randomUUID()
    localStorage.setItem('delta_session_id', sid)
  }
  return sid
}
