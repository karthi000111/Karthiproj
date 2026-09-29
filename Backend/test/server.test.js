const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../server');

test('GET /api/flashcards returns a list of flashcards', async () => {
  const server = app.listen(0);

  try {
    const {port} = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/flashcards`);
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.ok(Array.isArray(payload));
    assert.ok(payload.length > 0);
    assert.ok(payload[0].question);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
