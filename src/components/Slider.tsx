import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useEffect, useMemo, useRef } from "react";
import { useFBO } from "@react-three/drei";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import { disp } from "../assets/img";

export function Slider({ imgSections }: { imgSections: any }) {
  const groupRef = useRef<THREE.Group>(null);

  var aspect = window.innerWidth / window.innerHeight;

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  const { gl, camera, scene, size } = useThree();

  console.log(camera);

  let renderTarget = useFBO(size.width, size.height, {
    format: THREE.RGBAFormat,
    magFilter: THREE.NearestFilter,
    minFilter: THREE.NearestFilter,
  });
  let renderTarget1 = useFBO(size.width, size.height, {
    format: THREE.RGBAFormat,
    magFilter: THREE.NearestFilter,
    minFilter: THREE.NearestFilter,
  });

  const sceneQuad = new THREE.Scene();
  // const materialQuad = new THREE.MeshBasicMaterial({});
  const materialQuad = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTexture: { value: null },
      uTime: { value: 0 },
      uSpeed: { value: 0 },
      uDir: { value: 0 },
      uDisp: { value: new THREE.TextureLoader().load(disp) },
    },
    vertexShader: vertexShader,
    // transparent: true,
    // depthWrite: true,
    fragmentShader: fragmentShader,
  });

  const quad = new THREE.Mesh(
    new THREE.PlaneGeometry(3 * aspect, 3),
    materialQuad
  );
  sceneQuad.add(quad);

  const backgroundQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(3 * aspect, 3),
    new THREE.MeshBasicMaterial({})
  );
  backgroundQuad.position.z = -0.5;
  scene.add(backgroundQuad);

  const spacing = 1.1;
  const totalWidth = spacing * imgSections.length;

  const offset = useRef(0);
  const target = useRef(0);

  useFrame(() => {
    gl.autoClear = false;
    // render base scene
    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);

    // render distorted texture
    gl.setRenderTarget(renderTarget1);
    materialQuad.uniforms.uTexture.value = renderTarget.texture;
    // set a speed limiter
    materialQuad.uniforms.uSpeed.value = Math.min(0.3, Math.abs(offset.current.valueOf()));
    materialQuad.uniforms.uDir.value = Math.sign(offset.current.valueOf());

    gl.render(sceneQuad, camera);

    gl.clearDepth();
    // final scene
    gl.setRenderTarget(null);
    backgroundQuad.material.map = renderTarget1.texture;
    gl.render(scene, camera);
  });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      console.log(e)
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
    const loopX = (offset.current % totalWidth) + totalWidth;
    groupRef.current.position.x = -loopX;
  });

  return (
    <>
      {/* duplicate the sections for loop */}
      <group ref={groupRef}>
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
