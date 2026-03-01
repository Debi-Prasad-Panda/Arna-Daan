/**
 * Annadaan — Appwrite Functions Deploy Script
 *
 * Prerequisites:
 *   npm install -g appwrite-cli
 *   appwrite login
 *
 * Usage:
 *   node deploy-functions.js
 *
 * This script creates (or updates) both Appwrite Functions and sets
 * the required environment variables automatically.
 */

import { Client, Functions, Storage } from 'node-appwrite'
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))

// ── Config — fill these in or set as env vars ─────────────────────────────────
const ENDPOINT   = process.env.APPWRITE_ENDPOINT   || 'https://sgp.cloud.appwrite.io/v1'
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '69a3f5fa001d16c4716f'
const API_KEY    = process.env.APPWRITE_API_KEY     || 'YOUR_SERVER_API_KEY'
const DATABASE_ID           = process.env.DATABASE_ID           || '69a40e400036fcae920c'
const LISTINGS_COLLECTION   = process.env.LISTINGS_COLLECTION   || '69a40e4200032badb38a'
const REQUESTS_COLLECTION   = process.env.REQUESTS_COLLECTION   || '69a40e47000a3e5a09c3'
const USERS_COLLECTION      = process.env.USERS_COLLECTION      || ''

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY)
const funcs  = new Functions(client)

const SHARED_VARS = [
  { key: 'APPWRITE_FUNCTION_API_ENDPOINT', value: ENDPOINT },
  { key: 'APPWRITE_FUNCTION_PROJECT_ID',   value: PROJECT_ID },
  { key: 'APPWRITE_API_KEY',               value: API_KEY },
  { key: 'DATABASE_ID',                    value: DATABASE_ID },
  { key: 'LISTINGS_COLLECTION_ID',         value: LISTINGS_COLLECTION },
  { key: 'REQUESTS_COLLECTION_ID',         value: REQUESTS_COLLECTION },
  { key: 'USERS_COLLECTION_ID',            value: USERS_COLLECTION },
]

async function upsertFunction(name, funcId, entrypoint, events, vars) {
  console.log(`\n📦 Deploying: ${name}`)
  let id = funcId

  try {
    // Create function if it doesn't exist
    const fn = await funcs.create(
      id || 'unique()',
      name,
      'node-18.0',
      events,
      undefined,  // schedule
      15,         // timeout (seconds)
      true,       // enabled
    )
    id = fn.$id
    console.log(`  ✅ Function created: ${id}`)
  } catch (e) {
    if (e.code === 409) {
      console.log(`  ♻️  Function already exists: ${id}`)
    } else {
      console.error(`  ❌ Create failed: ${e.message}`)
      return
    }
  }

  // Set env vars
  for (const v of vars) {
    try {
      await funcs.createVariable(id, v.key, v.value)
      console.log(`  🔑 Var set: ${v.key}`)
    } catch (e) {
      if (e.code === 409) process.stdout.write('.')
      else console.warn(`  ⚠️  Var ${v.key}: ${e.message}`)
    }
  }

  // Zip and deploy code
  const fnDir   = path.join(__dirname, 'functions', name.toLowerCase().replace(/\s+/g, '-'))
  const zipPath = path.join(__dirname, `${name}.zip`)
  try {
    execSync(`cd "${fnDir}" && npm install --omit=dev 2>&1 && cd "${__dirname}" && tar -czf "${zipPath}" -C "${fnDir}" .`, { stdio: 'pipe' })
    const deployment = await funcs.createDeployment(id, new File([fs.readFileSync(zipPath)], 'code.tar.gz'), true, entrypoint)
    console.log(`  🚀 Deployed: ${deployment.$id}`)
    fs.unlinkSync(zipPath)
  } catch (e) {
    console.error(`  ❌ Deploy failed: ${e.message}`)
  }

  return id
}

async function main() {
  console.log('🌾 Annadaan — Appwrite Functions Deployer\n')

  // 1. notify-on-claim
  await upsertFunction(
    'notify-on-claim',
    null,
    'src/main.js',
    [
      `databases.${DATABASE_ID}.collections.${REQUESTS_COLLECTION}.documents.*.create`,
      `databases.${DATABASE_ID}.collections.${REQUESTS_COLLECTION}.documents.*.update`,
    ],
    SHARED_VARS
  )

  // 2. update-user-role
  const roleUpdaterId = await upsertFunction(
    'update-user-role',
    null,
    'src/main.js',
    [],  // HTTP-only, no event triggers
    SHARED_VARS
  )

  if (roleUpdaterId) {
    console.log(`\n✅ update-user-role function ID: ${roleUpdaterId}`)
    console.log('   Add this to your frontend .env:')
    console.log(`   VITE_ROLE_UPDATE_FUNCTION_ID=${roleUpdaterId}`)
  }

  console.log('\n✅ Done! Check the Appwrite Console to verify deployments.')
  console.log('   → Don\'t forget to configure an email provider in Console → Messaging → Providers')
}

main().catch(console.error)
