const json = (response, status, body) => response.status(status).json(body);

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Telegram contact endpoint is missing its environment configuration.');
    return json(response, 503, { error: 'Contact form is not configured' });
  }

  const data = request.body;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return json(response, 400, { error: 'Invalid request body' });
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const subject = typeof data.subject === 'string' ? data.subject.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (!name || name.length > 120 || !email || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || subject.length > 200 ||
      !message || message.length > 4000) {
    return json(response, 400, { error: 'Please provide valid contact details and message' });
  }

  // Escape Telegram MarkdownV2 reserved characters so user input cannot break formatting.
  const escapeMarkdown = (value) => value.replace(/[\\_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
  const text = [
    '*New portfolio contact message*',
    `*Name:* ${escapeMarkdown(name)}`,
    `*Email:* ${escapeMarkdown(email)}`,
    `*Subject:* ${escapeMarkdown(subject)}`,
    '*Message:*',
    escapeMarkdown(message)
  ].join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'MarkdownV2' })
    });
    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.json().catch(() => ({}));
      console.error('Telegram rejected a contact notification:', telegramResponse.status, telegramError.description);
      return json(response, 502, { error: 'Message delivery failed' });
    }
    return json(response, 200, { ok: true });
  } catch (error) {
    console.error('Telegram contact notification failed:', error);
    return json(response, 502, { error: 'Message delivery failed' });
  }
}
