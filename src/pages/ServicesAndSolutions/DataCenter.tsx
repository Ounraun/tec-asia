import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    { top: "67%", left: "36%" },
    { top: "75%", left: "13%" },
    { top: "40%", left: "33%" },
    { top: "23%", left: "13%" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [facility, setFacility] = useState<Facility | null>(null);
  const { t, i18n } = useTranslation(["common", "dataCenter"]);

  useEffect(() => {
    getDataCenter()
      .then((res) => setFacility(res.data))
      .catch((err) => console.error("Failed fetching Data Center:", err));
  }, [i18n.language]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <span className={styles.data}>{t("dataCenter:data")}</span>{" "}
          <span className={styles.center}>{t("dataCenter:center")}</span>
        </h1>
        <p className={styles.subtitle}>{facility?.subTitle || "Loading..."}</p>
      </div>

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
        {/* ขอบเบลอจริง */}
        <div className={styles.blurTop}></div>
        <div className={styles.blurBottom}></div>
        {facility?.content?.map((item, index) => {
          const pos = positions[index] || { top: "0%", left: "0%" }; // ตำแหน่งของแต่ละ node with fallback

          return (
            <div
              key={item.id}
              className={styles.cardWrapper}
              style={{ top: pos.top, left: pos.left }}
            >
              <div className={styles.card}>
                {/* โหมดแสดงตัวเลข */}
                <div className={styles.cardLabel}>{index + 1}</div>

                {/* โหมดแสดงเนื้อหาเมื่อ hover */}
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
                  <p>{item.content}</p>
                </div>
              </div>

              <div className={styles.Background_51_171}></div>
            </div>
          );
        })}
      </div>
      <div className="navigation">
        <Link to="/services/digital-transformation" className="navLink">
          &lt; DIGITAL TRANSFORMATION
        </Link>
        <Link to="/services/network-solution" className="navLink">
          NETWORK SOLUTION &gt;
        </Link>
      </div>
    </div>
  );
};

export default DataCenter;
