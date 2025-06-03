import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./DigitalTransformation.module.css";
import { useTranslation } from "react-i18next";

import type { Transformation } from "../../types/digitalTransformation";
import { getDataTransformation } from "../../services/strapi";
import Maskgroup from "@/assets/DigitalTransformation/Maskgroup.png";

const DigitalTransformation: React.FC = () => {
  const [transformationItem, setTransformationItem] =
    useState<Transformation | null>(null);
  const { t, i18n } = useTranslation(["common", "digitalTransformation"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getDataTransformation()
      .then((res) => setTransformationItem(res.data))
      .catch((err) =>
        console.error("Failed fetching Digital Transformation:", err)
      );
  }, [i18n.language]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <span className={styles.digital}>
            {t("digitalTransformation:digital")}
          </span>{" "}
          <span className={styles.transformation}>
            {t("digitalTransformation:transformation")}
          </span>
        </h1>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftSection}>
          <div className={styles.imageContainer}>
            <img
              src={Maskgroup}
              alt="Digital Transformation"
              className={styles.mainImage}
            />
          </div>
          <div className={styles.description}>
            {transformationItem?.subTitle}
          </div>
        </div>

        <div className={styles.transformationList}>
          <div className={styles.listContainer}>
            {transformationItem?.content.map((item) => (
              <div key={item.id} className={styles.transformationItem}>
                <div className={styles.itemBar} />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="navigation">
        <Link to="/services/multimedia-solution" className="navLink">
          &lt; MULTIMEDIA SOLUTION
        </Link>
        <Link to="/services/network-solution" className="navLink">
          NETWORK SOLUTION &gt;
        </Link>
      </div>
    </div>
  );
};

export default DigitalTransformation;
