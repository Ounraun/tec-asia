import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./NetworkSolution.module.css";
import ContentCard from "../../components/NetworkSolutions/Card";

import BackgroudCity from "../../assets/NetworkSolution/backgroudCity.webp";

import { useTranslation } from "react-i18next";
import type { NetworkSolution } from "../../types/networkSolution";
import { getNetworkSolution } from "../../services/strapi";

const NetworkSolution: React.FC = () => {
  const [networkData, setNetworkData] = useState<NetworkSolution | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(["common", "networkSolution"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    getNetworkSolution()
      .then((res) => setNetworkData(res.data))
      .catch((err) => console.error("Failed fetching Network Solution:", err))
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

  const items = networkData?.content || [];
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <span className={styles.network}>{t("networkSolution:network")}</span>{" "}
          <span className={styles.solution}>
            {t("networkSolution:solution")}
          </span>
        </h1>
        <p className={styles.subtitle}>{networkData?.subTitle}</p>
      </header>

      <div className={styles.mainImageContainer}>
        <img
          src={BackgroudCity}
          alt={networkData?.mainImage?.alternativeText || "Default Image"}
          className={styles.mainImage}
        />
      </div>

      <div className={styles.description}>
        <p>{networkData?.subTitle2}</p>
      </div>

      <div className={styles.contentSections}>
        <div className={styles.fullWrapper}>
          {items.length > 0 && <ContentCard item={items[0]} />}
        </div>

        <div className={styles.groupWrapper}>
          {items.length > 0 && <ContentCard item={items[1]} isGrouped={true} />}
          {items.length > 0 && <ContentCard item={items[2]} isGrouped={true} />}
        </div>

        <div className={styles.fullWrapper}>
          {items.length > 0 && <ContentCard item={items[3]} />}
        </div>
      </div>
      <nav className="navigation">
        <Link to="/services/digital-transformation" className="navLink">
          &lt; DIGITAL TRANSFORMATION
        </Link>
        <Link to="/services/data-center" className="navLink">
          DATA CENTER &gt;
        </Link>
      </nav>
    </div>
  );
};

export default NetworkSolution;
