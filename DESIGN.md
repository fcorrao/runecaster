# Runecaster (working title)

A typing rhythm game. You are a spellcaster; you type words to cast spells.
Characters scroll down in finger-aligned lanes, and you hit them on the beat.
The rhythm isn't music — it's the enemy's attack pattern.

> **Status:** concept + design scaffolding. Decisions below are settled in
> conversation; open questions are marked **[OPEN]**.

---

## 1. Concept

Guitar Hero, but for typing. Notes scroll down vertical lanes; you hit them on
the beat. Instead of a guitar, your instrument is a keyboard. Instead of a
song, the rhythm is a battle — an enemy attacks in a pattern, and you type
spells to counter it.

The twist that makes it a *learning* game, not just typing practice: the lanes
are aligned to **fingers**, not keys. Each character scrolls down in the lane
of the finger that should type it. The lane teaches you touch typing — which
finger goes to which key — and over time the association becomes automatic.

The theme is a **spellcaster**. You type incantations (real words) to cast
spells. The characters are runes. The lanes are **elements** (fire, water,
earth, air), which gives the finger mapping a non-arbitrary meaning.

**Design philosophy:** accuracy is paramount; speed comes later. The game
rewards typing *correctly* first, then *in time*, then *fast*. This inverts the
usual typing-game obsession with WPM.

---

## 2. Core Loop

1. An enemy (or wave) attacks in a rhythmic pattern.
2. A spell — a word — appears. Its characters scroll down in the finger-lanes.
3. You type the characters on the beat to cast the spell.
4. If you're accurate, the spell casts and counters the attack.
5. If you miss, the spell **fizzles** and the enemy hits you.

The enemy's attack cadence is the rhythm. The beat has stakes: miss it and you
take damage.

---

## 3. The Finger-Lane Mechanic (core innovation)

**8 lanes, one per finger** (thumbs excluded — they handle space).

- Lanes are **per-finger, not per-key.** Left index types R, T, F, G, V, B, 4,
  5 — all in one lane. The note shows the character; the lane shows the finger.
  This is exactly the touch-typing mapping.
- **Layout mimics the keyboard.** Left-hand lanes on the left, right-hand lanes
  on the right, a gap in the middle (like the keyboard split). Reinforces
  left/right hand separation.
- **Color-coded by hand** (and per-finger) so the eye learns the mapping before
  the fingers do.

**Travel cues.** A per-finger lane is ambiguous within the lane: F and G both
ride the left-index lane, and the lane alone doesn't say which the note wants.
Each rune therefore carries a small movement marker relative to that finger's
**home key**: home keys (A S D F J K L ;) show a dot ("finger stays put"),
off-home keys show a chevron in the direction the finger travels from home —
G = right of F, R = upper-left, V = down, etc. The lane answers *which finger*;
the cue answers *what the finger does next*. Playtested: it's readable
peripherally and turns the lane into motor instruction, not just identification.

**Shift flags.** Numbers ride their digit rows in the same lanes; symbols are
shifted digits/punctuation and carry a small `⇧` marker — the *other* hand
supplies shift, which the lane cannot express. (Prototype exposes the typing
truth that symbols are a two-hand chord, not a key.)

**Elements = finger positions:**
- Index = Fire, Middle = Water, Ring = Earth, Pinky = Air
- Each element appears in 2 lanes (left + right)
- Element tells you the finger-position; the side tells you the hand
- Player learns: "Fire = index finger," "left/right = which hand"

**Word grouping:** characters in a word span multiple lanes (different fingers).
They arrive **staggered** (one at a time) with a subtle connector showing the
word boundary.

**Space key:** thumbs have no lane. Recommendation: a **central space
channel** between the two hand groups — fits the keyboard-split metaphor, and
for learning, typing space matters. **[OPEN]** — channel vs. auto-insert for
early levels.

**Finger enforcement:** the game can't detect *which* finger you actually use
(unless you have a per-key-pressure keyboard), so it **guides** rather than
enforces. The lanes teach; you learn by using them.

---

## 4. The Spellcaster Theme

- **Characters are runes.** You type incantations (real words) to cast spells.
- **Elements are the lanes.** Fire, water, earth, air — mapped to finger
  positions (see §3).
- **Spells are words.** The word you type *is* the spell. Real words, so you
  learn to type real text.
- **Enemies have elemental weaknesses.** A fire creature is weak to water
  spells. You need to know which spell is water, and cast it at the right
  creature. This makes the elements meaningful beyond decoration.

**Spell element is derived from its characters.** Each rune's element is the
element of the finger that types it (§3), so a word's element is a function of
its letters; the aggregation rule (majority element, first letter, …) is
**[OPEN]**. Enemy weaknesses then make **word choice = lane selection**: a
water spell is made of middle-finger characters, so picking the
counter-element picks which lanes you'll play. Element's real job is this
strategy layer (plus lane highlighting); the lanes themselves already teach
the finger mapping.

---

## 5. Rhythm & Timing

**The rhythm is the enemy's attack pattern, not a song.** The enemy attacks on
a beat; you type spells to counter. The beat has stakes — miss it and you take
damage. Different enemies = different rhythms.

**Enemy structures:**
- **Wave (archers)** — the standard encounter. A line of archers fires volleys
  on a steady beat. Each volley is a beat; you type a spell to counter it.
  Cleanest, most learnable.
- **Boss (single enemy)** — the "song" encounter. One big enemy with a complex
  attack pattern (attack, attack, big attack, pause, repeat). Varied, structured
  rhythm. The progression target.
- **Cavalry** — a speed variant. The charge *accelerates* (the rhythm speeds
  up). Tests speed once accuracy is down.

**Timing model (fixed rhythm for now):**
- **One word per volley.** The enemy attacks once (a volley); you type a whole
  word to counter. The word's characters scroll down in the rhythm. More
  "spell-casting" feel than one-key-per-beat.
- **Per-character beat grid — [OPEN].** Words vary in length but the enemy
  cadence is fixed: does the volley stretch to fit the word (rhythm becomes
  word-dependent), do multiple runes share a beat, or does scroll speed
  compensate? Core scheduling problem; unresolved.
- **Per-character grading, per-spell outcome.** Each rune is graded
  perfect / good / miss as you go; the word casts or fizzles as a whole.

**The hierarchy, driven by "accuracy paramount":**
1. **Correctness before the deadline is the gate.** The spell casts only if
   you type the right characters before each rune passes the hit line. A
   wrong key, or a rune that lapses untyped, = full fizzle.
2. **Timing within the window is the amplifier.** Perfect = right character on
   the beat → full-power spell, big combo. Good = right character, off-beat →
   spell casts, reduced power. Timing never *blocks* a cast; it only scales
   it. The deadline, not the beat, is the gate.
3. **Speed is the difficulty knob.** Tempo (scroll speed) increases over time.

**Tempo:** **[OPEN]** — fixed per-spell with a difficulty selector, or
adaptive? Constrained either way: cavalry (above) accelerates *within* an
encounter, so the model must support intra-encounter tempo curves.

---

## 6. Accuracy, Penalty & Reward

**Mistake types:**
- **Wrong key** — hit the wrong character. Most important for a typing game.
- **Missed note** — the character reached the hit line untyped.
- **Off-timing** — right key, slightly early/late. *Graded, not penalized.*
  (Graded "good," which still builds combo but earns less.)

**Penalty ladder (escalating):**
1. **Combo break** (always). Perfect/good build a combo; a miss breaks it.
   Combo = score multiplier.
2. **Spell fizzle** (the thematic one). **Full fizzle: a single mistake fails
   the whole spell** — no restart, no partial credit; the incantation fizzles
   and the enemy attack (3) lands. (Decision: accuracy is paramount.) In
   lenient early levels fizzle is disabled: a wrong key breaks combo (1),
   consumes that rune as a miss, and the word continues.
3. **Enemy attack** (the consequence). A fizzle or missed note lets the enemy
   hit you. You have a health bar; attacks drain it.
4. **Level fail.** Health reaches zero. Retry.

**Educational side:** when you miss, the game should **teach you the right
key** — flash the correct character, maybe a brief "this is the correct key"
animation. A mistake is a learning moment, not just a penalty. This is the
core value proposition: a tutor that happens to be a rhythm game.

**Reward for accuracy:** perfect typing = full-power spell (big damage,
dramatic effect); good = reduced-power spell; mistake = fizzle. Your typing
quality *is* the spell quality.

**Balance for learners:** off-timing is never a miss (graded "good"). Early
levels are lenient (fizzle disabled — see penalty ladder 2); later levels are
harsh (full fizzle, strong enemies). The difficulty curve isn't just "faster
notes" — it's also "harsher penalties."

> **Prototype decision (playtested):** the damage model is **miss-only,
> proportional, with perfects healing**. Goods cost spell power but never
> health ("all good" = zero damage); each lapsed rune draws its share of the
> enemy's arrow (full lapse = 18, one of four = 5); every perfect *heals* 2.
> A leaky "sloppy timing" arrow — punishing tempo while the learner is still
> accuracy-focused — tested hostile and was removed. Perfect-heal makes the
> accuracy gradient pay directly in survival.

---

## 7. Progression

**Difficulty arc — accuracy → rhythm → speed:**
- **Phase 1 — Learning.** Slow tempo. Accuracy is the only thing that matters.
  You learn the keys and the finger-lanes.
- **Phase 2 — Rhythm.** Medium tempo. You start hitting the beat. Perfect
  timing becomes a bonus (more spell power, bigger score).
- **Phase 3 — Mastery.** Fast tempo. You need speed *and* accuracy. The rhythm
  game really kicks in.

**Key progression:** home row → top row → bottom row → numbers → symbols. The
lanes never change; the characters in them just grow. A clean learning curve.

**Enemy progression:** archers (learn accuracy) → boss (learn rhythm) →
cavalry (learn speed). Maps to the three phases.

---

## 8. Design Scaffolding — open questions

These are the seams where a full design doc would live. **[OPEN]** throughout.

- **Space key handling** (central space channel — recommended in §3 — vs.
  auto-insert for early levels).
- **Tempo model** (fixed per-spell vs. adaptive; must support
  intra-encounter acceleration for cavalry).
- **Spell content** — how are words generated? Real-word dictionary? Difficulty
  tiers by word length/keys? Procedural or curated? Constraint: early words
  use only learned keys (§7 key progression).
- **Elemental weakness system** — only the aggregation rule is open (a spell's
  element is derived from its letters, §4): majority element, first letter, …
- **Per-character beat grid** — how variable-length words map onto a fixed
  enemy cadence (see §5).
- **Timing windows & latency calibration** — perfect/good/miss thresholds,
  plus an input/audio latency calibration step (mandatory for a rhythm game).
- **Visual design** — lane rendering, hit line, enemy animation, spell effects,
  element color language.
- **Audio** — the "beat" of the enemy's attack; how is it conveyed (SFX, music,
  screen pulse)?

  > **Prototype answer (soundtrack):** three ACE-Step-generated loops (tribal /
  > orchestral / synthwave) at a 90 BPM reference; `playbackRate` tracks the
  > game's bpm, so the music literally runs at the speed of the letters and
  > rides wave/cavalry ramps pitch-intact. The metronome stays as the enemy's
  > heartbeat under the track.
- **Meta-progression** — spellbook, unlockable elements/areas, score/rank,
  replay.
- **Controls & input** — key event handling, input buffering, key-rollover for
  fast typing.
- **Tech stack** — engine/framework, platform (web? desktop?).

---

## Notes

- **Stenography tangent (parked):** a chord-based rhythm game would be a
  *stenography* game, not a typing game — steno machines have a small set of
  keys and you press combinations to represent sounds. The "lanes" would be the
  few steno keys and the "notes" would be chords. Distinct project; interesting
  future idea.
