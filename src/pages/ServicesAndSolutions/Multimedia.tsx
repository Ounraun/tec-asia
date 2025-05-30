import React, { useState, useEffect } from "react";
import styles from "./Multimedia.module.css";

import { useTranslation } from "react-i18next";
import type { MultimediaService } from "../../types/multimedia";
import { getMultimedia } from "../../services/strapi";

const Multimedia: React.FC = () => {
  const [MultimediaService, setContent] = useState<MultimediaService | null>(
    null
  );
  const { t, i18n } = useTranslation(["common", "multimedia"]);
  // const [secondServices, setSecondServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    getMultimedia()
      .then((res) => setContent(res.data))
      .catch((err) =>
        console.error("Failed fetching Multimedia Service:", err)
      );
  }, [i18n.language]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <span className={styles.gradientText}>
            {t("multimedia:multimedia")}
          </span>
          <span className={styles.solution}>{t("multimedia:solution")}</span>
        </h1>
        <p className={styles.subtitle}>{MultimediaService?.subTitle}</p>
      </header>

      <div className={styles.backgroundsContainer}>
        <div className={styles.firstBackground}>
          <div className={styles.servicesGrid}>
            {MultimediaService?.content.slice(0, 3).map((service) => (
              <div key={service.id} className={styles.serviceCard}>
                {/* <div className={styles.glowDot}></div> */}
                <h3>{service.title}</h3>
                <ul>
                  {service.content.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.secondBackground}>
          <div className={styles.servicesGrid}>
            {MultimediaService?.content.slice(3, 7).map((service) => (
              <div key={service.id} className={styles.serviceCard}>
                {/* <div className={styles.glowDot}></div> */}
                <h3>{service.title}</h3>
                <ul>
                  {service.content.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className={styles.navigation}>
        <a href="/services/centralize-management" className="navLink">
          {"< CENTRALIZE MANAGEMENT"}
        </a>
        <a href="/services/data-management" className="navLink">
          {"DATA MANAGEMENT >"}
        </a>
      </nav>
    </div>
  );
};

export default Multimedia;
