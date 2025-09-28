import React, { useState, useEffect } from "react";
//
import { ServicesPager } from "@/components/ServicesNav";
import { servicesNavItems } from "@/features/services/navItems";
import styles from "./NetworkSolution.module.css";
import ContentCard from "../../components/NetworkSolutions/Card";
import { formatTextWithLineBreaks } from "@/utils/textFormatter";

import BackgroudCity from "../../assets/NetworkSolution/backgroudCity.webp";

import { useTranslation } from "react-i18next";
import type { NetworkSolution } from "../../types/networkSecurity";
import { getNetworkSolution } from "../../services/strapi";

const NetworkSolution: React.FC = () => {
  const [networkData, setNetworkData] = useState<NetworkSolution | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(["common", "networkSecurity"]);

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

  const items = networkData?.content || [];

  // Keep hook order stable; render loading UI after hooks
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
      <header className={styles.header}>
        <h1>
          <span className={styles.network}>{t("networkSecurity:network")}</span>{" "}
          <span className={styles.solution}>
            {t("networkSecurity:security")}
          </span>
        </h1>
        <p className={styles.subtitle}>{networkData?.subTitle}</p>
      </header>

      {/* Removed main image from backend schema. Keep decorative background image without alt dependency. */}
      <div className={styles.mainImageContainer}>
        <img src={BackgroudCity} alt="" className={styles.mainImage} />
      </div>

      <div className={styles.description}>
        <p>{formatTextWithLineBreaks(networkData?.subTitle2 || "")}</p>
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
      <ServicesPager items={servicesNavItems} />
    </div>
  );
};

export default NetworkSolution;
