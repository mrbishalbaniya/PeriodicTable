/**
 * Emission spectrum data for elements.
 * Wavelengths are visible Balmer/emission lines in nm.
 * Primary color is the dominant visual emission color.
 */

export interface SpectrumData {
  primaryColor: string;
  lines: number[]; // wavelengths in nm (visible range 380–700)
}

/**
 * Convert wavelength in nm to an approximate RGB hex color.
 * Based on Dan Bruton's algorithm.
 */
export function wavelengthToRGB(nm: number): string {
  let r = 0, g = 0, b = 0;

  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (nm >= 440 && nm < 490) {
    r = 0;
    g = (nm - 440) / (490 - 440);
    b = 1;
  } else if (nm >= 490 && nm < 510) {
    r = 0;
    g = 1;
    b = -(nm - 510) / (510 - 490);
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (nm >= 580 && nm < 645) {
    r = 1;
    g = -(nm - 645) / (645 - 580);
    b = 0;
  } else if (nm >= 645 && nm <= 700) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity falloff at edges of visible spectrum
  let intensity = 1.0;
  if (nm >= 380 && nm < 420) {
    intensity = 0.3 + 0.7 * (nm - 380) / (420 - 380);
  } else if (nm >= 645 && nm <= 700) {
    intensity = 0.3 + 0.7 * (700 - nm) / (700 - 645);
  }

  r = Math.round(255 * r * intensity);
  g = Math.round(255 * g * intensity);
  b = Math.round(255 * b * intensity);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Spectrum database keyed by atomic number.
 * Covers a good range of elements with their visible emission lines.
 */
const SPECTRA_DB: Record<number, SpectrumData> = {
  // Hydrogen — Balmer series
  1: { primaryColor: "#ff0055", lines: [410, 434, 486, 656] },
  // Helium
  2: { primaryColor: "#ffee44", lines: [388, 447, 471, 492, 501, 587, 668] },
  // Lithium
  3: { primaryColor: "#ff2200", lines: [610, 670] },
  // Beryllium
  4: { primaryColor: "#aaffcc", lines: [467, 527] },
  // Boron
  5: { primaryColor: "#44ff66", lines: [449, 518] },
  // Carbon
  6: { primaryColor: "#aaccff", lines: [427, 505, 538, 600] },
  // Nitrogen
  7: { primaryColor: "#ff8866", lines: [463, 500, 568, 648] },
  // Oxygen
  8: { primaryColor: "#66aaff", lines: [436, 533, 615, 645] },
  // Fluorine
  9: { primaryColor: "#ffcc55", lines: [624, 685] },
  // Neon — distinct orange glow
  10: { primaryColor: "#ff4400", lines: [540, 585, 603, 616, 626, 640, 650, 660, 692] },
  // Sodium — sodium doublet
  11: { primaryColor: "#ffaa00", lines: [589, 590] },
  // Magnesium
  12: { primaryColor: "#66ddff", lines: [470, 517, 518] },
  // Aluminum
  13: { primaryColor: "#8899ff", lines: [394, 396] },
  // Silicon
  14: { primaryColor: "#ccddff", lines: [390, 413, 505, 634] },
  // Phosphorus
  15: { primaryColor: "#ddff44", lines: [603, 604] },
  // Sulfur
  16: { primaryColor: "#88aaff", lines: [415, 469, 545, 564] },
  // Chlorine
  17: { primaryColor: "#44ff88", lines: [438, 452, 479, 520, 542] },
  // Argon
  18: { primaryColor: "#cc66ff", lines: [394, 420, 434, 560, 603, 697] },
  // Potassium
  19: { primaryColor: "#cc44ff", lines: [404, 691, 693, 697] },
  // Calcium
  20: { primaryColor: "#ff6622", lines: [393, 397, 423, 443, 527, 612, 616, 643] },
  // Iron
  26: { primaryColor: "#ffcc66", lines: [404, 427, 432, 438, 466, 495, 516, 527] },
  // Copper
  29: { primaryColor: "#44ffaa", lines: [510, 515, 522, 570, 578] },
  // Zinc
  30: { primaryColor: "#6688ff", lines: [468, 472, 481, 636] },
  // Barium
  56: { primaryColor: "#55ff44", lines: [455, 493, 553, 578, 614, 649] },
  // Mercury
  80: { primaryColor: "#6644ff", lines: [405, 436, 546, 577, 579] },
  // Gold
  79: { primaryColor: "#ffbb33", lines: [428, 479, 523, 583, 628] },
};

/**
 * Get spectrum data for an element by atomic number.
 * Falls back to a default single-line spectrum.
 */
export function getSpectrum(atomicNumber: number): SpectrumData {
  return SPECTRA_DB[atomicNumber] ?? {
    primaryColor: "#aaaaff",
    lines: [500],
  };
}
