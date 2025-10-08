import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import aboutStyles from "./AboutUs.module.css";
import GemOneEn from "@/assets/AboutUs/Gem1en.webp";
import GemTwoEn from "@/assets/AboutUs/Gem2en.webp";
import GemThreeEn from "@/assets/AboutUs/Gem3en.webp";
import GemFourEn from "@/assets/AboutUs/Gem4en.webp";
import GemFiveEn from "@/assets/AboutUs/Gem5en.webp";
import GemSixEn from "@/assets/AboutUs/Gem6en.webp";
import GemOneTh from "@/assets/AboutUs/Gem1th.webp";
import GemTwoTh from "@/assets/AboutUs/Gem2th.webp";
import GemThreeTh from "@/assets/AboutUs/Gem3th.webp";
import GemFourTh from "@/assets/AboutUs/Gem4th.webp";
import GemFiveTh from "@/assets/AboutUs/Gem5th.webp";
import GemSixTh from "@/assets/AboutUs/Gem6th.webp";

type LocaleKey = "en" | "th";

const gemData = [
  {
    id: 1,
    images: {
      en: GemOneEn,
      th: GemOneTh,
    },
    style: "gem-float-1",
    path: "/services/network-solution",
  },
  {
    id: 2,
    images: {
      en: GemTwoEn,
      th: GemTwoTh,
    },
    style: "gem-float-2",
    path: "/services/data-center",
  },
  {
    id: 3,
    images: {
      en: GemThreeEn,
      th: GemThreeTh,
    },
    style: "gem-float-3",
    path: "/services/data-management",
  },
  {
    id: 4,
    images: {
      en: GemFourEn,
      th: GemFourTh,
    },
    style: "gem-float-4",
    path: "/services/centralize-management",
  },
  {
    id: 5,
    images: {
      en: GemFiveEn,
      th: GemFiveTh,
    },
    style: "gem-float-5",
    path: "/services/multimedia-solution",
  },
  {
    id: 6,
    images: {
      en: GemSixEn,
      th: GemSixTh,
    },
    style: "gem-float-6",
    path: "/services/digital-transformation",
  },
] as const;

const GemGroup = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const languageKey: LocaleKey = i18n.language.startsWith("th") ? "th" : "en";

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
            src={gem.images[languageKey]}
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
