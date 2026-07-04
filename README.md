# NextFace

NextFace is a 100% serverless, massively scalable Omegle alternative. It connects users into random 1-on-1 video chats.

## Architecture

This application has been engineered to run completely on the edge, meaning **zero server costs** and infinite scalability.

- **Frontend**: React + Vite + TailwindCSS v4
- **Authentication**: Supabase Auth (Google OAuth)
- **Signaling**: Supabase Realtime Channels (Ephemeral WebRTC connection handshakes)
- **Matchmaking Engine**: Cloudflare Workers + Cloudflare D1
- **Video & Chat**: 100% Peer-to-Peer WebRTC (RTCDataChannel)

## How It Works

1. Users log in with their Google account via Supabase.
2. When they click "Start", they hit the Cloudflare Worker matchmaker API.
3. The matchmaker uses a Single-Row Switchboard pattern in Cloudflare D1 to pair them up within milliseconds while staying completely under free-tier write limits.
4. The two matched users are assigned a temporary Supabase Realtime Room.
5. They exchange SDP offers/answers over Supabase.
6. Once the direct P2P video connection is established, they disconnect from Supabase. All video and chat messaging happens directly between the peers at zero cost to the server.

## Local Setup

1. Copy `frontend/.env.local` placeholders and fill in your Supabase details.
2. Run `npm install` inside `frontend` and `cloudflare-worker`.
3. Deploy the worker using `npx wrangler d1 create nextface-d1` and `npx wrangler deploy`.
4. Run `npm run dev` in the frontend directory.
