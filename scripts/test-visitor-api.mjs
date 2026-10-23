import assert from 'node:assert/strict';
import { onRequestGet, onRequestPost } from '../functions/api/visitors.js';

class MemoryD1 {
  constructor() {
    this.visitors = new Set();
  }

  prepare(statement) {
    if (statement.startsWith('SELECT COUNT')) {
      return { first: async () => ({ count: this.visitors.size }) };
    }
    if (statement.startsWith('INSERT OR IGNORE')) {
      return {
        bind: visitorId => ({
          run: async () => {
            const existed = this.visitors.has(visitorId);
            this.visitors.add(visitorId);
            return { meta: { changes: existed ? 0 : 1 } };
          },
        }),
      };
    }
    throw new Error(`Unexpected statement: ${statement}`);
  }
}

const origin = 'https://xvwhite.pages.dev';
const visitorId = '2a345678-1234-4abc-8def-1234567890ab';
const database = new MemoryD1();
const env = { VISITOR_DB: database };
const post = (id = visitorId, requestOrigin = origin) => onRequestPost({
  env,
  request: new Request(`${origin}/api/visitors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: requestOrigin },
    body: JSON.stringify({ visitorId: id }),
  }),
});

let response = await onRequestGet({ env });
assert.equal(response.status, 200);
assert.deepEqual(await response.json(), { count: 0 });

response = await post();
assert.equal(response.status, 200);
assert.deepEqual(await response.json(), { count: 1, counted: true });

response = await post();
assert.deepEqual(await response.json(), { count: 1, counted: false });

response = await post('not-a-uuid');
assert.equal(response.status, 400);

response = await post(visitorId, 'https://example.com');
assert.equal(response.status, 403);

response = await onRequestGet({ env: {} });
assert.equal(response.status, 503);

console.log('Visitor API tests passed.');
