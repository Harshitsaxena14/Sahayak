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
    console.error("Sahayak Component Boundary Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto my-12 p-6 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-stitch-navy">
            {this.props.language === 'hi' ? 'कुछ गलत हो गया' : 'Something went wrong'}
          </h2>
          <p className="text-xs text-stitch-subtle font-medium">
            {this.props.language === 'hi'
              ? 'कृपया फिर से कोशिश करें या पृष्ठ को रीलोड करें।'
              : 'Please try again or refresh the page.'}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 bg-stitch-navy hover:bg-stitch-navyLight text-white font-extrabold text-xs rounded-full transition-all inline-flex items-center gap-1.5 min-h-touch"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{this.props.language === 'hi' ? 'पुनः प्रयास करें (Retry)' : 'Retry'}</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
