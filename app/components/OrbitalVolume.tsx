"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useElementStore } from "../store/useElementStore";

/**
 * OrbitalVolume renders a volumetric atomic orbital using a raymarching shader.
 * It implements Spherical Harmonics and Radial Wave Functions directly in GLSL.
 */
export default function OrbitalVolume() {
  const { n, l, m } = useElementStore((s) => s.quantumState);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uN: { value: n },
    uL: { value: l },
    uM: { value: m },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1000, 1000) },
  }), [n, l, m]);

  useFrame((state) => {
    if (meshRef.current) {
      // @ts-ignore
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const vertexShader = `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform int uN;
    uniform int uL;
    uniform int uM;
    uniform float uTime;
    varying vec3 vPosition;

    #define PI 3.14159265359

    // Factorial helper
    float factorial(int n) {
      float res = 1.0;
      for (int i = 2; i <= 10; i++) {
        if (i > n) break;
        res *= float(i);
      }
      return res;
    }

    // Associated Legendre Polynomials P_l^m(x)
    // Simplified versions for l=0..4
    float P(int l, int m, float x) {
      int am = abs(uM);
      if (l == 0) return 1.0;
      if (l == 1) {
        if (am == 0) return x;
        if (am == 1) return sqrt(1.0 - x*x);
      }
      if (l == 2) {
        if (am == 0) return 0.5 * (3.0*x*x - 1.0);
        if (am == 1) return 3.0 * x * sqrt(1.0 - x*x);
        if (am == 2) return 3.0 * (1.0 - x*x);
      }
      if (l == 3) {
        if (am == 0) return 0.5 * (5.0*x*x*x - 3.0*x);
        if (am == 1) return 1.5 * (5.0*x*x - 1.0) * sqrt(1.0 - x*x);
        if (am == 2) return 15.0 * x * (1.0 - x*x);
        if (am == 3) return 15.0 * pow(1.0 - x*x, 1.5);
      }
      if (l == 4) {
        if (am == 0) return 0.125 * (35.0*x*x*x*x - 30.0*x*x + 3.0);
        if (am == 1) return 2.5 * (7.0*x*x*x - 3.0*x) * sqrt(1.0 - x*x);
        if (am == 2) return 7.5 * (7.0*x*x - 1.0) * (1.0 - x*x);
        if (am == 3) return 105.0 * x * pow(1.0 - x*x, 1.5);
        if (am == 4) return 105.0 * pow(1.0 - x*x, 2.0);
      }
      // Fallback
      return 1.0;
    }

    // Radial function R_nl(r)
    // Uses a simplified Laguerre approach for visualization
    float radial(int n, int l, float r) {
      float rho = 2.0 * r / float(uN);
      float L = 1.0;
      
      // Manual Laguerre-like polynomial variations
      if (n - l - 1 == 1) L = (float(2*l + 2) - rho);
      if (n - l - 1 == 2) L = 0.5 * (rho*rho - 2.0*rho*float(2*l+3) + float((2*l+3)*(2*l+2)));
      if (n - l - 1 >= 3) L = (rho*rho - 6.0*rho + 6.0); // Generic cubic

      return exp(-rho/2.0) * pow(rho, float(uL)) * L;
    }

    void main() {
      // Raymarching setup
      vec3 rayDir = normalize(vPosition);
      vec3 rayOrigin = vec3(0.0);
      
      float totalDensity = 0.0;
      vec3 totalColor = vec3(0.0);
      
      // Step through the volume
      const int steps = 40;
      float stepSize = 0.25;
      
      for(int i = 0; i < steps; i++) {
        vec3 p = rayDir * float(i) * stepSize;
        float r = length(p);
        if (r > 10.0) break;

        // Spherical coordinates
        float theta = acos(clamp(p.z / (r + 0.0001), -1.0, 1.0));
        float phi = atan(p.y, p.x);

        // Calculate Y_lm
        float angular = P(uL, uM, cos(theta));
        if (uM > 0) angular *= cos(float(uM) * phi);
        else if (uM < 0) angular *= sin(float(-uM) * phi);

        float psi = radial(uN, uL, r) * angular;
        float prob = psi * psi;

        if (prob > 0.005) {
          vec3 phaseColor = psi > 0.0 ? vec3(0.0, 1.0, 1.0) : vec3(1.0, 0.0, 1.0);
          float alpha = prob * 0.15;
          totalColor += phaseColor * alpha;
          totalDensity += alpha;
        }

        if (totalDensity >= 1.0) break;
      }

      if (totalDensity < 0.01) discard;
      gl_FragColor = vec4(totalColor, totalDensity);
    }
  `;

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[10, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Coordinate System Axes */}
      <group scale={[5, 5, 5]}>
        <primitive object={new THREE.AxesHelper(1)} />
        {/* Labels for axes */}
        <Html position={[1.1, 0, 0]} center>
          <div className="axis-label x-axis">X</div>
        </Html>
        <Html position={[0, 1.1, 0]} center>
          <div className="axis-label y-axis">Y</div>
        </Html>
        <Html position={[0, 0, 1.1]} center>
          <div className="axis-label z-axis">Z</div>
        </Html>
      </group>
    </group>
  );
}

// Helper wrapper for Html (imported from drei)
import { Html } from "@react-three/drei";
