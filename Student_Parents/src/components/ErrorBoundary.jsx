import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 select-none">
          <div className="w-full max-w-md bg-white border border-red-100 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                पृष्ठ लोड करने में समस्या आई / Page Error
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                यह पृष्ठ लोड करते समय कुछ तकनीकी त्रुटि हुई। कृपया पुनः प्रयास करें।
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 font-mono text-left break-words">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>पुनः प्रयास करें (Reload)</span>
              </button>
              <a
                href="/dashboard"
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>डैशबोर्ड</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
