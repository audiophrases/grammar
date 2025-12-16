import { Link, NavLink } from 'react-router-dom';

interface Props {
  onRefresh: () => void;
  fetchedAt?: number;
  updatedAt?: string;
  language: 'en' | 'ca' | 'both';
  onLanguageChange: (value: 'en' | 'ca' | 'both') => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-200 hover:bg-slate-800'}`;

const Layout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onRefresh,
  fetchedAt,
  updatedAt,
  language,
  onLanguageChange,
}) => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div>
          <Link to="/" className="text-xl font-bold text-indigo-200">
            ESL Grammar Study
          </Link>
          <p className="text-xs text-slate-400">Auto-updating from Google Sheets</p>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/points" className={navLinkClass}>
            Grammar Points
          </NavLink>
        </nav>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <span>Language:</span>
            <select
              className="text-sm"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as 'en' | 'ca' | 'both')}
            >
              <option value="en">English</option>
              <option value="ca">Català</option>
              <option value="both">Show both</option>
            </select>
          </div>
          <button className="btn bg-indigo-500" onClick={() => onRefresh()}>
            Refresh content
          </button>
          <div className="text-right leading-tight">
            {fetchedAt && <div>Fetched at {new Date(fetchedAt).toLocaleTimeString()}</div>}
            {updatedAt && <div>Latest update: {updatedAt}</div>}
          </div>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">{children}</main>
  </div>
);

export default Layout;
