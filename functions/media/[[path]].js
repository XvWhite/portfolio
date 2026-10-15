const cacheControl = 'public, max-age=86400, stale-while-revalidate=604800';

function mediaKey(value) {
  const parts = Array.isArray(value) ? value : String(value || '').split('/');
  const clean = parts.map(part => decodeURIComponent(part)).filter(Boolean);
  if (!clean.length || clean.some(part => part === '.' || part === '..')) return null;
  return clean.join('/');
}

function parseRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value || '');
  if (!match || (!match[1] && !match[2])) return null;
  let start;
  let end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
  }
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= size || end < start) return null;
  end = Math.min(end, size - 1);
  return { offset: start, length: end - start + 1, end };
}

function objectHeaders(object, length) {
  const headers = new Headers();
  object.writeHttpMetadata?.(headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', cacheControl);
  headers.set('Content-Length', String(length));
  headers.set('Content-Type', headers.get('Content-Type') || 'video/mp4');
  if (object.httpEtag) headers.set('ETag', object.httpEtag);
  headers.set('X-Content-Type-Options', 'nosniff');
  return headers;
}

export async function onRequest({ request, env, params }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  if (!env.PORTFOLIO_MEDIA) return new Response('Media storage is not configured', { status: 503 });

  const key = mediaKey(params.path);
  if (!key) return new Response('Not Found', { status: 404 });

  const rangeHeader = request.headers.get('Range');
  if (request.method === 'HEAD' || rangeHeader) {
    const metadata = await env.PORTFOLIO_MEDIA.head(key);
    if (!metadata) return new Response('Not Found', { status: 404 });
    const headers = objectHeaders(metadata, metadata.size);
    if (request.method === 'HEAD') return new Response(null, { status: 200, headers });

    const range = parseRange(rangeHeader, metadata.size);
    if (!range) {
      headers.set('Content-Range', `bytes */${metadata.size}`);
      headers.set('Content-Length', '0');
      return new Response(null, { status: 416, headers });
    }

    const object = await env.PORTFOLIO_MEDIA.get(key, { range: { offset: range.offset, length: range.length } });
    if (!object) return new Response('Not Found', { status: 404 });
    const partialHeaders = objectHeaders(object, range.length);
    partialHeaders.set('Content-Range', `bytes ${range.offset}-${range.end}/${metadata.size}`);
    return new Response(object.body, { status: 206, headers: partialHeaders });
  }

  const object = await env.PORTFOLIO_MEDIA.get(key);
  if (!object) return new Response('Not Found', { status: 404 });
  return new Response(object.body, { status: 200, headers: objectHeaders(object, object.size) });
}
