interface Props {
  message: string;
  onRetry?: () => void;
  onRefresh?: () => void;
  hasCache?: boolean;
}

const ErrorPanel = ({ message, onRetry, onRefresh, hasCache }: Props) => (
  <div className="card border-2 border-red-400 bg-red-950/50">
    <h2 className="text-lg font-semibold text-red-200">Unable to load latest content</h2>
    <p className="mt-2 text-sm text-slate-100">{message}</p>
    {hasCache && <p className="mt-2 text-xs text-slate-300">Showing cached data.</p>}
    <div className="mt-4 flex flex-wrap gap-2">
      {onRetry && (
        <button className="btn bg-red-500" onClick={onRetry}>
          Retry
        </button>
      )}
      {onRefresh && (
        <button className="btn bg-indigo-500" onClick={onRefresh}>
          Refresh content
        </button>
      )}
    </div>
  </div>
);

export default ErrorPanel;
