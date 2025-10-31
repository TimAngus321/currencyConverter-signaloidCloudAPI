import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path || '';

  const apiKey = process.env.VITE_SIGNALOID_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  const url = `https://api.signaloid.io/${apiPath}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}
