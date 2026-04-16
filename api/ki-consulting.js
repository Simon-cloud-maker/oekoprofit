// Vercel Serverless Function
// Proxies AI requests to OpenRouter so the frontend never needs an API key.
//
// Set environment variable on Vercel:
// - OPENROUTER_API_KEY

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vercel parses JSON bodies automatically for common runtimes.
    const { prompt } = req.body || {};

    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Missing "prompt" string in request body.' });
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterKey) {
      return res.status(500).json({ error: 'Server misconfiguration: OPENROUTER_API_KEY is not set.' });
    }

    // Use OpenRouter free models router to keep costs at (often) $0.
    // Notes: Free-tier is rate-limited and not meant for heavy production traffic.
    const model = 'openrouter/free';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openrouterKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'OpenRouter API error', details: text });
    }

    const data = JSON.parse(text);
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      return res.status(502).json({ error: 'Empty response from OpenRouter.' });
    }

    return res.status(200).json({ response: content.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

