"use client";

import dynamic from "next/dynamic";
import Explorer from "./components/Explorer";
import Workbench from "./components/Workbench";
import { useElementStore } from "./store/useElementStore";
import { Search, FlaskConical, Orbit } from "lucide-react";

const AtomicSimulator = dynamic(
  () => import("./components/AtomicSimulator"),
  { ssr: false }
);

const OrbitalControls = dynamic(
  () => import("./components/OrbitalControls"),
  { ssr: false }
);

function AppModeToggle() {
  const appMode = useElementStore((s) => s.appMode);
  const setAppMode = useElementStore((s) => s.setAppMode);

  return (
    <div className="app-mode-toggle" id="app-mode-toggle">
      <button
        className={`app-mode-btn ${appMode === "explore" ? "app-mode-active" : ""}`}
        onClick={() => setAppMode("explore")}
        id="app-mode-explore"
      >
        <Search size={16} strokeWidth={2.5} />
        Explore
      </button>
      <button
        className={`app-mode-btn ${appMode === "sandbox" ? "app-mode-active" : ""}`}
        onClick={() => setAppMode("sandbox")}
        id="app-mode-sandbox"
      >
        <FlaskConical size={16} strokeWidth={2.5} />
        Sandbox
      </button>
      <button
        className={`app-mode-btn ${appMode === "orbitals" ? "app-mode-active" : ""}`}
        onClick={() => setAppMode("orbitals")}
        id="app-mode-orbitals"
      >
        <Orbit size={16} strokeWidth={2.5} />
        Orbitals
      </button>
    </div>
  );
}

export default function Home() {
  const appMode = useElementStore((s) => s.appMode);

  return (
    <main className="app-layout" id="app-root">
      <section className="pane-explorer">
        <AppModeToggle />
        {appMode === "orbitals" ? <OrbitalControls /> : <Explorer />}
        {appMode === "sandbox" && <Workbench />}
      </section>
      <section className="pane-simulator">
        <AtomicSimulator />
      </section>
    </main>
  );
}
