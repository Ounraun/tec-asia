import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./CentralizeManagement.module.css";

import { getCentralizeManagement } from "../../services/strapi";
import type { Feature } from "../../types/centralizeManagement";

const CentralizeManagement = () => {
  const [feature, setFeature] = useState<Feature | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(["common", "centralize"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    getCentralizeManagement()
      .then((res) => {
        setFeature(res.data);
        setCurrentIdx(0);
      })
      .catch((err) =>
        console.error("Failed fetching Centralize Managment:", err)
      )
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

  const items = feature?.content || [];
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const prev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const next = () => setCurrentIdx((i) => Math.min(items.length - 1, i + 1));
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <span className={styles.highlight}>{t("centralize:centralize")}</span>{" "}
          <span className={styles.Management_29_186}>
            {t("centralize:management")}
          </span>
        </h1>
      </div>

      <div className={styles.cityBackground}>
        <p className={styles.subtitle}>
          {feature?.mainSubTitle || "Loading..."}
        </p>
      </div>

      <div className="carouselContainer">
        <div className={styles.carouselContainer}>
          {isMobile && (
            <button
              className={styles.prevBtn}
              onClick={prev}
              aria-label="Previous"
            >
              &lt;
            </button>
          )}

          <div className={styles.slides}>
            {isMobile
              ? items.slice(currentIdx, currentIdx + 1).map((item) => (
                  <div key={item.id} className={styles.slide}>
                    <div className={styles.featureCard}>
                      <h3 className={styles.featureTitle}>{item.title}</h3>
                      <p className={styles.featureContent}>{item.content}</p>
                    </div>
                  </div>
                ))
              : items.map((item) => (
                  <div key={item.id} className={styles.slide}>
                    <div className={styles.featureCard}>
                      <h3 className={styles.featureTitle}>{item.title}</h3>
                      <p className={styles.featureContent}>{item.content}</p>
                    </div>
                  </div>
                ))}
          </div>

          {isMobile && (
            <button
              className={styles.nextBtn}
              onClick={next}
              disabled={currentIdx === items.length - 1}
            >
              &gt;
            </button>
          )}
          {isMobile && (
            <div className={styles.dots}>
              {items.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${
                    idx === currentIdx ? styles.activeDot : ""
                  }`}
                  onClick={() => setCurrentIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.SolutionsCardBackground}></div>
      <div className="navigation">
        <Link to="/services/data-management" className="navLink">
          &lt; DATA MANAGEMENT
        </Link>
        <Link to="/services/multimedia-solution" className="navLink">
          MULTI MEDIA SOLUTION &gt;
        </Link>
      </div>
    </div>
  );
};

export default CentralizeManagement;
