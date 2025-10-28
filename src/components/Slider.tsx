import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useEffect, useMemo, useRef } from "react";

export function Slider({ imgSections }: { imgSections: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const backGroupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 1), []);
  //   const material = useMemo(() =>
  //   ), []);

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
    if (!groupRef.current || !backGroupRef.current) return;

    // lerp for smoothness * inertia not too much for more snappy
    offset.current += (target.current - offset.current) * 0.15;

    // ((offset.current % totalWidth) + totalWidth) makes sure the offset stays withing 0 and 2* totalWidth
    const loopX = (offset.current % totalWidth) + totalWidth;
    groupRef.current.position.x = -loopX;

    backGroupRef.current.position.x = -loopX * 0.5;
    backGroupRef.current.position.y = -2;
  });

  return (
    <>
      <group ref={backGroupRef}>
        {imgSections.map((section, i) => (
          <group key={i}>
            {[...Array(4)].map((_, j) => (
              <mesh
                key={j}
                geometry={geometry}
                position={[i * spacing, j * 1.5, -0.05]} // Y-stack + Z-depth
              >
                <meshBasicMaterial
                  map={new THREE.TextureLoader().load(section.at(-1)!)}
                  transparent
                  opacity={1 - j * 0.2}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      <group ref={groupRef}>
        {/* duplicate the sections for loop */}
        {[...imgSections, ...imgSections].map(
          (section: string[], i: number) => (
            <mesh
              key={i}
              geometry={geometry}
              material={
                new THREE.MeshBasicMaterial({
                  // -1 cause main images i put at the end
                  map: new THREE.TextureLoader().load(section.at(-1)!),
                })
              }
              position={[i * spacing, 0, 0]}
            />
          )
        )}
      </group>
    </>
  );
}
