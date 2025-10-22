import React from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <main className="intro">
      <NavBar />
      <Hero/>
    </main>
  );
};

export default App;
