import process from 'process';
import { Client, Databases, Permission, Role, ID } from 'node-appwrite';
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
  console.error("Please provide an API Key with 'database.write', 'collections.write', and 'attributes.write' scopes.");
  process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// Helper function to wait for attribute creation
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function setupDatabase() {
  try {
    console.log("🚀 Starting Appwrite Database & Collections Setup...");
    
    // 1. Create a New Database
    const dbId = ID.unique();
    console.log(`\n📦 Creating Database...`);
    const db = await databases.create(dbId, 'ArnaDaanDB');
    console.log(`✅ Database created! ID: ${db.$id}`);

    // Create Collections with permissive rules for prototyping
    const permissions = [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
    ];

    // ==========================================
    // 2. Setup Listings Collection
    // ==========================================
    console.log(`\n📂 Creating 'Listings' Collection...`);
    const listingsCol = await databases.createCollection(db.$id, ID.unique(), 'Listings', permissions);
    console.log(`✅ Listings Collection ID: ${listingsCol.$id}`);
    
    console.log(`Adding attributes (this takes a moment)...`);
    await databases.createStringAttribute(db.$id, listingsCol.$id, 'title', 255, true);
    await databases.createStringAttribute(db.$id, listingsCol.$id, 'category', 255, true);
    await databases.createIntegerAttribute(db.$id, listingsCol.$id, 'quantity', true);
    await databases.createStringAttribute(db.$id, listingsCol.$id, 'bestBefore', 255, true);
    await databases.createStringAttribute(db.$id, listingsCol.$id, 'diet', 255, false, 'Non-Veg');
    await databases.createStringAttribute(db.$id, listingsCol.$id, 'status', 255, false, 'Active');
    await databases.createStringAttribute(db.$id, listingsCol.$id, 'donorId', 255, true);
    await databases.createStringAttribute(db.$id, listingsCol.$id, 'donorName', 255, true);
    await sleep(2500); // Wait for attributes to deploy

    // ==========================================
    // 3. Setup Requests Collection
    // ==========================================
    console.log(`\n📂 Creating 'Requests' Collection...`);
    const requestsCol = await databases.createCollection(db.$id, ID.unique(), 'Requests', permissions);
    console.log(`✅ Requests Collection ID: ${requestsCol.$id}`);
    
    console.log(`Adding attributes...`);
    await databases.createStringAttribute(db.$id, requestsCol.$id, 'listingId', 255, true);
    await databases.createStringAttribute(db.$id, requestsCol.$id, 'receiverId', 255, true);
    await databases.createStringAttribute(db.$id, requestsCol.$id, 'receiverName', 255, true);
    await databases.createStringAttribute(db.$id, requestsCol.$id, 'status', 255, false, 'Pending');
    await databases.createStringAttribute(db.$id, requestsCol.$id, 'requestTime', 255, false);
    await sleep(2500); // Wait for attributes to deploy

    // ==========================================
    // 4. Setup Deliveries Collection
    // ==========================================
    console.log(`\n📂 Creating 'Deliveries' Collection...`);
    const deliveriesCol = await databases.createCollection(db.$id, ID.unique(), 'Deliveries', permissions);
    console.log(`✅ Deliveries Collection ID: ${deliveriesCol.$id}`);
    
    console.log(`Adding attributes...`);
    await databases.createStringAttribute(db.$id, deliveriesCol.$id, 'requestId', 255, true);
    await databases.createStringAttribute(db.$id, deliveriesCol.$id, 'volunteerId', 255, true);
    await databases.createStringAttribute(db.$id, deliveriesCol.$id, 'volunteerName', 255, true);
    await databases.createStringAttribute(db.$id, deliveriesCol.$id, 'status', 255, false, 'Assigned');
    await databases.createStringAttribute(db.$id, deliveriesCol.$id, 'pickupCode', 5, true);
    await sleep(2500); // Wait for attributes to deploy

    // ==========================================
    // 5. Output .env Config
    // ==========================================
    console.log(`\n🎉 SETUP COMPLETE! 🎉`);
    console.log(`\n==============================================`);
    console.log(`COPY AND PASTE THIS INTO YOUR .env.local FILE:`);
    console.log(`==============================================`);
    console.log(`VITE_APPWRITE_PROJECT_ID="${PROJECT_ID}"`);
    console.log(`VITE_APPWRITE_PROJECT_NAME="Arna Daan"`);
    console.log(`VITE_APPWRITE_ENDPOINT="${ENDPOINT}"`);
    console.log(`VITE_APPWRITE_DATABASE_ID="${db.$id}"`);
    console.log(`VITE_APPWRITE_LISTINGS_COLLECTION_ID="${listingsCol.$id}"`);
    console.log(`VITE_APPWRITE_REQUESTS_COLLECTION_ID="${requestsCol.$id}"`);
    console.log(`VITE_APPWRITE_DELIVERIES_COLLECTION_ID="${deliveriesCol.$id}"`);
    console.log(`==============================================\n`);

  } catch (error) {
    console.error("\n❌ Error during setup:", error.message);
  }
}

setupDatabase();
