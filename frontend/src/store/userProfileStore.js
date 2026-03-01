import { create } from 'zustand'
import { databases, APPWRITE_CONFIG } from '../lib/appwrite'
import { ID, Query } from 'appwrite'

/**
 * userProfileStore — stores a Appwrite "Users" collection document for each
 * registered account. Created at signup, read by the Admin KYC table.
 *
 * Collection: VITE_APPWRITE_USERS_COLLECTION_ID
 * Attributes: userId, name, email, role, createdAt
 */
const useUserProfileStore = create((set) => ({
  profiles: [],
  isLoading: false,

  fetchProfiles: async () => {
    const collectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
    if (!collectionId) return

    set({ isLoading: true })
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        collectionId,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      )
      set({ profiles: res.documents, isLoading: false })
    } catch (e) {
      console.error('fetchProfiles error:', e)
      set({ isLoading: false })
    }
  },

  createProfile: async (userId, name, email, role) => {
    const collectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
    if (!collectionId) return

    try {
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        collectionId,
        ID.unique(),
        { userId, name, email, role, createdAt: new Date().toISOString() }
      )
    } catch (e) {
      // Ignore duplicate errors silently
      console.warn('createProfile error (may already exist):', e.message)
    }
  },
}))

export default useUserProfileStore
