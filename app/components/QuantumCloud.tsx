"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface QuantumCloudProps {
  totalElectrons: number;
}

/**
 * Generates a quantum probability cloud using an exponential radial
 * decay distribution. Points are concentrated near the nucleus and
 * fade outward — mimicking the 1s/2s/2p… probability densities.
 */
function generateCloudPoints(
  totalElectrons: number
): { positions: Float32Array; colors: Float32Array } {
  // Scale point count with electron count, clamped between 3k–10k
  const count = Math.min(10000, Math.max(3000, totalElectrons * 120));
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  // Decay constant — heavier atoms have tighter inner density
  const decay = 0.6 + Math.log(totalElectrons + 1) * 0.25;
  // Max radius scales with shells
  const maxRadius = 2 + Math.pow(totalElectrons, 0.35) * 1.8;

  // Color palette for probability layers (inner → outer)
  const innerColor = new THREE.Color("#a78bfa"); // violet
  const midColor = new THREE.Color("#22d3ee"); // cyan
  const outerColor = new THREE.Color("#6366f1"); // indigo

  for (let i = 0; i < count; i++) {
    // Inverse CDF sampling for exponential radial distribution
    const u = Math.random();
    const r = -Math.log(1 - u * (1 - Math.exp(-decay * maxRadius))) / decay;

    // Uniform sphere direction
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // Color by radial distance
    const t = Math.min(r / maxRadius, 1);
    const color = new THREE.Color();
    if (t < 0.4) {
      color.lerpColors(innerColor, midColor, t / 0.4);
    } else {
      color.lerpColors(midColor, outerColor, (t - 0.4) / 0.6);
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return { positions, colors };
}

export default function QuantumCloud({ totalElectrons }: QuantumCloudProps) {
  const groupRef = useRef<THREE.Group>(null);

  const { positions, colors } = useMemo(
    () => generateCloudPoints(totalElectrons),
    [totalElectrons]
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.55}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Larger, softer outer glow layer */}
      <points geometry={geometry}>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.08}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
