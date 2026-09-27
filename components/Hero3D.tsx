"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * Geometry generation — runs once, memoized.
 * Point budget is hard-capped well under 3000 for mobile GPUs.
 * ------------------------------------------------------------------ */

const RADIUS = 2.45;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

type NetworkGeometry = {
  nodes: Float32Array;
  hubs: Float32Array;
  edges: Float32Array;
};

function buildNetwork(pointCount: number, maxEdges: number): NetworkGeometry {
  const count = Math.min(Math.max(pointCount, 300), 2600);
  const nodes = new Float32Array(count * 3);
  const raw: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;

    // Slight jitter so the spiral does not read as a mechanical pattern.
    const r = RADIUS * (0.985 + Math.random() * 0.03);
    const x = Math.cos(theta) * ring * r;
    const z = Math.sin(theta) * ring * r;
    const yy = y * r;

    nodes[i * 3] = x;
    nodes[i * 3 + 1] = yy;
    nodes[i * 3 + 2] = z;
    raw.push(new THREE.Vector3(x, yy, z));
  }

  // Gold "validator hub" nodes: a sparse subset rendered larger.
  const hubCount = Math.max(8, Math.floor(count / 90));
  const hubs = new Float32Array(hubCount * 3);
  const hubIndices: number[] = [];
  for (let h = 0; h < hubCount; h++) {
    const idx = Math.floor((h + 0.5) * (count / hubCount));
    hubIndices.push(idx);
    hubs[h * 3] = raw[idx].x * 1.012;
    hubs[h * 3 + 1] = raw[idx].y * 1.012;
    hubs[h * 3 + 2] = raw[idx].z * 1.012;
  }

  // Edges: neighbour scan within a small index window keeps this O(n * k).
  const segments: number[] = [];
  const threshold = RADIUS * 0.24;
  const window = 26;

  for (let i = 0; i < count && segments.length / 6 < maxEdges; i++) {
    const a = raw[i];
    for (let k = 1; k <= window; k++) {
      const j = i + k;
      if (j >= count) break;
      const b = raw[j];
      if (a.distanceTo(b) > threshold) continue;
      if (Math.random() > 0.22) continue; // thin it out visually
      segments.push(a.x, a.y, a.z, b.x, b.y, b.z);
      if (segments.length / 6 >= maxEdges) break;
    }
  }

  // A handful of long-haul "synchronizer" links across the sphere.
  for (let h = 0; h < hubIndices.length - 1; h += 2) {
    const a = raw[hubIndices[h]];
    const b = raw[hubIndices[h + 1]];
    segments.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }

  return { nodes, hubs, edges: new Float32Array(segments) };
}

/* ------------------------------------------------------------------ *
 * Soft round sprite for the points, generated on a 64px canvas.
 * ------------------------------------------------------------------ */

function useDotTexture(): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.65, "rgba(255,255,255,0.25)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    setTexture(tex);

    return () => tex.dispose();
  }, []);

  return texture;
}

/* ------------------------------------------------------------------ *
 * Scene
 * ------------------------------------------------------------------ */

function NetworkGlobe({
  pointCount,
  maxEdges,
  interactive,
}: {
  pointCount: number;
  maxEdges: number;
  interactive: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const hubMaterial = useRef<THREE.PointsMaterial>(null);
  const { nodes, hubs, edges } = useMemo(
    () => buildNetwork(pointCount, maxEdges),
    [pointCount, maxEdges]
  );
  const dot = useDotTexture();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    // Clamp delta so a backgrounded tab does not snap the rotation forward.
    const d = Math.min(delta, 0.05);
    g.rotation.y += d * 0.085;

    if (interactive) {
      const targetX = state.pointer.y * 0.2 + 0.14;
      const targetZ = state.pointer.x * 0.05;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.04);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, targetZ, 0.04);
      g.position.x = THREE.MathUtils.lerp(
        g.position.x,
        state.pointer.x * 0.18,
        0.04
      );
    }

    if (hubMaterial.current) {
      const t = state.clock.elapsedTime;
      hubMaterial.current.opacity = 0.55 + Math.sin(t * 1.6) * 0.35;
    }
  });

  return (
    <group ref={group} rotation={[0.14, 0, 0]}>
      {/* Opaque core so back-facing points are correctly occluded */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.94, 48, 48]} />
        <meshBasicMaterial color="#06090F" />
      </mesh>

      {/* Faint wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[RADIUS * 0.965, 2]} />
        <meshBasicMaterial
          color="#00D1FF"
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Connection mesh */}
      {edges.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[edges, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00D1FF"
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {/* Participant nodes — Canton cyan */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color="#00D1FF"
          map={dot ?? undefined}
          alphaMap={dot ?? undefined}
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Validator hubs — Canton gold, gently pulsing */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[hubs, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={hubMaterial}
          size={0.14}
          color="#D4A017"
          map={dot ?? undefined}
          alphaMap={dot ?? undefined}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Public component
 * ------------------------------------------------------------------ */

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function Hero3D({
  className = "",
  pointCount = 2200,
  maxEdges = 900,
}: {
  className?: string;
  pointCount?: number;
  maxEdges?: number;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setSupported(hasWebGL());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Stop rendering entirely once the hero scrolls off screen.
  useEffect(() => {
    const el = wrapper.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768 ? true : false;
  const effectivePoints = isMobile ? Math.min(pointCount, 1200) : pointCount;
  const effectiveEdges = isMobile ? Math.min(maxEdges, 420) : maxEdges;

  return (
    <div ref={wrapper} className={`relative h-full w-full ${className}`}>
      {/* Ambient glow behind the canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-canton-radial"
      />

      {supported === false ? (
        <div
          aria-hidden
          className="absolute inset-0 grid-bg opacity-60 animate-pulse-glow"
        />
      ) : supported === true ? (
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 1.8]}
          camera={{ position: [0, 0, 6.6], fov: 45, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#06090F"), 0);
          }}
          className="!absolute inset-0"
        >
          <NetworkGlobe
            pointCount={effectivePoints}
            maxEdges={effectiveEdges}
            interactive={!reducedMotion}
          />
        </Canvas>
      ) : null}

      {/* Fade the globe into the page background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-canton-black"
      />
    </div>
  );
}
