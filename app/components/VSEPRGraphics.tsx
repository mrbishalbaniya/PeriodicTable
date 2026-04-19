"use client";

import { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Molecule, VSEPRData } from "../data/molecules";

interface VSEPRGraphicsProps {
  molecule: Molecule;
  vsepr: VSEPRData;
}

/**
 * Visualize a single angle arc between two bond vectors from a central atom.
 * Uses a TorusGeometry slice rotated into the plane formed by the two vectors.
 */
function AngleArc({
  center,
  posA,
  posB,
  angle,
}: {
  center: THREE.Vector3;
  posA: THREE.Vector3;
  posB: THREE.Vector3;
  angle: number;
}) {
  const midpoint = useMemo(() => {
    const dirA = posA.clone().sub(center).normalize();
    const dirB = posB.clone().sub(center).normalize();

    // Plane normal = cross product of the two bond vectors
    const normal = new THREE.Vector3().crossVectors(dirA, dirB).normalize();

    // If vectors are parallel (cross product is zero), skip
    if (normal.length() < 0.001) {
      return center;
    }

    const arcRadius = 0.55;

    // Bisector for label positioning
    const bisector = dirA.clone().add(dirB).normalize();
    const mid = center.clone().add(bisector.multiplyScalar(arcRadius + 0.3));

    return mid;
  }, [center, posA, posB]);

  const arcAngle = useMemo(() => {
    const dirA = posA.clone().sub(center).normalize();
    const dirB = posB.clone().sub(center).normalize();
    return dirA.angleTo(dirB);
  }, [center, posA, posB]);

  // Build arc geometry manually using points
  const arcGeometry = useMemo(() => {
    const dirA = posA.clone().sub(center).normalize();
    const dirB = posB.clone().sub(center).normalize();
    const normal = new THREE.Vector3().crossVectors(dirA, dirB).normalize();

    if (normal.length() < 0.001) return null;

    const radius = 0.55;
    const segments = 32;
    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Slerp between dirA and dirB
      const theta = arcAngle * t;
      // Rotate dirA around normal by theta
      const rotated = dirA.clone().applyAxisAngle(normal, theta);
      points.push(center.clone().add(rotated.multiplyScalar(radius)));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [center, posA, posB, arcAngle]);

  if (!arcGeometry) return null;

  return (
    <>
      {/* Arc line */}
      <primitive object={new THREE.Line(arcGeometry)}>
        <lineBasicMaterial color="#f59e0b" opacity={0.7} transparent linewidth={2} />
      </primitive>

      {/* Angle label */}
      <Html position={midpoint.toArray()} center style={{ pointerEvents: "none" }}>
        <div style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          color: "#fbbf24",
          fontSize: "11px",
          fontWeight: 700,
          padding: "2px 7px",
          borderRadius: "6px",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          whiteSpace: "nowrap",
          fontFamily: "'Inter', sans-serif",
        }}>
          {angle}°
        </div>
      </Html>
    </>
  );
}

/**
 * Visualize a lone pair as a translucent yellow lobe.
 * Positions are computed to fill the "empty" directions
 * in the steric arrangement around the central atom.
 */
function LonePairLobe({
  position,
  direction,
}: {
  position: THREE.Vector3;
  direction: THREE.Vector3;
}) {
  const { pos, quaternion } = useMemo(() => {
    const lobeCenter = position.clone().add(direction.clone().multiplyScalar(0.7));
    // Rotate the elongated sphere to point along the direction
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    return { pos: lobeCenter, quaternion: quat };
  }, [position, direction]);

  return (
    <mesh position={pos.toArray()} quaternion={quaternion} scale={[0.3, 0.5, 0.3]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={0.4}
        transparent
        opacity={0.22}
        side={THREE.DoubleSide}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Full VSEPR overlay: angle arcs, labels, and lone pair lobes.
 */
export default function VSEPRGraphics({ molecule, vsepr }: VSEPRGraphicsProps) {
  const centralPos = new THREE.Vector3(...molecule.atoms[vsepr.centralAtomIndex].position);

  // Gather all bond vectors from central atom
  const bondVectors = useMemo(() => {
    return molecule.bonds
      .filter((b) => b.from === vsepr.centralAtomIndex || b.to === vsepr.centralAtomIndex)
      .map((b) => {
        const otherIdx = b.from === vsepr.centralAtomIndex ? b.to : b.from;
        return new THREE.Vector3(...molecule.atoms[otherIdx].position);
      });
  }, [molecule, vsepr.centralAtomIndex]);

  // Compute lone pair directions
  // These fill the "missing" steric positions
  const lonePairDirections = useMemo(() => {
    if (vsepr.lonePairs === 0) return [];

    const bondDirs = bondVectors.map((v) =>
      v.clone().sub(centralPos).normalize()
    );

    // Strategy: Use the known geometry to place lone pairs
    // The lone pairs go where bonds would be in the ideal geometry
    const directions: THREE.Vector3[] = [];

    if (vsepr.lonePairs === 1 && vsepr.stericNumber === 4) {
      // Trigonal pyramidal (like NH3): lone pair opposite the bonds
      const avg = bondDirs.reduce((a, b) => a.clone().add(b), new THREE.Vector3()).normalize();
      directions.push(avg.negate());
    } else if (vsepr.lonePairs === 2 && vsepr.stericNumber === 4) {
      // Bent (like H2O): two lone pairs above the molecule plane
      const avg = bondDirs.reduce((a, b) => a.clone().add(b), new THREE.Vector3()).normalize();
      const normal = new THREE.Vector3().crossVectors(
        bondDirs[0] || new THREE.Vector3(1, 0, 0),
        bondDirs[1] || new THREE.Vector3(0, 0, 1)
      ).normalize();

      // Two lone pairs spread above/below the bond plane
      const loneDir1 = avg.clone().negate().add(normal.clone().multiplyScalar(0.5)).normalize();
      const loneDir2 = avg.clone().negate().add(normal.clone().multiplyScalar(-0.5)).normalize();
      directions.push(loneDir1, loneDir2);
    } else if (vsepr.lonePairs === 3) {
      // Like HCl: 3 lone pairs around Cl
      const bondDir = bondDirs[0] || new THREE.Vector3(1, 0, 0);
      const perp1 = new THREE.Vector3();
      if (Math.abs(bondDir.x) < 0.9) {
        perp1.crossVectors(bondDir, new THREE.Vector3(1, 0, 0)).normalize();
      } else {
        perp1.crossVectors(bondDir, new THREE.Vector3(0, 1, 0)).normalize();
      }
      const perp2 = new THREE.Vector3().crossVectors(bondDir, perp1).normalize();

      directions.push(bondDir.clone().negate());
      directions.push(perp1);
      directions.push(perp2);
    } else if (vsepr.lonePairs >= 1) {
      // Fallback: point lone pairs away from bonds
      const avg = bondDirs.reduce((a, b) => a.clone().add(b), new THREE.Vector3()).normalize();
      directions.push(avg.negate());
      for (let i = 1; i < vsepr.lonePairs; i++) {
        const offset = new THREE.Vector3(
          Math.sin(i * Math.PI * 2 / vsepr.lonePairs) * 0.5,
          Math.cos(i * Math.PI * 2 / vsepr.lonePairs) * 0.5,
          0
        );
        directions.push(avg.clone().negate().add(offset).normalize());
      }
    }

    return directions;
  }, [bondVectors, vsepr, centralPos]);

  // Generate angle arcs between consecutive bond pairs
  const anglePairs = useMemo(() => {
    if (bondVectors.length < 2) return [];
    const pairs: { a: THREE.Vector3; b: THREE.Vector3; angle: number }[] = [];

    // For molecules with a single bond angle, show arcs between adjacent pairs
    if (vsepr.bondAngles.length === 1) {
      // Show all unique bond pairs
      for (let i = 0; i < bondVectors.length; i++) {
        for (let j = i + 1; j < bondVectors.length; j++) {
          pairs.push({
            a: bondVectors[i],
            b: bondVectors[j],
            angle: vsepr.bondAngles[0],
          });
          // Limit to 4 arcs for visual clarity
          if (pairs.length >= 4) return pairs;
        }
      }
    } else {
      // Multiple distinct angles — use in order
      for (let i = 0; i < Math.min(bondVectors.length - 1, vsepr.bondAngles.length); i++) {
        pairs.push({
          a: bondVectors[i],
          b: bondVectors[i + 1],
          angle: vsepr.bondAngles[i],
        });
      }
    }

    return pairs;
  }, [bondVectors, vsepr.bondAngles]);

  return (
    <group>
      {/* Angle arcs with labels */}
      {anglePairs.map((pair, i) => (
        <AngleArc
          key={`arc-${i}`}
          center={centralPos}
          posA={pair.a}
          posB={pair.b}
          angle={pair.angle}
        />
      ))}

      {/* Lone pair lobes */}
      {lonePairDirections.map((dir, i) => (
        <LonePairLobe
          key={`lp-${i}`}
          position={centralPos}
          direction={dir}
        />
      ))}

      {/* Central atom highlight ring */}
      <mesh position={centralPos.toArray()} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.6, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
