# Hong Hengdavuth Portfolio

React portfolio built with Vite.

## Run locally

```bash
npm install
npm run dev
```

To create a production build, run `npm run build`.

## Telegram contact notifications

The contact form sends submissions to `/api/contact`, which delivers them with a Telegram bot. The bot token stays on the server and must never be added to frontend code.

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy its token.
2. Start a chat with the bot (or add it to the group where you want messages).
3. Find the destination chat ID. For local development, copy `.env.example` to `.env.local` and fill in both values there. `.env.local` is ignored by Git.
4. Deploy the site to Vercel. The `api/contact.js` function runs on the server; a static-only host will need an equivalent serverless endpoint.

For local development, run `npm run dev`; Vite provides `/api/contact` locally and reads credentials from `.env.local`. For production on Vercel, add the same values under **Project Settings → Environment Variables** and redeploy. The Telegram bot token must never be added to frontend code.
