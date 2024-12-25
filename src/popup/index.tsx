import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/popup/App';
import '@/styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);