import React, { useState, useRef, useEffect } from "react";
import { images } from "../assets/img";
import Layers from "./Layers";
import gsap from "gsap";

const menus = [
  { title: "Mr.Chedda the Mouse", subtitle: "Have a gouda day!" },
  { title: "Maxwell the Cat", subtitle: "Codename: Dingus." },
  { title: "Ponsuke-kun the Seal", subtitle: "He's just a silly baby!" },
];

function Menu({ onClick }: { onClick: () => void }) {
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
            onClick={onClick}
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

const Hero = () => {
  const tl = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));

  function handleClick() {
    tl.current?.restart();
  }

  return (
    <div className="content">
      <div className="grid">
        {images.map((image) => {
          const index = images.indexOf(image);
          console.log(image, images.indexOf(image));
          console.log(`grid__item--${index}`);
          return (
            <div
              key={index}
              className={`grid__item grid__item--${index}`}
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          );
        })}
      </div>

      <Menu onClick={handleClick} />

      <Layers timeline={tl.current} />
    </div>
  );
};

export default Hero;
