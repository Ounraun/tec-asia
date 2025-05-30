import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./CentralizeManagement.module.css";

import { getCentralizeManagement } from "../../services/strapi";
import type { Feature } from "../../types/centralizeManagement";

const CentralizeManagement = () => {
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [feature, setFeature] = useState<Feature | null>(null);
  const { t, i18n } = useTranslation(["common", "centralize"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1️⃣ ดึงข้อมูล About Us ตอนหน้า mount และทุกครั้งที่เปลี่ยนภาษา
  useEffect(() => {
    getCentralizeManagement()
      .then((res) => setFeature(res.data))
      .catch((err) =>
        console.error("Failed fetching Centralize Managment:", err)
      );
  }, [i18n.language]);

  console.log(feature);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <span className={styles.highlight}>{t("centralize:centralize")}</span>{" "}
          <span className={styles.Management_29_186}>
            {t("centralize:management")}
          </span>
        </h1>
        <p className={styles.subtitle}>
          {feature?.mainSubTitle || "Loading..."}
        </p>
      </div>

      <div className={styles.cityBackground}></div>

      <div className={styles.featuresGrid}>
        {feature?.content.map((item) => (
          <div key={item.id} className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{item.title}</h3>
            {/* <p className={styles.featureSubtitle}>
              {item.subtitle || "No subtitle"}
            </p> */}
            <p className={styles.featureContent}>{item.content}</p>
          </div>
        ))}
      </div>

      <div className={styles.SolutionsCardBackground}></div>
      <div className="navigation">
        <Link to="/services/data-center" className="navLink">
          &lt; DATA CENTER
        </Link>
        <Link to="/services/multimedia-solution" className="navLink">
          MULTI MEDIA SOLUTION &gt;
        </Link>
      </div>
    </div>
  );
};

export default CentralizeManagement;
