// Runecaster API on Cloudflare Workers + D1. Static files (prototype/) are served by Workers assets; only /api/*
// reaches this code (wrangler.jsonc run_worker_first).
//
// GET  /api/scores?limit=10   -> {scores: [{id, name, score, chapter, cleared, max_combo, perfect, good, miss, at}]}
// GET  /api/me?player=ID      -> {name: this browser's last name or null, best, runs}
// POST /api/scores {player, name, score, chapter, cleared, max_combo, perfect, good, miss} -> {id, rank}
//
// `player` is a random id the browser keeps in localStorage: it is the player's memory key and never leaves the
// API (the board doesn't return it). Scores are client-reported, so posts are sanity-checked against the scoring
// rule and rate-limited (per IP by the RATE binding, per player by the gap since their last run).

const FIELDS = ['score', 'chapter', 'cleared', 'max_combo', 'perfect', 'good', 'miss'];
const NAME_MAX = 12, NAME_RE = /^[\w .'-]+$/, PLAYER_RE = /^[A-Za-z0-9-]{8,64}$/;
const PLAYER_GAP_S = 10; // a run can't end sooner than this after the last one
const COUNT_MAX = 1e6, CHAPTER_MAX = 99;
// the game's scoring: each judged hit scores 100 (perfect) or 50 (good) × the combo multiplier, 1 to 4
const scoreOk = r => r.score >= 100 * r.perfect + 50 * r.good && r.score <= 4 * (100 * r.perfect + 50 * r.good);

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

function parseRun(data) {
  if (!data || typeof data !== 'object') return 'bad run';
  if (typeof data.player !== 'string' || !PLAYER_RE.test(data.player)) return 'bad player';
  const name = String(data.name ?? '').split(/\s+/).filter(Boolean).join(' ').slice(0, NAME_MAX);
  if (!name) return 'name required';
  if (!NAME_RE.test(name)) return 'bad name';
  const run = { player: data.player, name };
  for (const f of FIELDS) {
    const v = data[f];
    if (!Number.isSafeInteger(v) || v < 0 || v > COUNT_MAX) return `bad ${f}`;
    run[f] = v;
  }
  if (run.chapter < 1 || run.chapter > CHAPTER_MAX) return 'bad chapter';
  if (run.max_combo > run.perfect + run.good) return 'impossible combo';
  if (!scoreOk(run)) return 'impossible score';
  return run;
}

async function postScore(req, env) {
  const { success } = await env.RATE.limit({ key: req.headers.get('CF-Connecting-IP') || 'local' });
  if (!success) return json({ error: 'too many runs, slow down' }, 429);
  let data;
  try { data = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
  const run = parseRun(data);
  if (typeof run === 'string') return json({ error: run }, 400);
  const recent = await env.DB.prepare(`SELECT 1 FROM runs WHERE player = ? AND at > datetime('now', ?) LIMIT 1`)
    .bind(run.player, `-${PLAYER_GAP_S} seconds`).first();
  if (recent) return json({ error: 'too many runs, slow down' }, 429);
  const cols = ['player', 'name', ...FIELDS];
  const row = await env.DB.prepare(`INSERT INTO runs (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')}) RETURNING id`)
    .bind(...cols.map(c => run[c])).first();
  const { n } = await env.DB.prepare('SELECT COUNT(*) AS n FROM runs WHERE score > ?').bind(run.score).first();
  return json({ id: row.id, rank: n + 1 });
}

async function getScores(url, env) {
  const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get('limit'), 10) || 10));
  const { results } = await env.DB.prepare(`SELECT id, name, ${FIELDS.join(', ')}, at FROM runs ORDER BY score DESC, id ASC LIMIT ?`)
    .bind(limit).all();
  return json({ scores: results });
}

async function getMe(url, env) {
  const player = url.searchParams.get('player') || '';
  if (!PLAYER_RE.test(player)) return json({ name: null, best: 0, runs: 0 });
  const [last, agg] = await env.DB.batch([
    env.DB.prepare('SELECT name FROM runs WHERE player = ? ORDER BY id DESC LIMIT 1').bind(player),
    env.DB.prepare('SELECT COUNT(*) AS runs, COALESCE(MAX(score), 0) AS best FROM runs WHERE player = ?').bind(player),
  ]);
  const a = agg.results[0];
  return json({ name: last.results[0]?.name ?? null, best: a.best, runs: a.runs });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    try {
      if (url.pathname === '/api/scores') {
        if (req.method === 'GET') return await getScores(url, env);
        if (req.method === 'POST') return await postScore(req, env);
        return json({ error: 'method not allowed' }, 405);
      }
      if (url.pathname === '/api/me' && req.method === 'GET') return await getMe(url, env);
      return json({ error: 'not found' }, 404);
    } catch (err) {
      console.error(err);
      return json({ error: 'scores unavailable' }, 503); // e.g. D1's daily cap: the game shows the board as offline
    }
  },
};
