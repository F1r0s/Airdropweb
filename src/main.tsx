// Ensure window.fetch has both getter and setter in iframe environments
if (typeof window !== 'undefined') {
  try {
    let _nativeFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return _nativeFetch;
      },
      set(v) {
        _nativeFetch = v;
      },
      configurable: true,
      enumerable: true
    });
  } catch {
    // ignore if already configurable or fails
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
