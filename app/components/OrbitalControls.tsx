"use client";

import { useElementStore } from "../store/useElementStore";
import { SUBSHELL_MAP, getOrbitalLabel } from "../utils/quantumMath";

export default function OrbitalControls() {
  const { n, l, m } = useElementStore((s) => s.quantumState);
  const setQuantumNumbers = useElementStore((s) => s.setQuantumNumbers);

  const handleNChange = (val: number) => {
    setQuantumNumbers(val, Math.min(l, val - 1), 0);
  };

  const handleLChange = (val: number) => {
    setQuantumNumbers(n, val, 0);
  };

  const handleMChange = (val: number) => {
    setQuantumNumbers(n, l, val);
  };

  return (
    <div className="orbital-controls" id="orbital-controls">
      <div className="explorer-header">
        <h1 className="explorer-title">
          <span className="title-accent">💫</span> Orbital Viewer
        </h1>
        <p className="explorer-subtitle">
          Visualize the probability density of different quantum states.
        </p>
      </div>

      <div className="orbital-card">
        <div className="orbital-display">
          <div className="orbital-label" dangerouslySetInnerHTML={{ __html: getOrbitalLabel(n, l, m) }} />
          <div className="orbital-description">
            {SUBSHELL_MAP[l]?.toUpperCase()} subshell — {n === 1 ? "Ground" : `Excited (Level ${n})`}
          </div>
        </div>

        <div className="quantum-inputs">
          {/* Principal Quantum Number n */}
          <div className="quantum-input-group">
            <div className="quantum-header">
              <label>Energy Level (n)</label>
              <span className="quantum-value">{n}</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={n}
              onChange={(e) => handleNChange(parseInt(e.target.value))}
              className="quantum-slider"
            />
          </div>

          {/* Azimuthal Quantum Number l */}
          <div className="quantum-input-group">
            <div className="quantum-header">
              <label>Subshell (l: {SUBSHELL_MAP[l]})</label>
              <span className="quantum-value">{l}</span>
            </div>
            <input
              type="range"
              min="0"
              max={n - 1}
              step="1"
              value={l}
              onChange={(e) => handleLChange(parseInt(e.target.value))}
              className="quantum-slider"
            />
          </div>

          {/* Magnetic Quantum Number m */}
          <div className="quantum-input-group">
            <div className="quantum-header">
              <label>Orientation (m)</label>
              <span className="quantum-value">{m}</span>
            </div>
            <input
              type="range"
              min={-l}
              max={l}
              step="1"
              value={m}
              onChange={(e) => handleMChange(parseInt(e.target.value))}
              className="quantum-slider"
            />
          </div>
        </div>
      </div>

      <div className="orbital-info">
        <div className="info-item">
          <strong className="info-topic">Node Count:</strong>
          <span>{n - 1} total nodes ({n - l - 1} radial, {l} angular)</span>
        </div>
        <div className="info-item">
          <strong className="info-topic">Degeneracy:</strong>
          <span>{2 * l + 1} orbitals in this subshell</span>
        </div>
      </div>
    </div>
  );
}
