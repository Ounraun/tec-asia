import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import aboutStyles from "./AboutUs.module.css";
import GemOne from "@/assets/AboutUs/Gem1.svg";
import GemTwo from "@/assets/AboutUs/Gem2.svg";
import GemThree from "@/assets/AboutUs/Gem3.svg";
import GemFour from "@/assets/AboutUs/Gem4.svg";
import GemFive from "@/assets/AboutUs/Gem5.svg";
import GemSix from "@/assets/AboutUs/Gem6.svg";

const gemData = [
  {
    id: 1,
    label: "Network solution",
    image: GemOne,
    style: "gem-float-1",
    path: "/services/network-solution",
  },
  {
    id: 2,
    label: "Data center",
    image: GemTwo,
    style: "gem-float-2",
    path: "/services/data-center",
  },
  {
    id: 3,
    label: "Data management",
    image: GemThree,
    style: "gem-float-3",
    path: "/services/data-management",
  },
  {
    id: 4,
    label: "Centralize management",
    image: GemFour,
    style: "gem-float-4",
    path: "/services/centralize-management",
  },
  {
    id: 5,
    label: "Multimedia solution",
    image: GemFive,
    style: "gem-float-5",
    path: "/services/multimedia-solution",
  },
  {
    id: 6,
    label: "Digital transformation",
    image: GemSix,
    style: "gem-float-6",
    path: "/services/digital-transformation",
  },
];

const GemGroup = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <>
      {gemData.map((gem, index) => (
        <button
          key={gem.id}
          type="button"
          onClick={() => navigate(gem.path)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={[
            "position-absolute",
            aboutStyles[gem.style],
            hoveredIndex === index ? aboutStyles.hovered : "",
          ].join(" ")}
          style={{
            zIndex: 5,
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
          aria-label={`Go to ${gem.label}`}
        >
          <img
            src={gem.image}
            alt=""
            style={{ width: "100%", height: "100%" }}
            aria-hidden="true"
          />
          <p className={aboutStyles.textInGem}>{gem.label}</p>
        </button>
      ))}
    </>
  );
};

export default GemGroup;
