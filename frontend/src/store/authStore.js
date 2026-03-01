import { create } from 'zustand';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';

const useAuthStore = create((set) => ({
    user: null,
    isLoading: true,
    
    checkAuth: async () => {
        try {
            const currentUser = await account.get();
            set({ user: currentUser, isLoading: false });
        } catch (error) {
            set({ user: null, isLoading: false });
        }
    },

    register: async (email, password, name) => {
        try {
            set({ isLoading: true });
            await account.create(ID.unique(), email, password, name);
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            set({ user, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            set({ isLoading: true });
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();
            set({ user: currentUser, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            await account.deleteSession('current');
            set({ user: null });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
}));

export default useAuthStore;
