export async function sendContact(data, { token, chatId }) {
  if (!token || !chatId) {
    console.error('Telegram contact endpoint is missing its environment configuration.');
    return { status: 503, body: { error: 'Contact form is not configured' } };
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { status: 400, body: { error: 'Invalid request body' } };
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const subject = typeof data.subject === 'string' ? data.subject.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (!name || name.length > 120 || !email || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || subject.length > 200 ||
      !message || message.length > 4000) {
    return { status: 400, body: { error: 'Please provide valid contact details and message' } };
  }

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
    const telegramResult = await telegramResponse.json().catch(() => ({}));
    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error('Telegram rejected a contact notification:', telegramResponse.status, telegramResult.description);
      return { status: 502, body: { error: 'Message delivery failed' } };
    }
    console.info('Telegram contact notification delivered:', {
      chatId: telegramResult.result?.chat?.id,
      messageId: telegramResult.result?.message_id
    });
    return { status: 200, body: { ok: true } };
  } catch (error) {
    console.error('Telegram contact notification failed:', error);
    return { status: 502, body: { error: 'Message delivery failed' } };
  }
}
