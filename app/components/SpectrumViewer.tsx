"use client";

import { useElementStore } from "../store/useElementStore";
import { getSpectrum, wavelengthToRGB } from "../data/spectra";

/**
 * 2D Emission Spectrum "barcode" viewer.
 * Maps element emission wavelengths to colored vertical lines
 * on a 400nm–700nm visible spectrum scale.
 */
export default function SpectrumViewer() {
  const selectedElement = useElementStore((s) => s.selectedElement);
  const emissionColor = useElementStore((s) => s.emissionColor);
  const spectrum = getSpectrum(selectedElement.atomicNumber);

  const MIN_NM = 380;
  const MAX_NM = 720;
  const RANGE = MAX_NM - MIN_NM;

  return (
    <div
      className={`spectrum-viewer ${emissionColor ? "spectrum-flash" : ""}`}
      id="spectrum-viewer"
      style={{
        "--flash-color": emissionColor || "transparent",
      } as React.CSSProperties}
    >
      <div className="spectrum-labels">
        <span className="spectrum-label-title">
          Emission Spectrum
        </span>
        <span className="spectrum-label-element">
          {selectedElement.symbol} — {selectedElement.name}
        </span>
      </div>

      <div className="spectrum-barcode" id="spectrum-barcode">
        {/* Gradient background representing visible spectrum faintly */}
        <div className="spectrum-bg" />

        {/* Emission lines */}
        {spectrum.lines.map((nm, i) => {
          const pct = ((nm - MIN_NM) / RANGE) * 100;
          const color = wavelengthToRGB(nm);
          return (
            <div
              key={`line-${i}`}
              className="spectrum-line"
              style={{
                left: `${pct}%`,
                background: color,
                boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
              }}
              title={`${nm} nm`}
            />
          );
        })}

        {/* nm scale markers */}
        {[400, 450, 500, 550, 600, 650, 700].map((nm) => {
          const pct = ((nm - MIN_NM) / RANGE) * 100;
          return (
            <span
              key={`tick-${nm}`}
              className="spectrum-tick"
              style={{ left: `${pct}%` }}
            >
              {nm}
            </span>
          );
        })}
      </div>
    </div>
  );
}
