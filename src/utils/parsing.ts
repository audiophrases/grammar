import Papa from 'papaparse';
import { ActivityType, GrammarPoint, PracticeItem } from '../types';

const cefrOrder: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

const normalizeKey = (key: string) => key.trim().toLowerCase();

const splitList = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const parts = value
    .split(/[,;]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
};

const parseJSON = <T>(value?: string): T | undefined => {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch (err) {
    console.warn('JSON parse failed, continuing', err);
    return undefined;
  }
};

export const parseCSV = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const text = await response.text();
  const { data } = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  return data as Array<Record<string, string>>;
};

const extract = (row: Record<string, string>, candidates: string[]): string | undefined => {
  for (const key of candidates) {
    const value = row[key];
    if (value !== undefined) return value;
  }
  return undefined;
};

export const parseGrammarRow = (row: Record<string, string>): GrammarPoint | null => {
  const normalized: Record<string, string> = {};
  Object.entries(row).forEach(([k, v]) => {
    normalized[normalizeKey(k)] = v;
  });

  const pointId = normalized.point_id || normalized.id || normalized.point || '';
  if (!pointId) return null;

  const examples_en = extract(normalized, ['examples_en', 'examples', 'example_en'])
    ?.split(/\n|\r|;/)
    .map((e) => e.trim())
    .filter(Boolean);
  const examples_ca = extract(normalized, ['examples_ca', 'example_ca'])
    ?.split(/\n|\r|;/)
    .map((e) => e.trim())
    .filter(Boolean);

  const tags = splitList(normalized.tags);
  const related_point_ids = splitList(normalized.related_point_ids || normalized.related);

  return {
    point_id: pointId,
    title_en: normalized.title_en || normalized.title || normalized.point,
    title_ca: normalized.title_ca,
    cefr_level: normalized.cefr_level as ActivityType,
    sort_order: normalized.sort_order ? Number(normalized.sort_order) : undefined,
    thread_id: normalized.thread_id,
    tags,
    explanation_en: normalized.explanation_en || normalized.explanation,
    explanation_ca: normalized.explanation_ca,
    form_pattern: normalized.form_pattern || normalized.pattern,
    common_errors: normalized.common_errors || normalized.errors,
    examples_en,
    examples_ca,
    parent_point_id: normalized.parent_point_id,
    related_point_ids,
    next_point_id: normalized.next_point_id,
    media_image: normalized.media_image,
    media_audio: normalized.media_audio,
    updated_at: normalized.updated_at,
  };
};

export const parsePracticeRow = (row: Record<string, string>): PracticeItem | null => {
  const normalized: Record<string, string> = {};
  Object.entries(row).forEach(([k, v]) => {
    normalized[normalizeKey(k)] = v;
  });

  const itemId = normalized.item_id || normalized.id || '';
  const pointId = normalized.point_id || normalized.point || '';
  if (!itemId || !pointId) return null;

  const optionsJson = parseJSON<Record<string, string>>(normalized.options_json);
  const feedbackJson = parseJSON<string>(normalized.feedback_json);
  const acceptableAnswers = splitList(normalized.acceptable_answers || normalized.answers);

  const options: Record<string, string> | undefined = optionsJson
    ? optionsJson
    : ['option_a', 'option_b', 'option_c', 'option_d']
        .map((key, idx) => [String.fromCharCode(97 + idx), normalized[key]] as const)
        .filter(([, value]) => value)
        .reduce<Record<string, string>>((acc, [letter, value]) => {
          acc[letter] = value;
          return acc;
        }, {});

  return {
    item_id: itemId,
    point_id: pointId,
    activity_type: (normalized.activity_type || 'FILL_BLANK') as ActivityType,
    prompt_en: normalized.prompt_en || normalized.prompt,
    prompt_ca: normalized.prompt_ca,
    acceptable_answers: acceptableAnswers,
    options,
    hint: normalized.hint,
    feedback: feedbackJson || normalized.feedback,
    sort_order: normalized.sort_order ? Number(normalized.sort_order) : undefined,
    tags: splitList(normalized.tags),
    media_image: normalized.media_image,
    media_audio: normalized.media_audio,
    updated_at: normalized.updated_at,
  };
};

export const sortGrammarPoints = (points: GrammarPoint[]) =>
  [...points].sort((a, b) => {
    const cefrA = cefrOrder[a.cefr_level || ''] || 99;
    const cefrB = cefrOrder[b.cefr_level || ''] || 99;
    if (cefrA !== cefrB) return cefrA - cefrB;
    const sortA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
    const sortB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
    if (sortA !== sortB) return sortA - sortB;
    return 0;
  });

export const sortPracticeItems = (items: PracticeItem[]) =>
  [...items].sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER));
