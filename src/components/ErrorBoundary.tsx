import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Wine, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Pazion Cellar Uncaught Error:', error, errorInfo);
  }

  public handleReload = () => {
    try {
      window.location.reload();
    } catch {
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 p-8 shadow-2xl">
            <div className="w-14 h-14 bg-stone-800 text-stone-200 mx-auto mb-6 flex items-center justify-center">
              <Wine className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-medium mb-2">
              Pazion Liquor Store
            </p>
            <h1 className="text-2xl font-serif text-white mb-3">
              Cellar Gateway Initializing
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-6">
              Our curated cellar catalog is synchronizing with international allocations. Please refresh to continue browsing.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-stone-100 hover:bg-white text-stone-950 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Cellar</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
