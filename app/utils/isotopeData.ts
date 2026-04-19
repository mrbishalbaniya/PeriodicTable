/**
 * Isotope stability checker based on the Belt of Stability model.
 *
 * - Light elements (Z ≤ 20): stable N/Z ≈ 1.0 (tolerance ±0.25)
 * - Medium elements (20 < Z ≤ 83): stable N/Z transitions from 1.0→1.52 (tolerance ±0.20)
 * - Heavy elements (Z > 83): always unstable
 *
 * Also includes a lookup table for well-known stable isotopes at boundaries.
 */

// Known stable isotope neutron counts for edge-case accuracy
const KNOWN_STABLE: Record<number, number[]> = {
  1: [0, 1],        // H-1, H-2 (deuterium)
  2: [1, 2],        // He-3, He-4
  6: [6, 7],        // C-12, C-13
  7: [7, 8],        // N-14, N-15
  8: [8, 9, 10],    // O-16, O-17, O-18
  20: [20, 22, 24], // Ca-40, Ca-42, Ca-44
  26: [28, 30, 31, 32], // Fe-54, Fe-56, Fe-57, Fe-58
  50: [62, 64, 65, 66, 67, 68, 69, 70, 72, 74], // Sn isotopes
  82: [122, 124, 125, 126], // Pb isotopes
  83: [126],        // Bi-209 (longest-lived "stable")
};

/**
 * Returns the expected stable N/Z ratio for a given proton count.
 */
function stableNZRatio(Z: number): number {
  if (Z <= 20) return 1.0;
  if (Z <= 83) {
    // Linear interpolation from 1.0 (at Z=20) to 1.52 (at Z=83)
    return 1.0 + ((Z - 20) / (83 - 20)) * 0.52;
  }
  return 1.55; // beyond stability
}

/**
 * Returns the tolerance window for the N/Z ratio.
 * Lighter elements have a wider tolerance; heavier ones narrow.
 */
function toleranceWindow(Z: number): number {
  if (Z <= 10) return 0.35;
  if (Z <= 20) return 0.28;
  if (Z <= 50) return 0.22;
  if (Z <= 83) return 0.18;
  return 0;
}

/**
 * Checks if an isotope with the given proton and neutron count
 * falls within the Belt of Stability.
 */
export function checkIsotopeStability(
  protons: number,
  neutrons: number
): boolean {
  // Edge case: hydrogen with 0 neutrons is stable
  if (protons === 1 && neutrons === 0) return true;

  // Elements above Bismuth (Z > 83) are always unstable
  if (protons > 83) return false;

  // Must have at least 1 neutron (except H-1)
  if (neutrons <= 0) return false;

  // Check known stable isotopes first
  if (KNOWN_STABLE[protons]?.includes(neutrons)) return true;

  // Belt of stability calculation
  const ratio = neutrons / protons;
  const expectedRatio = stableNZRatio(protons);
  const tolerance = toleranceWindow(protons);

  return Math.abs(ratio - expectedRatio) <= tolerance;
}

/**
 * Returns the default neutron count for an element.
 */
export function defaultNeutrons(
  atomicNumber: number,
  atomicMass: number
): number {
  return Math.max(0, Math.round(atomicMass) - atomicNumber);
}

/**
 * Returns sensible min/max neutron bounds for the isotope slider.
 */
export function neutronBounds(protons: number): {
  min: number;
  max: number;
} {
  return {
    min: Math.max(0, protons - 5),
    max: protons + Math.max(15, Math.round(protons * 0.6)),
  };
}
