import { useEffect } from 'react'
import { client, APPWRITE_CONFIG } from '../lib/appwrite'

/**
 * useRealtime — subscribe to Appwrite Realtime events on a collection.
 *
 * @param {string} collectionId  - e.g. APPWRITE_CONFIG.listingsCollectionId
 * @param {function} onEvent     - callback(payload) called on every update
 *
 * The subscription is automatically cancelled on unmount.
 */
export function useRealtime(collectionId, onEvent) {
  useEffect(() => {
    if (!collectionId) return

    const channel = `databases.${APPWRITE_CONFIG.databaseId}.collections.${collectionId}.documents`

    const unsubscribe = client.subscribe(channel, (payload) => {
      onEvent(payload)
    })

    return () => {
      unsubscribe()
    }
  }, [collectionId, onEvent])
}
