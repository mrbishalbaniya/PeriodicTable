export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: string;
  shells: number[];
  group: number;
  period: number;
  gridColumn: number;
  gridRow: number;
}

export const CATEGORIES = [
  "Alkali metal",
  "Alkaline earth metal",
  "Transition metal",
  "Post-transition metal",
  "Metalloid",
  "Nonmetal",
  "Halogen",
  "Noble gas",
  "Lanthanide",
  "Actinide",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  "Alkali metal": "#e8564a",
  "Alkaline earth metal": "#f0a030",
  "Transition metal": "#4fc3f7",
  "Post-transition metal": "#81c784",
  "Metalloid": "#ce93d8",
  "Nonmetal": "#ffd54f",
  "Halogen": "#4dd0e1",
  "Noble gas": "#b39ddb",
  "Lanthanide": "#f48fb1",
  "Actinide": "#ef9a9a",
};

export const elements: Element[] = [
  // Period 1
  { atomicNumber: 1, symbol: "H", name: "Hydrogen", atomicMass: 1.008, category: "Nonmetal", shells: [1], group: 1, period: 1, gridColumn: 1, gridRow: 1 },
  { atomicNumber: 2, symbol: "He", name: "Helium", atomicMass: 4.003, category: "Noble gas", shells: [2], group: 18, period: 1, gridColumn: 18, gridRow: 1 },

  // Period 2
  { atomicNumber: 3, symbol: "Li", name: "Lithium", atomicMass: 6.941, category: "Alkali metal", shells: [2, 1], group: 1, period: 2, gridColumn: 1, gridRow: 2 },
  { atomicNumber: 4, symbol: "Be", name: "Beryllium", atomicMass: 9.012, category: "Alkaline earth metal", shells: [2, 2], group: 2, period: 2, gridColumn: 2, gridRow: 2 },
  { atomicNumber: 5, symbol: "B", name: "Boron", atomicMass: 10.81, category: "Metalloid", shells: [2, 3], group: 13, period: 2, gridColumn: 13, gridRow: 2 },
  { atomicNumber: 6, symbol: "C", name: "Carbon", atomicMass: 12.011, category: "Nonmetal", shells: [2, 4], group: 14, period: 2, gridColumn: 14, gridRow: 2 },
  { atomicNumber: 7, symbol: "N", name: "Nitrogen", atomicMass: 14.007, category: "Nonmetal", shells: [2, 5], group: 15, period: 2, gridColumn: 15, gridRow: 2 },
  { atomicNumber: 8, symbol: "O", name: "Oxygen", atomicMass: 15.999, category: "Nonmetal", shells: [2, 6], group: 16, period: 2, gridColumn: 16, gridRow: 2 },
  { atomicNumber: 9, symbol: "F", name: "Fluorine", atomicMass: 18.998, category: "Halogen", shells: [2, 7], group: 17, period: 2, gridColumn: 17, gridRow: 2 },
  { atomicNumber: 10, symbol: "Ne", name: "Neon", atomicMass: 20.18, category: "Noble gas", shells: [2, 8], group: 18, period: 2, gridColumn: 18, gridRow: 2 },

  // Period 3
  { atomicNumber: 11, symbol: "Na", name: "Sodium", atomicMass: 22.99, category: "Alkali metal", shells: [2, 8, 1], group: 1, period: 3, gridColumn: 1, gridRow: 3 },
  { atomicNumber: 12, symbol: "Mg", name: "Magnesium", atomicMass: 24.305, category: "Alkaline earth metal", shells: [2, 8, 2], group: 2, period: 3, gridColumn: 2, gridRow: 3 },
  { atomicNumber: 13, symbol: "Al", name: "Aluminium", atomicMass: 26.982, category: "Post-transition metal", shells: [2, 8, 3], group: 13, period: 3, gridColumn: 13, gridRow: 3 },
  { atomicNumber: 14, symbol: "Si", name: "Silicon", atomicMass: 28.086, category: "Metalloid", shells: [2, 8, 4], group: 14, period: 3, gridColumn: 14, gridRow: 3 },
  { atomicNumber: 15, symbol: "P", name: "Phosphorus", atomicMass: 30.974, category: "Nonmetal", shells: [2, 8, 5], group: 15, period: 3, gridColumn: 15, gridRow: 3 },
  { atomicNumber: 16, symbol: "S", name: "Sulfur", atomicMass: 32.06, category: "Nonmetal", shells: [2, 8, 6], group: 16, period: 3, gridColumn: 16, gridRow: 3 },
  { atomicNumber: 17, symbol: "Cl", name: "Chlorine", atomicMass: 35.45, category: "Halogen", shells: [2, 8, 7], group: 17, period: 3, gridColumn: 17, gridRow: 3 },
  { atomicNumber: 18, symbol: "Ar", name: "Argon", atomicMass: 39.948, category: "Noble gas", shells: [2, 8, 8], group: 18, period: 3, gridColumn: 18, gridRow: 3 },

  // Period 4
  { atomicNumber: 19, symbol: "K", name: "Potassium", atomicMass: 39.098, category: "Alkali metal", shells: [2, 8, 8, 1], group: 1, period: 4, gridColumn: 1, gridRow: 4 },
  { atomicNumber: 20, symbol: "Ca", name: "Calcium", atomicMass: 40.078, category: "Alkaline earth metal", shells: [2, 8, 8, 2], group: 2, period: 4, gridColumn: 2, gridRow: 4 },
  { atomicNumber: 21, symbol: "Sc", name: "Scandium", atomicMass: 44.956, category: "Transition metal", shells: [2, 8, 9, 2], group: 3, period: 4, gridColumn: 3, gridRow: 4 },
  { atomicNumber: 22, symbol: "Ti", name: "Titanium", atomicMass: 47.867, category: "Transition metal", shells: [2, 8, 10, 2], group: 4, period: 4, gridColumn: 4, gridRow: 4 },
  { atomicNumber: 23, symbol: "V", name: "Vanadium", atomicMass: 50.942, category: "Transition metal", shells: [2, 8, 11, 2], group: 5, period: 4, gridColumn: 5, gridRow: 4 },
  { atomicNumber: 24, symbol: "Cr", name: "Chromium", atomicMass: 51.996, category: "Transition metal", shells: [2, 8, 13, 1], group: 6, period: 4, gridColumn: 6, gridRow: 4 },
  { atomicNumber: 25, symbol: "Mn", name: "Manganese", atomicMass: 54.938, category: "Transition metal", shells: [2, 8, 13, 2], group: 7, period: 4, gridColumn: 7, gridRow: 4 },
  { atomicNumber: 26, symbol: "Fe", name: "Iron", atomicMass: 55.845, category: "Transition metal", shells: [2, 8, 14, 2], group: 8, period: 4, gridColumn: 8, gridRow: 4 },
  { atomicNumber: 27, symbol: "Co", name: "Cobalt", atomicMass: 58.933, category: "Transition metal", shells: [2, 8, 15, 2], group: 9, period: 4, gridColumn: 9, gridRow: 4 },
  { atomicNumber: 28, symbol: "Ni", name: "Nickel", atomicMass: 58.693, category: "Transition metal", shells: [2, 8, 16, 2], group: 10, period: 4, gridColumn: 10, gridRow: 4 },
  { atomicNumber: 29, symbol: "Cu", name: "Copper", atomicMass: 63.546, category: "Transition metal", shells: [2, 8, 18, 1], group: 11, period: 4, gridColumn: 11, gridRow: 4 },
  { atomicNumber: 30, symbol: "Zn", name: "Zinc", atomicMass: 65.38, category: "Transition metal", shells: [2, 8, 18, 2], group: 12, period: 4, gridColumn: 12, gridRow: 4 },
  { atomicNumber: 31, symbol: "Ga", name: "Gallium", atomicMass: 69.723, category: "Post-transition metal", shells: [2, 8, 18, 3], group: 13, period: 4, gridColumn: 13, gridRow: 4 },
  { atomicNumber: 32, symbol: "Ge", name: "Germanium", atomicMass: 72.63, category: "Metalloid", shells: [2, 8, 18, 4], group: 14, period: 4, gridColumn: 14, gridRow: 4 },
  { atomicNumber: 33, symbol: "As", name: "Arsenic", atomicMass: 74.922, category: "Metalloid", shells: [2, 8, 18, 5], group: 15, period: 4, gridColumn: 15, gridRow: 4 },
  { atomicNumber: 34, symbol: "Se", name: "Selenium", atomicMass: 78.971, category: "Nonmetal", shells: [2, 8, 18, 6], group: 16, period: 4, gridColumn: 16, gridRow: 4 },
  { atomicNumber: 35, symbol: "Br", name: "Bromine", atomicMass: 79.904, category: "Halogen", shells: [2, 8, 18, 7], group: 17, period: 4, gridColumn: 17, gridRow: 4 },
  { atomicNumber: 36, symbol: "Kr", name: "Krypton", atomicMass: 83.798, category: "Noble gas", shells: [2, 8, 18, 8], group: 18, period: 4, gridColumn: 18, gridRow: 4 },

  // Period 5
  { atomicNumber: 37, symbol: "Rb", name: "Rubidium", atomicMass: 85.468, category: "Alkali metal", shells: [2, 8, 18, 8, 1], group: 1, period: 5, gridColumn: 1, gridRow: 5 },
  { atomicNumber: 38, symbol: "Sr", name: "Strontium", atomicMass: 87.62, category: "Alkaline earth metal", shells: [2, 8, 18, 8, 2], group: 2, period: 5, gridColumn: 2, gridRow: 5 },
  { atomicNumber: 39, symbol: "Y", name: "Yttrium", atomicMass: 88.906, category: "Transition metal", shells: [2, 8, 18, 9, 2], group: 3, period: 5, gridColumn: 3, gridRow: 5 },
  { atomicNumber: 40, symbol: "Zr", name: "Zirconium", atomicMass: 91.224, category: "Transition metal", shells: [2, 8, 18, 10, 2], group: 4, period: 5, gridColumn: 4, gridRow: 5 },
  { atomicNumber: 41, symbol: "Nb", name: "Niobium", atomicMass: 92.906, category: "Transition metal", shells: [2, 8, 18, 12, 1], group: 5, period: 5, gridColumn: 5, gridRow: 5 },
  { atomicNumber: 42, symbol: "Mo", name: "Molybdenum", atomicMass: 95.95, category: "Transition metal", shells: [2, 8, 18, 13, 1], group: 6, period: 5, gridColumn: 6, gridRow: 5 },
  { atomicNumber: 43, symbol: "Tc", name: "Technetium", atomicMass: 98, category: "Transition metal", shells: [2, 8, 18, 13, 2], group: 7, period: 5, gridColumn: 7, gridRow: 5 },
  { atomicNumber: 44, symbol: "Ru", name: "Ruthenium", atomicMass: 101.07, category: "Transition metal", shells: [2, 8, 18, 15, 1], group: 8, period: 5, gridColumn: 8, gridRow: 5 },
  { atomicNumber: 45, symbol: "Rh", name: "Rhodium", atomicMass: 102.906, category: "Transition metal", shells: [2, 8, 18, 16, 1], group: 9, period: 5, gridColumn: 9, gridRow: 5 },
  { atomicNumber: 46, symbol: "Pd", name: "Palladium", atomicMass: 106.42, category: "Transition metal", shells: [2, 8, 18, 18], group: 10, period: 5, gridColumn: 10, gridRow: 5 },
  { atomicNumber: 47, symbol: "Ag", name: "Silver", atomicMass: 107.868, category: "Transition metal", shells: [2, 8, 18, 18, 1], group: 11, period: 5, gridColumn: 11, gridRow: 5 },
  { atomicNumber: 48, symbol: "Cd", name: "Cadmium", atomicMass: 112.414, category: "Transition metal", shells: [2, 8, 18, 18, 2], group: 12, period: 5, gridColumn: 12, gridRow: 5 },
  { atomicNumber: 49, symbol: "In", name: "Indium", atomicMass: 114.818, category: "Post-transition metal", shells: [2, 8, 18, 18, 3], group: 13, period: 5, gridColumn: 13, gridRow: 5 },
  { atomicNumber: 50, symbol: "Sn", name: "Tin", atomicMass: 118.71, category: "Post-transition metal", shells: [2, 8, 18, 18, 4], group: 14, period: 5, gridColumn: 14, gridRow: 5 },
  { atomicNumber: 51, symbol: "Sb", name: "Antimony", atomicMass: 121.76, category: "Metalloid", shells: [2, 8, 18, 18, 5], group: 15, period: 5, gridColumn: 15, gridRow: 5 },
  { atomicNumber: 52, symbol: "Te", name: "Tellurium", atomicMass: 127.6, category: "Metalloid", shells: [2, 8, 18, 18, 6], group: 16, period: 5, gridColumn: 16, gridRow: 5 },
  { atomicNumber: 53, symbol: "I", name: "Iodine", atomicMass: 126.904, category: "Halogen", shells: [2, 8, 18, 18, 7], group: 17, period: 5, gridColumn: 17, gridRow: 5 },
  { atomicNumber: 54, symbol: "Xe", name: "Xenon", atomicMass: 131.293, category: "Noble gas", shells: [2, 8, 18, 18, 8], group: 18, period: 5, gridColumn: 18, gridRow: 5 },

  // Period 6
  { atomicNumber: 55, symbol: "Cs", name: "Cesium", atomicMass: 132.905, category: "Alkali metal", shells: [2, 8, 18, 18, 8, 1], group: 1, period: 6, gridColumn: 1, gridRow: 6 },
  { atomicNumber: 56, symbol: "Ba", name: "Barium", atomicMass: 137.327, category: "Alkaline earth metal", shells: [2, 8, 18, 18, 8, 2], group: 2, period: 6, gridColumn: 2, gridRow: 6 },
  // Lanthanides (57-71) - placed in row 9
  { atomicNumber: 57, symbol: "La", name: "Lanthanum", atomicMass: 138.905, category: "Lanthanide", shells: [2, 8, 18, 18, 9, 2], group: 3, period: 6, gridColumn: 3, gridRow: 9 },
  { atomicNumber: 58, symbol: "Ce", name: "Cerium", atomicMass: 140.116, category: "Lanthanide", shells: [2, 8, 18, 19, 9, 2], group: 3, period: 6, gridColumn: 4, gridRow: 9 },
  { atomicNumber: 59, symbol: "Pr", name: "Praseodymium", atomicMass: 140.908, category: "Lanthanide", shells: [2, 8, 18, 21, 8, 2], group: 3, period: 6, gridColumn: 5, gridRow: 9 },
  { atomicNumber: 60, symbol: "Nd", name: "Neodymium", atomicMass: 144.242, category: "Lanthanide", shells: [2, 8, 18, 22, 8, 2], group: 3, period: 6, gridColumn: 6, gridRow: 9 },
  { atomicNumber: 61, symbol: "Pm", name: "Promethium", atomicMass: 145, category: "Lanthanide", shells: [2, 8, 18, 23, 8, 2], group: 3, period: 6, gridColumn: 7, gridRow: 9 },
  { atomicNumber: 62, symbol: "Sm", name: "Samarium", atomicMass: 150.36, category: "Lanthanide", shells: [2, 8, 18, 24, 8, 2], group: 3, period: 6, gridColumn: 8, gridRow: 9 },
  { atomicNumber: 63, symbol: "Eu", name: "Europium", atomicMass: 151.964, category: "Lanthanide", shells: [2, 8, 18, 25, 8, 2], group: 3, period: 6, gridColumn: 9, gridRow: 9 },
  { atomicNumber: 64, symbol: "Gd", name: "Gadolinium", atomicMass: 157.25, category: "Lanthanide", shells: [2, 8, 18, 25, 9, 2], group: 3, period: 6, gridColumn: 10, gridRow: 9 },
  { atomicNumber: 65, symbol: "Tb", name: "Terbium", atomicMass: 158.925, category: "Lanthanide", shells: [2, 8, 18, 27, 8, 2], group: 3, period: 6, gridColumn: 11, gridRow: 9 },
  { atomicNumber: 66, symbol: "Dy", name: "Dysprosium", atomicMass: 162.5, category: "Lanthanide", shells: [2, 8, 18, 28, 8, 2], group: 3, period: 6, gridColumn: 12, gridRow: 9 },
  { atomicNumber: 67, symbol: "Ho", name: "Holmium", atomicMass: 164.93, category: "Lanthanide", shells: [2, 8, 18, 29, 8, 2], group: 3, period: 6, gridColumn: 13, gridRow: 9 },
  { atomicNumber: 68, symbol: "Er", name: "Erbium", atomicMass: 167.259, category: "Lanthanide", shells: [2, 8, 18, 30, 8, 2], group: 3, period: 6, gridColumn: 14, gridRow: 9 },
  { atomicNumber: 69, symbol: "Tm", name: "Thulium", atomicMass: 168.934, category: "Lanthanide", shells: [2, 8, 18, 31, 8, 2], group: 3, period: 6, gridColumn: 15, gridRow: 9 },
  { atomicNumber: 70, symbol: "Yb", name: "Ytterbium", atomicMass: 173.045, category: "Lanthanide", shells: [2, 8, 18, 32, 8, 2], group: 3, period: 6, gridColumn: 16, gridRow: 9 },
  { atomicNumber: 71, symbol: "Lu", name: "Lutetium", atomicMass: 174.967, category: "Lanthanide", shells: [2, 8, 18, 32, 9, 2], group: 3, period: 6, gridColumn: 17, gridRow: 9 },
  // Continue Period 6
  { atomicNumber: 72, symbol: "Hf", name: "Hafnium", atomicMass: 178.49, category: "Transition metal", shells: [2, 8, 18, 32, 10, 2], group: 4, period: 6, gridColumn: 4, gridRow: 6 },
  { atomicNumber: 73, symbol: "Ta", name: "Tantalum", atomicMass: 180.948, category: "Transition metal", shells: [2, 8, 18, 32, 11, 2], group: 5, period: 6, gridColumn: 5, gridRow: 6 },
  { atomicNumber: 74, symbol: "W", name: "Tungsten", atomicMass: 183.84, category: "Transition metal", shells: [2, 8, 18, 32, 12, 2], group: 6, period: 6, gridColumn: 6, gridRow: 6 },
  { atomicNumber: 75, symbol: "Re", name: "Rhenium", atomicMass: 186.207, category: "Transition metal", shells: [2, 8, 18, 32, 13, 2], group: 7, period: 6, gridColumn: 7, gridRow: 6 },
  { atomicNumber: 76, symbol: "Os", name: "Osmium", atomicMass: 190.23, category: "Transition metal", shells: [2, 8, 18, 32, 14, 2], group: 8, period: 6, gridColumn: 8, gridRow: 6 },
  { atomicNumber: 77, symbol: "Ir", name: "Iridium", atomicMass: 192.217, category: "Transition metal", shells: [2, 8, 18, 32, 15, 2], group: 9, period: 6, gridColumn: 9, gridRow: 6 },
  { atomicNumber: 78, symbol: "Pt", name: "Platinum", atomicMass: 195.084, category: "Transition metal", shells: [2, 8, 18, 32, 17, 1], group: 10, period: 6, gridColumn: 10, gridRow: 6 },
  { atomicNumber: 79, symbol: "Au", name: "Gold", atomicMass: 196.967, category: "Transition metal", shells: [2, 8, 18, 32, 18, 1], group: 11, period: 6, gridColumn: 11, gridRow: 6 },
  { atomicNumber: 80, symbol: "Hg", name: "Mercury", atomicMass: 200.592, category: "Transition metal", shells: [2, 8, 18, 32, 18, 2], group: 12, period: 6, gridColumn: 12, gridRow: 6 },
  { atomicNumber: 81, symbol: "Tl", name: "Thallium", atomicMass: 204.38, category: "Post-transition metal", shells: [2, 8, 18, 32, 18, 3], group: 13, period: 6, gridColumn: 13, gridRow: 6 },
  { atomicNumber: 82, symbol: "Pb", name: "Lead", atomicMass: 207.2, category: "Post-transition metal", shells: [2, 8, 18, 32, 18, 4], group: 14, period: 6, gridColumn: 14, gridRow: 6 },
  { atomicNumber: 83, symbol: "Bi", name: "Bismuth", atomicMass: 208.98, category: "Post-transition metal", shells: [2, 8, 18, 32, 18, 5], group: 15, period: 6, gridColumn: 15, gridRow: 6 },
  { atomicNumber: 84, symbol: "Po", name: "Polonium", atomicMass: 209, category: "Post-transition metal", shells: [2, 8, 18, 32, 18, 6], group: 16, period: 6, gridColumn: 16, gridRow: 6 },
  { atomicNumber: 85, symbol: "At", name: "Astatine", atomicMass: 210, category: "Halogen", shells: [2, 8, 18, 32, 18, 7], group: 17, period: 6, gridColumn: 17, gridRow: 6 },
  { atomicNumber: 86, symbol: "Rn", name: "Radon", atomicMass: 222, category: "Noble gas", shells: [2, 8, 18, 32, 18, 8], group: 18, period: 6, gridColumn: 18, gridRow: 6 },

  // Period 7
  { atomicNumber: 87, symbol: "Fr", name: "Francium", atomicMass: 223, category: "Alkali metal", shells: [2, 8, 18, 32, 18, 8, 1], group: 1, period: 7, gridColumn: 1, gridRow: 7 },
  { atomicNumber: 88, symbol: "Ra", name: "Radium", atomicMass: 226, category: "Alkaline earth metal", shells: [2, 8, 18, 32, 18, 8, 2], group: 2, period: 7, gridColumn: 2, gridRow: 7 },
  // Actinides (89-103) - placed in row 10
  { atomicNumber: 89, symbol: "Ac", name: "Actinium", atomicMass: 227, category: "Actinide", shells: [2, 8, 18, 32, 18, 9, 2], group: 3, period: 7, gridColumn: 3, gridRow: 10 },
  { atomicNumber: 90, symbol: "Th", name: "Thorium", atomicMass: 232.038, category: "Actinide", shells: [2, 8, 18, 32, 18, 10, 2], group: 3, period: 7, gridColumn: 4, gridRow: 10 },
  { atomicNumber: 91, symbol: "Pa", name: "Protactinium", atomicMass: 231.036, category: "Actinide", shells: [2, 8, 18, 32, 20, 9, 2], group: 3, period: 7, gridColumn: 5, gridRow: 10 },
  { atomicNumber: 92, symbol: "U", name: "Uranium", atomicMass: 238.029, category: "Actinide", shells: [2, 8, 18, 32, 21, 9, 2], group: 3, period: 7, gridColumn: 6, gridRow: 10 },
  { atomicNumber: 93, symbol: "Np", name: "Neptunium", atomicMass: 237, category: "Actinide", shells: [2, 8, 18, 32, 22, 9, 2], group: 3, period: 7, gridColumn: 7, gridRow: 10 },
  { atomicNumber: 94, symbol: "Pu", name: "Plutonium", atomicMass: 244, category: "Actinide", shells: [2, 8, 18, 32, 24, 8, 2], group: 3, period: 7, gridColumn: 8, gridRow: 10 },
  { atomicNumber: 95, symbol: "Am", name: "Americium", atomicMass: 243, category: "Actinide", shells: [2, 8, 18, 32, 25, 8, 2], group: 3, period: 7, gridColumn: 9, gridRow: 10 },
  { atomicNumber: 96, symbol: "Cm", name: "Curium", atomicMass: 247, category: "Actinide", shells: [2, 8, 18, 32, 25, 9, 2], group: 3, period: 7, gridColumn: 10, gridRow: 10 },
  { atomicNumber: 97, symbol: "Bk", name: "Berkelium", atomicMass: 247, category: "Actinide", shells: [2, 8, 18, 32, 27, 8, 2], group: 3, period: 7, gridColumn: 11, gridRow: 10 },
  { atomicNumber: 98, symbol: "Cf", name: "Californium", atomicMass: 251, category: "Actinide", shells: [2, 8, 18, 32, 28, 8, 2], group: 3, period: 7, gridColumn: 12, gridRow: 10 },
  { atomicNumber: 99, symbol: "Es", name: "Einsteinium", atomicMass: 252, category: "Actinide", shells: [2, 8, 18, 32, 29, 8, 2], group: 3, period: 7, gridColumn: 13, gridRow: 10 },
  { atomicNumber: 100, symbol: "Fm", name: "Fermium", atomicMass: 257, category: "Actinide", shells: [2, 8, 18, 32, 30, 8, 2], group: 3, period: 7, gridColumn: 14, gridRow: 10 },
  { atomicNumber: 101, symbol: "Md", name: "Mendelevium", atomicMass: 258, category: "Actinide", shells: [2, 8, 18, 32, 31, 8, 2], group: 3, period: 7, gridColumn: 15, gridRow: 10 },
  { atomicNumber: 102, symbol: "No", name: "Nobelium", atomicMass: 259, category: "Actinide", shells: [2, 8, 18, 32, 32, 8, 2], group: 3, period: 7, gridColumn: 16, gridRow: 10 },
  { atomicNumber: 103, symbol: "Lr", name: "Lawrencium", atomicMass: 266, category: "Actinide", shells: [2, 8, 18, 32, 32, 8, 3], group: 3, period: 7, gridColumn: 17, gridRow: 10 },
  // Continue Period 7
  { atomicNumber: 104, symbol: "Rf", name: "Rutherfordium", atomicMass: 267, category: "Transition metal", shells: [2, 8, 18, 32, 32, 10, 2], group: 4, period: 7, gridColumn: 4, gridRow: 7 },
  { atomicNumber: 105, symbol: "Db", name: "Dubnium", atomicMass: 268, category: "Transition metal", shells: [2, 8, 18, 32, 32, 11, 2], group: 5, period: 7, gridColumn: 5, gridRow: 7 },
  { atomicNumber: 106, symbol: "Sg", name: "Seaborgium", atomicMass: 269, category: "Transition metal", shells: [2, 8, 18, 32, 32, 12, 2], group: 6, period: 7, gridColumn: 6, gridRow: 7 },
  { atomicNumber: 107, symbol: "Bh", name: "Bohrium", atomicMass: 270, category: "Transition metal", shells: [2, 8, 18, 32, 32, 13, 2], group: 7, period: 7, gridColumn: 7, gridRow: 7 },
  { atomicNumber: 108, symbol: "Hs", name: "Hassium", atomicMass: 277, category: "Transition metal", shells: [2, 8, 18, 32, 32, 14, 2], group: 8, period: 7, gridColumn: 8, gridRow: 7 },
  { atomicNumber: 109, symbol: "Mt", name: "Meitnerium", atomicMass: 278, category: "Transition metal", shells: [2, 8, 18, 32, 32, 15, 2], group: 9, period: 7, gridColumn: 9, gridRow: 7 },
  { atomicNumber: 110, symbol: "Ds", name: "Darmstadtium", atomicMass: 281, category: "Transition metal", shells: [2, 8, 18, 32, 32, 16, 2], group: 10, period: 7, gridColumn: 10, gridRow: 7 },
  { atomicNumber: 111, symbol: "Rg", name: "Roentgenium", atomicMass: 282, category: "Transition metal", shells: [2, 8, 18, 32, 32, 17, 2], group: 11, period: 7, gridColumn: 11, gridRow: 7 },
  { atomicNumber: 112, symbol: "Cn", name: "Copernicium", atomicMass: 285, category: "Transition metal", shells: [2, 8, 18, 32, 32, 18, 2], group: 12, period: 7, gridColumn: 12, gridRow: 7 },
  { atomicNumber: 113, symbol: "Nh", name: "Nihonium", atomicMass: 286, category: "Post-transition metal", shells: [2, 8, 18, 32, 32, 18, 3], group: 13, period: 7, gridColumn: 13, gridRow: 7 },
  { atomicNumber: 114, symbol: "Fl", name: "Flerovium", atomicMass: 289, category: "Post-transition metal", shells: [2, 8, 18, 32, 32, 18, 4], group: 14, period: 7, gridColumn: 14, gridRow: 7 },
  { atomicNumber: 115, symbol: "Mc", name: "Moscovium", atomicMass: 290, category: "Post-transition metal", shells: [2, 8, 18, 32, 32, 18, 5], group: 15, period: 7, gridColumn: 15, gridRow: 7 },
  { atomicNumber: 116, symbol: "Lv", name: "Livermorium", atomicMass: 293, category: "Post-transition metal", shells: [2, 8, 18, 32, 32, 18, 6], group: 16, period: 7, gridColumn: 16, gridRow: 7 },
  { atomicNumber: 117, symbol: "Ts", name: "Tennessine", atomicMass: 294, category: "Halogen", shells: [2, 8, 18, 32, 32, 18, 7], group: 17, period: 7, gridColumn: 17, gridRow: 7 },
  { atomicNumber: 118, symbol: "Og", name: "Oganesson", atomicMass: 294, category: "Noble gas", shells: [2, 8, 18, 32, 32, 18, 8], group: 18, period: 7, gridColumn: 18, gridRow: 7 },
];
