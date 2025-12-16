import React from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Uncaught error', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="card border-2 border-red-400">
              <h1 className="text-2xl font-bold text-red-300">Something went wrong</h1>
              <p className="mt-2 text-sm text-slate-200">An unexpected error occurred. Please refresh the page.</p>
              {this.state.error && (
                <pre className="mt-4 max-h-64 overflow-auto rounded bg-slate-950 p-3 text-xs text-red-200">
                  {this.state.error.stack || this.state.error.message}
                </pre>
              )}
              <button className="btn mt-4 bg-indigo-500" onClick={this.handleReset}>
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
