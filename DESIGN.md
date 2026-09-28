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

**Space key — decided (playtest): no space lane.** A typed space took a whole
lane of screen and gave the thumb almost nothing to do. Word breaks are now
**rests**: the space keeps its time slot in the rhythm but has no rune (a small
diamond falls through the gap between the hands, and the connector breaks
between words). The eight finger lanes widened into the freed space, and the
gap between the hands is reserved for the thumb's new job: **cast mode** for
powers (Space opens it, you type the power's name — planned, see §8).

**Finger enforcement:** the game can't detect *which* finger you actually use
(unless you have a per-key-pressure keyboard), so it **guides** rather than
enforces. The lanes teach; you learn by using them.

---

## 4. The Spellcaster Theme

- **Characters are runes.** You type incantations to cast spells.
- **Elements are the lanes.** Fire, water, earth, air — mapped to finger
  positions (see §3).
- **Spells are incantations in an invented tongue.** **Decided (playtest):**
  not real words, but not random letters either — random letter salad read as
  "a jump of random stuff". Spells are phrases in one small invented language:
  a verb (`kai` strike, `sel` bind, `fen` ward, `quo` silence …) plus nouns
  from the encounter's *school* (flame `vor`/`pyr`, storm `zar`/`wyn`, stone
  `dun`/`bry`, tide `gam`/`cyl`, shadow `mox`/`jex`), grown by suffixes
  (`-a` great, `-en` many, `-eth` ancient, `-ium` circle of …). The lexicon
  covers every letter a–z; one school per encounter means words repeat and
  become learnable; a gloss under the word says what you're casting
  ("kai voreth" — strike · ancient flame).
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

> **Prototype implementation:** all three are encounters. Archers space runes
> evenly; cavalry crams one extra rune per bar and raises the tempo 4% every
> spell (reset when the encounter ends); a boss places runes on rhythm
> patterns drawn per bar (off-beat eighths, gaps before the next phrase), hits
> harder (24 vs 18) and has its own school — its roots orbit it on stage.

**Timing model (fixed rhythm for now):**
- **One word per volley.** The enemy attacks once (a volley); you type a whole
  word to counter. The word's characters scroll down in the rhythm. More
  "spell-casting" feel than one-key-per-beat.
- **Per-character beat grid — decided (playtest): the incantation fills
  whole bars.** "Word fits 4 beats" flowed better than one char per beat, but
  cramming long words into one bar was too hard. So a spell spans as many
  4-beat bars as it needs, runes spread evenly across them, with a
  per-chapter cap on runes per bar (5 → 7). The spell always starts on a
  bar-aligned click and the next spell follows after whole beats of rest.
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

> **Prototype implementation (verified):** every ruling is the press error
> `t − r.time` against two constants (±55 ms perfect, ±140 ms good), where
> `t` is the key's event timestamp on the *heard* audio clock
> (`getOutputTimestamp`) minus a per-device input offset. Visuals are drawn on
> the same clock (for the frame's display time), so a rune crosses the line
> exactly when its click is heard.
> - **When to press:** the letter crossing the white line — the tile filling
>   its receptor slot. Dashed gold lines over the tiles mark the perfect window;
>   a tile touching the line at all is inside the good window.
> - **Routing:** a press goes to the nearest pending rune with that character.
>   A different rune inside its window → WRONG; the correct key up to 0.6 s
>   early → EARLY (unjudged, rune stays live); a past-due but not-yet-lapsed
>   rune → MISS on input. Frame lapses wait 50 ms of grace so a queued
>   in-window press is always graded by its own timestamp.
> - **Tempo map:** a tempo change (wave ramp, cavalry, slider) takes effect on
>   the first rune of the next scheduled spell; clicks, the line pulse and the
>   music follow it, so no cue ever disagrees with runes already on screen.
>   Music is started on a click at its measured first beat, scaled so one track
>   beat = one game beat, and looped over whole bars.
> - **Feedback:** every judgment shows its error in ms; a hit-error meter plots
>   the last 20 presses with their average; the run summary reports average
>   offset and spread. Consistent offset → calibrate input; wide spread → the
>   player. Audio delay (±300 ms) and input offset (±150 ms, or set from the
>   last 20 hits) persist per browser.

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

**Key progression — decided (playtest):** all 26 letters and space from the
first spell (home-row-only drills read as random and dull); **numbers join at
chapter 4, symbols at chapter 5**. Within letters, progression is *longer
magic words*, not new keys. The lanes never change.

**Enemy progression:** archers (learn accuracy) → boss (learn rhythm) →
cavalry (learn speed), as encounter types that coexist rather than eras.

> **Prototype run structure (playtest: "waves go on too long; always an
> archer"):** a run is a sequence of **chapters of 3–5 short encounters**,
> each ending in a named boss. Enemy HP is small early (archer 12 = two
> full-power casts, ~15 s) and grows per chapter; a bar of rest separates
> encounters and a banner names the next enemy and its school.
>
> | ch | name | incantations | runes/bar | tempo | encounters |
> |---|---|---|---|---|---|
> | 1 | Apprentice | verb + root ("kai vor") | 5 | start | archer, archer, boss |
> | 2 | Adept | + suffixes ("kai vora") | 5 | +4 | archer, cavalry, boss |
> | 3 | Magus | + ancient suffixes, three words | 6 | +8 | archer, cavalry, archer, boss |
> | 4 | Numerist | + digits ("kai 3 voren") | 6 | +10 | archer, cavalry, boss |
> | 5 | Glyphwright | + symbols ("tor! dunen", "sel dun-bry") | 7 | +12 | archer, cavalry, archer, boss |
> | 6+ | Archmage | four-word invocations | 7 | +16, +4/loop | archer, cavalry, boss, cavalry, boss |
>
> 65% of spells use the chapter's newest templates, the rest earlier ones, so
> difficulty rises without every spell being the hardest.

---

## 8. Design Scaffolding — open questions

These are the seams where a full design doc would live. **[OPEN]** throughout.

- **Tempo model** — prototype: start tempo + a per-chapter offset; cavalry
  accelerates within its encounter via the tempo map (§5).
- **Spell content** — prototype answer: the invented tongue (§4). Open: a
  larger lexicon, per-school verbs, meaning that matters in play.
- **Elemental weakness system** — only the aggregation rule is open (a spell's
  element is derived from its letters, §4): majority element, first letter, …
- **Timing windows & latency calibration** — perfect/good/miss thresholds are
  playable in the prototype (§5); calibration is manual (audio delay + input
  offset, or "set from last 20 hits"). Open: a guided first-run calibration step.
- **Visual design** — lane rendering, hit line, enemy animation, spell effects,
  element color language.

  > **Prototype answer (art direction): retro-wizard synthwave**, set by the
  > key art (`prototype/art/splash.jpg`, also the splash screen). Palette
  > sampled from it: night navy/indigo sky, violet and magenta haze, hot-pink
  > striped sun behind a gothic castle, neon elements (fire orange, water cyan,
  > earth green, air violet — the art's Q/W/E/R rune colors). Runes are glowing
  > element rings with serif glyphs, the hit line a magenta laser, the stage a
  > vista with a perspective-grid floor, and the enemies an undead host
  > (skeleton archer, skeletal knight on a spectral horse, crowned lich).
  > The caster is deliberately off-palette for contrast (playtest: purple
  > blended into the magenta night): teal cloth, gold rune band and belt, a
  > cyan rim light and floor rune circle, a lit face.
- **Audio** — the "beat" of the enemy's attack; how is it conveyed (SFX, music,
  screen pulse)?

  > **Prototype answer (soundtrack):** ACE-Step-generated loops. Tribal drums
  > were cut (didn't fit); synthwave fit, so three darker arcane synthwave
  > tracks were generated and picked from 16 candidates for beat stability.
  > Each track is started on a click at its measured first beat and time-scaled
  > so its beat is the game's beat (resampling, so pitch follows tempo). The
  > metronome stays as the enemy's heartbeat under the track.
- **Powers (sigils) — prototype, playtest pending.** The thumb's job once the
  space lane was cut. Earned: defeating an enemy grants its school's sigil
  (bosses 2); three flawless (all-perfect) spells grant the current school's
  sigil; max 3 charges each. Cast: **Space opens cast mode, you type the
  sigil's name** — a noun of its school + a verb of the tongue, prefix-free so
  it fires on the last letter. A letter that fits no owned name **fizzles**
  (mode closes, charge kept); Space again cancels.

  **Decided (playtest): cast mode slows time.** Typing a name in the gap between
  spells was too tight, worse as the pace rose. Now opening cast mode slows the
  whole rhythm to a fixed crawl (the field creeps at 36 px/s — ~19% speed — at
  any tempo): runes, tempo map, metronome and soundtrack together (the music
  drops in pitch like slowed tape), so everything is still on the beat when the
  ring closes. **Letters are hidden** while it is open, so slow time is not a
  free read-ahead. The runes keep creeping — that distance is the price of a
  cast. Because time is slowed, the ring may open at any moment, even with runes
  in their windows; it closes itself (free) only when a rune reaches the line,
  leaving the late half of that rune's window to hit it.

  | sigil | name | school | effect | animation |
  |---|---|---|---|---|
  | Gale | `wynkai` | storm | runes not yet in their window move one bar later (whole bar: stays on the grid; tempo map + music rates shift with them) | wind streaks up the lanes, runes ease back |
  | Bulwark | `dunfen` | stone | the next strike deals 0 | hex shield before the caster, shatters on the hit |
  | Veil | `moxquo` | shadow | next 6 runes accept any key of the right finger (letter stays faintly visible) | smoke orbits the rune, dashed finger ring |
  | Stillwater | `gamsel` | tide | next 2 spells play at 80% tempo (tempo map) | ripples across the lanes, cyan shimmer on the slowed runes |
  | Kindle | `vorlum` | flame | next spell casts at double power | embers smoulder in the spell hand |

  Every name is always listed in the panel between the hands (dim until
  owned, with charge pips and the flawless meter); cast mode dims the lanes,
  turns a rune ring and glows the typed prefix on the matching name.

  **Teaching the sigils (playtest: "you'd have to memorize them; you can't read
  the unlock message mid-fight").** Explanations move to the moments you can
  read: (1) **the spellbook** — opening cast mode expands the panel into a
  list of every sigil with its name, effect, charges, or where to earn it;
  time is slowed there, so reading is free; (2) **NEW tags** on freshly earned
  sigils until the spellbook has been opened; (3) **live status chips** in the
  left margin while an effect runs ("VEIL · 5 runes · any finger key",
  "BULWARK · next strike blocked") — you learn what a sigil does by watching
  it work. The unlock toast only says "press Space to read it". This is what
  makes adding more sigils viable: none of them has to be memorized up front. Open:
  timed casting (bonus for casting on the click), more sigils, whether
  perfect-heal should give way to charges.
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
