import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    listingsCollectionId: import.meta.env.VITE_APPWRITE_LISTINGS_COLLECTION_ID,
    requestsCollectionId: import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
    deliveriesCollectionId: import.meta.env.VITE_APPWRITE_DELIVERIES_COLLECTION_ID,
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};
