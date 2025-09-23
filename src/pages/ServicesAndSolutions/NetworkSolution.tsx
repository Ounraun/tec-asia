import React, { useState, useEffect, useMemo } from "react";
//
import { ServicesPager } from "@/components/ServicesNav";
import { servicesNavItems } from "@/features/services/navItems";
import styles from "./NetworkSolution.module.css";
import ContentCard from "../../components/NetworkSolutions/Card";

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

  // Normalize API newlines/BRs so visual line breaks match editor "Enter"
  const normalizedSubTitle2 = useMemo(() => {
    const raw = networkData?.subTitle2 ?? "";
    if (!raw) return null;
    // Convert <br> (any casing, optional slash) to newline characters
    const withNewlines = raw.replace(/<br\s*\/?>(\r?\n)?/gi, "\n");
    // Also convert escaped newlines ("\\n") to real newlines
    const normalized = withNewlines.replace(/\\n/g, "\n");
    const parts = normalized.split(/\r?\n/);
    return parts.map((p, idx) => (
      <React.Fragment key={idx}>
        {p}
        {idx < parts.length - 1 ? "\n" : null}
      </React.Fragment>
    ));
  }, [networkData?.subTitle2]);

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

      <div className={styles.mainImageContainer}>
        <img
          src={BackgroudCity}
          alt={networkData?.mainImage?.alternativeText || "Default Image"}
          className={styles.mainImage}
        />
      </div>

      <div className={styles.description}>
        <p>{normalizedSubTitle2}</p>
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
