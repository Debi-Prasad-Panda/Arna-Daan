import { create } from 'zustand';
import { APPWRITE_CONFIG, databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import useAuthStore from './authStore';

const useDeliveryStore = create((set) => ({
  deliveries: [],
  isLoading: false,
  error: null,

  fetchDeliveries: async (volunteerId = null) => {
    set({ isLoading: true, error: null });
    try {
      const queries = [Query.orderDesc('$createdAt')];
      if (volunteerId) {
        queries.push(Query.equal('volunteerId', volunteerId));
      }

      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.deliveriesCollectionId,
        queries
      );

      set({ deliveries: response.documents, isLoading: false });
      return response.documents;
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  acceptMission: async (requestId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('Must be logged in to accept missions.');
    }

    set({ isLoading: true, error: null });
    
    // Generate simple 4 digit pin for handover security
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();

    const deliveryData = {
      requestId: requestId,
      volunteerId: user.$id,
      volunteerName: user.name,
      status: 'Assigned',
      pickupCode: pickupCode
    };

    try {
      const response = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.deliveriesCollectionId,
        ID.unique(),
        deliveryData
      );

      set(state => ({
        deliveries: [response, ...state.deliveries],
        isLoading: false
      }));

      return response;
    } catch (error) {
      console.error('Error creating delivery mission:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  updateDeliveryStatus: async (documentId, newStatus) => {
    set({ isLoading: true, error: null });
    try {
      const response = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.deliveriesCollectionId,
        documentId,
        { status: newStatus }
      );

      set(state => ({
        deliveries: state.deliveries.map(del => 
          del.$id === documentId ? response : del
        ),
        isLoading: false
      }));
      
      return response;
    } catch (error) {
       console.error('Error updating delivery status:', error);
       set({ error: error.message, isLoading: false });
       throw error;
    }
  }
}));

export default useDeliveryStore;
