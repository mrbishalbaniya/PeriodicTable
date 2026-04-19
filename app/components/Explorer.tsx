"use client";

import { useElementStore } from "../store/useElementStore";
import { Atom } from "lucide-react";
import {
  elements,
  CATEGORIES,
  CATEGORY_COLORS,
  type Element,
} from "../data/elements";

function ElementCell({ element }: { element: Element }) {
  const activeFilter = useElementStore((s) => s.activeFilter);
  const selectedElement = useElementStore((s) => s.selectedElement);
  const appMode = useElementStore((s) => s.appMode);
  const setSelectedElement = useElementStore((s) => s.setSelectedElement);
  const addToWorkbench = useElementStore((s) => s.addToWorkbench);

  const isFiltered = activeFilter && element.category !== activeFilter;
  const isSelected =
    appMode === "explore" &&
    selectedElement.atomicNumber === element.atomicNumber;
  const categoryColor = CATEGORY_COLORS[element.category] || "#888";

  const handleClick = () => {
    if (appMode === "sandbox") {
      addToWorkbench(element);
    } else {
      setSelectedElement(element);
    }
  };

  return (
    <button
      id={`element-${element.atomicNumber}`}
      className={`element-cell ${isSelected ? "element-selected" : ""}`}
      style={{
        gridColumn: element.gridColumn,
        gridRow: element.gridRow,
        opacity: isFiltered ? 0.15 : 1,
        borderColor: isSelected ? categoryColor : "transparent",
        "--cat-color": categoryColor,
      } as React.CSSProperties}
      onClick={handleClick}
      title={
        appMode === "sandbox"
          ? `Add ${element.name} to workbench`
          : `${element.name} (${element.symbol})`
      }
    >
      <span className="element-number">{element.atomicNumber}</span>
      <span className="element-symbol" style={{ color: categoryColor }}>
        {element.symbol}
      </span>
      <span className="element-name">{element.name}</span>
    </button>
  );
}

export default function Explorer() {
  const activeFilter = useElementStore((s) => s.activeFilter);
  const setActiveFilter = useElementStore((s) => s.setActiveFilter);
  const appMode = useElementStore((s) => s.appMode);

  return (
    <div className="explorer-container" id="explorer">
      <div className="explorer-header">
        <h1 className="explorer-title">
          <span className="title-accent"><Atom size={28} strokeWidth={2.5} /></span> Periodic Table
        </h1>
        <p className="explorer-subtitle">
          {appMode === "explore"
            ? "Click any element to explore its atomic structure in 3D"
            : "Click elements to add them to the workbench"}
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="filter-bar" id="filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.replace(/\s+/g, "-").toLowerCase()}`}
            className={`filter-btn ${activeFilter === cat ? "filter-active" : ""}`}
            style={{
              "--filter-color": CATEGORY_COLORS[cat],
            } as React.CSSProperties}
            onClick={() => setActiveFilter(cat)}
          >
            <span
              className="filter-dot"
              style={{ background: CATEGORY_COLORS[cat] }}
            />
            {cat}
          </button>
        ))}
      </div>

      {/* Periodic Table Grid */}
      <div className="periodic-table" id="periodic-table">
        {elements.map((el) => (
          <ElementCell key={el.atomicNumber} element={el} />
        ))}

        {/* Lanthanide/Actinide placeholder markers */}
        <div
          className="series-marker"
          style={{ gridColumn: 3, gridRow: 6 }}
        >
          <span style={{ color: CATEGORY_COLORS["Lanthanide"] }}>La-Lu</span>
        </div>
        <div
          className="series-marker"
          style={{ gridColumn: 3, gridRow: 7 }}
        >
          <span style={{ color: CATEGORY_COLORS["Actinide"] }}>Ac-Lr</span>
        </div>
      </div>
    </div>
  );
}
