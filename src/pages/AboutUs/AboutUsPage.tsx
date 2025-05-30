import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

import ParticlesComponent from "../../components/Particles/Particles";
import CommunityCard from "./CommunityCard";
import Contact from "../../components/Contact";

import aboutStyles from "./AboutUs.module.css";

import { getAboutUs } from "../../services/strapi";
import type { AboutUs } from "../../types/aboutUs";

// Importing SVG assets
import BG_Service from "@/assets/AboutUs/bg_service.webp";
import GemFloor from "@/assets/AboutUs/Gem-floor.svg";
import GemOne from "@/assets/AboutUs/Gem1.svg";
import GemTwo from "@/assets/AboutUs/Gem2.svg";
import GemThree from "@/assets/AboutUs/Gem3.svg";
import GemFour from "@/assets/AboutUs/Gem4.svg";
import GemFive from "@/assets/AboutUs/Gem5.svg";
import GemSix from "@/assets/AboutUs/Gem6.svg";
import BG_Wave from "@/assets/AboutUs/bg-wave.svg";
import BG_Wave_Service from "@/assets/AboutUs/bg-wave-service.svg";

const AboutUs = () => {
  const [isHoveredGem1, setIsHoveredGem1] = useState(false);
  const [isHoveredGem2, setIsHoveredGem2] = useState(false);
  const [isHoveredGem3, setIsHoveredGem3] = useState(false);
  const [isHoveredGem4, setIsHoveredGem4] = useState(false);
  const [isHoveredGem5, setIsHoveredGem5] = useState(false);
  const [isHoveredGem6, setIsHoveredGem6] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const particles = useMemo(() => {
    return <ParticlesComponent />;
  }, []);

  const { t, i18n } = useTranslation(["common", "aboutUs"]);
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const navigate = useNavigate();

  // 1️⃣ ดึงข้อมูล About Us ตอนหน้า mount และทุกครั้งที่เปลี่ยนภาษา
  useEffect(() => {
    setIsLoading(true);
    getAboutUs()
      .then((res) => {
        setAboutUs(res.data);
        // รอให้เนื้อหาโหลดเสร็จก่อน
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      })
      .catch((err) => {
        console.error("Failed fetching AboutUs:", err);
        setIsLoading(false);
      });
  }, [i18n.language]);

  useEffect(() => {
    // เพิ่ม smooth scroll behavior ให้กับ html element
    document.documentElement.style.scrollBehavior = "smooth";

    // Cleanup function
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // ฟังก์ชันสำหรับเลื่อนไปที่ส่วน Contact
  const scrollToContact = () => {
    if (!isLoading) {
      const contactSection = document.getElementById("contact-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // ตรวจสอบ URL hash เมื่อโหลดหน้า
  useEffect(() => {
    if (!isLoading && window.location.hash === "#contact-section") {
      scrollToContact();
    }
  }, [isLoading]);

  if (isLoading) {
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
    <div className="overflow-hidden" style={{ scrollBehavior: "smooth" }}>
      {/* hero  */}
      <div
        className="position-relative bg-dark"
        style={{
          zIndex: 1,
          height: "600px",
          margin: 0,
          padding: 0,
          width: "100%",
          scrollSnapAlign: "start",
        }}
      >
        <div className={aboutStyles.particleWrapper}>
          {particles}
          <div className={aboutStyles.contentLayout}>
            <div className="p-2">
              <h1
                className={aboutStyles.mainTitle}
                style={{
                  paddingTop: "0px",
                }}
              >
                {aboutUs?.heroTitle}
              </h1>
              <p
                className={`${aboutStyles.mainText} ${aboutStyles.mainTextS32}`}
                style={{
                  fontWeight: "400",
                  lineHeight: "170%",
                  letterSpacing: "-1.9%",
                  marginTop: "30px",
                }}
              >
                {aboutUs?.heroContent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* service and solutions */}
      <div
        className="position-relative"
        style={{
          height: "293vh",
          overflow: "hidden",
          scrollSnapAlign: "start",
        }}
      >
        {" "}
        {/* Background */}
        <img
          src={BG_Service}
          alt="Background"
          className={`${aboutStyles.bgFade}`}
        />
        {/* Background */}
        <div
          className="position-absolute text-white"
          style={{
            top: "27% ",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h1
            className="text-white text-center fw-bold display-4 display-md-3 display-lg-1"
            style={{
              fontFamily: "Saira, sans-serif",
              lineHeight: "142%",
            }}
          >
            {t("aboutUs:service")}
            <br />
            {t("aboutUs:and")} <br />
            {t("aboutUs:solutions")}
          </h1>
        </div>
        {/* Gems 1 */}
        <div
          className={[
            "position-absolute",
            aboutStyles["gem-float-1"],
            isHoveredGem1 ? aboutStyles.hovered : "",
          ].join(" ")}
          style={{
            zIndex: 5,
            cursor: "pointer",
          }}
          onMouseEnter={() => {
            setIsHoveredGem1(true);
          }}
          onMouseLeave={() => {
            setIsHoveredGem1(false);
          }}
          onClick={() => navigate("/services/network-solution")}
        >
          <img src={GemOne} alt="" style={{ width: "100%", height: "100%" }} />
          <p className={`${aboutStyles.textInGem}`}>Network solution</p>
        </div>
        {/* Gems 2 */}
        <div
          className={[
            "position-absolute",
            aboutStyles["gem-float-2"],
            isHoveredGem2 ? aboutStyles.hovered : "",
          ].join(" ")}
          style={{
            zIndex: 5,
            cursor: "pointer",
          }}
          onMouseEnter={() => {
            setIsHoveredGem2(true);
          }}
          onMouseLeave={() => {
            setIsHoveredGem2(false);
          }}
          onClick={() => navigate("/services/data-center")}
        >
          <img src={GemTwo} alt="" style={{ width: "100%", height: "100%" }} />
          <p className={`${aboutStyles.textInGem}`}>Data center</p>
        </div>
        {/* Gems 3 */}
        <div
          className={[
            "position-absolute",
            aboutStyles["gem-float-3"],
            isHoveredGem3 ? aboutStyles.hovered : "",
          ].join(" ")}
          style={{
            zIndex: 5,
            cursor: "pointer",
          }}
          onMouseEnter={() => {
            setIsHoveredGem3(true);
          }}
          onMouseLeave={() => {
            setIsHoveredGem3(false);
          }}
          onClick={() => navigate("/services/data-management")}
        >
          <img
            src={GemThree}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
          <p className={`${aboutStyles.textInGem}`}>Data management</p>
        </div>
        {/* Gems 4 */}
        <div
          className={[
            "position-absolute",
            aboutStyles["gem-float-4"],
            isHoveredGem4 ? aboutStyles.hovered : "",
          ].join(" ")}
          style={{
            zIndex: 5,
            cursor: "pointer",
          }}
          onMouseEnter={() => {
            setIsHoveredGem4(true);
          }}
          onMouseLeave={() => {
            setIsHoveredGem4(false);
          }}
          onClick={() => navigate("/services/centralize-management")}
        >
          <img src={GemFour} alt="" style={{ width: "100%", height: "100%" }} />
          <p className={`${aboutStyles.textInGem}`}>Centralize management</p>
        </div>
        {/* Gems 5 */}
        <div
          className={[
            "position-absolute",
            aboutStyles["gem-float-5"],
            isHoveredGem5 ? aboutStyles.hovered : "",
          ].join(" ")}
          style={{
            zIndex: 5,
            cursor: "pointer",
          }}
          onMouseEnter={() => {
            setIsHoveredGem5(true);
          }}
          onMouseLeave={() => {
            setIsHoveredGem5(false);
          }}
          onClick={() => navigate("/services/multimedia-solution")}
        >
          <img src={GemFive} alt="" style={{ width: "100%", height: "100%" }} />
          <p className={`${aboutStyles.textInGem}`}>Multimedia solution</p>
        </div>
        {/* Gems 6 */}
        <div
          className={[
            "position-absolute",
            aboutStyles["gem-float-6"],
            isHoveredGem6 ? aboutStyles.hovered : "",
          ].join(" ")}
          style={{
            zIndex: 5,
            cursor: "pointer",
          }}
          onMouseEnter={() => {
            setIsHoveredGem6(true);
          }}
          onMouseLeave={() => {
            setIsHoveredGem6(false);
          }}
          onClick={() => navigate("/services/digital-transformation")}
        >
          <img src={GemSix} alt="" style={{ width: "100%", height: "100%" }} />
          <p className={`${aboutStyles.textInGem}`}>Digital transformation</p>
        </div>
        {/* Gems floor */}
        <div
          className="position-absolute"
          style={{
            top: "-12%",
            right: 0,
            width: "100%",
          }}
        >
          <img
            src={GemFloor}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className={`${aboutStyles.vl}`}></div>
        <div className={aboutStyles["iso-layout"]}>
          <div className={aboutStyles["iso-item"]}>
            <div className={`${aboutStyles["iso-item-content"]} text-white`}>
              <p>{t("aboutUs:isoLineOne")}</p>
              <p>
                <span className={aboutStyles["color-gradient-1"]}>
                  {t("aboutUs:isoLineTwo")}
                </span>{" "}
              </p>
              <p>
                {t("aboutUs:isoLineThree")}{" "}
                <a
                  href="https://online.fliphtml5.com/gardk/ptra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={aboutStyles["color-gradient-2"]}
                >
                  {aboutUs?.ISONumber}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* community */}
      <div
        className={`position-relative ${aboutStyles["community-layout"]} ${aboutStyles["bg-community"]}`}
        style={{ scrollSnapAlign: "start" }}
      >
        <div className={aboutStyles["filter-bg-community-1"]}></div>
        <div className={aboutStyles["filter-bg-community-2"]}></div>
        <div className={aboutStyles["circle-bg-community-1"]}></div>
        <div className={aboutStyles["circle-bg-community-2"]}></div>
        <div className="position-absolute w-100 h-100">
          <div
            className={`${aboutStyles["wave-bg-community"]} position-relative  w-100 h-100`}
          >
            <img
              className={`${aboutStyles["bg-wave-filter"]} position-absolute`}
              src={BG_Wave_Service}
              alt=""
            />
            <img
              className={`${aboutStyles["bg-wave"]} position-absolute`}
              src={BG_Wave}
              alt=""
            />
          </div>
        </div>
        <div
          className="position-absolute text-white"
          style={{
            zIndex: 6,
            bottom: "5%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1 className={aboutStyles["main-text-s50"]}>
            {t("aboutUs:endLineOne")}
            <br />
          </h1>
          <h1 className={aboutStyles["main-text-s50"]}>
            {t("aboutUs:endLineTwo")}
          </h1>
        </div>
        <div
          className="position-absolute text-white"
          style={{
            zIndex: 6,
            top: "5%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h1 className={aboutStyles["main-text-s64"]}>
            {t("aboutUs:ourCommunity")}
          </h1>
        </div>
        <CommunityCard />
        <div className={`${aboutStyles["backgroundSVG"]} position-absolute`}>
          <svg
            viewBox="0 0 1440 2090"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              bottom: "1%",
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 3,
            }}
          >
            <g filter="url(#filter0_dddddd_213_108)">
              <ellipse
                cx="238.727"
                cy="247.573"
                rx="239.727"
                ry="247.573"
                transform="matrix(0.992546 0.121869 -0.992546 0.121869 723.457 877)"
                fill="#3D5B89"
                fillOpacity="0.08"
              />
            </g>
            <defs>
              <filter
                id="filter0_dddddd_213_108"
                x="-453.156"
                y="0.800728"
                width="2335.67"
                height="1736.77"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="9.83897" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.719743 0 0 0 0 0.894904 0 0 0 0 1 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_213_108"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-8.04927" />
                <feGaussianBlur stdDeviation="19.6779" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.517725 0 0 0 0 0.835172 0 0 0 0 1 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_dropShadow_213_108"
                  result="effect2_dropShadow_213_108"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-40.2464" />
                <feGaussianBlur stdDeviation="68.8728" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0.55 0 0 0 0 1 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect2_dropShadow_213_108"
                  result="effect3_dropShadow_213_108"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-60.3695" />
                <feGaussianBlur stdDeviation="137.746" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.209028 0 0 0 0 0.716667 0 0 0 0 0.358333 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect3_dropShadow_213_108"
                  result="effect4_dropShadow_213_108"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-73.785" />
                <feGaussianBlur stdDeviation="236.135" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.784314 0 0 0 0 0.596078 0 0 0 0 0.862745 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect4_dropShadow_213_108"
                  result="effect5_dropShadow_213_108"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-67.0773" />
                <feGaussianBlur stdDeviation="413.237" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.666801 0 0 0 0 0.271181 0 0 0 0 0.916667 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect5_dropShadow_213_108"
                  result="effect6_dropShadow_213_108"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect6_dropShadow_213_108"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact-section" style={{ scrollSnapAlign: "start" }}>
        <Contact />
      </div>
    </div>
  );
};

export default AboutUs;
