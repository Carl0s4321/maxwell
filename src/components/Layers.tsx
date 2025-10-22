import React, { useEffect } from "react";
import { images } from "../assets/img";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Layers = ({ timeline }: { timeline: gsap.core.Timeline }) => {

  useGSAP(() => {

    const layers = [...document.querySelectorAll(".layers__item")].map((el) => {
      // console.log("el", el);
      return {
        el,
        image: el.querySelector(".layers__item-img"),
      };
    });

    const gridItems = [...document.querySelectorAll(".grid__item")];

    const main = document.querySelector("main");

    console.log("Layers:", layers);
    console.log("main:", main);


    if (!layers) {
      console.log("no layers");
      return;
    }

    const options = {
      duration: 1,
      panelDelay: 0.15,
    };

    layers.forEach((layer, i) => {
      timeline.to(
        [layer.el, layer.image],
        {
          duration: options.duration,
          ease: "Power2.easeInOut",
          y: 0,
        },
        options.panelDelay * i
      );
    });

    timeline
      .addLabel(
        "halfway",
        options.panelDelay * (layers.length - 1) + options.duration
      )
      .call(() => {
        layers
          .slice(0, -1)
          .forEach((layer) => gsap.set(layer.el, { opacity: 0 }));
        // @ts-ignore
        main.classList.remove("intro");
      })
      .to(
        [layers.at(-1)!.el, layers.at(-1)!.image],
        {
          duration: options.duration,
          ease: "expo.inOut",
          y: (index) => (index ? "101%" : "-101%"),
        },
        "halfway"
      )
      .fromTo(
        gridItems,
        { y: () => Math.random() * 400 + 100 },
        {
          duration: options.duration * 2,
          ease: "expo.out",
          y: 0,
          opacity: 1,
        },
        "halfway"
      );
  }, []);

  return (
    <div className="layers">
      {images.map((image) => (
        <div key={image} className="layers__item">
          <div
            className={"layers__item-img"}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Layers;
