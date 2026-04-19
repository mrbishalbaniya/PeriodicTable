"use client";

import { useElementStore } from "../store/useElementStore";
import { Compass } from "lucide-react";

/**
 * Floating glassmorphism panel showing VSEPR geometry details.
 * Displayed when showVSEPR is true and a molecule with VSEPR data is active.
 */
export default function VSEPRPanel() {
  const activeMolecule = useElementStore((s) => s.activeMolecule);
  const showVSEPR = useElementStore((s) => s.showVSEPR);

  if (!showVSEPR || !activeMolecule?.vsepr) return null;

  const { vsepr } = activeMolecule;
  const centralAtom = activeMolecule.atoms[vsepr.centralAtomIndex];

  return (
    <div className="vsepr-panel" id="vsepr-panel">
      <div className="vsepr-header">
        <Compass size={14} className="vsepr-header-icon" />
        <span className="vsepr-badge">VSEPR</span>
        <span className="vsepr-molecule-name">
          {activeMolecule.formula} — {activeMolecule.name}
        </span>
      </div>

      <div className="vsepr-grid">
        <div className="vsepr-stat">
          <span className="vsepr-stat-label">Central Atom</span>
          <span className="vsepr-stat-value">{centralAtom.element}</span>
        </div>
        <div className="vsepr-stat">
          <span className="vsepr-stat-label">Hybridization</span>
          <span className="vsepr-stat-value vsepr-hybrid">{vsepr.hybridization}</span>
        </div>
        <div className="vsepr-stat">
          <span className="vsepr-stat-label">Geometry</span>
          <span className="vsepr-stat-value">{vsepr.geometry}</span>
        </div>
        <div className="vsepr-stat">
          <span className="vsepr-stat-label">Bond Angle{vsepr.bondAngles.length > 1 ? "s" : ""}</span>
          <span className="vsepr-stat-value">
            {vsepr.bondAngles.map((a) => `${a}°`).join(", ")}
          </span>
        </div>
        <div className="vsepr-stat">
          <span className="vsepr-stat-label">Steric Number</span>
          <span className="vsepr-stat-value">{vsepr.stericNumber}</span>
        </div>
        <div className="vsepr-stat">
          <span className="vsepr-stat-label">Lone Pairs</span>
          <span className="vsepr-stat-value">{vsepr.lonePairs}</span>
        </div>
      </div>

      <div className="vsepr-notation">
        <span className="vsepr-notation-label">AXₙEₘ notation:</span>
        <span className="vsepr-notation-value">
          AX{vsepr.stericNumber - vsepr.lonePairs}
          {vsepr.lonePairs > 0 ? `E${vsepr.lonePairs}` : ""}
        </span>
      </div>
    </div>
  );
}
