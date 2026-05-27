import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const link = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        pathname === to
          ? 'text-teal'
          : 'text-muted hover:text-off-white'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-mono font-semibold text-lg text-teal tracking-tight">
            Delta
          </span>
          <span className="hidden sm:block text-muted text-xs font-mono">
            / reasoning traces
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {link('/extract', 'Extract')}
          {link('/browse', 'Browse')}
        </div>
      </div>
    </nav>
  )
}
