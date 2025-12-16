import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataBundle, GrammarPoint } from '../types';
import { useAttempts } from '../hooks/useAttempts';
import { sortGrammarPoints } from '../utils/parsing';

interface Props {
  data: DataBundle;
  language: 'en' | 'ca' | 'both';
  onRefresh: () => void;
}

const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const Dashboard = ({ data, language, onRefresh }: Props) => {
  const { attempts } = useAttempts();
  const [search, setSearch] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return sortGrammarPoints(
      data.grammarPoints.filter((p) => {
        const title = `${p.title_en || ''} ${p.title_ca || ''}`.toLowerCase();
        const matchesSearch = !search || title.includes(searchLower) || p.point_id.toLowerCase().includes(searchLower);
        const matchesCefr = !selectedCefr.length || (p.cefr_level && selectedCefr.includes(p.cefr_level));
        return matchesSearch && matchesCefr;
      }),
    );
  }, [data.grammarPoints, search, selectedCefr]);

  const continuePoint = useMemo(() => {
    const completed = Object.entries(attempts)
      .filter(([, value]) => value.correct)
      .map(([itemId]) => itemId);
    if (!completed.length) return undefined;
    const item = data.practiceItems.find((p) => completed.includes(p.item_id));
    return item ? data.grammarPoints.find((g) => g.point_id === item.point_id) : undefined;
  }, [attempts, data.grammarPoints, data.practiceItems]);

  const languageTitle = (p: GrammarPoint) => {
    if (language === 'ca') return p.title_ca || p.title_en || p.point_id;
    if (language === 'both') return `${p.title_en || ''} / ${p.title_ca || ''}`.trim();
    return p.title_en || p.title_ca || p.point_id;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold">Study dashboard</h2>
          <p className="text-sm text-slate-300">Search, filter, and jump back into your practice.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label>Search</label>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="title, id" />
            </div>
            <div>
              <label>CEFR</label>
              <select
                multiple
                className="h-24"
                value={selectedCefr}
                onChange={(e) =>
                  setSelectedCefr(Array.from(e.target.selectedOptions, (o) => o.value))
                }
              >
                {cefrLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn bg-indigo-500" onClick={onRefresh}>
                Refresh content
              </button>
              <Link to="/points" className="btn bg-slate-800 text-slate-100">
                Browse all
              </Link>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold uppercase text-slate-300">Continue</h3>
          {continuePoint ? (
            <div className="mt-2 space-y-2">
              <div className="text-lg font-semibold">{languageTitle(continuePoint)}</div>
              <Link
                to={`/points/${continuePoint.point_id}/practice`}
                className="btn w-full justify-center bg-green-600 text-white"
              >
                Resume practice
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-300">Start with any grammar point below.</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link key={p.point_id} to={`/points/${p.point_id}`} className="card block hover:border-indigo-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{languageTitle(p)}</h3>
              {p.cefr_level && <span className="badge bg-indigo-600">{p.cefr_level}</span>}
            </div>
            {p.tags && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                {p.tags.map((tag) => (
                  <span key={tag} className="badge bg-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
