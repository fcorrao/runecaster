# Boss curses — design

Decided with the user, 2026-10-17. **Built** on `feat/boss-curses`. Each of the six chapter bosses gets one
unique power: a **timed curse on the glyphs**. Attirus wields all six.

## Rules

- **Trigger: HP thresholds.** A chapter boss casts its curse when its HP falls
  past **2/3** and again past **1/3**. Every player sees it, at dramatic moments.
- **Warning.** The instant a threshold is crossed: the boss nameplate pops with
  the curse's name and a one-line hint, and the boss-side screen edge tints in
  the boss's color.
- **Duration: the next N spells generated** (2 for chapter bosses). Spells
  already falling are untouched, so a curse starts and ends on spell
  boundaries with a full bar of warning. A small marker shows cursed spells
  remaining.
- **Scoring: normal rules only.** Misses hurt, clean spells earn runes; no
  bonus for beating a curse.
- **Revived bosses** (Boss Rush): same thresholds, curse lasts **3 spells**.

## The six curses

| Boss | Curse | Effect | Where |
|---|---|---|---|
| Stone Warden | **Landslide** | Glyphs fall like boulders: slow at the top, accelerating hard into the line. Timing unchanged; only the fall curve. | draw |
| Storm Hierophant | **Lightning** | Glyphs are dark, visible only in a lightning flash on each beat: read in glimpses, remember. | draw |
| Tide Lich | **Rising Tide** | Water rises from the hit line and hides the bottom third of the lanes: type the last stretch from memory. | draw |
| Counting Wraith | **Tally** | Some glyphs carry a count (`3×k`): press that key that many times in a quick burst. | generate |
| Glyph Tyrant | **Tyranny** | Some glyphs become the Shift symbol of a number-row/punctuation key on the same finger (`4`→`$`, `;`→`:`): Shift with the other hand. | generate |
| Shadow Archon | **Mirror** | Glyphs fall in the mirrored lane on the other hand's side (an `f` falls in the R-index lane) but you still press the key shown: read letters, not lanes. The next-lane highlight mirrors too. | draw |

All six act on glyphs, so they work in both riffs and words modes.

## Attirus

On top of rising again and life drain, Attirus casts **all six curses in
order**, at **3/4, 1/2 and 1/4 HP of each life**: first life Landslide,
Lightning, Rising Tide; after he rises, Tally, Tyranny, Mirror. 2 spells each.
His nameplate names the servant whose power he wields. His risen life is a
fresh bar (40% of his HP as its max), so its three marks are 3/4, 1/2, 1/4 of that.

## Build

- Boss entries get `curse: '<id>'`; a `CURSES` table holds name, hint, effect.
- Enemy state tracks its threshold list and how many curses it has cast.
  `applyImpact` checks for a crossed threshold → warn now, then `makeSpell`
  tags the next N spells with the curse id (`sp.curse`).
- Draw-time curses read `sp.curse` when placing/painting glyphs; generate-time
  curses transform the spell's glyphs as it's built (Tyranny reuses the
  existing Shift-hand hint).
- Dev mode (`?dev`) gains a **force curse** picker to fire any curse at once.

## Testing

`npm run check` (parse only), then each curse in the browser through dev mode
with screenshots, and one full Attirus fight through all six.
