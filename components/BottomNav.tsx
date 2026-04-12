'use client';

type Screen = 'home' | 'vote' | 'team' | 'match' | 'admin';

interface Props { active: Screen; onNavigate: (s: Screen) => void; }

export default function BottomNav({ active, onNavigate }: Props) {
  const a = '#e8c84a', g = '#666';
  const navItems = [
    { key: 'home', label: 'HOME', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
    { key: 'vote', label: 'VOTE', path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z' },
    { key: 'team', label: 'TEAM', path: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    { key: 'match', label: 'MATCH', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' },
    { key: 'admin', label: 'MY', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  ];
  return (
    <nav className="bottom-nav">
      {navItems.map(({ key, label, path }) => (
        <button key={key} className={`nav-btn${active === key ? ' active' : ''}`} onClick={() => onNavigate(key as Screen)}>
          <div className="nav-icon">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d={path} fill={active === key ? a : g}/>
            </svg>
          </div>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
