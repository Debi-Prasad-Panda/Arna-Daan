import { create } from 'zustand';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';
import useUserProfileStore from './userProfileStore';

// Map a role string to the right dashboard route
export function getHomeRoute(role) {
  switch (role) {
    case 'ngo':       return '/feed';
    case 'volunteer': return '/logistics';
    case 'admin':     return '/admin';
    default:          return '/dashboard'; // donor
  }
}

const useAuthStore = create((set) => ({
    user: null,
    role: null,   // 'donor' | 'ngo' | 'volunteer' | 'admin'
    isLoading: true,
    
    checkAuth: async () => {
        try {
            const currentUser = await account.get();
            const role = currentUser.prefs?.role || 'donor';
            set({ user: currentUser, role, isLoading: false });
        } catch {
            set({ user: null, role: null, isLoading: false });
        }
    },

    register: async (email, password, name, role = 'donor') => {
        try {
            set({ isLoading: true });
            await account.create(ID.unique(), email, password, name);
            await account.createEmailPasswordSession(email, password);
            // Persist the chosen role in Appwrite user prefs
            await account.updatePrefs({ role });
            const user = await account.get();
            // Also create a profile document so the Admin KYC table can list users
            await useUserProfileStore.getState().createProfile(user.$id, name, email, role);
            set({ user, role, isLoading: false });
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
            const role = currentUser.prefs?.role || 'donor';
            set({ user: currentUser, role, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            await account.deleteSession('current');
            set({ user: null, role: null });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
}));

export default useAuthStore;
