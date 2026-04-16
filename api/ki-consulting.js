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

    // OpenRouter generally follows the OpenAI chat-completions shape, but in practice
    // free routers can return slightly different structures. Be robust.
    const content =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      data?.choices?.[0]?.delta?.content ??
      '';

    const contentTrimmed = typeof content === 'string' ? content.trim() : '';
    if (!contentTrimmed) {
      // Don't leak the API key; only return safe debugging info.
      const debug = {
        model,
        hasChoices: Array.isArray(data?.choices),
        firstChoiceKeys: data?.choices?.[0] ? Object.keys(data.choices[0]) : null,
        finishReason: data?.choices?.[0]?.finish_reason ?? null,
      };
      return res.status(502).json({ error: 'Empty response from OpenRouter.', debug });
    }

    return res.status(200).json({ response: contentTrimmed });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
};

