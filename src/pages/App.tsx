import { useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import ErrorPanel from '../components/ErrorPanel';
import LoadingState from '../components/LoadingState';
import { useGrammarData } from '../hooks/useGrammarData';
import Dashboard from './Dashboard';
import PointsList from './PointsList';
import PointDetail from './PointDetail';
import PracticeView from './PracticeView';

const App = () => {
  const { data, loading, error, refresh, lastFetched } = useGrammarData();
  const [language, setLanguage] = useState<'en' | 'ca' | 'both'>('en');

  const updatedAt = useMemo(() => {
    if (!data) return undefined;
    const times = [...data.grammarPoints, ...data.practiceItems]
      .map((item) => item.updated_at)
      .filter(Boolean) as string[];
    if (!times.length) return undefined;
    return times.sort().reverse()[0];
  }, [data]);

  const content = () => {
    if (loading && !data) return <LoadingState message="Loading grammar points…" />;
    if (!data)
      return (
        <ErrorPanel
          message={error || 'Unable to load data'}
          onRetry={() => refresh(false)}
          onRefresh={() => refresh(true)}
          hasCache={false}
        />
      );

    return (
      <Routes>
        <Route
          path="/"
          element={<Dashboard data={data} language={language} onRefresh={() => refresh(true)} />}
        />
        <Route path="/points" element={<PointsList data={data} language={language} />} />
        <Route path="/points/:pointId" element={<PointDetail data={data} language={language} />} />
        <Route path="/points/:pointId/practice" element={<PracticeView data={data} language={language} />} />
      </Routes>
    );
  };

  return (
    <Layout
      onRefresh={() => refresh(true)}
      fetchedAt={data?.fetchedAt || lastFetched}
      updatedAt={updatedAt}
      language={language}
      onLanguageChange={setLanguage}
    >
      {error && data && (
        <ErrorPanel
          message={error}
          onRetry={() => refresh(false)}
          onRefresh={() => refresh(true)}
          hasCache={Boolean(data)}
        />
      )}
      {content()}
    </Layout>
  );
};

export default App;
