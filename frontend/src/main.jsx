import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// ── Service Worker Registration ───────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[SW] Registered, scope:', registration.scope)

        // Check for updates every 60 minutes
        setInterval(() => registration.update(), 60 * 60 * 1000)

        // Prompt user to refresh when a new SW is waiting
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available — show a subtle toast (deferred import)
              import('react-hot-toast').then(({ default: toast }) => {
                toast('App updated! Refresh for the latest version 🎉', {
                  duration: 8000,
                  icon: '🔄',
                })
              })
            }
          })
        })
      })
      .catch((err) => console.warn('[SW] Registration failed:', err))
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
