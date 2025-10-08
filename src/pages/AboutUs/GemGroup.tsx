import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import aboutStyles from "./AboutUs.module.css";
import GemOne from "@/assets/AboutUs/Gem1en.webp";
import GemTwo from "@/assets/AboutUs/Gem2en.webp";
import GemThree from "@/assets/AboutUs/Gem3en.webp";
import GemFour from "@/assets/AboutUs/Gem4en.webp";
import GemFive from "@/assets/AboutUs/Gem5en.webp";
import GemSix from "@/assets/AboutUs/Gem6en.webp";

const gemData = [
  {
    id: 1,
    image: GemOne,
    style: "gem-float-1",
    path: "/services/network-solution",
  },
  {
    id: 2,
    image: GemTwo,
    style: "gem-float-2",
    path: "/services/data-center",
  },
  {
    id: 3,
    image: GemThree,
    style: "gem-float-3",
    path: "/services/data-management",
  },
  {
    id: 4,
    image: GemFour,
    style: "gem-float-4",
    path: "/services/centralize-management",
  },
  {
    id: 5,
    image: GemFive,
    style: "gem-float-5",
    path: "/services/multimedia-solution",
  },
  {
    id: 6,
    image: GemSix,
    style: "gem-float-6",
    path: "/services/digital-transformation",
  },
];

const GemGroup = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <div className={aboutStyles["gemGroup"]}>
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
        >
          <img
            src={gem.image}
            alt=""
            style={{ width: "100%", height: "100%" }}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
};

export default GemGroup;
