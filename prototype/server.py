#!/usr/bin/env python3
"""Runecaster dev server: the prototype's static files plus a tiny SQLite score API (stdlib only).

    python3 prototype/server.py [port]      # default 8777, serves prototype/

GET  /api/scores?limit=10  -> {"scores": [{id, name, score, chapter, cleared, max_combo, perfect, good, miss, at}, ...]}
GET  /api/me               -> {"name": last name used or null, "best": that name's best score, "runs": runs recorded}
POST /api/scores  {name, score, chapter, cleared, max_combo, perfect, good, miss} -> {"id": .., "rank": ..}

The database is prototype/runecaster.db, created on first run (not in git).
"""
import json
import sqlite3
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent
DB = ROOT / 'runecaster.db'
FIELDS = ('score', 'chapter', 'cleared', 'max_combo', 'perfect', 'good', 'miss')
NAME_MAX = 12


def db():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    con.execute(f"""CREATE TABLE IF NOT EXISTS runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        {', '.join(f'{f} INTEGER NOT NULL' for f in FIELDS)},
        at TEXT NOT NULL DEFAULT (datetime('now')))""")
    con.execute('CREATE INDEX IF NOT EXISTS runs_score ON runs (score DESC)')
    return con


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def send_json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        url = urlparse(self.path)
        if url.path == '/api/scores':
            limit = max(1, min(50, int((parse_qs(url.query).get('limit') or ['10'])[0])))
            with db() as con:
                rows = con.execute('SELECT * FROM runs ORDER BY score DESC, id ASC LIMIT ?', (limit,)).fetchall()
            return self.send_json({'scores': [dict(r) for r in rows]})
        if url.path == '/api/me':
            with db() as con:
                last = con.execute('SELECT name FROM runs ORDER BY id DESC LIMIT 1').fetchone()
                runs = con.execute('SELECT COUNT(*) FROM runs').fetchone()[0]
                best = last and con.execute('SELECT MAX(score) FROM runs WHERE name = ?', (last['name'],)).fetchone()[0]
            return self.send_json({'name': last and last['name'], 'best': best or 0, 'runs': runs})
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != '/api/scores':
            return self.send_json({'error': 'not found'}, 404)
        try:
            data = json.loads(self.rfile.read(int(self.headers.get('Content-Length') or 0)))
            name = ' '.join(str(data['name']).split())[:NAME_MAX]
            vals = [max(0, int(data[f])) for f in FIELDS]
        except (ValueError, KeyError, TypeError):
            return self.send_json({'error': 'bad run'}, 400)
        if not name:
            return self.send_json({'error': 'name required'}, 400)
        with db() as con:
            cur = con.execute(f"INSERT INTO runs (name, {', '.join(FIELDS)}) VALUES (?{', ?' * len(FIELDS)})", (name, *vals))
            rank = con.execute('SELECT COUNT(*) FROM runs WHERE score > ?', (vals[0],)).fetchone()[0] + 1
        return self.send_json({'id': cur.lastrowid, 'rank': rank})


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8777
    print(f'runecaster on http://127.0.0.1:{port}/ (scores in {DB.name})', flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
