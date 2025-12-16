import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataBundle, PracticeItem } from '../types';
import { useAttempts } from '../hooks/useAttempts';
import { isCorrectAnswer } from '../utils/answers';

interface Props {
  data: DataBundle;
  language: 'en' | 'ca' | 'both';
}

const renderPrompt = (item: PracticeItem, language: 'en' | 'ca' | 'both') => {
  if (language === 'ca') return item.prompt_ca || item.prompt_en;
  if (language === 'both') return `${item.prompt_en || ''} / ${item.prompt_ca || ''}`.trim();
  return item.prompt_en || item.prompt_ca;
};

const PracticeView = ({ data, language }: Props) => {
  const { pointId } = useParams();
  const point = data.grammarPoints.find((p) => p.point_id === pointId);
  const items = useMemo(
    () => data.practiceItems.filter((p) => p.point_id === pointId),
    [data.practiceItems, pointId],
  );
  const { attempts, record } = useAttempts();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const onSubmit = (item: PracticeItem) => {
    const response = answers[item.item_id] || '';
    const acceptable = item.acceptable_answers?.length
      ? item.acceptable_answers
      : item.prompt_en
          ?.split(/[;|]/)
          .map((s) => s.trim())
          .filter(Boolean);
    const correct = isCorrectAnswer(response, acceptable);
    record(item.item_id, correct, response);
    setFeedback((prev) => ({
      ...prev,
      [item.item_id]:
        (correct ? 'Correct!' : 'Keep trying.') + (item.feedback ? ` ${item.feedback}` : ''),
    }));
  };

  const renderOptions = (item: PracticeItem) => {
    if (!item.options || !Object.keys(item.options).length) return <p className="text-sm text-red-200">Missing options.</p>;
    return (
      <div className="space-y-2">
        {Object.entries(item.options).map(([key, value]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={item.item_id}
              value={value}
              checked={answers[item.item_id] === value}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [item.item_id]: e.target.value }))}
            />
            <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase">{key}</span>
            <span>{value}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderActivity = (item: PracticeItem) => {
    switch (item.activity_type) {
      case 'MCQ':
        return renderOptions(item);
      case 'WORD_ORDER':
        return <p className="text-sm text-slate-100">Arrange: {renderPrompt(item, language)}</p>;
      case 'ERROR_CORRECTION':
        return <p className="text-sm text-slate-100">Rewrite correctly: {renderPrompt(item, language)}</p>;
      default:
        return (
          <input
            value={answers[item.item_id] || ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [item.item_id]: e.target.value }))}
            placeholder="Type your answer"
          />
        );
    }
  };

  if (!point) return <div className="card">Point not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Practice: {point.title_en || point.title_ca}</h1>
          <p className="text-sm text-slate-300">{items.length} activities</p>
        </div>
        <Link to={`/points/${point.point_id}`} className="btn bg-slate-800">
          Back to detail
        </Link>
      </div>

      {items.map((item) => (
        <div key={item.item_id} className="card space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm uppercase tracking-wide text-slate-400">{item.activity_type}</div>
            {attempts[item.item_id]?.correct && <span className="badge bg-green-600">Completed</span>}
          </div>
          <p className="text-lg font-semibold">{renderPrompt(item, language)}</p>
          {renderActivity(item)}
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {item.tags?.map((t) => (
              <span key={t} className="badge bg-slate-800">
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn bg-indigo-500" onClick={() => onSubmit(item)}>
              Check answer
            </button>
            <button className="btn bg-slate-800" onClick={() => setAnswers((prev) => ({ ...prev, [item.item_id]: '' }))}>
              Clear
            </button>
          </div>
          {feedback[item.item_id] && (
            <div className="rounded-md bg-slate-800 p-3 text-sm text-slate-100">{feedback[item.item_id]}</div>
          )}
          {item.hint && <div className="text-sm text-slate-300">Hint: {item.hint}</div>}
          {(item.media_image || item.media_audio) && (
            <div className="flex flex-wrap gap-4">
              {item.media_image && <img src={item.media_image} alt="" className="h-24 rounded-md object-cover" />}
              {item.media_audio && (
                <audio controls className="w-full max-w-xs">
                  <source src={item.media_audio} />
                </audio>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PracticeView;
