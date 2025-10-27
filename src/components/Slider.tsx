import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useEffect, useMemo, useRef } from "react";

export function Slider({ imgSections }: { imgSections: any }) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 1), []);
  const material = useMemo(() => new THREE.ShaderMaterial(), []);

  const spacing = 1.5;
  const totalWidth = spacing * imgSections.length;

  const offset = useRef(0);
  const target = useRef(0);

  const { gl } = useThree();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      target.current += e.deltaY * 0.01;
    };

    const dom = gl.domElement;
    dom.addEventListener("wheel", handleWheel, { passive: true });
    return () => dom.removeEventListener("wheel", handleWheel);
  }, [gl]);

  useFrame(() => {
    if (!groupRef.current) return;

    // lerp for smoothness * inertia not too much for more snappy
    offset.current += (target.current - offset.current) * 0.15;

    // ((offset.current % totalWidth) + totalWidth) makes sure the offset stays withing 0 and 2* totalWidth
    // mod it to totalWidth again to make sure the next totalWidth is already loaded before going into it
    const loopX = ((offset.current % totalWidth) + totalWidth) % totalWidth;
    groupRef.current.position.x = -loopX;
  });

  return (
    <group ref={groupRef}>
      {/* duplicate the sections for loop */}
      {[...imgSections, ...imgSections].map((_: any, i: number) => (
        <mesh
          key={i}
          geometry={geometry}
          material={material}
          position={[i * spacing, 0, 0]}
        />
      ))}
    </group>
  );
}
