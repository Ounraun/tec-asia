import React, { useState, useEffect } from "react";
import styles from "./DataManagement.module.css";
import DataImage from "@/assets/DataManagement/87.png";

import { useTranslation } from "react-i18next";

import { getDataManagement } from "../../services/strapi";
import type { Service } from "../../types/dataManagement";

const DataManagement: React.FC = () => {
  const [services, setServices] = useState<Service | null>(null);
  const { t, i18n } = useTranslation(["common", "dataManagement"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getDataManagement()
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Failed fetching Data Managment:", err));
  }, [i18n.language]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <span className={styles.data}>{t("dataManagement:data")}</span>{" "}
          <span className={styles.management}>
            {t("dataManagement:management")}
          </span>
        </h1>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.leftSection}>
          <img
            src={DataImage}
            alt="Data Management"
            className={styles.mainImage}
          />
        </div>
        <div className={styles.rightSection}>
          <div className={styles.descriptionBox}>{services?.subTitle1}</div>
          <div className={styles.separator}></div>
          <div className={styles.descriptionBox}>{services?.subTitle2}</div>
        </div>
      </div>
      <div className={styles.servicesContainer}>
        <h2 className={styles.servicesTitle}>
          {t("dataManagement:ourService")}
        </h2>
        <div className={styles.servicesList}>
          <div className={styles.leftContent}>
            {services?.serviceContent1}
            <br></br>
            <br></br>
            {services?.serviceContent2}
          </div>
          <div className={styles.rightContent}>
            {services?.content.map((item) => (
              <div key={item.id} className={styles.serviceItem}>
                <div className={styles.serviceBar} />
                <div className={styles.serviceContent}>
                  <h3>{item.title}</h3>
                  <p>{item.content || "No content available"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="navigation">
        <a href="/services/multimedia-solution" className="navLink">
          {"< MULTI MEDIA SOLUTION"}
        </a>
        <a href="/services/digital-transformation" className="navLink">
          {"DIGITAL TRANSFORMATION >"}
        </a>
      </div>
    </div>
  );
};

export default DataManagement;
