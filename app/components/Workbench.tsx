"use client";

import { useElementStore } from "../store/useElementStore";
import { CATEGORY_COLORS } from "../data/elements";
import { useEffect } from "react";
import {
  Beaker,
  Plus,
  X,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from "lucide-react";

export default function Workbench() {
  const workbench = useElementStore((s) => s.workbench);
  const activeMolecule = useElementStore((s) => s.activeMolecule);
  const bondError = useElementStore((s) => s.bondError);
  const showVSEPR = useElementStore((s) => s.showVSEPR);
  const removeFromWorkbench = useElementStore((s) => s.removeFromWorkbench);
  const clearWorkbench = useElementStore((s) => s.clearWorkbench);
  const bondElements = useElementStore((s) => s.bondElements);
  const clearBondError = useElementStore((s) => s.clearBondError);
  const toggleVSEPR = useElementStore((s) => s.toggleVSEPR);

  // Auto-clear error after 3 seconds
  useEffect(() => {
    if (!bondError) return;
    const timer = setTimeout(() => clearBondError(), 3000);
    return () => clearTimeout(timer);
  }, [bondError, clearBondError]);

  return (
    <div className="workbench" id="workbench">
      <div className="workbench-header">
        <span className="workbench-title">
          <Beaker size={18} className="title-icon" strokeWidth={2.5} /> Workbench
        </span>
        <span className="workbench-count">
          {workbench.length}/5 elements
        </span>
      </div>

      <div className="workbench-slots">
        {Array.from({ length: 5 }).map((_, i) => {
          const el = workbench[i];
          if (!el) {
            return (
              <div key={`slot-${i}`} className="workbench-slot slot-empty">
                <Plus size={20} className="slot-plus-icon" strokeWidth={1.5} />
              </div>
            );
          }
          const color = CATEGORY_COLORS[el.category] || "#888";
          return (
            <div
              key={`slot-${i}`}
              className="workbench-slot slot-filled"
              style={{ borderColor: color }}
            >
              <button
                className="slot-remove"
                onClick={() => removeFromWorkbench(i)}
                title="Remove"
              >
                <X size={12} />
              </button>
              <span className="slot-symbol" style={{ color }}>
                {el.symbol}
              </span>
              <span className="slot-name">{el.name}</span>
            </div>
          );
        })}
      </div>

      <div className="workbench-actions">
        <button
          className="btn-bond"
          onClick={bondElements}
          disabled={workbench.length < 2}
          id="bond-btn"
        >
          <FlaskConical size={16} />
          Synthesize
        </button>
        <button
          className="btn-clear"
          onClick={clearWorkbench}
          disabled={workbench.length === 0}
          id="clear-btn"
        >
          Clear
        </button>
      </div>

      {/* Result display */}
      {activeMolecule && (
        <div className="workbench-result result-success">
          <CheckCircle2 size={16} className="result-icon-lucide" />
          <div>
            <strong>{activeMolecule.formula}</strong>
            <span className="result-name"> — {activeMolecule.name}</span>
          </div>
        </div>
      )}

      {/* VSEPR Toggle — shown only for molecules with VSEPR data */}
      {activeMolecule?.vsepr && (
        <button
          className={`btn-vsepr ${showVSEPR ? "btn-vsepr-active" : ""}`}
          onClick={toggleVSEPR}
          id="vsepr-toggle-btn"
        >
          <Compass size={16} className={showVSEPR ? "animate-spin-slow" : ""} />
          <span>{showVSEPR ? "Hide VSEPR" : "Show VSEPR Geometry"}</span>
        </button>
      )}

      {bondError && (
        <div className="workbench-result result-error">
          <AlertTriangle size={16} className="result-icon-lucide" />
          <span>{bondError}</span>
        </div>
      )}
    </div>
  );
}
