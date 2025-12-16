interface Props {
  message?: string;
}

const LoadingState = ({ message = 'Loading content…' }: Props) => (
  <div className="card">
    <div className="loading-bar" />
    <p className="mt-2 text-sm text-slate-300">{message}</p>
  </div>
);

export default LoadingState;
