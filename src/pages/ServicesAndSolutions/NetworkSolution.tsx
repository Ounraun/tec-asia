import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./NetworkSolution.module.css";
import ContentCard from "../../components/NetworkSolutions/Card";
// import cityImage from "../../assets/NetworkSolution/city.webp";

import { useTranslation } from "react-i18next";
import type { NetworkSolution } from "../../types/networkSolution";
import { getNetworkSolution } from "../../services/strapi";

const NetworkSolution: React.FC = () => {
  const [networkData, setNetworkData] = useState<NetworkSolution | null>(null);
  const { t, i18n } = useTranslation(["common", "networkSolution"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getNetworkSolution()
      .then((res) => setNetworkData(res.data))
      .catch((err) => console.error("Failed fetching Network Solution:", err));
  }, [i18n.language]);

  const items = networkData?.content || [];
  console.log("Network Solution Data:", networkData);
  return (
    <div className={styles.container}>
      {/* ส่วนหัว */}
      <header className={styles.header}>
        <h1>
          <span className={styles.network}>{t("networkSolution:network")}</span>{" "}
          <span className={styles.solution}>
            {t("networkSolution:solution")}
          </span>
        </h1>
        <p className={styles.subtitle}>{networkData?.subTitle}</p>
      </header>

      {/* ส่วนภาพหลัก */}
      <div className={styles.mainImageContainer}>
        <img
          src={`${networkData?.mainImage?.url}`}
          alt={networkData?.mainImage?.alternativeText || "Default Image"}
          className={styles.mainImage}
        />
      </div>

      {/* ส่วนคำอธิบาย */}
      <div className={styles.description}>
        <p>{networkData?.subTitle2}</p>
      </div>

      <div className={styles.contentSections}>
        {/* 1) Wire & Wireless */}
        <div className={styles.fullWrapper}>
          {items.length > 0 && <ContentCard item={items[0]} />}
        </div>

        {/* 2) Security + Surveillance */}
        <div className={styles.groupWrapper}>
          {items.length > 0 && <ContentCard item={items[1]} isGrouped={true} />}
          {items.length > 0 && <ContentCard item={items[2]} isGrouped={true} />}
        </div>

        {/* 3) Data Collection */}
        <div className={styles.fullWrapper}>
          {items.length > 0 && <ContentCard item={items[3]} />}
        </div>
      </div>

      {/* ส่วนการนำทาง */}
      <nav className="navigation">
        <Link to="/services/data-center" className="navLink">
          &lt; DATA CENTER
        </Link>
        <Link to="/services/centralize-management" className="navLink">
          CENTRALIZE MANAGEMENT &gt;
        </Link>
      </nav>
    </div>
  );
};

export default NetworkSolution;
