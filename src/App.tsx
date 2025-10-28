import React from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { Slider } from "./components/Slider";

import { imgSections } from "./assets/img";
import { OrthographicCamera } from "@react-three/drei";

gsap.registerPlugin(useGSAP);

var fructumSize = 3;
var aspect = window.innerWidth / window.innerHeight;

const App = () => {
  return (
    <main className="intro">
      {/* <NavBar />
      <Hero /> */}
      <div className="canvas-container">
        <Canvas gl={{antialias: true, alpha: true}} className="canvas-slider" >
          <OrthographicCamera
            makeDefault
            position={[0, 0, 2]}
            left={(fructumSize * aspect) / -2}
            right={(fructumSize * aspect) / 2}
            top={fructumSize / 2}
            bottom={fructumSize / -2}
            near={-1000}
            far={1000}
          />
          <Slider imgSections={imgSections} />
        </Canvas>
      </div>
    </main>
  );
};

export default App;
