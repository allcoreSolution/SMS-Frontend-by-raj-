import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Accountant Portal Error:', error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '40px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #fee2e2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>!</div>
            <div>
              <h2 style={{ margin: 0, color: '#991b1b', fontSize: '18px' }}>Dashboard Render Error</h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>A runtime error prevented the page from rendering</p>
            </div>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '12px', borderRadius: '6px', color: '#991b1b', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: '16px' }}>
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ padding: '8px 16px', background: '#00a65a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginRight: '8px' }}
          >
            Clear Cache & Reload
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '8px 16px', background: '#3c8dbc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)
