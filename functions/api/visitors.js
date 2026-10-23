const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: JSON_HEADERS,
});

const getDatabase = env => env?.VISITOR_DB;

const readCount = async database => {
  const row = await database.prepare('SELECT COUNT(*) AS count FROM visitors').first();
  return Number(row?.count ?? 0);
};

export async function onRequestGet({ env }) {
  const database = getDatabase(env);
  if (!database) return json({ error: 'Visitor database is unavailable.' }, 503);

  try {
    return json({ count: await readCount(database) });
  } catch {
    return json({ error: 'Unable to read visitor count.' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const database = getDatabase(env);
  if (!database) return json({ error: 'Visitor database is unavailable.' }, 503);

  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  if (origin && origin !== requestUrl.origin) return json({ error: 'Cross-origin requests are not allowed.' }, 403);

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 256) return json({ error: 'Request body is too large.' }, 413);

  let payload;
  try {
    const body = await request.text();
    if (body.length > 256) return json({ error: 'Request body is too large.' }, 413);
    payload = JSON.parse(body);
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const visitorId = typeof payload?.visitorId === 'string' ? payload.visitorId.trim() : '';
  if (!UUID_PATTERN.test(visitorId)) return json({ error: 'Invalid visitor ID.' }, 400);

  try {
    const result = await database
      .prepare('INSERT OR IGNORE INTO visitors (visitor_id) VALUES (?)')
      .bind(visitorId)
      .run();
    const count = await readCount(database);
    return json({ count, counted: Number(result?.meta?.changes ?? 0) > 0 });
  } catch {
    return json({ error: 'Unable to update visitor count.' }, 500);
  }
}
