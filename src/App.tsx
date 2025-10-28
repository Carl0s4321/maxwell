import React from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { Slider } from "./components/Slider";

import { imgSections } from "./assets/img";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <main className="intro">
      {/* <NavBar />
      <Hero /> */}
      <div className="canvas-container">
        <Canvas className="canvas-slider" camera={{ position: [0, 0, 1] }}>
          <Slider imgSections={imgSections} />
        </Canvas>

      </div>
    </main>
  );
};

export default App;
