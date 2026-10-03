// Syntax check: the game's inline <script> and the Worker. `npm run check` (CI runs it on every PR).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const html = readFileSync('prototype/index.html', 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error('prototype/index.html: no inline <script>'); process.exit(1); }
const game = join(mkdtempSync(join(tmpdir(), 'rc-')), 'game.js');
writeFileSync(game, m[1]);
for (const [label, file] of [['prototype/index.html <script>', game], ['worker/index.js', 'worker/index.js']]) {
  try { execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' }); console.log(`ok  ${label}`); }
  catch { console.error(`FAIL ${label}`); process.exit(1); }
}
