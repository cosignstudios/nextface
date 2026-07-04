export interface Env {
  DB: D1Database;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json() as { userId: string, action?: string };
      const { userId, action } = body;
      
      if (!userId) {
        return new Response("Missing userId", { status: 400, headers: CORS_HEADERS });
      }

      // Handle cancel request to prevent ghosts
      if (action === "cancel") {
        let row: any = await env.DB.prepare("SELECT * FROM global_queue WHERE id = 1").first();
        if (row && row.waiting_user_id === userId) {
          await env.DB.prepare("UPDATE global_queue SET waiting_user_id = NULL, version = version + 1 WHERE id = 1 AND version = ?").bind(row.version).run();
        }
        return new Response(JSON.stringify({ status: "cancelled" }), { headers: CORS_HEADERS });
      }

      // Step 1: Read the current state of the global queue
      let row: any = await env.DB.prepare("SELECT * FROM global_queue WHERE id = 1").first();
      
      // Safety initialization if the row doesn't exist
      if (!row) {
        await env.DB.prepare("INSERT INTO global_queue (id, waiting_user_id, room_id, version) VALUES (1, NULL, NULL, 0)").run();
        row = { id: 1, waiting_user_id: null, room_id: null, version: 0 };
      }

      // Scenario A: Someone else is waiting. Let's match with them!
      if (row.waiting_user_id && row.waiting_user_id !== userId) {
        const roomId = crypto.randomUUID();
        
        // We generate the room ID, clear the waiting user, and increment version
        const updateResult = await env.DB.prepare(`
          UPDATE global_queue 
          SET waiting_user_id = NULL, room_id = ?, version = version + 1 
          WHERE id = 1 AND version = ?
        `).bind(roomId, row.version).run();

        // If the update failed (someone else matched them first), we need to retry or return waiting
        if (!updateResult.success || updateResult.meta.changes === 0) {
           return new Response(JSON.stringify({ status: "retry" }), { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ status: "matched", roomId, isInitiator: false }), {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // Scenario B: Nobody is waiting, or we are the ones waiting. Let's claim the slot.
      if (!row.waiting_user_id) {
        const claimResult = await env.DB.prepare(`
          UPDATE global_queue 
          SET waiting_user_id = ?, room_id = NULL, version = version + 1 
          WHERE id = 1 AND version = ?
        `).bind(userId, row.version).run();

        // If claim failed, someone else snuck in. The client should retry.
        if (!claimResult.success || claimResult.meta.changes === 0) {
           return new Response(JSON.stringify({ status: "retry" }), { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
        }
      }

      // Scenario C: We are waiting in the queue. Begin long-polling loop.
      // We will loop for up to 20 seconds, checking every 2 seconds.
      for (let i = 0; i < 10; i++) {
        // Sleep for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Read the row again
        const pollRow: any = await env.DB.prepare("SELECT * FROM global_queue WHERE id = 1").first();
        
        // If our waiting_user_id is cleared and a room_id is set, we've been matched!
        if (pollRow && pollRow.waiting_user_id !== userId && pollRow.room_id) {
          return new Response(JSON.stringify({ status: "matched", roomId: pollRow.room_id, isInitiator: true }), {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          });
        }

        // If for some reason we got bumped out entirely without a room ID (shouldn't happen with proper logic, but just in case)
        if (pollRow && pollRow.waiting_user_id !== userId && !pollRow.room_id) {
             return new Response(JSON.stringify({ status: "retry" }), { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
        }
      }

      // If we timeout after 20 seconds and still no match
      // Note: we leave ourselves in the waiting slot so the next person can find us,
      // or the client can re-request and continue the loop.
      return new Response(JSON.stringify({ status: "waiting" }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
      
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS_HEADERS });
    }
  },
};
