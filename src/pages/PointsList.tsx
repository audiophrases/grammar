import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataBundle, GrammarPoint } from '../types';
import { sortGrammarPoints } from '../utils/parsing';

interface Props {
  data: DataBundle;
  language: 'en' | 'ca' | 'both';
}

const PointsList = ({ data, language }: Props) => {
  const [search, setSearch] = useState('');
  const [thread, setThread] = useState('');
  const [tag, setTag] = useState('');

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return sortGrammarPoints(
      data.grammarPoints.filter((p) => {
        const matchesSearch =
          !search ||
          `${p.title_en || ''} ${p.title_ca || ''} ${p.point_id}`.toLowerCase().includes(searchLower);
        const matchesThread = !thread || p.thread_id === thread;
        const matchesTag = !tag || p.tags?.includes(tag);
        return matchesSearch && matchesThread && matchesTag;
      }),
    );
  }, [data.grammarPoints, search, thread, tag]);

  const languageTitle = (p: GrammarPoint) => {
    if (language === 'ca') return p.title_ca || p.title_en || p.point_id;
    if (language === 'both') return `${p.title_en || ''} / ${p.title_ca || ''}`.trim();
    return p.title_en || p.title_ca || p.point_id;
  };

  const tags = Array.from(new Set(data.grammarPoints.flatMap((p) => p.tags || []))).filter(Boolean);
  const threads = Array.from(new Set(data.grammarPoints.map((p) => p.thread_id).filter(Boolean)));

  return (
    <div className="space-y-4">
      <div className="card grid gap-3 md:grid-cols-3">
        <div>
          <label>Search</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="title, id" />
        </div>
        <div>
          <label>Thread</label>
          <select value={thread} onChange={(e) => setThread(e.target.value)}>
            <option value="">All</option>
            {threads.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Tags</label>
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">All</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link key={p.point_id} to={`/points/${p.point_id}`} className="card block hover:border-indigo-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{languageTitle(p)}</h3>
              {p.cefr_level && <span className="badge bg-indigo-600">{p.cefr_level}</span>}
            </div>
            {p.explanation_en && (
              <p className="mt-2 line-clamp-3 text-sm text-slate-300">{p.explanation_en}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
              {p.tags?.map((t) => (
                <span key={t} className="badge bg-slate-800">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PointsList;
