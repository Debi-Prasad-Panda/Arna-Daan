import process from 'process';
import { Client, Databases, Storage, Permission, Role, ID } from 'node-appwrite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your endpoint and project ID if needed
const ENDPOINT = "https://sgp.cloud.appwrite.io/v1";
const PROJECT_ID = "69a3f5fa001d16c4716f";
const API_KEY = "standard_d4e6f56f24dae994b8557b879ef77257dd0acbbc850303b3635b0afced9b54c8de8d19c117995ce4c38f6b8d58256b9ddc38c875cbfee3c78d9e4f6090f1c871b9cc230e67ff0fb2a06914970c548bf990cafff4e8ea0b21a179b9be50517a4f3645e9504ce2da8d78e98cbb8a7e12abaa479ad0358df2733336110cdb2b6a45";

if (!API_KEY) {
  console.error("❌ Error: APPWRITE_API_KEY environment variable is missing.");
  process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function patchDatabase() {
  try {
    console.log("🚀 Patching Appwrite Database...");
    
    // We already know the database and collection IDs from the .env.local
    const dbId = process.env.VITE_APPWRITE_DATABASE_ID || '67c2aaee001dc53400ea'; // From previous runs
    const listingsColId = process.env.VITE_APPWRITE_LISTINGS_COLLECTION_ID || '67c2aaee002ccf8fa935';

    console.log(`Adding 'ingredients' attribute to Listings Collection...`);
    try {
        await databases.createStringAttribute(dbId, listingsColId, 'ingredients', 1024, false); // false = not required
        console.log(`✅ 'ingredients' attribute added successfully!`);
    } catch (e) {
        if (e.code === 409) console.log(`✅ 'ingredients' attribute already exists.`);
        else throw e;
    }

    console.log(`Adding 'address' attribute to Listings Collection...`);
    try {
        await databases.createStringAttribute(dbId, listingsColId, 'address', 256, false); // false = not required
        console.log(`✅ 'address' attribute added successfully!`);
    } catch (e) {
        if (e.code === 409) console.log(`✅ 'address' attribute already exists.`);
        else throw e;
    }

  } catch (error) {
    console.error("\n❌ Error during setup:", error.message);
  }
}

patchDatabase();
