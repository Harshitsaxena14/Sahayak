import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Sahayak Boundary Caught Error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto my-12 p-6 bg-sahayak-surface border border-sahayak-border rounded-3xl shadow-sahayak-card text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sahayak-errorBg text-sahayak-error flex items-center justify-center font-bold text-xl mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-sahayak-ink">Something went wrong</h2>
            <p className="text-xs text-sahayak-inkSoft font-medium mt-1">
              An unhandled error occurred in this view. Don't worry, your session data is saved.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReload}
            className="px-6 py-2.5 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white font-extrabold text-xs rounded-full transition-all inline-flex items-center gap-1.5 min-h-touch active:scale-97"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
