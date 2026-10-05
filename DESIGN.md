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
spells. The characters are glyphs. The lanes are **elements** (fire, water,
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

> **Decided (playtest: "casting runes has been the fun"):** runes are now the
> core loop, not power-ups. Typing the incantation *earns* a rune (a clean
> spell → a rune of its element); you attack, heal and block by **casting
> runes** (Space, type the name). Missed glyphs still let the enemy hit you, and
> every enemy charges a big attack you answer with the ward. See §8 Powers.

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
Each glyph therefore carries a small movement marker relative to that finger's
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
**rests**: the space keeps its time slot in the rhythm but has no glyph (a small
diamond falls through the gap between the hands, and the connector breaks
between words). The eight finger lanes widened into the freed space, and the
gap between the hands is reserved for the thumb's new job: **cast mode** for
powers (Space opens it, you type the power's name — planned, see §8).

**Finger enforcement:** the game can't detect *which* finger you actually use
(unless you have a per-key-pressure keyboard), so it **guides** rather than
enforces. The lanes teach; you learn by using them.

---

## 4. The Spellcaster Theme

- **Naming — decided (playtest):** the falling letters are **glyphs**; the
  things you earn and cast are **runes** (they were "runes" and "sigils" until
  the rune-core rework: a *Runecaster* casts runes, and runes as earned-then-
  spent spell ammo is the familiar reading; "glyph" = one written character,
  already the chapter-5 word, and avoids reusing "sigil" in the opposite sense).
- **Characters are glyphs.** You type incantations to cast spells.
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

**Spell element is derived from its characters.** Each glyph's element is the
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

**Riffs — decided (playtest, under trial): glyphs come in key patterns, not
single letters.** Playtest: one letter per slot at ~1.75 keys/s felt too slow,
and faster was too hard — every glyph was a fresh read (which letter, which
finger, which row). Rhythm games are fast because players read *patterns*
(runs, trills, repeats) and play them as one movement; fluent typing is the
same (motor chunks). So a spell is two bars of **chunks** — repeats (`jjjj`),
trills (`fkfk`), finger rolls (`asdf`, `;lkj`), real words, later numbers and
punctuation — each played on 8ths or 16ths with a breath between. The tempo
stays; the bursts are what's fast (`jjjj` on 16ths at 84 bpm ≈ 5.6 keys/s for
a beat). Tiers open keys row by row — home row only (8 keys, one per finger:
an 8-button game) → g h + home-row words → top row → whole keyboard + numbers
→ punctuation → fast phrases — so no key is excluded, only staged. Each
encounter keeps 4 chunks in rotation (one swapped now and then) so they repeat
and get chunked. Bosses may start chunks on off-beats. The runic-tongue words
stay as a "words" setting for comparison; the tongue itself is no longer a
goal. Not adopted: keys playing the melody / song-battle framing (overdone).
A press goes to the **earliest** in-window glyph of its key, so a late press in
a fast repeat fills the run in order.

**Sigils — decided (playtest): the path is the sigil.** Every riff spell is a
sigil of one rune: its strokes share one shape, and the shape decides the bolt
rune a clean spell earns (replacing majority-lane element in riffs).
- **Pillar → earth** — one key repeated (`jjjj`): a column in one lane.
  **Decided (user): never a run of exactly three k's** (the Klan's initials);
  a `k` pillar is always four long, and every generated spell (riff or
  incantation) is checked and regenerated if one slips through. `kkkk` is fine.
- **Wave → water** — two fingers trading (`fkfk`): a zigzag.
- **Sweep → air** — a roll across neighbouring fingers (`asdf`, `;lkj`): a slash.
- **Burst → fire** — mirrored pairs hand to hand, opening out from the index
  fingers or closing in (`fjdk`, `sldk`; 3 pairs from chapter 5): a flame.
The thread through a sigil's glyphs glows in its rune's color (flares white
when sealed), so the shape — and the rune — reads before the spell lands; the
header names it. Sigils never repeat back to back. From chapter 2 a sigil ends
in a real word, its **inscription** (plain thread, no effect on the rune) — the
transferable typing practice. Strokes are drawn on the rows the tier has open,
numbers included from chapter 4. Each encounter keeps 2 strokes per sigil in
rotation. The icons already matched (✦ ≈ ▲ ≋). **[OPEN]** whether sigil choice
should favour the enemy's weakness; whether the inscription should matter
(e.g. its letters' lanes power the bolt); chunk pool size, 16th rate per tier.

**Enemy structures:**
- **Wave (archers)** — the standard encounter. A line of archers fires volleys
  on a steady beat. Each volley is a beat; you type a spell to counter it.
  Cleanest, most learnable.
- **Boss (single enemy)** — the "song" encounter. One big enemy with a complex
  attack pattern (attack, attack, big attack, pause, repeat). Varied, structured
  rhythm. The progression target.
- **Cavalry** — a speed variant. The charge *accelerates* (the rhythm speeds
  up). Tests speed once accuracy is down.

> **Prototype implementation:** all three are encounters. Archers space glyphs
> evenly; cavalry crams one extra glyph per bar and raises the tempo 4% every
> spell (reset when the encounter ends); a boss places glyphs on rhythm
> patterns drawn per bar (off-beat eighths, gaps before the next phrase), hits
> harder (24 vs 18) and has its own school — its roots orbit it on stage.

**Timing model (fixed rhythm for now):**
- **One word per volley.** The enemy attacks once (a volley); you type a whole
  word to counter. The word's characters scroll down in the rhythm. More
  "spell-casting" feel than one-key-per-beat.
- **Per-character beat grid — decided (playtest): the incantation fills
  whole bars.** "Word fits 4 beats" flowed better than one char per beat, but
  cramming long words into one bar was too hard. So a spell spans as many
  4-beat bars as it needs, glyphs spread evenly across them, with a
  per-chapter cap on glyphs per bar (5 → 7). The spell always starts on a
  bar-aligned click and the next spell follows after whole beats of rest.
- **Per-character grading, per-spell outcome.** Each glyph is graded
  perfect / good / miss as you go; the word casts or fizzles as a whole.

**The hierarchy, driven by "accuracy paramount":**
1. **Correctness before the deadline is the gate.** The spell casts only if
   you type the right characters before each glyph passes the hit line. A
   wrong key, or a glyph that lapses untyped, = full fizzle.
2. **Timing within the window is the amplifier.** Perfect = right character on
   the beat → full-power spell, big combo. Good = right character, off-beat →
   spell casts, reduced power. Timing never *blocks* a cast; it only scales
   it. The deadline, not the beat, is the gate.
3. **Speed is the difficulty knob.** Tempo (scroll speed) increases over time.

> **Prototype implementation (verified):** every ruling is the press error
> `t − r.time` against two constants (±55 ms perfect, ±140 ms good), where
> `t` is the key's event timestamp on the *heard* audio clock
> (`getOutputTimestamp`) minus a per-device input offset. Visuals are drawn on
> the same clock (for the frame's display time), so a glyph crosses the line
> exactly when its click is heard.
> - **When to press:** the letter crossing the white line — the tile filling
>   its receptor slot. Dashed gold lines over the tiles mark the perfect window;
>   a tile touching the line at all is inside the good window.
> - **Routing:** a press goes to the nearest pending glyph with that character.
>   A different glyph inside its window → WRONG; the correct key up to 0.6 s
>   early → EARLY (unjudged, glyph stays live); a past-due but not-yet-lapsed
>   glyph → MISS on input. Frame lapses wait 50 ms of grace so a queued
>   in-window press is always graded by its own timestamp.
> - **Tempo map:** a tempo change (wave ramp, cavalry, slider) takes effect on
>   the first glyph of the next scheduled spell; clicks, the line pulse and the
>   music follow it, so no cue ever disagrees with glyphs already on screen.
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
   consumes that glyph as a miss, and the word continues.
3. **Enemy attack** (the consequence). A fizzle or missed note lets the enemy
   hit you. You have a health bar; attacks drain it.
   **Decided (playtest): health sits under each fighter's feet**, in the side
   margins level with the hit line and keycaps, not at the top corners: the
   eyes live at the hit line, so the top of the screen was never looked at.
   Each panel: name, the gauge with HP in it; the enemy's adds the charge bar
   and a second line, "weak to X" in the element's color.
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
> proportional**. Goods never cost health; each lapsed glyph draws its share of
> the enemy's arrow (full lapse = 18, one of four = 5). A leaky "sloppy timing"
> arrow — punishing tempo while the learner is still accuracy-focused — tested
> hostile and was removed. Perfect-heal (+2 per perfect) was replaced in the
> rune-core rework: accuracy now pays as runes (a clean spell earns one), and
> perfection as the flawless-spell powers (§8); healing is the mend rune.

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
> | ch | name | incantations | glyphs/bar | tempo | encounters |
> |---|---|---|---|---|---|
> | 1 | Apprentice | verb + root ("kai vor") | 5 | start | archer, archer, boss |
> | 2 | Adept | + suffixes ("kai vora") | 5 | +4 | archer, cavalry, boss |
> | 3 | Magus | + ancient suffixes, three words | 6 | +8 | archer, cavalry, archer, boss |
> | 4 | Numerist | + digits ("kai 3 voren") | 6 | +10 | archer, cavalry, boss |
> | 5 | Glyphwright | + symbols ("tor! dunen", "sel dun-bry") | 7 | +12 | archer, cavalry, archer, boss |
> | 6 | Archmage | four-word invocations | 7 | +16 | archer, cavalry, boss, cavalry, boss |
>
> 65% of spells use the chapter's newest templates, the rest earlier ones, so
> difficulty rises without every spell being the hardest.
>
> **Decided (user): after the last boss, an endless Revived boss rush.** Once
> the Shadow Archon falls, the final chapter no longer repeats — the game cycles
> the six bosses forever, each a solo `boss` encounter, each lap a harder
> **Revived** re-fight: `Revived`, then `Re-Revived`, `ReRe-Revived`, … one
> "Re" per full cycle. HP scales with the ever-rising chapter index, tempo climbs
> +3 per cycle, and every revamp uses chapter-6 (hardest) incantations. Each
> revived boss still plays **its own theme** — the display name is the Revived
> string, but the track stays keyed by the boss's real name — and wears a
> **swirling rainbow aura** (a deeper re-live adds a counter-spinning second
> ring), so a revived boss reads at a glance; the escalating name auto-shrinks to
> fit the banner. There is no win condition — the rush only ends when you fall.

---

## 8. Design Scaffolding — open questions

These are the seams where a full design doc would live. **[OPEN]** throughout.

- **Tempo model** — prototype: start tempo + a per-chapter offset; cavalry
  accelerates within its encounter via the tempo map (§5).
- **Spell content** — prototype answer: the invented tongue (§4). Open: a
  larger lexicon, per-school verbs, meaning that matters in play.
- **Elemental weakness system** — prototype: majority element (the lane most
  of a spell's glyphs ride) decides which bolt rune it earns; weaknesses per
  school double bolt damage (§8 Powers).
- **Timing windows & latency calibration** — perfect/good/miss thresholds are
  playable in the prototype (§5); calibration is manual (audio delay + input
  offset, or "set from last 20 hits"). Open: a guided first-run calibration step.
- **Visual design** — lane rendering, hit line, enemy animation, spell effects,
  element color language.

  > **Rune spirit art (decided, user):** one emblem per rune in the splash's
  > style, a spirit inside a magenta neon ring inscribed with gold runes:
  > fire phoenix, water sea-dragon, earth crystal stag, air storm wolf (the
  > splash's four), mend an ember salamander, ward a gold-runed stone tortoise.
  > Generated locally with Qwen-Image 2.1 (mlx-serve, 1024², seed 23, one
  > shared prompt template, phoenix chosen from two seeds), resized to 256²
  > JPEG in `prototype/art/runes/<key>.jpg` (~30 KB each). Until an image
  > loads, the card shows the rune's icon.
  >
  > **Prototype answer (art direction): retro-wizard synthwave**, set by the
  > key art (`prototype/art/splash.jpg`, also the splash screen). Palette
  > sampled from it: night navy/indigo sky, violet and magenta haze, hot-pink
  > striped sun behind a gothic castle, neon elements (fire orange, water cyan,
  > earth green, air violet — the art's Q/W/E/R glyph colors). Glyphs are glowing
  > element rings with serif glyphs, the hit line a magenta laser, the stage a
  > vista with a perspective-grid floor, and the enemies an undead host
  > (skeleton archer, skeletal knight on a spectral horse, crowned lich).
  > The caster is deliberately off-palette for contrast (playtest: purple
  > blended into the magenta night): teal cloth, gold glyph band and belt, a
  > cyan rim light and floor glyph circle, a lit face.
- **Audio** — the "beat" of the enemy's attack; how is it conveyed (SFX, music,
  screen pulse)?

  > **Prototype answer (soundtrack):** one ACE-Step-generated synthwave loop.
  > Tribal drums were cut (didn't fit); darker arcane synthwave variants were
  > generated and tried, but after playtesting the original synthwave stayed the
  > best, so it was the only track (on/off in settings).
  >
  > **Decided (user): a theme per enemy — and a distinct one per named boss.**
  > Supersedes the round-robin over two generic tracks and the single generic
  > boss track (`nightdrive.m4a` and the one `boss.m4a` are both removed). A track
  > key is an enemy **kind** for the rank-and-file (every archer one theme, every
  > cavalry another) or a boss's **name** (`encKey` = `ch.encs[ei] === 'boss' ?
  > ch.boss : enc`), so each of the six bosses has his own theme; `trackFor` falls
  > back to the archer theme for unknown keys. While one plays, the *next
  > encounter's* theme is prefetched; a new enemy's track crossfades in on a click
  > about a beat later, the old one holds if the new isn't decoded yet, and if the
  > spellbook is open (time stopped) it starts on the grid when it closes.
  > Per-boss *mechanics* (not just music) is deferred to a later discussion.
  >
  > All eight are ACE-Step 1.5 synthwave in the splash's house style,
  > character-tuned, loudness-matched to **−14 LUFS** (the sparse Counting Wraith
  > peaks-limits to −16 to keep its transients clean), 96 kbps AAC, 3 ms seam
  > fades baked in. bpm/off/bars is a least-squares fit through kick onsets on the
  > *encoded* file (browser-verified within ~1 ms); a generated song is 60 s with
  > an intro pickup and an outro, so the bake trims to [first kick, last whole
  > bar] so the loop jumps groove→groove (an untrimmed song-end→song-start reads
  > 60–90 dB = dead air; a good loop ~1–3 dB). `loopEnd` is clamped to the decoded
  > buffer length (AAC framing can land the computed seam 1 ms past the end). Each
  > was chosen from 3–12 seeds by the steadiest beat and cleanest seam.
  > **Archer** = the playtested `synthwave.m4a` (101.964 / 0.194 / 25). **Cavalry**:
  > galloping chase (108 BPM) → 107.997 / 0.0793 / 24. **Bosses** — *Stone Warden*:
  > slow grinding tectonic stomp (96) → 96.028 / 0.3539 / 22; *Storm Hierophant*:
  > fast electric crackle, racing arps (112) → 109.996 / 0.0467 / 24; *Tide Lich*:
  > cold liquid ebb/flow swells (94) → 94.078 / 0.5759 / 21; *Counting Wraith*:
  > glassy clockwork tick, hollow (105) → 105.001 / 0.0967 / 24; *Glyph Tyrant*:
  > burning fierce lead, war drums (110) → 110.002 / 0.051 / 24; *Shadow Archon*
  > (finale): epic choral apocalyptic dread (92) → 92.044 / 0.4642 / 21.
  > ~0.64–0.68 MB per theme.

  > **Prototype answer (sound effects):** ACE-Step can't make one-shots (every
  > request returns 60 s of music, whatever the duration asked), so foley comes
  > from **MiniMax-H3**, a video model that generates a synchronized soundtrack:
  > each sound is prompted as a filmed event ("a skeleton archer releases an
  > arrow, bowstring twang…"), two candidates per sound, and the audio track is
  > cut to a one-shot automatically (onset → −40 dB tail, click-free fades,
  > loudness-normalized), choosing the candidate whose energy is most
  > concentrated in one event. Sampled: spell casts per element, bolt impact,
  > enemy strike loosed, hit taken, shield block, enemy defeated, rune earned,
  > time resuming, fizzle, rune cast, chapter horn, game over. Playtest
  > fixes: the earth cast was re-prompted as an earthquake rumble (the first
  > take sounded like the fizzle); the impact is cut to its 0.28 s crack; enemy
  > defeat is synthesized instead (a low pitch-dropping boom with a brief
  > C-major shimmer — "triumphant, not overdone"), since generated takes stayed
  > crackly; time slowing stays synthesized (the sample didn't read as
  > slowing).
  > Timing-critical sounds stay synthesized (glyph hits, wrong key, name ticks,
  > the metronome) — they must be instant and sample-accurate.
  > Each track is started on a click at its measured first beat and time-scaled
  > so its beat is the game's beat (resampling, so pitch follows tempo). The
  > metronome stays as the enemy's heartbeat under the track.
- **Powers (runes) — the core loop (playtest rework).** The thumb's job once
  the space lane was cut, and after playtesting the part that was fun — so
  runes became *how you fight*. **Typing no longer attacks.**

  | source | what you get |
  |---|---|
  | clean spell (no glyph missed) | +1 rune of the spell's element — the lane most of its glyphs ride |
  | one missed glyph, **lenient mode only** | +1 **cracked** rune of that element (see below); strict mode: nothing |
  | flawless spell (every glyph perfect) | its school's power fires at once, no cast (below) |
  | enemy defeated | +1 mend rune (boss +2) — still has to be cast |
  | a missed glyph | its share of the enemy's strike — the ward doesn't stop it |
  | enemy defeated under par | **SWIFT** score (§10 bound): see below |

  **Decided (mechanics review R4): cracked runes in lenient mode.** All-or-
  nothing sealing gave an 88% typist a rune on ~22% of spells, so learners
  rarely met bolts and lived on the ward. In lenient mode a spell with exactly
  one missed glyph (of two or more) still seals its rune, **cracked**: its bolt
  casts at power ×0.5 (after the speed power; weakness etc. still stack) and
  the spell never wakes a boon (it isn't flawless). The miss still draws its
  strike. The seal ring flares dim; the panel draws a cracked charge as a
  hollow pip, the spellbook says "2 (1 cracked)". A rune holding both spends
  its **cracked charges first**, so the clean ones keep full value for the big
  moments (empowered, Kindle, a lethal burst). Cracked charges count toward
  the cap of 3. Strict mode is unchanged (any miss fizzles the spell).

  **Decided (playtest): a fizzle ends the sigil at once.** Strict mode used to
  leave the spell's un-played glyphs falling as unhittable ghosts (the lapse
  loop skips a done spell), so after a fizzle you just watched them scroll past
  with nothing to do. Now `fizzle()` clears the spell on the spot: its sigil
  thread and rest diamonds are dropped from the draw and every still-pending
  glyph shatters through the existing crimson judgment ring, so the field is
  empty at once. The counter-arrow, the combo reset and the FIZZLE chip are
  unchanged; the *next* spell still lands on its scheduled beat, so the beat-
  locked tempo map and the charge timers never desync.

  **Decided (mechanics review R2): kill speed scores — the swift kill.** Score
  was glyphs only, so a fight without bolts (ward + counters) lasted ~1.6–2.2×
  longer and paid 1.8–2.5× more: the board paid you not to cast. Now each kill
  has a **par** = the spells a ward-only fight takes,
  `ceil(ceil(maxHP / 12) × chargeBeats / 10)` (ch1 archer 3, ch1 boss 5, ch6
  boss 8); a kill in fewer resolved spells (fizzled ones count) pays
  `(par − spells) × 1200 × the current combo multiplier` — each spell you
  didn't need pays like a perfect 12-glyph spell, cancelling the stall premium.
  Popup "SWIFT ×2 · +4,800". The run reports `swift` (spells saved in all).
  Speed still runs through accuracy: bolts come only from sealed spells.

  Cast: **Space opens cast mode, you type the rune's name** — a noun of the
  tongue + a verb (`kai` strike, `hal` mend, `fen` ward), prefix-free so it
  fires on the last letter; its meaning is shown under it in parentheses —
  `vorkai` *(flame strike)* — so nothing has to be memorized (playtest). A
  letter that fits no owned name **fizzles** (mode
  closes, charge kept); Space again cancels. Max 3 charges each.
  **Decided (playtest): fizzling has a cost.** Two fizzles in a row
  **backfire** — 12 damage to the caster (straight to HP; the ward doesn't
  stop your own magic). A successful cast clears the streak; cancelling or the
  ring closing itself neither counts nor clears. The first fizzle warns
  "fizzle again and it backfires".

  | rune | name | effect |
  |---|---|---|
  | Fire / Water / Earth / Air | `vorkai` `gamkai` `brykai` `wynkai` | bolt, 6 damage; ×2 against the enemy's weakness |
  | Mend | `pyrhal` | +30 HP |
  | Ward | `dunfen` | innate (∞): holds 5 s and answers the **charged attack only** — it is **countered** (12 damage back) and the counter opens your empowered window (riposte) |

  **Decided (mechanics review R1): the ward answers the charge only.** It used
  to block every strike while it held, so a ward erased typing mistakes
  ("-0 · WARDED") and chaining it made a learner immune (sim: 0.7 HP per
  encounter). Now ordinary strikes — your missed glyphs — land, ward or not:
  accuracy keeps its cost. `WARD_S` stays 5 s; it only has to cover the
  countdown.

  **Elemental weakness (§4) is live:** each school is weak to one element
  (flame→water, storm→earth, stone→air, tide→fire, shadow→fire), shown on the
  enemy's health bar, in its banner, and as ×2 on the rune. Which element you
  earn depends on the incantation's letters, so saving the right bolt is the
  choice.

  **Charged attacks.** Every enemy fills a charge over its beats (archer 24,
  cavalry 20, boss 16; dealing 30 / 30 / 40), starting with its first spell. A
  ring over its head and a thin bar under its health fill; the last bar (4
  beats) turns red, counts down, growls on each beat and prompts `ward:
  dunfen`. The charge lives on the rhythm timeline, so cast mode stops it with
  everything else. The ward is innate rather than earned so the charged attack
  is always answerable: the skill is reading the telegraph and casting in time
  (**decided, playtest: the ward lasts 5 s** — one bar plus the attack's flight
  was too tight; 5 s spans the whole on-screen countdown, so casting at any
  point of it holds).

  **Decided (playtest): the countdown must reach you while you watch the
  glyphs.** Your eyes are on the hit line, so the warning comes there and to
  the periphery: a **doom pulse** each countdown beat (detuned saw stack through
  a closing low-pass, a step higher each beat, the first doubled), the **hit
  line turns red** and beats with it, and the **enemy's screen edge flashes
  red** on each beat (until you ward).

  **Empowered window — the caster's mirror of the charge.** A ring over the
  caster fills on a **timer** (20 beats, from the first spell; decided in
  playtest over filling it with hit glyphs — a true mirror of the enemy's).
  Full, a bright rising chime plays and a **5 s window** opens: cyan aura, the
  seconds counting down over his head, "cast a bolt!", and the caster's screen
  edge glowing cyan. Every bolt cast in it hits **×2** (stacks with weakness and
  Kindle); its "cast a bolt!" prompt goes dim when you hold no bolt. When it
  closes the next charge starts.

  **Decided (mechanics review R3): the riposte.** A countered charge opens the
  empowered window at once (if it isn't open already); the counter stays 12
  (the sim showed halving it crushes learners). This is a **counter trigger,
  not a glyph trigger**: the ring still fills on its 20-beat timer otherwise,
  as decided above. It joins the two verbs — ward the charge, then burst the
  bolts you held back. Gale (below) also adds a bar to the ring. Both the charge and the
  window live on the rhythm timeline (cast mode stops them).

  **Flawless powers** — the old castable runes, now triggered directly by an
  all-perfect spell of that school:

  | power | school | effect |
  |---|---|---|
  | Gale | storm | glyphs not yet in their window, and the enemy's charge, move one bar later; your ring gains one bar (4 beats) — none while the window is already open |
  | Bulwark | stone | the next counter deals ×2 (24) |
  | Veil | shadow | the next bolt counts as the enemy's weakness (×2); spent by the next bolt, weak or not |
  | Stillwater | tide | the next mend heals ×2 |
  | Kindle | flame | next bolt ×2 (stacks with weakness) |

  **Decided (mechanics review R6): boons pay the player who earns them.**
  Boons need a flawless spell (~0.3% of a competent player's spells, ~18% of an
  expert's), but Bulwark blocked a miss experts rarely make, Stillwater slowed
  a player who didn't need it, Gale delayed the counter, and Veil let wrong keys
  through — relaxing the very skill being trained. Now each pays in the fight's
  own currency (counter, weakness, mend, ring); names and school flavour kept.
  Veil's motor-coaching idea is dropped (give it to learners another way if it
  is missed, not as a perfection reward).

  **Decided (mechanics review R5): lethal preview.** "Can I finish it before
  the charge?" is a real decision but was invisible. The enemy's health bar
  shows a pale **ghost** for what your held bolts would deal now at power 1.0
  (weakness ×2, Veil on the best non-weak bolt, Kindle on the best bolt,
  empowered ×2, cracked ×0.5), and during the charge countdown a **gold notch**
  for the counter (×2 with Bulwark); **LETHAL** lights on the bar when the two
  reach its HP. Draw-only; it assumes the best cast order.

  **Decided (playtest): cast mode slows time.** Typing a name in the gap between
  spells was too tight, worse as the pace rose. Now opening cast mode slows the
  whole rhythm to a fixed crawl (the field creeps at 36 px/s — ~19% speed — at
  any tempo): glyphs, tempo map, metronome and soundtrack together (the music
  drops in pitch like slowed tape), so everything is still on the beat when the
  ring closes. **Letters are hidden** while it is open, so slow time is not a
  free read-ahead. The glyphs keep creeping — that distance is the price of a
  cast. Because time is slowed, the ring may open at any moment, even with glyphs
  in their windows; it closes itself (free) only when a glyph reaches the line,
  leaving the late half of that glyph's window to hit it.

  **Decided (playtest, riffs): cast mode stops time, and resumes with a
  count-in.** At riff pace even the crawl was too much to manage. Now the
  rhythm stands still while the spellbook is open — glyphs, clicks, music
  (tape-stop), the enemy's charge, your ward and empowered windows. Letters
  stay hidden, so a stop is no free look. The price of a cast moves from
  "glyphs creep" to "you lose the groove", so closing **counts you back in**:
  if the next glyph is closer than **2 beats** it slips back by whole beats
  (music and clicks keep their phase), and a big beat count ("2 · 1 · ready")
  sits over the hit line until it arrives. Opening is still refused while a
  glyph is on the line. Count-in length **[OPEN]**.

  **Decided (playtest): the stop is short, and speed is power.** An endless
  stop killed the tension, so cast mode stays open only a few real seconds —
  **6 s in chapter 1, 0.5 s less per chapter, 3.5 s from chapter 6** — shown as
  an arc around the cast ring draining gold → orange → red (pulsing near the
  end). Empty, the cast **fizzles** (counts toward backfire). The time left
  when the name completes is the rune's **power**: ×1.5 instantly down to ×0.5
  at the buzzer, linear, in tenths; it scales bolt damage (before weakness,
  Kindle, empowered) and mend HP, shown live under the ring ("power ×1.3") and
  on the cast. The ward has no power — it just has to land. Chosen over a
  golf-swing release meter (Enter on a pulse): speed rewards the typing skill
  itself and adds no step. **[OPEN]** curve and limits — reading the spellbook
  early eats the bar.

  **Decided (playtest): both charges are tracked by ear.** Watching glyphs,
  you can't watch two gauges, so every stage of both is a sound, on the beat,
  and **panned to its fighter** (enemy right, caster left), dark vs bright:
  - **Enemy charge:** a soft low thrum on every bar of the fill, rising with it,
    up to the countdown's doom pulses (unchanged), then the loose.
  - **Caster charge:** a bell on every bar of the fill, rising; a sparkle each
    beat of the last bar (4 → 1, rising — the mirror of the doom countdown);
    the window's chime; a soft high tick each beat the window stays open; a
    falling arpeggio when it closes.
  All synthesized (beat-locked, controllable). **[OPEN]** whether the two
  sets clash when the charges line up (they start together each encounter).

  **Teaching the runes (playtest: "you'd have to memorize them; you can't read
  the unlock message mid-fight").** Explanations move to the moments you can
  read: (1) **the spellbook** — opening cast mode expands the panel into a
  card for every rune with its name, effect, charges, or where to earn it, and
  which bolt the enemy is weak to; time stands still there, so reading is free.
  **Decided (user): the spellbook takes the whole lane field** (the glyphs are
  veiled while casting anyway): six cards, bolts down the left (fire, water,
  earth), air, mend and ward down the right, the typing ring between them.
  Each card: the rune's spirit art, name (the typed prefix glows), label,
  gloss, charges (cracked pips hollow), NEW / ×2 WEAK, effect, how to earn it.
  A matching card lights in its colour; the others dim. Opening it also clears
  the earned-rune toast and stray popups, which used to sit over it;
  **The rune panel (outside cast mode; decided, user)** fills the gap between
  the hands from the top of the field to just above the hit line: per rune one
  centred column (playtest: art off-centre over centred text looked off) — its
  spirit art, the charges as a row of pips under it (∞ for the ward), the name
  in 15 px; NEW / ×2 as a chip on the art's corner; unowned runes
  dimmed. It is drawn under the spells, so sigil threads and rest diamonds
  crossing the gap stay on top. Floating popups got a dark pill so they read
  over it;
  (2) **NEW tags** on freshly earned runes (and the ward, from the start)
  until the spellbook has been opened; only the first of each rune gets a
  toast; (3) **live status chips** in the left margin while an effect runs
  ("WARD · 3 s · counters a charge", "VEIL · next bolt hits the weakness").
  **[OPEN]** after playtest: whether flawless powers fire too often at high
  skill (every all-perfect spell), timed casting, bolt damage vs enemy HP; the
  mechanics review's playtest questions — do players read a miss inside a ward
  as their mistake (or need a "ward: charge only" chip), cast bolts in an
  encounter's first spell (swift), hold bolts back for the riposte, burst on
  LETHAL instead of warding, read "cracked" as "type it clean", and notice
  the retuned boons. Nerfing the counter only after cracked runes land, and
  only in strict mode if at all.
- **Meta-progression** — spellbook, unlockable elements/areas, score/rank,
  replay.
- **Controls & input** — key event handling, input buffering, key-rollover for
  fast typing.
- **Tech stack** — engine/framework, platform (web? desktop?).

---

## 9. How to Play

**Decided (playtest): a narrated demo, not a tutorial level.** The splash has
a **HOW TO PLAY** button under CLICK TO BEGIN. It runs the real game on
chapter 1 riffs (whatever the settings), played by an autoplayer, while a
caption where the error meter sits explains one idea at a time (~85 s):
1. glyphs, lanes, the beat · 2. sigils and their shapes (names the live one) ·
3. a clean sigil seals a rune · 4. a deliberate miss lets the arrow through
and seals a cracked rune (the lesson waits for its sigil to resolve) ·
5. Space stops time, the spellbook, speed = power, weakness ×2 (casts the
weak bolt) · 6. the count-in · 7. the charged attack, answered with the ward
and its counter, whose riposte opens the empowered window · 8. that window
(or, if it isn't open, the ring filling) and an empowered ×2 bolt ·
9. a flawless spell wakes the school's boon · 10. a kill earns mend (and,
under par, SWIFT — large in the demo, whose enemy has 80 HP) ·
11. wrap-up, back to the splash.
Each lesson waits until its event has actually happened on screen; the two
charges are held until their lessons. The enemy has 80 HP so the lesson
survives. Not interactive (the user's call), but **paced by you (playtest:
"a little fast")**: when a lesson has shown its idea the rhythm stops, as in
cast mode, and a pulsing **NEXT ▸** waits for Enter / Space / → / a click;
the next lesson starts with the count-in. The last says FINISH and returns to
the title. Esc leaves at any time. **Next is always live** (a dim SKIP while
a lesson plays — it closes any cast the demo is typing); it is a large button
beside the caption, not inside it (playtest: it covered long lines). **Target ~5 s per
lesson** (playtest: lesson 4 ran far too long): measured 4–5 s for most; the
seal lesson ~7–8 s (it waits for a sigil to finish) and the charged attack
~7.5 s (the countdown plus the ward cast); ~55 s in all. The flawless lesson
takes a demo's licence — the spell already under way is regraded perfect —
so its boon comes with that spell instead of the next.
Every effect and sound is the game's own, so the demo stays true as the game
changes.

**Decided (playtest): a start cinematic, then the grid takes over.** The first
click on the title runs a short (~4 s) intro on the AudioContext clock before
the beat grid owns time. The caster steps in (a low fifth swells up), then the
four elemental sigils forge in across the stage left-to-right — burst, wave,
pillar, sweep — each on a metal anvil strike panned to its own position. The
chapter-1 banner and horn are held back and fire exactly at the handoff, so
"CHAPTER 1" reads as the grid taking over rather than the first thing you see.
While it plays there are no clicks and no glyphs (the grid is built but begins
at the handoff, `startRun(at)`); the first enemy walks in as chapter 1 opens.
Retrying after a game over skips the cinematic and starts at once — you have
already seen it. **[OPEN]** whether a click or key should be able to skip it
(it cannot today, so every fresh start waits out the ~4 s).

## 10. High Scores, Memory & Hosting

**Decided (user): Cloudflare Workers + D1** (D1 is SQLite), after a local
SQLite prototype (`server.py`, removed). The game stays static; one Worker
serves the score API. **Live at https://runecaster.net** (registered at
Cloudflare; the Worker is the apex's custom domain; workers.dev and preview
URLs are off). Free tier is ample: static files and their bandwidth are free
(20,000 files, 25 MiB each); D1 500 MB, 100k writes and 5M rows read a day.
- **Layout:** `wrangler.jsonc` (assets = `prototype/`, only `/api/*` runs the
  Worker), `worker/index.js` (the API), `migrations/` (D1 schema: `runs`, with
  indexes on score and on player so the board and rank never scan the table).
- **Local:** `npm install`, then `npm run dev` (applies migrations to a local
  D1 in `.wrangler/`, serves http://127.0.0.1:8777/).
- **Deploy:** once: `npx wrangler login`, `npx wrangler d1 create runecaster`
  (put its `database_id` in `wrangler.jsonc`). Then `npm run deploy` (remote
  migrations, then the Worker and assets). D1 `runecaster` lives in ENAM.
- **API:** `GET /api/scores?limit=10` (board; never returns player ids),
  `GET /api/me?player=ID` (memory), `POST /api/scores` → `{id, rank}`.
- **Board:** top 10 by score — rank, name, score, chapter, accuracy
  ((perfect+good)/judged). On the title screen (HIGH SCORES) and on the game
  over screen, with the run just recorded lit.
- **Recording:** at game over you type your name (it's a typing game); Enter
  records the run and shows its rank. Clicking to retry records it too.
- **Memory is per browser:** a random player id in localStorage
  (`runecaster.player`, beside the calibration) keys it. The last name used
  prefills the entry; the title screen says "welcome back, NAME · best N · R
  runs recorded". Clearing site data starts a new player.
- **Anti-cheat (basic; scores are client-reported):** a run must fit the
  scoring rule (100·perfect + 50·good ≤ score ≤ 4× that + 4 × 1200 ×
  swift; swift ≤ 10 × (cleared + 1); max combo ≤
  perfect + good; sane ranges and name characters); 5 posts a minute per IP
  (Workers rate-limit binding, no IPs stored); one run per player per 10 s.
  Rejections show their reason on the game over screen. Forging a plausible
  run is still possible: the next step would be replaying a submitted key log
  server-side (needs a seeded RNG).
- When the API is unreachable (file://, a plain static server, D1's daily cap)
  the board says "high scores are offline" and nothing is recorded.
**[OPEN]** per-player stats beyond best score (accuracy trend, weakest keys —
the data for adaptive patterns); whether the demo or abandoned runs count.

## 11. Workflow & Deploys

**Decided (user): a light pipeline.** `master` is protected: changes land
through pull requests from feature branches (`feat/…`, `fix/…`, `ci/…`), no
direct or force pushes. GitHub Actions:
- **ci** (`.github/workflows/ci.yml`, every PR to master; required to merge):
  `npm run check` (syntax of the game's inline script and the Worker) and
  `wrangler deploy --dry-run` (bundles the Worker, validates the config).
- **deploy** (`.github/workflows/deploy.yml`, every push to master = every
  merge; also runnable by hand): the check again, then `npm run deploy`
  (remote D1 migrations, then the Worker and assets) to runecaster.net.
  Needs the repo secret `CLOUDFLARE_API_TOKEN` (Cloudflare token from the
  "Edit Cloudflare Workers" template plus Account → D1 → Edit); the account id
  is in `wrangler.jsonc`.
Manual `npm run deploy` still works for emergencies.

## Notes

- **Stenography tangent (parked):** a chord-based rhythm game would be a
  *stenography* game, not a typing game — steno machines have a small set of
  keys and you press combinations to represent sounds. The "lanes" would be the
  few steno keys and the "notes" would be chords. Distinct project; interesting
  future idea.
