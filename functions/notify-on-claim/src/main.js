import { Client, Databases, Messaging, Users } from 'node-appwrite';

// Appwrite Function: triggered on requests collection document update
// Event: databases.*.collections.*.documents.*.update
//
// Environment variables to set in Appwrite Console:
//   APPWRITE_FUNCTION_API_ENDPOINT  — e.g. https://sgp.cloud.appwrite.io/v1
//   APPWRITE_FUNCTION_PROJECT_ID    — your project ID
//   APPWRITE_API_KEY                — server API key with databases + messaging scope
//   DATABASE_ID                     — your database ID
//   LISTINGS_COLLECTION_ID          — listings collection ID
//   USERS_COLLECTION_ID             — users profile collection ID

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases  = new Databases(client);
  const messaging  = new Messaging(client);
  const usersApi   = new Users(client);

  try {
    // The event payload contains the updated request document
    const payload = req.bodyJson;
    if (!payload) {
      log('No payload received');
      return res.json({ ok: false, reason: 'no_payload' });
    }

    const request  = payload;
    const status   = request.status;
    const listingId = request.listingId;
    const receiverId = request.receiverId;
    const receiverName = request.receiverName || 'Receiver';

    log(`Request updated — listingId: ${listingId}, status: ${status}`);

    // Fetch the listing to get donor info
    let listing = null;
    try {
      listing = await databases.getDocument(
        process.env.DATABASE_ID,
        process.env.LISTINGS_COLLECTION_ID,
        listingId
      );
    } catch (e) {
      log(`Could not fetch listing ${listingId}: ${e.message}`);
    }

    const donorId   = listing?.donorId;
    const listingTitle = listing?.title || 'Food Listing';

    // ── Notify DONOR when NGO claims their listing ────────────────────────────
    if (status === 'Pending' && donorId) {
      const subject = `🍱 New Claim on Your Listing — ${listingTitle}`;
      const body    = `
        <h2>Hello!</h2>
        <p><strong>${receiverName}</strong> has claimed your food listing: <strong>${listingTitle}</strong>.</p>
        <p>Log in to Annadaan to <strong>approve or reject</strong> this request.</p>
        <br/>
        <a href="${process.env.APPWRITE_FUNCTION_API_ENDPOINT?.replace('/v1', '')}/dashboard" 
           style="background:#e8622a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          View Dashboard →
        </a>
        <br/><br/>
        <p style="color:#888;font-size:12px;">Annadaan — Bridge the Gap · reducing food waste, one meal at a time</p>
      `;

      try {
        // Fetch donor's email from Appwrite Users
        const donorProfile = await databases.listDocuments(
          process.env.DATABASE_ID,
          process.env.USERS_COLLECTION_ID,
          [`userId=${donorId}`]
        );
        const donorEmail = donorProfile.documents[0]?.email;
        if (donorEmail) {
          await messaging.createEmail(
            'unique()',       // message ID
            subject,          // subject
            body,             // HTML content
            [],               // topics
            [donorId],        // user IDs (Appwrite Messaging)
            [],               // targets
            [],               // cc
            [],               // bcc
            [],               // attachments
            false,            // draft
            true,             // html
          );
          log(`Email sent to donor: ${donorEmail}`);
        }
      } catch (e) {
        log(`Email to donor failed: ${e.message}`);
      }
    }

    // ── Notify RECEIVER when donor approves/rejects their claim ──────────────
    if ((status === 'Approved' || status === 'Rejected') && receiverId) {
      const approved  = status === 'Approved';
      const subject   = approved
        ? `✅ Your food claim was approved! — ${listingTitle}`
        : `❌ Your food claim was not approved — ${listingTitle}`;
      const body = `
        <h2>Hello ${receiverName}!</h2>
        <p>Your claim for <strong>${listingTitle}</strong> has been 
           <strong style="color:${approved ? '#22c55e' : '#ef4444'}">${status.toLowerCase()}</strong>
           by the donor.</p>
        ${approved
          ? '<p>A volunteer will be assigned to deliver the food. You will receive another update once it is picked up.</p>'
          : '<p>You can browse more listings on the Annadaan feed.</p>'
        }
        <br/>
        <a href="${process.env.APPWRITE_FUNCTION_API_ENDPOINT?.replace('/v1', '')}/claims" 
           style="background:#e8622a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          View My Claims →
        </a>
        <br/><br/>
        <p style="color:#888;font-size:12px;">Annadaan — Bridge the Gap</p>
      `;

      try {
        await messaging.createEmail(
          'unique()', subject, body, [], [receiverId], [], [], [], [], false, true
        );
        log(`Email sent to receiver: ${receiverId}`);
      } catch (e) {
        log(`Email to receiver failed: ${e.message}`);
      }
    }

    // ── Notify RECEIVER when delivery is complete ─────────────────────────────
    if (status === 'Delivered' && receiverId) {
      const subject = `🎉 Your food has been delivered! — ${listingTitle}`;
      const body = `
        <h2>Great news, ${receiverName}!</h2>
        <p>Your food delivery for <strong>${listingTitle}</strong> has been marked as <strong>Delivered</strong>. 🎊</p>
        <p>Thank you for being part of the Annadaan community.</p>
        <br/>
        <a href="${process.env.APPWRITE_FUNCTION_API_ENDPOINT?.replace('/v1', '')}/community"
           style="background:#e8622a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Share Your Story →
        </a>
        <br/><br/>
        <p style="color:#888;font-size:12px;">Annadaan — Bridge the Gap</p>
      `;

      try {
        await messaging.createEmail(
          'unique()', subject, body, [], [receiverId], [], [], [], [], false, true
        );
        log(`Delivery confirmation email sent to: ${receiverId}`);
      } catch (e) {
        log(`Delivery email failed: ${e.message}`);
      }
    }

    return res.json({ ok: true, status });

  } catch (e) {
    error(`Function error: ${e.message}`);
    return res.json({ ok: false, error: e.message }, 500);
  }
};
