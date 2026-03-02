// Annadaan Service Worker — v2
// Handles: offline fallback, cache-first static assets, network-first API calls

const CACHE_NAME = 'annadaan-v2'
const OFFLINE_URL = '/offline.html'

// Static assets to pre-cache
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
]

// ── Install: pre-cache shell ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Don't fail install if some things aren't available yet
      })
    }).then(() => self.skipWaiting())
  )
})

// ── Activate: purge old caches ────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// ── Fetch: network-first for navigation, cache-first for static assets ────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, chrome-extension, and Appwrite API requests
  if (request.method !== 'GET') return
  if (url.origin !== location.origin) return
  if (url.pathname.startsWith('/v1/')) return  // Appwrite API

  // Navigation requests (page loads) → always go network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL) || caches.match('/'))
    )
    return
  }

  // Static assets → cache-first with background update
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok && (
          request.destination === 'script' ||
          request.destination === 'style' ||
          request.destination === 'image' ||
          request.destination === 'font'
        )) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse.clone()))
        }
        return networkResponse
      }).catch(() => cached)

      return cached || fetchPromise
    })
  )
})

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'Annadaan', body: 'You have a new notification', icon: '/icons/icon-192.png' }

  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch (error) {
    console.error('Push event data parsing failed', error)
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    data.icon  || '/icons/icon-192.png',
      badge:   '/icons/icon-72.png',
      tag:     data.tag   || 'annadaan-notif',
      data:    { url: data.url || '/' },
      actions: data.actions || [
        { action: 'open',    title: 'Open App'  },
        { action: 'dismiss', title: 'Dismiss'   },
      ],
      vibrate: [200, 100, 200],
    })
  )
})

// ── Notification click → open the app at the relevant URL ─────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus()
        }
      }
      return self.clients.openWindow(targetUrl)
    })
  )
})
