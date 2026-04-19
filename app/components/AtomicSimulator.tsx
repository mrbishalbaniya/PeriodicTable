"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { getAtomColor } from "../data/molecules";
import { Suspense, useState, useCallback } from "react";
import { useElementStore } from "../store/useElementStore";
import Nucleus from "./Nucleus";
import ElectronShells from "./ElectronShells";
import QuantumCloud from "./QuantumCloud";
import MoleculeViewer from "./MoleculeViewer";
import Photon from "./Photon";
import SpectrumViewer from "./SpectrumViewer";
import OrbitalVolume from "./OrbitalVolume";
import VSEPRPanel from "./VSEPRPanel";
import { Layers, Atom, Sparkles, Zap, RotateCcw } from "lucide-react";
import { CATEGORY_COLORS } from "../data/elements";
import { getSpectrum } from "../data/spectra";
import {
  checkIsotopeStability,
  defaultNeutrons,
  neutronBounds,
} from "../utils/isotopeData";
import { SUBSHELL_MAP } from "../utils/quantumMath";

/* ===== EXPLORE MODE: Atom Scene ===== */
function AtomScene() {
  const selectedElement = useElementStore((s) => s.selectedElement);
  const visualizationMode = useElementStore((s) => s.visualizationMode);
  const customNeutrons = useElementStore((s) => s.customNeutrons);
  const isExcited = useElementStore((s) => s.isExcited);
  const emissionColor = useElementStore((s) => s.emissionColor);

  const protons = selectedElement.atomicNumber;
  const neutrons =
    customNeutrons ??
    defaultNeutrons(protons, selectedElement.atomicMass);
  const isStable = checkIsotopeStability(protons, neutrons);

  // Photon state machine: 'idle' -> 'incoming' -> 'excited' -> 'outgoing' -> 'idle'
  const [photonPhase, setPhotonPhase] = useState<"idle" | "incoming" | "outgoing">("idle");
  const spectrum = getSpectrum(selectedElement.atomicNumber);

  // Listen for excitation trigger
  const prevExcited = useElementStore((s) => s.isExcited);

  // When store isExcited transitions to true, start incoming photon
  // We use a callback to avoid stale closures
  const handleExcite = useCallback(() => {
    setPhotonPhase("incoming");
  }, []);

  // Photon incoming complete -> wait, then outgoing
  const onIncomingComplete = useCallback(() => {
    setPhotonPhase("idle");
    // After the excited state resolves (~1500ms from store), outgoing photon fires
    setTimeout(() => {
      setPhotonPhase("outgoing");
    }, 1200);
  }, []);

  const onOutgoingComplete = useCallback(() => {
    setPhotonPhase("idle");
  }, []);

  // Sync excitation trigger with photon phase
  // We use a ref-check pattern in the parent instead

  return (
    <>
      <Nucleus protons={protons} neutrons={Math.max(0, neutrons)} isStable={isStable} />
      {visualizationMode === "bohr" ? (
        <ElectronShells
          shells={selectedElement.shells}
          isExcited={isExcited}
          emissionColor={emissionColor}
        />
      ) : (
        <QuantumCloud totalElectrons={selectedElement.atomicNumber} />
      )}

      {/* Incoming photon (white/UV to excite) */}
      {photonPhase === "incoming" && (
        <Photon
          direction="in"
          color="#ffffff"
          onComplete={onIncomingComplete}
        />
      )}

      {/* Outgoing photon (element emission color) */}
      {photonPhase === "outgoing" && (
        <Photon
          direction="out"
          color={spectrum.primaryColor}
          onComplete={onOutgoingComplete}
        />
      )}
    </>
  );
}

/**
 * Wrapper that syncs excitation triggers with photon phase.
 * We need this so we can manage photon state inside the Canvas.
 */
function AtomSceneWrapper() {
  const isExcited = useElementStore((s) => s.isExcited);
  const emissionColor = useElementStore((s) => s.emissionColor);
  const selectedElement = useElementStore((s) => s.selectedElement);
  const visualizationMode = useElementStore((s) => s.visualizationMode);
  const customNeutrons = useElementStore((s) => s.customNeutrons);
  const spectrum = getSpectrum(selectedElement.atomicNumber);

  const protons = selectedElement.atomicNumber;
  const neutrons = customNeutrons ?? defaultNeutrons(protons, selectedElement.atomicMass);
  const isStable = checkIsotopeStability(protons, neutrons);

  // Photon phase state
  const [photonPhase, setPhotonPhase] = useState<"idle" | "incoming" | "outgoing">("idle");

  // Track excitation changes
  const [wasExcited, setWasExcited] = useState(false);
  if (isExcited && !wasExcited) {
    setWasExcited(true);
    setPhotonPhase("incoming");
  }
  if (!isExcited && wasExcited) {
    setWasExcited(false);
    // Trigger outgoing photon after electron drops
    setTimeout(() => setPhotonPhase("outgoing"), 200);
  }

  const onIncomingComplete = useCallback(() => {
    setPhotonPhase("idle");
  }, []);

  const onOutgoingComplete = useCallback(() => {
    setPhotonPhase("idle");
  }, []);

  return (
    <>
      <Nucleus protons={protons} neutrons={Math.max(0, neutrons)} isStable={isStable} />
      {visualizationMode === "bohr" ? (
        <ElectronShells
          shells={selectedElement.shells}
          isExcited={isExcited}
          emissionColor={emissionColor}
        />
      ) : (
        <QuantumCloud totalElectrons={selectedElement.atomicNumber} />
      )}

      {/* Incoming photon (white/UV) */}
      {photonPhase === "incoming" && (
        <Photon direction="in" color="#ffffff" onComplete={onIncomingComplete} />
      )}

      {/* Outgoing photon (emission color) */}
      {photonPhase === "outgoing" && (
        <Photon direction="out" color={spectrum.primaryColor} onComplete={onOutgoingComplete} />
      )}
    </>
  );
}

/* ===== ORBITALS MODE: Scene Wrapper ===== */
function OrbitalScene() {
  return <OrbitalVolume />;
}

/* ===== SANDBOX MODE: Molecule Scene ===== */
function MoleculeScene() {
  const activeMolecule = useElementStore((s) => s.activeMolecule);
  if (!activeMolecule) return null;
  return <MoleculeViewer molecule={activeMolecule} />;
}

function LoadingFallback() {
  return (
    <Html center>
      <div style={{ color: "#8b8fa3", fontSize: "14px", whiteSpace: "nowrap" }}>
        Loading...
      </div>
    </Html>
  );
}

/* ===== MODE TOGGLE ===== */
function ModeToggle() {
  const visualizationMode = useElementStore((s) => s.visualizationMode);
  const setVisualizationMode = useElementStore((s) => s.setVisualizationMode);

  return (
    <div className="mode-toggle" id="mode-toggle">
      <button
        className={`mode-btn ${visualizationMode === "bohr" ? "mode-btn-active" : ""}`}
        onClick={() => setVisualizationMode("bohr")}
        id="mode-bohr"
      >
        <Layers size={14} />
        Bohr
      </button>
      <button
        className={`mode-btn ${visualizationMode === "quantum" ? "mode-btn-active" : ""}`}
        onClick={() => setVisualizationMode("quantum")}
        id="mode-quantum"
      >
        <Atom size={14} />
        Quantum
      </button>
    </div>
  );
}

/* ===== EXCITE BUTTON ===== */
function ExciteButton() {
  const isExcited = useElementStore((s) => s.isExcited);
  const triggerExcitation = useElementStore((s) => s.triggerExcitation);
  const visualizationMode = useElementStore((s) => s.visualizationMode);
  const emissionColor = useElementStore((s) => s.emissionColor);

  // Only show in Bohr mode (electron shells required)
  if (visualizationMode !== "bohr") return null;

  return (
    <button
      className={`btn-excite ${isExcited ? "btn-excite-active" : ""}`}
      onClick={triggerExcitation}
      disabled={isExcited}
      id="excite-btn"
      style={{
        "--excite-color": emissionColor || "#6366f1",
      } as React.CSSProperties}
    >
      <span className="excite-icon">
        {isExcited ? <Sparkles size={16} /> : <Zap size={16} />}
      </span>
      <span>{isExcited ? "Excited!" : "Excite Atom"}</span>
    </button>
  );
}

/* ===== ISOTOPE CONTROLS ===== */
function IsotopeControls() {
  const selectedElement = useElementStore((s) => s.selectedElement);
  const customNeutrons = useElementStore((s) => s.customNeutrons);
  const setCustomNeutrons = useElementStore((s) => s.setCustomNeutrons);
  const resetIsotope = useElementStore((s) => s.resetIsotope);

  const protons = selectedElement.atomicNumber;
  const defNeutrons = defaultNeutrons(protons, selectedElement.atomicMass);
  const currentNeutrons = customNeutrons ?? defNeutrons;
  const bounds = neutronBounds(protons);
  const massNumber = protons + currentNeutrons;
  const isStable = checkIsotopeStability(protons, currentNeutrons);
  const isCustom = customNeutrons !== null;

  return (
    <div className="isotope-controls" id="isotope-controls">
      <div className="isotope-header">
        <span className="isotope-title">Isotope Builder</span>
        {isCustom && (
          <button className="isotope-reset" onClick={resetIsotope} id="isotope-reset-btn" title="Reset to natural isotope">
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>
      <div className="isotope-slider-row">
        <label className="isotope-label" htmlFor="neutron-slider">Neutrons</label>
        <input
          id="neutron-slider"
          type="range"
          className="isotope-slider"
          min={bounds.min}
          max={bounds.max}
          value={currentNeutrons}
          onChange={(e) => setCustomNeutrons(Number(e.target.value))}
        />
        <span className="isotope-value">{currentNeutrons}</span>
      </div>
      <div className="isotope-stats">
        <div className="isotope-stat">
          <span className="isotope-stat-label">Mass Number (A)</span>
          <span className="isotope-stat-value">{massNumber}</span>
        </div>
        <div className="isotope-stat">
          <span className="isotope-stat-label">Notation</span>
          <span className="isotope-stat-value isotope-notation">
            <sup>{massNumber}</sup>{selectedElement.symbol}
          </span>
        </div>
        <div className="isotope-stat">
          <span className="isotope-stat-label">N/Z Ratio</span>
          <span className="isotope-stat-value">
            {protons > 0 ? (currentNeutrons / protons).toFixed(2) : "—"}
          </span>
        </div>
      </div>
      <div className={`isotope-badge ${isStable ? "badge-stable" : "badge-radioactive"}`} id="stability-badge">
        <span className="badge-icon">{isStable ? "✓" : "☢"}</span>
        <span>{isStable ? "Stable Isotope" : "Radioactive"}</span>
      </div>
    </div>
  );
}

/* ===== SANDBOX OVERLAY ===== */
function SandboxOverlay() {
  const activeMolecule = useElementStore((s) => s.activeMolecule);

  if (!activeMolecule) {
    return (
      <div className="simulator-overlay sandbox-prompt">
        <div className="sandbox-prompt-icon">⚗</div>
        <div className="sandbox-prompt-text">
          Add elements to the workbench,<br />then click <strong>Synthesize</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="simulator-overlay">
      <div className="simulator-element-symbol" style={{ color: "#818cf8" }}>
        {activeMolecule.formula}
      </div>
      <div className="simulator-element-name">{activeMolecule.name}</div>
      <div className="simulator-element-details">
        <span>{activeMolecule.atoms.length} atoms</span>
        <span className="detail-separator">•</span>
        <span>{activeMolecule.bonds.length} bonds</span>
      </div>
      <div className="simulator-shell-info">Ball-and-Stick Model</div>
    </div>
  );
}

/* ===== MAIN EXPORT ===== */
export default function AtomicSimulator() {
  const appMode = useElementStore((s) => s.appMode);
  const selectedElement = useElementStore((s) => s.selectedElement);
  const visualizationMode = useElementStore((s) => s.visualizationMode);
  const customNeutrons = useElementStore((s) => s.customNeutrons);
  const activeMolecule = useElementStore((s) => s.activeMolecule);
  const isExcited = useElementStore((s) => s.isExcited);
  const emissionColor = useElementStore((s) => s.emissionColor);
  const quantumState = useElementStore((s) => s.quantumState);
  const categoryColor = CATEGORY_COLORS[selectedElement.category] || "#888888";

  const protons = selectedElement.atomicNumber;
  const currentNeutrons = customNeutrons ?? defaultNeutrons(protons, selectedElement.atomicMass);
  const isStable = checkIsotopeStability(protons, currentNeutrons);

  const isExplore = appMode === "explore";
  const isOrbitals = appMode === "orbitals";

  // Bloom intensity pulses during emission
  const bloomIntensity = isExcited ? 1.2 : (emissionColor ? 0.6 : 0.15);

  return (
    <div className="simulator-container" id="atomic-simulator">
      {/* Overlays — conditional by mode */}
      {isExplore ? (
        <>
          <div className="simulator-overlay">
            <div className="simulator-element-symbol" style={{ color: categoryColor }}>
              {selectedElement.symbol}
            </div>
            <div className="simulator-element-name">{selectedElement.name}</div>
            <div className="simulator-element-details">
              <span>Z = {selectedElement.atomicNumber}</span>
              <span className="detail-separator">•</span>
              <span>A = {protons + currentNeutrons}</span>
            </div>
            <div className="simulator-shell-info">
              {visualizationMode === "bohr"
                ? `Shells: [${selectedElement.shells.join(", ")}]`
                : `Electrons: ${selectedElement.atomicNumber} · Probability Cloud`}
            </div>
          </div>
          <ModeToggle />
          <ExciteButton />
          <IsotopeControls />
        </>
      ) : isOrbitals ? (
        <div className="simulator-overlay">
          <div className="vsepr-badge" style={{ background: "#a78bfa", color: "#fff", marginBottom: "8px", display: "inline-block" }}>
            Quantum Orbital
          </div>
          <div className="simulator-element-symbol" style={{ color: "#a78bfa" }}>
            {quantumState.n}{SUBSHELL_MAP[quantumState.l]}
          </div>
          <div className="simulator-element-name">Wave Function Cloud</div>
          <div className="simulator-element-details">
            <span>n={quantumState.n}, l={quantumState.l}, m={quantumState.m}</span>
          </div>
        </div>
      ) : (
        <SandboxOverlay />
      )}

      {/* Emission flash overlay */}
      {emissionColor && isExplore && (
        <div
          className="emission-flash"
          style={{
            "--flash-color": emissionColor,
          } as React.CSSProperties}
        />
      )}

      <Canvas
        camera={{ position: [0, 3, 8], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a1a"]} />
        <ambientLight intensity={isExplore ? 0.4 : 0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#4488ff" />

        {!isExplore && (
          <pointLight position={[0, 8, 0]} intensity={0.4} color="#a78bfa" />
        )}

        <Suspense fallback={<LoadingFallback />}>
          {isExplore && <AtomSceneWrapper />}
          {isOrbitals && <OrbitalScene />}
          {appMode === "sandbox" && <MoleculeScene />}
        </Suspense>

        <Stars radius={50} depth={50} count={1500} factor={3} saturation={0.3} fade speed={0.5} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={30} autoRotate autoRotateSpeed={0.3} />

        {/* Bloom post-processing */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.4}
            intensity={bloomIntensity}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Spectrum Viewer — only in explore mode */}
      {isExplore && <SpectrumViewer />}

      {/* Legend */}
      {isExplore && (
        <div className="simulator-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#ff4444" }} />
            <span>Protons ({protons})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#4488ff" }} />
            <span>Neutrons ({currentNeutrons})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: visualizationMode === "bohr" ? "#00ffaa" : "#a78bfa" }} />
            <span>{visualizationMode === "bohr" ? "Electrons" : "Probability Cloud"}</span>
          </div>
        </div>
      )}

      {/* Orbitals legend */}
      {isOrbitals && (
        <div className="simulator-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#00ffff" }} />
            <span>Positive Phase (+)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#ff00ff" }} />
            <span>Negative Phase (−)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "rgba(255, 255, 255, 0.4)" }} />
            <span>N={quantumState.n}, L={quantumState.l}, M={quantumState.m}</span>
          </div>
        </div>
      )}

      {/* Molecule legend */}
      {!isExplore && activeMolecule && (
        <div className="simulator-legend molecule-legend">
          {[...new Set(activeMolecule.atoms.map((a) => a.element))].map((sym) => (
            <div key={sym} className="legend-item">
              <span className="legend-dot" style={{ background: getAtomColor(sym) }} />
              <span>{sym}</span>
            </div>
          ))}
        </div>
      )}

      {/* VSEPR Info Panel */}
      {!isExplore && <VSEPRPanel />}
    </div>
  );
}
