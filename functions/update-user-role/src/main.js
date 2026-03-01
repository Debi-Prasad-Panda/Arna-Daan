import { Client, Users } from 'node-appwrite';

// Appwrite Function: updates a user's role in their prefs
// Called via HTTP POST from the Admin panel's "Promote Role" button
//
// Required body: { userId: string, newRole: 'donor' | 'ngo' | 'volunteer' | 'admin' }
// Required header: Authorization — enforced by caller passing admin JWT
//
// Environment variables:
//   APPWRITE_FUNCTION_API_ENDPOINT
//   APPWRITE_FUNCTION_PROJECT_ID
//   APPWRITE_API_KEY  (server key with users.write scope)

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const usersApi = new Users(client);

  try {
    const { userId, newRole } = req.bodyJson || {};

    if (!userId || !newRole) {
      return res.json({ ok: false, reason: 'userId and newRole are required' }, 400);
    }

    const VALID_ROLES = ['donor', 'ngo', 'volunteer', 'admin'];
    if (!VALID_ROLES.includes(newRole)) {
      return res.json({ ok: false, reason: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` }, 400);
    }

    log(`Updating user ${userId} to role: ${newRole}`);

    // Fetch current prefs to preserve any other preferences
    const user     = await usersApi.get(userId);
    const prefs    = user.prefs || {};
    const newPrefs = { ...prefs, role: newRole };

    await usersApi.updatePrefs(userId, newPrefs);

    log(`Successfully updated user ${userId} role to ${newRole}`);
    return res.json({ ok: true, userId, newRole });

  } catch (e) {
    error(`update-user-role error: ${e.message}`);
    return res.json({ ok: false, error: e.message }, 500);
  }
};
