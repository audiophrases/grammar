import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CACHE_KEYS, CSV_ENDPOINTS, REVALIDATE_MS } from '../config';
import { DataBundle, GrammarPoint, PracticeItem } from '../types';
import { parseCSV, parseGrammarRow, parsePracticeRow, sortGrammarPoints, sortPracticeItems } from '../utils/parsing';

interface LoadState {
  loading: boolean;
  error?: string;
  lastFetched?: number;
}

const loadFromCache = (): DataBundle | null => {
  try {
    const grammarPoints = JSON.parse(localStorage.getItem(CACHE_KEYS.grammar) || 'null') as GrammarPoint[] | null;
    const practiceItems = JSON.parse(localStorage.getItem(CACHE_KEYS.practice) || 'null') as PracticeItem[] | null;
    const cachedTimes = [
      Number(localStorage.getItem(`${CACHE_KEYS.grammar}_time`) || 0),
      Number(localStorage.getItem(`${CACHE_KEYS.practice}_time`) || 0),
    ].filter(Boolean);
    const fetchedAt = cachedTimes.length ? Math.min(...cachedTimes) : undefined;
    if (grammarPoints && practiceItems && fetchedAt) {
      return { grammarPoints, practiceItems, fetchedAt };
    }
  } catch (err) {
    console.warn('Failed to parse cache', err);
  }
  return null;
};

const saveCache = (grammar: GrammarPoint[], practice: PracticeItem[]) => {
  localStorage.setItem(CACHE_KEYS.grammar, JSON.stringify(grammar));
  localStorage.setItem(CACHE_KEYS.practice, JSON.stringify(practice));
  const now = Date.now();
  localStorage.setItem(`${CACHE_KEYS.grammar}_time`, String(now));
  localStorage.setItem(`${CACHE_KEYS.practice}_time`, String(now));
};

const withCacheBuster = (url: string, forceRefresh: boolean) => (forceRefresh ? `${url}?t=${Date.now()}` : url);

export const useGrammarData = () => {
  const [state, setState] = useState<LoadState>({ loading: true });
  const [data, setData] = useState<DataBundle | null>(() => loadFromCache());
  const timerRef = useRef<number>();

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      setState((prev) => ({ ...prev, loading: true, error: undefined }));
      try {
        const [grammarRows, practiceRows] = await Promise.all([
          parseCSV(withCacheBuster(CSV_ENDPOINTS.grammarPoints, forceRefresh)),
          parseCSV(withCacheBuster(CSV_ENDPOINTS.practiceItems, forceRefresh)),
        ]);

        const grammarPoints = sortGrammarPoints(
          grammarRows
            .map(parseGrammarRow)
            .filter((g): g is GrammarPoint => Boolean(g)),
        );
        const practiceItems = sortPracticeItems(
          practiceRows
            .map(parsePracticeRow)
            .filter((p): p is PracticeItem => Boolean(p)),
        );

        saveCache(grammarPoints, practiceItems);
        const fetchedAt = Date.now();
        setData({ grammarPoints, practiceItems, fetchedAt });
        setState({ loading: false, lastFetched: fetchedAt });
      } catch (err) {
        console.error(err);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load data',
        }));
      }
    },
    [],
  );

  useEffect(() => {
    fetchData();
    timerRef.current = window.setInterval(() => fetchData(), REVALIDATE_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [fetchData]);

  const bundle = useMemo(() => data, [data]);

  return { ...state, data: bundle, refresh: fetchData };
};
