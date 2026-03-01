import { Client, Databases, Permission, Role } from 'node-appwrite';

const API_KEY = 'standard_d4e6f56f24dae994b8557b879ef77257dd0acbbc850303b3635b0afced9b54c8de8d19c117995ce4c38f6b8d58256b9ddc38c875cbfee3c78d9e4f6090f1c871b9cc230e67ff0fb2a06914970c548bf990cafff4e8ea0b21a179b9be50517a4f3645e9504ce2da8d78e98cbb8a7e12abaa479ad0358df2733336110cdb2b6a45';

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('69a3f5fa001d16c4716f')
  .setKey(API_KEY);

const db = new Databases(client);
const DB = '69a40e400036fcae920c';

async function run() {
  try {
    const col = await db.createCollection(DB, 'unique()', 'Users', [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
    ]);
    console.log('COLLECTION_ID=' + col.$id);

    // Wait a bit for collection to be ready before adding attributes
    await new Promise(r => setTimeout(r, 1000));

    await Promise.all([
      db.createStringAttribute(DB, col.$id, 'userId',    64,  true),
      db.createStringAttribute(DB, col.$id, 'name',      128, true),
      db.createStringAttribute(DB, col.$id, 'email',     128, true),
      db.createStringAttribute(DB, col.$id, 'role',      32,  true),
      db.createStringAttribute(DB, col.$id, 'createdAt', 64,  false),
    ]);
    console.log('Attributes created successfully');
    console.log('Add to .env.local: VITE_APPWRITE_USERS_COLLECTION_ID="' + col.$id + '"');
  } catch(e) {
    console.error('ERR:', e.message);
  }
}
run();
