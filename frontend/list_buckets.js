import { Client, Storage } from 'node-appwrite'

const KEY = 'standard_d4e6f56f24dae994b8557b879ef77257dd0acbbc850303b3635b0afced9b54c8de8d19c117995ce4c38f6b8d58256b9ddc38c875cbfee3c78d9e4f6090f1c871b9cc230e67ff0fb2a06914970c548bf990cafff4e8ea0b21a179b9be50517a4f3645e9504ce2da8d78e98cbb8a7e12abaa479ad0358df2733336110cdb2b6a45'
const client = new Client().setEndpoint('https://sgp.cloud.appwrite.io/v1').setProject('69a3f5fa001d16c4716f').setKey(KEY)
const storage = new Storage(client)

async function run() {
  const list = await storage.listBuckets()
  console.log('Buckets:', JSON.stringify(list.buckets.map(b => ({ id: b.$id, name: b.name })), null, 2))
}
run().catch(e => console.error(e.message))
