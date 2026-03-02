import { create } from 'zustand';
import { databases, APPWRITE_CONFIG } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const useListingStore = create((set) => ({
    listings: [],
    isLoading: false,
    error: null,

    fetchListings: async () => {
        set({ isLoading: true, error: null });
        try {
            const { databaseId, listingsCollectionId } = APPWRITE_CONFIG;
            if (!databaseId || !listingsCollectionId || databaseId === 'YOUR_DATABASE_ID_HERE') {
                console.warn("Appwrite Database or Collection ID is not set.");
                set({ isLoading: false });
                return;
            }

            const response = await databases.listDocuments(
                databaseId,
                listingsCollectionId,
                [Query.orderDesc('$createdAt')]
            );

            set({ listings: response.documents, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch listings", error);
            set({ error: error.message, isLoading: false });
        }
    },

    createListing: async (listingData) => {
        set({ isLoading: true, error: null });
        try {
            const { databaseId, listingsCollectionId } = APPWRITE_CONFIG;
            if (!databaseId || !listingsCollectionId || databaseId === 'YOUR_DATABASE_ID_HERE') {
                throw new Error("Appwrite Database Config Missing. Create Database and Collection in Appwrite Console first.");
            }

            const newListing = await databases.createDocument(
                databaseId,
                listingsCollectionId,
                ID.unique(),
                { ...listingData }
            );

            // Update local state without re-fetching
            set((state) => ({ 
                listings: [newListing, ...state.listings],
                isLoading: false 
            }));
            return newListing;
        } catch (error) {
            console.error("Failed to create listing", error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateListingStatus: async (documentId, newStatus) => {
        set({ isLoading: true, error: null });
        try {
            const { databaseId, listingsCollectionId } = APPWRITE_CONFIG;
            const updatedListing = await databases.updateDocument(
                databaseId,
                listingsCollectionId,
                documentId,
                { status: newStatus }
            );

            set((state) => ({
                listings: state.listings.map(item => 
                    item.$id === documentId ? updatedListing : item
                ),
                isLoading: false
            }));
            
            return updatedListing;
        } catch (error) {
            console.error("Failed to update listing status", error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateListing: async (documentId, dataToUpdate) => {
        set({ isLoading: true, error: null });
        try {
            const { databaseId, listingsCollectionId } = APPWRITE_CONFIG;
            const updatedListing = await databases.updateDocument(
                databaseId,
                listingsCollectionId,
                documentId,
                dataToUpdate
            );

            set((state) => ({
                listings: state.listings.map(item => 
                    item.$id === documentId ? updatedListing : item
                ),
                isLoading: false
            }));
            
            return updatedListing;
        } catch (error) {
            console.error("Failed to update listing", error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteListing: async (documentId) => {
        set({ isLoading: true, error: null });
        try {
            const { databaseId, listingsCollectionId } = APPWRITE_CONFIG;
            await databases.deleteDocument(databaseId, listingsCollectionId, documentId);

            set((state) => ({
                listings: state.listings.filter(item => item.$id !== documentId),
                isLoading: false
            }));
            
        } catch (error) {
            console.error("Failed to delete listing", error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    }
}));

export default useListingStore;
