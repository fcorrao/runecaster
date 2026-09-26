export type Hand = "left" | "right";
export type FingerName = "pinky" | "ring" | "middle" | "index";
export type Element = "fire" | "water" | "earth" | "air";

export interface Finger {
  hand: Hand;
  name: FingerName;
  element: Element;
}

/**
 * 8 lanes, one per finger, thumbs excluded. Lane order mirrors the keyboard:
 * left-hand lanes on the left, right-hand lanes on the right, gap in the
 * middle. Elements = finger positions (DESIGN.md §3):
 * index = fire, middle = water, ring = earth, pinky = air.
 */
export const FINGERS: Finger[] = [
  { hand: "left", name: "pinky", element: "air" },
  { hand: "left", name: "ring", element: "earth" },
  { hand: "left", name: "middle", element: "water" },
  { hand: "left", name: "index", element: "fire" },
  { hand: "right", name: "index", element: "fire" },
  { hand: "right", name: "middle", element: "water" },
  { hand: "right", name: "ring", element: "earth" },
  { hand: "right", name: "pinky", element: "air" },
];

/** QWERTY home row: key -> lane (index into FINGERS). */
export const KEY_FINGER: Record<string, number> = {
  a: 0,
  s: 1,
  d: 2,
  f: 3,
  g: 3,
  h: 4,
  j: 4,
  k: 5,
  l: 6,
  ";": 7,
};

export const ELEMENT_COLORS: Record<Element, string> = {
  fire: "#ff6b3d",
  water: "#4da6ff",
  earth: "#9ccc65",
  air: "#cfe9ff",
};

/** Real words spelled only with home-row keys (a s d f g h j k l). */
export const WORDS: string[] = [
  "dad", "sad", "lad", "fad", "add", "gas", "has", "had",
  "dash", "gash", "lash", "hash", "shag", "gaff", "fall", "hall",
  "ball", "half", "gall", "lass", "glad", "flag", "flash", "flask",
  "shall", "salad", "glass", "alfalfa", "haggis", "shad", "gash",
].filter((w) => [...w].every((c) => c in KEY_FINGER));
