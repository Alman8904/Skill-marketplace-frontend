/**
 * API Endpoint Verification Script
 * Run with: node scripts/verify-api.js
 * Requires backend running on http://localhost:8080
 */

const BASE = process.env.API_URL || 'http://localhost:8080';

const endpoints = [
  { method: 'GET', path: '/', name: 'Health' },
  { method: 'GET', path: '/swagger-ui/index.html', name: 'Swagger UI' },
];

async function check(endpoint) {
  const url = BASE + endpoint.path;
  try {
    const res = await fetch(url, { method: endpoint.method });
    return { ok: res.ok, status: res.status, name: endpoint.name };
  } catch (err) {
    return { ok: false, error: err.message, name: endpoint.name };
  }
}

async function main() {
  console.log('Verifying API endpoints at', BASE, '\n');
  let passed = 0;
  for (const ep of endpoints) {
    const result = await check(ep);
    const status = result.ok ? 'OK' : 'FAIL';
    const detail = result.ok ? result.status : (result.error || result.status);
    console.log(`  [${status}] ${ep.name} (${ep.method} ${ep.path}) - ${detail}`);
    if (result.ok) passed++;
  }
  console.log('\n' + passed + '/' + endpoints.length + ' endpoints OK');
  process.exit(passed === endpoints.length ? 0 : 1);
}

main();
