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
      <Canvas camera={{ position: [0, 0, 0.25] }}>
        <Slider imgSections={imgSections} />
      </Canvas>
    </main>
  );
};

export default App;
