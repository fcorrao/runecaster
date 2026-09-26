import { FINGERS, KEY_FINGER, ELEMENT_COLORS, WORDS } from "./words";
import type { Element } from "./words";

// --- Tuning constants (DESIGN.md §5 prototype defaults) ---
const BPM = 90;
const BEAT = 60_000 / BPM; // ms per beat
const TRAVEL_MS = BEAT * 4; // scroll time from spawn to hit line
const PERFECT_MS = 60; // |delta| <= this -> perfect
const GOOD_MS = 250; // |delta| <= this -> good; correct key outside -> ignored
const LAPSE_GRACE_MS = GOOD_MS; // past hitTime + this -> rune lapses (miss)
const VOLLEY_GAP_BEATS = 2; // quiet beats between volleys
const ENEMY_DAMAGE = 10;
const SPELL_DAMAGE = 2;
const SPELL_DAMAGE_FULL = 3; // all-perfect volley
const ENEMY_HP = 20;
const PLAYER_HP = 100;

// --- Canvas layout ---
const W = 960;
const H = 720;
const LANE_W = 70;
const MID_GAP = 60;
const LANES_X0 = (W - (8 * LANE_W + MID_GAP)) / 2;
const ARCHER_Y = 56;
const TOP_Y = 110;
const HIT_Y = 560;

function laneX(lane: number): number {
  return lane < 4
    ? LANES_X0 + lane * LANE_W + LANE_W / 2
    : LANES_X0 + 4 * LANE_W + MID_GAP + (lane - 4) * LANE_W + LANE_W / 2;
}

/** 1 + 0.5 per 5 combo, i.e. x1, x1.5, x2, ... */
function comboMultiplier(): number {
  return 1 + Math.floor(g.combo / 5) * 0.5;
}

// --- Game state ---
type Grade = "perfect" | "good";
type RuneState = "pending" | "typed" | "missed";

interface Rune {
  char: string;
  lane: number;
  element: Element;
  hitTime: number;
  lapseAt: number;
  state: RuneState;
  grade?: Grade;
}

interface Popup {
  text: string;
  color: string;
  x: number;
  y: number;
  born: number;
}

interface Hint {
  char: string;
  lane: number;
  until: number;
}

interface Stats {
  perfect: number;
  good: number;
  miss: number;
  volleys: number;
}

interface Game {
  phase: "playing" | "won" | "lost";
  word: string;
  runes: Rune[];
  resolveAt: number; // volley resolution time
  nextWordAt: number;
  playerHp: number;
  enemyHp: number;
  combo: number;
  score: number;
  popups: Popup[];
  hint: Hint | null;
  lastBeatIndex: number;
  outcome: { text: string; color: string; until: number } | null;
  stats: Stats;
}

let g: Game;

function reset(): void {
  g = {
    phase: "playing",
    word: "",
    runes: [],
    resolveAt: 0,
    nextWordAt: performance.now() + VOLLEY_GAP_BEATS * BEAT,
    playerHp: PLAYER_HP,
    enemyHp: ENEMY_HP,
    combo: 0,
    score: 0,
    popups: [],
    hint: null,
    lastBeatIndex: -1,
    outcome: null,
    stats: { perfect: 0, good: 0, miss: 0, volleys: 0 },
  };
}

function spellElement(word: string): Element {
  // Aggregation: majority element of the word's letters; tie -> first letter's.
  const counts: Record<Element, number> = { fire: 0, water: 0, earth: 0, air: 0 };
  for (const ch of word) counts[FINGERS[KEY_FINGER[ch]!]!.element]++;
  let best: Element | null = null;
  let bestN = 0;
  for (const el of Object.keys(counts) as Element[]) {
    if (counts[el]! > bestN) {
      best = el;
      bestN = counts[el]!;
    }
  }
  return best ?? FINGERS[KEY_FINGER[word[0]!]!].element;
}

function newVolley(now: number): void {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]!;
  g.word = word;
  g.runes = [...word].map((char, i) => {
    const lane = KEY_FINGER[char]!;
    return {
      char,
      lane,
      element: FINGERS[lane]!.element,
      // Rune i spawns now, scrolls for the travel time, then hits the line
      // one beat apart.
      hitTime: now + TRAVEL_MS + i * BEAT,
      lapseAt: now + TRAVEL_MS + i * BEAT + LAPSE_GRACE_MS,
      state: "pending" as const,
    };
  });
  const last = g.runes[g.runes.length - 1]!;
  g.resolveAt = last.hitTime + LAPSE_GRACE_MS + 50;
  g.outcome = null;
}

function markMiss(rune: Rune, now: number, teach: boolean): void {
  rune.state = "missed";
  g.combo = 0;
  g.stats.miss++;
  g.popups.push({
    text: "MISS",
    color: "#ff4d4d",
    x: laneX(rune.lane),
    y: HIT_Y,
    born: now,
  });
  if (teach) {
    // Educational feedback: flash the correct character in its lane (§6).
    g.hint = { char: rune.char, lane: rune.lane, until: now + 1200 };
  }
}

function resolveVolley(now: number): void {
  g.stats.volleys++;
  const cast = g.runes.every((r) => r.state === "typed");
  if (cast) {
    const allPerfect = g.runes.every((r) => r.grade === "perfect");
    const dmg = allPerfect ? SPELL_DAMAGE_FULL : SPELL_DAMAGE;
    g.enemyHp = Math.max(0, g.enemyHp - dmg);
    g.outcome = {
      text: allPerfect ? "FULL-POWER SPELL" : "SPELL CAST",
      color: ELEMENT_COLORS[spellElement(g.word)],
      until: now + 1400,
    };
    if (g.enemyHp <= 0) g.phase = "won";
  } else {
    g.playerHp = Math.max(0, g.playerHp - ENEMY_DAMAGE);
    g.outcome = { text: "FIZZLE — the archers hit you", color: "#ff4d4d", until: now + 1400 };
    if (g.playerHp <= 0) g.phase = "lost";
  }
  g.runes = [];
  g.nextWordAt = now + VOLLEY_GAP_BEATS * BEAT;
}

function update(now: number): void {
  // Lapse pending runes whose deadline passed.
  for (const r of g.runes) {
    if (r.state === "pending" && now > r.lapseAt) markMiss(r, now, true);
  }
  if (g.runes.length > 0 && now >= g.resolveAt) resolveVolley(now);
  if (g.runes.length === 0 && g.phase === "playing" && now >= g.nextWordAt) {
    newVolley(now);
  }
  g.popups = g.popups.filter((p) => now - p.born < 700);
  if (g.hint && now > g.hint.until) g.hint = null;
  if (g.outcome && now > g.outcome.until) g.outcome = null;
}

function onKey(e: KeyboardEvent): void {
  if (e.repeat) return;
  const key = e.key.toLowerCase();
  const now = performance.now();
  if (g.phase !== "playing") {
    if (key === "r") reset();
    return;
  }
  // Match against any pending rune with this character (nearest deadline
  // first) so typing one rune slightly ahead of its beat still lands.
  const match = g.runes
    .filter((r) => r.state === "pending" && r.char === key)
    .sort((a, b) => a.hitTime - b.hitTime)[0];
  if (match) {
    const delta = now - match.hitTime;
    // Correct character but way outside the timing window (too early; too
    // late already lapsed): ignore the input, rune stays pending. Without
    // this, mashing the whole word at spawn would cast at full combo.
    if (delta < -GOOD_MS) return;
    const grade: Grade = Math.abs(delta) <= PERFECT_MS ? "perfect" : "good";
    match.state = "typed";
    match.grade = grade;
    g.combo++;
    g.stats[grade]++;
    g.score += Math.round((grade === "perfect" ? 100 : 50) * comboMultiplier());
    g.popups.push({
      text: grade.toUpperCase(),
      color: grade === "perfect" ? "#ffd54d" : "#8ab4ff",
      x: laneX(match.lane),
      y: HIT_Y,
      born: now,
    });
  } else {
    // Lenient mode (§6): wrong key consumes the earliest pending rune as a
    // miss; the word continues, combo breaks, fizzle deferred to resolution.
    const target = g.runes
      .filter((r) => r.state === "pending")
      .sort((a, b) => a.hitTime - b.hitTime)[0];
    if (target) markMiss(target, now, true);
  }
}

// --- Rendering ---
const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

function drawLaneBackgrounds(): void {
  for (let lane = 0; lane < 8; lane++) {
    const x = laneX(lane) - LANE_W / 2;
    const el = FINGERS[lane]!.element;
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(x, TOP_Y, LANE_W, HIT_Y - TOP_Y + 30);
    ctx.fillStyle = ELEMENT_COLORS[el];
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, TOP_Y, 3, HIT_Y - TOP_Y + 30);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(LANES_X0 + 4 * LANE_W + MID_GAP / 2 - 1, TOP_Y, 2, HIT_Y - TOP_Y + 30);
}

function drawHitLine(): void {
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(LANES_X0 - 10, HIT_Y);
  ctx.lineTo(W - LANES_X0 + 10, HIT_Y);
  ctx.stroke();
}

function drawArchers(now: number): void {
  // Visual beat: every archer pulses on the beat (no audio in prototype).
  g.lastBeatIndex = Math.floor(now / BEAT);
  const pulse = 1 - (now % BEAT) / BEAT; // 1 right on the beat, decaying
  for (let lane = 0; lane < 8; lane++) {
    const x = laneX(lane);
    ctx.save();
    ctx.translate(x, ARCHER_Y);
    ctx.scale(1 + pulse * 0.15, 1 + pulse * 0.15);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 9, Math.PI * 0.25, Math.PI * 1.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(0, 9);
    ctx.stroke();
    ctx.restore();
  }
}

function drawWordProgress(): void {
  if (!g.word) return;
  ctx.font = "bold 26px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = [...g.word];
  let x = W / 2 - (chars.length * 22) / 2 + 11;
  for (let i = 0; i < chars.length; i++) {
    const rune = g.runes[i];
    if (rune?.state === "typed") ctx.fillStyle = ELEMENT_COLORS[rune.element];
    else if (rune?.state === "missed") ctx.fillStyle = "#ff4d4d";
    else ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText(chars[i]!.toUpperCase(), x, 86);
    x += 22;
  }
}

function drawRunes(now: number): void {
  for (const r of g.runes) {
    if (r.state === "typed") continue;
    // Scroll: spawn at TOP_Y, reach HIT_Y exactly at hitTime.
    const y = HIT_Y - ((r.hitTime - now) / TRAVEL_MS) * (HIT_Y - TOP_Y);
    if (y < TOP_Y - 40) continue;
    const x = laneX(r.lane);
    const missed = r.state === "missed";
    const cy = Math.min(y, HIT_Y);
    ctx.beginPath();
    ctx.arc(x, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = missed ? "rgba(90,90,90,0.6)" : "rgba(20,24,34,0.95)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = missed ? "#666" : ELEMENT_COLORS[r.element];
    ctx.stroke();
    ctx.fillStyle = missed ? "#999" : "#fff";
    ctx.font = "bold 22px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(r.char.toUpperCase(), x, cy);
  }
}

function drawHint(now: number): void {
  if (!g.hint) return;
  const x = laneX(g.hint.lane);
  ctx.globalAlpha = Math.min(1, (g.hint.until - now) / 400);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffd54d";
  ctx.font = "bold 40px ui-monospace, monospace";
  ctx.fillText(g.hint.char.toUpperCase(), x, HIT_Y - 90);
  const f = FINGERS[g.hint.lane]!;
  ctx.font = "14px ui-monospace, monospace";
  ctx.fillStyle = ELEMENT_COLORS[f.element];
  ctx.fillText(`${f.hand} ${f.name} finger`, x, HIT_Y - 55);
  ctx.globalAlpha = 1;
}

function drawHud(): void {
  // Health bars: enemy top-right, player bottom-left.
  const bars: Array<[number, number, number, string, string]> = [
    [W - LANES_X0 - 200, 16, g.enemyHp / ENEMY_HP, "#ff6b6b", `enemy ${g.enemyHp}/${ENEMY_HP}`],
    [16, H - 28, g.playerHp / PLAYER_HP, "#4da6ff", `you ${g.playerHp}/${PLAYER_HP}`],
  ];
  for (const [x, y, frac, color, label] of bars) {
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(x, y, 200, 12);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 200 * Math.max(0, frac), 12);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "12px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(label, x, y + 16);
  }

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 16px ui-monospace, monospace";
  ctx.fillText(`score ${g.score}`, 16, 16);
  if (g.combo > 1) {
    ctx.fillStyle = "#ffd54d";
    ctx.fillText(`combo ${g.combo}  x${comboMultiplier()}`, 16, 38);
  }
}

function drawPopups(now: number): void {
  for (const p of g.popups) {
    const t = (now - p.born) / 700;
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = p.color;
    ctx.font = "bold 18px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.text, p.x, p.y - t * 40);
  }
  ctx.globalAlpha = 1;
}

function drawOutcome(now: number): void {
  if (!g.outcome) return;
  ctx.globalAlpha = Math.min(1, (g.outcome.until - now) / 500);
  ctx.fillStyle = g.outcome.color;
  ctx.font = "bold 28px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(g.outcome.text, W / 2, H / 2 - 40);
  ctx.globalAlpha = 1;
}

function drawEndScreen(): void {
  ctx.fillStyle = "rgba(8,10,16,0.75)";
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = g.phase === "won" ? "#ffd54d" : "#ff4d4d";
  ctx.font = "bold 44px ui-monospace, monospace";
  ctx.fillText(g.phase === "won" ? "VICTORY" : "DEFEATED", W / 2, H / 2 - 80);
  const s = g.stats;
  const typed = s.perfect + s.good;
  const total = typed + s.miss || 1;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "16px ui-monospace, monospace";
  const lines = [
    `volleys ${s.volleys}   score ${g.score}`,
    `perfect ${s.perfect}   good ${s.good}   miss ${s.miss}   accuracy ${Math.round((typed / total) * 100)}%`,
    "",
    "press R to retry",
  ];
  lines.forEach((line, i) => ctx.fillText(line, W / 2, H / 2 - 20 + i * 26));
}

function draw(now: number): void {
  ctx.fillStyle = "#0a0d14";
  ctx.fillRect(0, 0, W, H);
  drawLaneBackgrounds();
  drawArchers(now);
  drawHitLine();
  drawWordProgress();
  drawRunes(now);
  drawHint(now);
  drawHud();
  drawPopups(now);
  drawOutcome(now);
  if (g.phase !== "playing") drawEndScreen();
}

function frame(now: number): void {
  if (g.phase === "playing") update(now);
  draw(now);
  requestAnimationFrame(frame);
}

window.addEventListener("keydown", onKey);

// Debug/test handle.
declare global {
  interface Window {
    __runecaster: { state: () => Game; reset: () => void };
  }
}
window.__runecaster = { state: () => g, reset };

reset();
requestAnimationFrame(frame);
