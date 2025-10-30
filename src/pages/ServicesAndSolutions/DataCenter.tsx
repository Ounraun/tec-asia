import React, { useState, useEffect } from "react";
import { ServicesPager } from "@/components/ServicesNav";
import { servicesNavItems } from "@/features/services/navItems";
import { useTranslation } from "react-i18next";
import { formatTextWithLineBreaks } from "@/utils/textFormatter";

import styles from "./DataCenter.module.css";
import type { Facility } from "../../types/dataCenter";
import { getDataCenter } from "../../services/strapi";

import BG_DataCenter from "@/assets/DataCenter/bg_datacenter.webp";

const desktopPositions = [
  { top: "15%", left: "30%" },
  { top: "15%", left: "65%" },
  { top: "48%", left: "70%" },
  { top: "63%", left: "48%" },
  { top: "79%", left: "72%" },
  { top: "64%", left: "30%" },
  { top: "75%", left: "13%" },
  { top: "40%", left: "33%" },
  { top: "23%", left: "7%" },
] as const;

const tabletPositions = [
  { top: "10%", left: "32%" },
  { top: "18%", left: "65%" },
  { top: "42%", left: "68%" },
  { top: "60%", left: "42%" },
  { top: "78%", left: "66%" },
  { top: "56%", left: "20%" },
  { top: "74%", left: "12%" },
  { top: "32%", left: "28%" },
  { top: "19%", left: "10%" },
] as const;

const DataCenter: React.FC = () => {
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [facility, setFacility] = useState<Facility | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(["common", "dataCenter"]);
  const seeMoreLabel = t("dataCenter:seeMore", { defaultValue: "See More" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const positions = viewportWidth <= 1080 ? tabletPositions : desktopPositions;

  useEffect(() => {
    setLoading(true);
    getDataCenter()
      .then((res) => setFacility(res.data))
      .catch((err) => console.error("Failed fetching Data Center:", err))
      .finally(() => {
        setLoading(false);
      });
  }, [i18n.language]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? (facility?.content?.length || 1) - 1 : prev - 1
    );
  };
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === (facility?.content?.length || 1) - 1 ? 0 : prev + 1
    );
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <span className={styles.center}>{t("dataCenter:dataCenter")}</span>
        </h1>
        <p className={styles.subtitle}>
          {formatTextWithLineBreaks(facility?.subTitle || "")}
        </p>
      </header>

      <div className={styles.line}></div>

      <div className={styles.facilitiesSection}>
        <h2 className={styles.facilitiesTitle}>Facilities System</h2>
      </div>

      <div className={styles.bgImageContainer}>
        <img
          src={BG_DataCenter}
          alt="Data Center Background"
          className={styles.bgImage}
        />
        <div className={styles.blurTop}></div>
        <div className={styles.blurBottom}></div>

        {facility?.content?.map((item, index) => {
          const pos = positions[index] || { top: "0%", left: "0%" };

          return (
            <div
              key={item.id}
              className={`${styles.cardWrapper} ${
                styles.responsiveCardWrapper
              } ${index === currentIndex ? styles.active : ""}`}
              style={{ top: pos.top, left: pos.left }}
            >
              <div className={styles.card}>
                <div className={styles.cardLabel}>
                  {`${item.title}\u00a0\u2192 ${seeMoreLabel}`}
                </div>
                <div
                  className={styles.cardContent}
                  tabIndex={0}
                  onClick={(e) => {
                    const target = e.currentTarget;
                    target.classList.toggle(styles.visible);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      const target = e.currentTarget;
                      target.classList.toggle(styles.visible);
                      e.preventDefault();
                    }
                  }}
                >
                  <h3>{item.title}</h3>
                  <p>{formatTextWithLineBreaks(item.content || "")}</p>
                </div>
              </div>

              <div className={styles.Background_51_171}></div>
            </div>
          );
        })}
        <div className={styles.carouselControls}>
          <button
            className={styles.carouselButton}
            onClick={handlePrev}
            aria-label="Previous"
          >
            &lt;
          </button>
          <span className={styles.carouselIndicator}>
            {currentIndex + 1 + " / " + (facility?.content?.length || 1)}
          </span>
          <button
            className={styles.carouselButton}
            onClick={handleNext}
            aria-label="Next"
          >
            &gt;
          </button>
        </div>
      </div>
      <ServicesPager items={servicesNavItems} />
    </div>
  );
};

export default DataCenter;
