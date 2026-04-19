"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  type Molecule,
  getAtomColor,
  getAtomRadius,
} from "../data/molecules";
import { useElementStore } from "../store/useElementStore";
import VSEPRGraphics from "./VSEPRGraphics";

interface MoleculeViewerProps {
  molecule: Molecule;
}

/**
 * Create a cylinder mesh connecting two 3D points.
 * Uses quaternion rotation to orient the cylinder correctly.
 */
function BondStick({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dir = b.clone().sub(a);
    const len = dir.length();

    // Cylinder is Y-aligned by default; rotate to match bond direction
    const yAxis = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(yAxis, dir.clone().normalize());

    return { position: mid, quaternion: quat, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.06, 0.06, length, 12]} />
      <meshPhysicalMaterial
        color="#888899"
        roughness={0.2}
        metalness={0.6}
        clearcoat={0.5}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function MoleculeViewer({ molecule }: MoleculeViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const showVSEPR = useElementStore((s) => s.showVSEPR);

  // Slow continuous rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Atoms */}
      {molecule.atoms.map((atom, i) => {
        const color = getAtomColor(atom.element);
        const radius = getAtomRadius(atom.element);
        return (
          <mesh key={`atom-${i}`} position={atom.position}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshPhysicalMaterial
              color={color}
              roughness={0.15}
              metalness={0.3}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={0.8}
            />
          </mesh>
        );
      })}

      {/* Bonds */}
      {molecule.bonds.map((bond, i) => (
        <BondStick
          key={`bond-${i}`}
          from={molecule.atoms[bond.from].position}
          to={molecule.atoms[bond.to].position}
        />
      ))}

      {/* VSEPR Geometry Overlay */}
      {showVSEPR && molecule.vsepr && (
        <VSEPRGraphics molecule={molecule} vsepr={molecule.vsepr} />
      )}

      {/* Subtle ambient glow */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
