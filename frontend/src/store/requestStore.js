import { create } from 'zustand';
import { APPWRITE_CONFIG, databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import useAuthStore from './authStore';

const useRequestStore = create((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,

  fetchRequests: async (receiverId = null) => {
    set({ isLoading: true, error: null });
    try {
      const queries = [Query.orderDesc('$createdAt')];
      if (receiverId) {
        queries.push(Query.equal('receiverId', receiverId));
      }

      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.requestsCollectionId,
        queries
      );

      set({ requests: response.documents, isLoading: false });
      return response.documents;
    } catch (error) {
      console.error('Error fetching requests:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createRequest: async (listingId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('Must be logged in to request food.');
    }

    set({ isLoading: true, error: null });
    
    const requestData = {
      listingId: listingId,
      receiverId: user.$id,
      receiverName: user.name,
      status: 'Pending',
      requestTime: new Date().toISOString()
    };

    try {
      const response = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.requestsCollectionId,
        ID.unique(),
        requestData
      );

      set(state => ({
        requests: [response, ...state.requests],
        isLoading: false
      }));

      return response;
    } catch (error) {
      console.error('Error creating request:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  updateRequestStatus: async (documentId, newStatus) => {
    set({ isLoading: true, error: null });
    try {
      const response = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.requestsCollectionId,
        documentId,
        { status: newStatus }
      );

      set(state => ({
        requests: state.requests.map(req => 
          req.$id === documentId ? response : req
        ),
        isLoading: false
      }));
      
      return response;
    } catch (error) {
       console.error('Error updating request status:', error);
       set({ error: error.message, isLoading: false });
       throw error;
    }
  }
}));

export default useRequestStore;
