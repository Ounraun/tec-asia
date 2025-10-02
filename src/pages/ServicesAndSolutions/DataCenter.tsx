import React, { useState, useEffect } from "react";
import { ServicesPager } from "@/components/ServicesNav";
import { servicesNavItems } from "@/features/services/navItems";
import { useTranslation } from "react-i18next";
import { formatTextWithLineBreaks } from "@/utils/textFormatter";

import styles from "./DataCenter.module.css";
import type { Facility } from "../../types/dataCenter";
import { getDataCenter } from "../../services/strapi";

import BG_DataCenter from "@/assets/DataCenter/bg_datacenter.webp";

const DataCenter: React.FC = () => {
  const positions = [
    { top: "15%", left: "30%" },
    { top: "15%", left: "65%" },
    { top: "48%", left: "70%" },
    { top: "63%", left: "48%" },
    { top: "79%", left: "72%" },
    { top: "64%", left: "30%" },
    { top: "75%", left: "13%" },
    { top: "40%", left: "33%" },
    { top: "23%", left: "7%" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [facility, setFacility] = useState<Facility | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(["common", "dataCenter"]);

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
                <div className={styles.cardLabel}>{item.title}</div>
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
