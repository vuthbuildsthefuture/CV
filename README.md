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
3. Find the destination chat ID and configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` as server environment variables in Vercel. For local function development, put them in a local `.env.local` file (do not commit it).
4. Deploy the site to Vercel. The `api/contact.js` function runs on the server; a static-only host will need an equivalent serverless endpoint.

For local development, use Vercel CLI (`vercel dev`) so `/api/contact` is available. Plain `npm run dev` serves only the Vite frontend and does not run the API function.
