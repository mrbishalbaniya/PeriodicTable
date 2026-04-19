/**
 * Quantum mechanics utility functions for atomic orbitals.
 */

export const SUBSHELL_MAP: Record<number, string> = {
  0: "s",
  1: "p",
  2: "d",
  3: "f",
  4: "g",
  5: "h",
};

/**
 * Returns the standard chemical notation for an orbital.
 * Example: n=2, l=1, m=0 -> "2p"
 * For m=0, ±1, etc., standard spatial labels like x, y, z are often used,
 * but for simplicity we keep the numeric m value here.
 */
export function getOrbitalLabel(n: number, l: number, m: number): string {
  const subshell = SUBSHELL_MAP[l] || `(${l})`;
  let mLabel = "";

  if (l === 1) {
    if (m === 0) mLabel = "z";
    if (m === 1) mLabel = "x";
    if (m === -1) mLabel = "y";
  } else if (l === 2) {
    if (m === 0) mLabel = "z²";
    if (m === 1) mLabel = "xz";
    if (m === -1) mLabel = "yz";
    if (m === 2) mLabel = "x²-y²";
    if (m === -2) mLabel = "xy";
  } else {
    mLabel = m === 0 ? "0" : m > 0 ? `+${m}` : `${m}`;
  }

  return `${n}${subshell}${mLabel ? `<sub>${mLabel}</sub>` : ""}`;
}

/**
 * Validates and constraints quantum numbers.
 * Principal n: 1-7
 * Azimuthal l: 0 to n-1
 * Magnetic m: -l to +l
 */
export function validateQuantumState(n: number, l: number, m: number) {
  const validN = Math.max(1, Math.min(7, n));
  const validL = Math.max(0, Math.min(validN - 1, l));
  const validM = Math.max(-validL, Math.min(validL, m));

  return { n: validN, l: validL, m: validM };
}
