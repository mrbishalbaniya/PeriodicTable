import { create } from "zustand";
import { elements, type Element } from "../data/elements";
import { lookupMolecule, type Molecule } from "../data/molecules";
import { getSpectrum } from "../data/spectra";

export type VisualizationMode = "bohr" | "quantum";
export type AppMode = "explore" | "sandbox" | "orbitals";

interface ElementStore {
  // Explore mode
  activeFilter: string | null;
  selectedElement: Element;
  visualizationMode: VisualizationMode;
  customNeutrons: number | null;

  // Excitation
  isExcited: boolean;
  emissionColor: string | null;

  // App mode
  appMode: AppMode;
  workbench: Element[];
  activeMolecule: Molecule | null;
  bondError: string | null;
  showVSEPR: boolean;

  // Orbitals mode
  quantumState: { n: number; l: number; m: number };

  // Explore actions
  setActiveFilter: (filter: string | null) => void;
  setSelectedElement: (element: Element) => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  setCustomNeutrons: (count: number) => void;
  resetIsotope: () => void;
  triggerExcitation: () => void;

  // App mode actions
  setAppMode: (mode: AppMode) => void;

  // Sandbox actions
  addToWorkbench: (element: Element) => void;
  removeFromWorkbench: (index: number) => void;
  clearWorkbench: () => void;
  bondElements: () => void;
  clearBondError: () => void;
  toggleVSEPR: () => void;
  setQuantumNumbers: (n: number, l: number, m: number) => void;
}

const MAX_WORKBENCH = 5;

export const useElementStore = create<ElementStore>((set, get) => ({
  activeFilter: null,
  selectedElement: elements[0],
  visualizationMode: "bohr",
  customNeutrons: null,
  isExcited: false,
  emissionColor: null,

  appMode: "explore",

  workbench: [],
  activeMolecule: null,
  bondError: null,
  showVSEPR: false,

  quantumState: { n: 1, l: 0, m: 0 },

  setActiveFilter: (filter) =>
    set((state) => ({
      activeFilter: state.activeFilter === filter ? null : filter,
    })),
  setSelectedElement: (element) =>
    set({ selectedElement: element, customNeutrons: null, isExcited: false, emissionColor: null }),
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  setCustomNeutrons: (count) => set({ customNeutrons: count }),
  resetIsotope: () => set({ customNeutrons: null }),

  triggerExcitation: () => {
    const { selectedElement, isExcited } = get();
    if (isExcited) return; // prevent re-trigger during animation
    const spectrum = getSpectrum(selectedElement.atomicNumber);
    set({ isExcited: true, emissionColor: spectrum.primaryColor });
    setTimeout(() => {
      set({ isExcited: false });
      // Clear emission color after fade
      setTimeout(() => set({ emissionColor: null }), 600);
    }, 1500);
  },

  setAppMode: (mode) =>
    set({
      appMode: mode,
      // Clear sandbox state when switching to explore
      ...(mode === "explore"
        ? { activeMolecule: null, bondError: null, showVSEPR: false }
        : {}),
    }),

  addToWorkbench: (element) => {
    const { workbench } = get();
    if (workbench.length >= MAX_WORKBENCH) return;
    set({
      workbench: [...workbench, element],
      activeMolecule: null,
      bondError: null,
      showVSEPR: false,
    });
  },

  removeFromWorkbench: (index) => {
    const { workbench } = get();
    set({
      workbench: workbench.filter((_, i) => i !== index),
      activeMolecule: null,
      bondError: null,
      showVSEPR: false,
    });
  },

  clearWorkbench: () =>
    set({ workbench: [], activeMolecule: null, bondError: null, showVSEPR: false }),

  bondElements: () => {
    const { workbench } = get();
    if (workbench.length < 2) {
      set({ bondError: "Add at least 2 elements to bond" });
      return;
    }
    const symbols = workbench.map((el) => el.symbol);
    const molecule = lookupMolecule(symbols);
    if (molecule) {
      set({ activeMolecule: molecule, bondError: null });
    } else {
      set({
        activeMolecule: null,
        bondError: "Unknown or unstable compound",
      });
    }
  },

  clearBondError: () => set({ bondError: null }),
  toggleVSEPR: () => set((s) => ({ showVSEPR: !s.showVSEPR })),

  setQuantumNumbers: (n, l, m) => {
    // Basic boundary enforcement
    const validL = Math.max(0, Math.min(n - 1, l));
    const validM = Math.max(-validL, Math.min(validL, m));
    set({ quantumState: { n, l: validL, m: validM } });
  },
}));
