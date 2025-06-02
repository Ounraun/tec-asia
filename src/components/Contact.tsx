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
  // const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getCompanyInfo()
      .then((res) => setCompanyInfo(res.data))
      .catch((err) => console.error("Failed fetching Company Info:", err));
  }, [i18n.language]);

  return (
    <div className="contact-layout">
      <div className="contact-inner overflow-hidden">
        <div className="row">
          <h1 className="contact-title">
            {companyInfo ? companyInfo.name : "Loading..."}
          </h1>
        </div>
        <div className="row">
          {/* ด้านซ้าย */}
          <div className="col-md-4 mb-4 pr-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="text-white mb-0" style={{ fontSize: "1.2rem" }}>
                {companyInfo ? companyInfo.phone : "Loading..."}
              </p>
              <div className="d-flex align-items-center">
                <img src={emailIcon} alt="Email" className="me-3" />
                <img src={facebookIcon} alt="Facebook" />
              </div>
            </div>
            <p className="mb-3 text-white" style={{ fontSize: "1rem" }}>
              Location : {companyInfo ? companyInfo.location : "Loading..."}
              <br />
              {companyInfo ? companyInfo.address : "Loading..."}
            </p>
            <img src={Map} alt="Map" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-7 ">
            <div className="row">
              <h2 className="mb-4 text-white" style={{ fontFamily: "Saira" }}>
                {t("contact:menu")}
              </h2>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div
                  className="mb-3 text-white"
                  style={{ fontFamily: "Saira" }}
                >
                  <h5 style={{ color: "#39D6DE" }}>
                    {t("contact:serviceAndSolutions")}
                  </h5>
                  <ul className="list-unstyled ps-3">
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
                      onClick={() =>
                        navigate("/services/centralize-management")
                      }
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
                      onClick={() =>
                        navigate("/services/digital-transformation")
                      }
                    >
                      {t("contact:digitalTransformation")}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className="mb-3 text-white"
                  style={{ fontFamily: "Saira" }}
                >
                  <h5 style={{ color: "#39D6DE" }}>
                    {t("contact:ourCommunity")}
                  </h5>
                  <ul className="list-unstyled ps-3">
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
        </div>
      </div>
    </div>
  );
};

export default Contact;
