import { Link, useParams } from 'react-router-dom';
import { DataBundle, GrammarPoint } from '../types';

interface Props {
  data: DataBundle;
  language: 'en' | 'ca' | 'both';
}

const renderText = (p: GrammarPoint, language: 'en' | 'ca' | 'both', field: 'explanation' | 'title') => {
  if (field === 'title') {
    if (language === 'ca') return p.title_ca || p.title_en || p.point_id;
    if (language === 'both') return `${p.title_en || ''} / ${p.title_ca || ''}`.trim();
    return p.title_en || p.title_ca || p.point_id;
  }
  if (language === 'ca') return p.explanation_ca || p.explanation_en;
  if (language === 'both') return [p.explanation_en, p.explanation_ca].filter(Boolean).join(' / ');
  return p.explanation_en || p.explanation_ca;
};

const PointDetail = ({ data, language }: Props) => {
  const { pointId } = useParams();
  const point = data.grammarPoints.find((p) => p.point_id === pointId);
  const related = data.grammarPoints.filter((p) => point?.related_point_ids?.includes(p.point_id));

  if (!point) return <div className="card">Point not found.</div>;

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{renderText(point, language, 'title')}</h1>
            <p className="text-sm text-slate-300">ID: {point.point_id}</p>
          </div>
          {point.cefr_level && <span className="badge bg-indigo-600">{point.cefr_level}</span>}
        </div>
        {point.tags && (
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {point.tags.map((t) => (
              <span key={t} className="badge bg-slate-800">
                {t}
              </span>
            ))}
          </div>
        )}
        {point.form_pattern && <div className="rounded-md bg-slate-800 p-3">{point.form_pattern}</div>}
        {point.explanation_en && <p className="text-sm text-slate-200">{renderText(point, language, 'explanation')}</p>}
        {point.common_errors && (
          <div className="rounded-md border border-amber-400 bg-amber-900/40 p-3 text-sm text-amber-100">
            <strong>Common errors:</strong> {point.common_errors}
          </div>
        )}
        {point.examples_en && (
          <div>
            <h3 className="text-sm font-semibold text-slate-300">Examples</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-100">
              {(language === 'ca' ? point.examples_ca || point.examples_en : point.examples_en)?.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
              {language === 'both' &&
                point.examples_ca?.map((ex, idx) => (
                  <li key={`ca-${idx}`} className="text-slate-300">
                    {ex}
                  </li>
                ))}
            </ul>
          </div>
        )}
        {(point.media_image || point.media_audio) && (
          <div className="flex flex-wrap gap-4">
            {point.media_image && <img src={point.media_image} alt="illustration" className="h-32 rounded-md object-cover" />}
            {point.media_audio && (
              <audio controls className="w-full max-w-md">
                <source src={point.media_audio} />
              </audio>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          {point.parent_point_id && (
            <Link className="btn bg-slate-800" to={`/points/${point.parent_point_id}`}>
              Parent
            </Link>
          )}
          {point.next_point_id && (
            <Link className="btn bg-slate-800" to={`/points/${point.next_point_id}`}>
              Next
            </Link>
          )}
          <Link className="btn bg-indigo-500" to={`/points/${point.point_id}/practice`}>
            Practice
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold uppercase text-slate-300">Related</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.point_id} to={`/points/${r.point_id}`} className="btn bg-slate-800">
                {renderText(r, language, 'title')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PointDetail;
