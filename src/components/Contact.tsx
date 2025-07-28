import React, { useState, useEffect } from "react";
import "./Contact.css";
import emailIcon from "../assets/AboutUs/icon-email.svg";
import facebookIcon from "../assets/AboutUs/icon-facebook.svg";
import Map from "../assets/AboutUs/map.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { CompanyInfo } from "../types/contact";
import { getCompanyInfo } from "../services/strapi";

const Contact = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const { t, i18n } = useTranslation(["common", "contact"]);
  const navigate = useNavigate();

  useEffect(() => {
    getCompanyInfo()
      .then((res) => setCompanyInfo(res.data))
      .catch((err) => console.error("Failed fetching Company Info:", err));
  }, [i18n.language]);

  return (
    <div className="contact-layout">
      <div className="contact-inner">
        <div className="row align-items-start mb-5 custom-gutter">
          <div className="col-lg-6 mb-4">
            <h1 className="contact-title">
              {companyInfo?.name ?? "Loading..."}
            </h1>
            <p className="text-white fs-5 mb-3">
              {companyInfo?.phone ?? "Loading..."}
            </p>
            <div className="mb-4">
              <img src={emailIcon} alt="Email" />
              <img src={facebookIcon} alt="Facebook" />
            </div>
            <p className="text-white">
              {companyInfo?.location ?? "Loading..."}
              <br />
              {companyInfo?.address ?? "Loading..."}
            </p>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.1964524159557!2d100.5786777110017!3d13.7670234865706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d61c5ec1ffbb1%3A0xb0a7eeab763bfdb5!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4lOC4tCDguYDguK3guYfguIHguIvguYzguYDguIvguYDguKXguYnguJnguJfguYwg4LiE4Lit4Lih4Lih4Li54LiZ4Li04LmA4LiE4LiK4Lix4LmI4LiZIOC4iOC4s-C4geC4seC4lA!5e0!3m2!1sen!2sth!4v1753334691233!5m2!1sen!2sth"
                width="100%"
                height="236"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="row custom-gutter">
          <div className="col-md-6 mb-4">
            <h2 className="section-title">
              {t("contact:serviceAndSolutions")}
            </h2>
            <ul className="list-unstyled ps-3 text-white service-list">
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/services/network-solution")}
              >
                {t("contact:networkAndSolution")}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/services/data-center")}
              >
                {t("contact:dataCenter")}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/services/data-management")}
              >
                {t("contact:dataManagement")}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/services/centralize-management")}
              >
                {t("contact:centralizeManagement")}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/services/multimedia")}
              >
                {t("contact:multimediaSolution")}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/services/digital-transformation")}
              >
                {t("contact:digitalTransformation")}
              </li>
            </ul>
          </div>

          <div className="col-md-6 mb-4">
            <h2 className="section-title">{t("contact:ourCommunity")}</h2>
            <ul className="list-unstyled ps-3 text-white">
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/community/company-events")}
              >
                {t("contact:companyEvents")}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/community/knowledge")}
              >
                {t("contact:knowledge")}
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/community/society")}
              >
                {t("contact:society")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
