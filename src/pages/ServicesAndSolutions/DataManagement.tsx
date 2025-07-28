import React, { useState, useEffect } from "react";
import styles from "./DataManagement.module.css";
import DataImage from "@/assets/DataManagement/87.webp";

import { useTranslation } from "react-i18next";

import { getDataManagement } from "../../services/strapi";
import type { Service } from "../../types/dataManagement";

const DataManagement: React.FC = () => {
  const [services, setServices] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(["common", "dataManagement"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    getDataManagement()
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Failed fetching Data Managment:", err))
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
          <div className={styles.descriptionBox}>{services?.subTitle2}</div>
        </div>
      </div>
      <div className={styles.servicesContainer}>
        <div className={styles.servicesList}>
          <div className={styles.leftContent}>
            <h2 className={styles.servicesTitle}>
              {t("dataManagement:ourService")}
            </h2>
          </div>
          <div className={styles.rightContent}>
            {services?.content.map((item) => (
              <div key={item.id} className={styles.serviceItem}>
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
        <a href="/services/data-center" className="navLink">
          {"< DATA CENTER"}
        </a>
        <a href="/services/centralize-management" className="navLink">
          {"CENTRALIZE MANAGEMENT >"}
        </a>
      </div>
    </div>
  );
};

export default DataManagement;
