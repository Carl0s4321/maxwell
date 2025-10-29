import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useEffect, useMemo, useRef } from "react";
import { useFBO } from "@react-three/drei";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import { disp } from "../assets/img";

export function Slider({
  imgSections,
  tl,
}: {
  imgSections: any;
  tl: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  var aspect = window.innerWidth / window.innerHeight;

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  const { gl, camera, scene, size } = useThree();

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

  const scroll = useRef(0);
  const scrollTarget = useRef(0);
  const currScroll = useRef(0);

  useFrame(() => {
    gl.autoClear = false;
    // render base scene
    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);

    // render distorted texture
    gl.setRenderTarget(renderTarget1);
    materialQuad.uniforms.uTexture.value = renderTarget.texture;
    // set a speed limiter
    materialQuad.uniforms.uSpeed.value = Math.min(
      0.5,
      Math.abs(scroll.current)
    );
    materialQuad.uniforms.uDir.value = Math.sign(scroll.current);

    gl.render(sceneQuad, camera);

    gl.clearDepth();
    // final scene
    gl.setRenderTarget(null);
    backgroundQuad.material.map = renderTarget1.texture;
    gl.render(scene, camera);
  });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      scrollTarget.current = e.deltaY * 0.5;
    };

    const dom = gl.domElement;
    dom.addEventListener("wheel", handleWheel, { passive: true });
    return () => dom.removeEventListener("wheel", handleWheel);
  }, [gl]);

  const margin = 1.1;
  const wholeWidth = margin * imgSections.length;

  useFrame(() => {
    if (!groupRef.current) return;

    scroll.current += (scrollTarget.current - scroll.current) * 0.15;
    // friction
    scroll.current *= 0.9;
    // console.log(scroll.current)

    scrollTarget.current *= 0.9;

    currScroll.current += scroll.current * 0.01;

    // move each mesh inside the group
    groupRef.current.children.forEach((mesh: any, i: number) => {
      mesh.position.x =
        ((margin * i + currScroll.current + 234567 * wholeWidth) % wholeWidth) -
        3 * margin;
    });
  });

  return (
    <>
      <group ref={groupRef} onClick={tl} >
        {imgSections.map((section: string[], i: number) => (
          <mesh
            key={i}
            geometry={geometry}
            material={
              new THREE.MeshBasicMaterial({
                // -1 cause main images i put at the end
                map: new THREE.TextureLoader().load(section.at(-1)!),
              })
            }
            position={[margin * i + currScroll.current, 0, 0]}
          />
        ))}
      </group>
    </>
  );
}
