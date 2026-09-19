import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const fallbackDiv = document.createElement('div');
  fallbackDiv.id = 'root';
  document.body.appendChild(fallbackDiv);
  createRoot(fallbackDiv).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
