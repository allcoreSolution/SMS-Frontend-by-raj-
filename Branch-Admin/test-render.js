import React from 'react';
import { renderToString } from 'react-dom/server';

// Mock localStorage
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

try {
  const { default: App } = await import('./src/App.jsx');
  const html = renderToString(React.createElement(App));
  console.log('SUCCESS! Rendered length:', html.length);
} catch (err) {
  console.error('RENDER ERROR OCCURRED:');
  console.error(err);
}
