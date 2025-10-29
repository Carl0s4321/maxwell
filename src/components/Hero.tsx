import React, { useState, useRef, useEffect } from "react";
import { imgSections, maxwellImg, meowlImg } from "../assets/img";
import Layers from "./Layers";
import gsap from "gsap";
import { pickNNumbersFromRange } from "../utils/nNumbers";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const menus = [
  { title: "Mr.Chedda the Mouse", subtitle: "Have a gouda day!" },
  { title: "Maxwell the Cat", subtitle: "Codename: Dingus." },
  { title: "Ponsuke-kun the Seal", subtitle: "He's just a silly baby!" },
];

function Menu() {
  const [selected, setSelected] = useState(1);

  return (
    <nav className="menu">
      {menus.map((menu) => {
        const index = menus.indexOf(menu);
        const isSelected = index === selected;
        // console.log(index);
        const nonSelectedName = menu.title.split(" ")[0];
        return (
          <a
            key={index}
            className={`menu__item ${isSelected ? "menu__item--current" : ""}`}
            data-index={"0" + index}
          >
            <h2 className="menu__item-title">
              {isSelected ? menu.title : nonSelectedName}
            </h2>
            <p className="menu__item-subtitle">{menu.subtitle}</p>
          </a>
        );
      })}
    </nav>
  );
}

const Hero = ({ tl }: { tl: React.RefObject<gsap.core.Timeline> }) => {
  const nPics = 6;
  const selectedIndexes = pickNNumbersFromRange(nPics, maxwellImg.length - 1);
  // console.log(selectedIndexes);

  let counter = 6;

  return (
    <div className="content">
      <div className="grid">
        {/* GRID ITEMS */}
        {selectedIndexes.map((index) => {
          const image = maxwellImg.at(index);
          counter--;
          return (
            <div
              key={index}
              className={`grid__item grid__item--${counter}`}
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          );
        })}
      </div>
      <Menu />

      <Layers timeline={tl.current} />
    </div>
  );
};

export default Hero;
