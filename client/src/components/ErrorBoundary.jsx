import { Component } from 'react';

// Shows a friendly message instead of a blank page if something breaks while rendering.
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error(error); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="pad" role="alert" style={{ maxWidth: 760, margin: '0 auto', padding: '72px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>Sorry, something went wrong on this page</h1>
        <p style={{ margin: 0, fontSize: 16, color: '#3E4860', lineHeight: 1.6 }}>Please reload the page. If it keeps happening, call or WhatsApp us.</p>
        <button type="button" className="btn-red" onClick={() => location.reload()} style={{ height: 48, padding: '0 24px', border: 0, borderRadius: 4, background: '#D90A0A', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Reload</button>
      </div>
    );
  }
}
