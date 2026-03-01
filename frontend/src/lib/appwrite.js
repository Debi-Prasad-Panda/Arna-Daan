import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Default database IDs and collection IDs will go here once you create them in Appwrite
export const APPWRITE_CONFIG = {
    // Add your DB and Collection IDs here later
    // databaseId: '...',
    // usersCollectionId: '...',
    // listingsCollectionId: '...',
};
