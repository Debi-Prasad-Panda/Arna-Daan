import { Client, Storage, Databases, Query, Permission, Role } from 'node-appwrite'

const KEY = 'standard_d4e6f56f24dae994b8557b879ef77257dd0acbbc850303b3635b0afced9b54c8de8d19c117995ce4c38f6b8d58256b9ddc38c875cbfee3c78d9e4f6090f1c871b9cc230e67ff0fb2a06914970c548bf990cafff4e8ea0b21a179b9be50517a4f3645e9504ce2da8d78e98cbb8a7e12abaa479ad0358df2733336110cdb2b6a45'
const client = new Client().setEndpoint('https://sgp.cloud.appwrite.io/v1').setProject('69a3f5fa001d16c4716f').setKey(KEY)
const storage = new Storage(client)
const db = new Databases(client)
const DB = '69a40e400036fcae920c'

async function run() {
  try {
    // Create bucket
    const bucket = await storage.createBucket(
      'unique()',
      'Food Images',
      [Permission.read(Role.any()), Permission.create(Role.users())],
      false,
      true,
      3145728,
      ['jpg', 'jpeg', 'png', 'webp', 'gif']
    )
    console.log('BUCKET_ID=' + bucket.$id)

    // Get real collection counts
    const [listings, requests, deliveries, users] = await Promise.all([
      db.listDocuments(DB, '69a40e4200032badb38a', [Query.limit(1)]),
      db.listDocuments(DB, '69a40e47000a3e5a09c3', [Query.limit(1)]),
      db.listDocuments(DB, '69a40e4a002370eff30c', [Query.limit(1)]),
      db.listDocuments(DB, '69a41df33602e515b6af', [Query.limit(1)]),
    ])
    console.log('listings=' + listings.total)
    console.log('requests=' + requests.total)
    console.log('deliveries=' + deliveries.total)
    console.log('users=' + users.total)
  } catch (e) {
    console.error('ERR:', e.message)
  }
}
run()
