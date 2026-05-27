import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const link = (to, label) => {
    const active = pathname === to
    return (
      <Link
        to={to}
        className={`relative text-base font-medium px-3.5 py-2 rounded-md transition-all duration-200 ${
          active
            ? 'text-off-white bg-card-hover'
            : 'text-muted hover:text-off-white hover:bg-card-hover'
        }`}
      >
        {label}
        {active && (
          <span
            className="absolute bottom-0 left-3 right-3 h-px rounded-full"
            style={{ background: 'linear-gradient(90deg, #00b4d8, #818cf8)' }}
          />
        )}
      </Link>
    )
  }

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-md"
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #6366f1 100%)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,1 13,13 1,13" fill="white" opacity="0.95" />
            </svg>
          </span>
          <span
            className="font-semibold text-lg tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Delta
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {link('/extract', 'Extract')}
          {link('/browse', 'Browse')}
        </div>
      </div>
    </nav>
  )
}
