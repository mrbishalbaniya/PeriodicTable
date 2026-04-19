/**
 * Molecule lookup dictionary for the Sandbox mode.
 * Keys are canonical formulas (sorted symbol+count), values contain
 * 3D coordinates for ball-and-stick rendering.
 */

export interface MoleculeAtom {
  element: string; // symbol
  position: [number, number, number];
}

export interface MoleculeBond {
  from: number; // index into atoms[]
  to: number;
}

export interface VSEPRData {
  centralAtomIndex: number;
  stericNumber: number;
  lonePairs: number;
  geometry: string;
  bondAngles: number[];
  hybridization: string;
}

export interface Molecule {
  name: string;
  formula: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
  vsepr?: VSEPRData;
}

/**
 * Standard CPK coloring by element symbol.
 */
export const CPK_COLORS: Record<string, string> = {
  H: "#ffffff",
  C: "#333333",
  N: "#3050f8",
  O: "#ff0d0d",
  S: "#ffff30",
  Cl: "#1ff01f",
  F: "#90e050",
  P: "#ff8000",
  Br: "#a62929",
  I: "#940094",
};

/**
 * Atom radii for ball-and-stick model.
 */
export const ATOM_RADII: Record<string, number> = {
  H: 0.3,
  C: 0.45,
  N: 0.42,
  O: 0.4,
  S: 0.5,
  Cl: 0.48,
  F: 0.38,
  P: 0.5,
};

const DEFAULT_RADIUS = 0.4;
export function getAtomRadius(symbol: string): number {
  return ATOM_RADII[symbol] ?? DEFAULT_RADIUS;
}

export function getAtomColor(symbol: string): string {
  return CPK_COLORS[symbol] ?? "#aaaaaa";
}

/**
 * Molecule database keyed by canonical formula.
 * Canonical key = sorted "Symbol+Count" segments, e.g., "H2O1" or "C1H4".
 */
const MOLECULE_DB: Record<string, Molecule> = {
  // Water — H₂O (bent, ~104.5°)
  "H2O1": {
    name: "Water",
    formula: "H₂O",
    atoms: [
      { element: "O", position: [0, 0, 0] },
      { element: "H", position: [-0.95, 0.55, 0] },
      { element: "H", position: [0.95, 0.55, 0] },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
    ],
    vsepr: {
      centralAtomIndex: 0,
      stericNumber: 4,
      lonePairs: 2,
      geometry: "Bent",
      bondAngles: [104.5],
      hybridization: "sp³",
    },
  },

  // Carbon Dioxide — CO₂ (linear)
  "C1O2": {
    name: "Carbon Dioxide",
    formula: "CO₂",
    atoms: [
      { element: "C", position: [0, 0, 0] },
      { element: "O", position: [-1.2, 0, 0] },
      { element: "O", position: [1.2, 0, 0] },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
    ],
    vsepr: {
      centralAtomIndex: 0,
      stericNumber: 2,
      lonePairs: 0,
      geometry: "Linear",
      bondAngles: [180],
      hybridization: "sp",
    },
  },

  // Oxygen gas — O₂
  "O2": {
    name: "Oxygen",
    formula: "O₂",
    atoms: [
      { element: "O", position: [-0.6, 0, 0] },
      { element: "O", position: [0.6, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1 }],
    vsepr: {
      centralAtomIndex: 0,
      stericNumber: 2,
      lonePairs: 2,
      geometry: "Linear",
      bondAngles: [180],
      hybridization: "sp²",
    },
  },

  // Nitrogen gas — N₂
  "N2": {
    name: "Nitrogen",
    formula: "N₂",
    atoms: [
      { element: "N", position: [-0.55, 0, 0] },
      { element: "N", position: [0.55, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1 }],
    vsepr: {
      centralAtomIndex: 0,
      stericNumber: 2,
      lonePairs: 1,
      geometry: "Linear",
      bondAngles: [180],
      hybridization: "sp",
    },
  },

  // Methane — CH₄ (tetrahedral)
  "C1H4": {
    name: "Methane",
    formula: "CH₄",
    atoms: [
      { element: "C", position: [0, 0, 0] },
      { element: "H", position: [0.63, 0.63, 0.63] },
      { element: "H", position: [-0.63, -0.63, 0.63] },
      { element: "H", position: [-0.63, 0.63, -0.63] },
      { element: "H", position: [0.63, -0.63, -0.63] },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
    ],
    vsepr: {
      centralAtomIndex: 0,
      stericNumber: 4,
      lonePairs: 0,
      geometry: "Tetrahedral",
      bondAngles: [109.5],
      hybridization: "sp³",
    },
  },

  // Ammonia — NH₃ (trigonal pyramidal)
  "H3N1": {
    name: "Ammonia",
    formula: "NH₃",
    atoms: [
      { element: "N", position: [0, 0.2, 0] },
      { element: "H", position: [0.94, -0.33, 0] },
      { element: "H", position: [-0.47, -0.33, 0.82] },
      { element: "H", position: [-0.47, -0.33, -0.82] },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
    ],
    vsepr: {
      centralAtomIndex: 0,
      stericNumber: 4,
      lonePairs: 1,
      geometry: "Trigonal Pyramidal",
      bondAngles: [107],
      hybridization: "sp³",
    },
  },

  // Hydrogen Chloride — HCl
  "Cl1H1": {
    name: "Hydrogen Chloride",
    formula: "HCl",
    atoms: [
      { element: "H", position: [-0.65, 0, 0] },
      { element: "Cl", position: [0.65, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1 }],
    vsepr: {
      centralAtomIndex: 1,
      stericNumber: 4,
      lonePairs: 3,
      geometry: "Linear",
      bondAngles: [180],
      hybridization: "sp³",
    },
  },

  // Hydrogen gas — H₂
  "H2": {
    name: "Hydrogen",
    formula: "H₂",
    atoms: [
      { element: "H", position: [-0.37, 0, 0] },
      { element: "H", position: [0.37, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1 }],
  },

  // Hydrogen Sulfide — H₂S
  "H2S1": {
    name: "Hydrogen Sulfide",
    formula: "H₂S",
    atoms: [
      { element: "S", position: [0, 0, 0] },
      { element: "H", position: [-0.96, 0.55, 0] },
      { element: "H", position: [0.96, 0.55, 0] },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
    ],
    vsepr: {
      centralAtomIndex: 0,
      stericNumber: 4,
      lonePairs: 2,
      geometry: "Bent",
      bondAngles: [92],
      hybridization: "sp³",
    },
  },

  // Carbon Monoxide — CO
  "C1O1": {
    name: "Carbon Monoxide",
    formula: "CO",
    atoms: [
      { element: "C", position: [-0.56, 0, 0] },
      { element: "O", position: [0.56, 0, 0] },
    ],
    bonds: [{ from: 0, to: 1 }],
    vsepr: {
      centralAtomIndex: 0,
      stericNumber: 2,
      lonePairs: 1,
      geometry: "Linear",
      bondAngles: [180],
      hybridization: "sp",
    },
  },
};

/**
 * Given an array of element symbols from the workbench,
 * generate a canonical key and look up a molecule.
 */
export function lookupMolecule(symbols: string[]): Molecule | null {
  const key = buildCanonicalKey(symbols);
  return MOLECULE_DB[key] ?? null;
}

function buildCanonicalKey(symbols: string[]): string {
  const counts: Record<string, number> = {};
  for (const s of symbols) {
    counts[s] = (counts[s] || 0) + 1;
  }
  // Sort by symbol name, then build "Symbol+Count" segments
  return Object.keys(counts)
    .sort()
    .map((sym) => (counts[sym] === 1 ? `${sym}1` : `${sym}${counts[sym]}`))
    .join("");
}
