import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkPortal } from '../scripts/check-portal.mjs';

const valid = () => new Response(JSON.stringify({ csrf: 'a'.repeat(64), user: null }), {
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store, private' },
});
await checkPortal('https://roknord.ru', async () => valid());
for (const response of [
  new Response('Not found', { status: 404 }),
  new Response('<html>PHP error</html>', { status: 500 }),
  new Response('<html>Static fallback</html>'),
  new Response('{}', { headers: { 'content-type': 'application/json' } }),
]) await assert.rejects(checkPortal('https://roknord.ru', async () => response));
await assert.rejects(checkPortal('http://roknord.ru', async () => valid()));

const deploySource = readFileSync(resolve('scripts/deploy-timeweb.sh'), 'utf8');
assert.ok(deploySource.includes('--chmod=Fu=rw,Fgo='), 'private file mode must work with the system rsync');
assert.ok(!deploySource.includes('--chmod=F600'), 'numeric chmod syntax is not supported by the system rsync');

// Stub only the external transport, never connect to hosting or upload test data.
const fixture = mkdtempSync(join(tmpdir(), 'roknord-deploy-check-'));
try {
  const bin = join(fixture, 'bin');
  mkdirSync(bin);
  const stub = '#!' + process.execPath + '\n' + `
const fs = require('node:fs');
const path = require('node:path');
const tool = path.basename(process.argv[1]);
const args = process.argv.slice(2);
fs.appendFileSync(process.env.DEPLOY_TEST_LOG, JSON.stringify({tool,args}) + '\\n');
if (tool === 'ssh' && args.includes('bash')) fs.readFileSync(0, 'utf8');
const fail = process.env.DEPLOY_TEST_FAIL;
if (fail === 'ssh' && tool === 'ssh') process.exit(255);
if (fail === 'init' && tool === 'ssh' && args.join(' ').includes('/install.php')) process.exit(1);
if (fail === 'api' && tool === 'node') process.exit(1);
`;
  for (const tool of ['ssh', 'rsync', 'npm', 'node']) writeFileSync(join(bin, tool), stub, { mode: 0o755 });
  const keyPath = join(fixture, 'key with spaces');
  writeFileSync(keyPath, 'Not a real SSH key; transport is stubbed.');
  for (const failure of ['', 'ssh', 'init', 'api', 'ftp']) {
    const log = join(fixture, 'log-' + (failure || 'success'));
    const result = spawnSync('bash', [resolve('scripts/deploy-timeweb.sh')], {
      encoding: 'utf8',
      env: { ...process.env, PATH: bin + ':' + process.env.PATH, DEPLOY_TEST_LOG: log, DEPLOY_TEST_FAIL: failure,
        TIMEWEB_DEPLOY_TRANSPORT: failure === 'ftp' ? 'ftp' : 'ssh',
        TIMEWEB_SITE_PATH: 'roknord/public_html', TIMEWEB_SSH_KEY: keyPath },
    });
    const records = failure === 'ftp' ? [] : readFileSync(log, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    const staticUpload = records.findIndex(r => r.tool === 'rsync' && r.args.includes('./dist/'));
    if (failure) {
      assert.notEqual(result.status, 0, failure);
      assert.equal(staticUpload, -1, 'failed preflight/init/API must block static upload: ' + failure);
    } else {
      assert.equal(result.status, 0, result.stderr);
      const init = records.findIndex(r => r.tool === 'ssh' && r.args.join(' ').includes('/install.php'));
      const probes = records.flatMap((r, i) => r.tool === 'node' ? [i] : []);
      assert.equal(probes.length, 2);
      assert.ok(init < probes[0] && probes[0] < staticUpload && staticUpload < probes[1]);
      assert.ok(records[staticUpload].args.includes('--exclude=/portal-api/'));
      assert.ok(records[staticUpload].args.some(arg => arg.includes('"' + keyPath + '"')), 'rsync must quote key paths with spaces');
      assert.ok(records.filter(r => r.tool === 'rsync').every(r => !r.args.some(a => a.includes('demo') || a.includes('portal.sqlite') || a === '--delete')));
    }
  }
  console.log('PASS deployment ordering, failure guards, API contract, no demo/database upload');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
