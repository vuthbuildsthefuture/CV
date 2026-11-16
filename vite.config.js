import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { sendContact } from './api/contact-handler.js';

function localContactApi({ token, chatId }) {
  return {
    name: 'local-contact-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.split('?')[0] !== '/api/contact') return next();
        if (request.method !== 'POST') {
          response.setHeader('Allow', 'POST');
          response.writeHead(405, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          let rawBody = '';
          for await (const chunk of request) {
            rawBody += chunk;
            if (rawBody.length > 16_384) {
              response.writeHead(413, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({ error: 'Request is too large' }));
              return;
            }
          }
          const data = JSON.parse(rawBody);
          const result = await sendContact(data, { token, chatId });
          response.writeHead(result.status, { 'Content-Type': 'application/json; charset=utf-8' });
          response.end(JSON.stringify(result.body));
        } catch {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ error: 'Invalid request body' }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      localContactApi({
        token: process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID || env.TELEGRAM_CHAT_ID
      })
    ]
  };
});
