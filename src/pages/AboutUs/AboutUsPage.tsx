import React, { useState, useMemo, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ParticlesComponent from "../../components/Particles/Particles";
import Contact from "../../components/Contact";
import aboutStyles from "./AboutUs.module.css";
import { getAboutUs } from "../../services/strapi";
import type { AboutUs } from "../../types/aboutUs";
import GemGroup from "./GemGroup";
// Importing SVG assets
import BG_Service from "@/assets/AboutUs/bg_service.webp";
import GemFloor from "@/assets/AboutUs/Gem-floor.svg";
import BG_Wave from "@/assets/AboutUs/bg-wave.svg";
import BG_Wave_Service from "@/assets/AboutUs/bg-wave-service.svg";
import {
  getLatestPostByCategory,
  getStrapiImageUrl,
} from "../../services/strapi";

const CommunityCard = lazy(() => import("./CommunityCard"));
type Key = "company" | "knowledge" | "society";

const AboutUs = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Record<Key, any>>({} as any);

  useEffect(() => {
    Promise.all([
      getLatestPostByCategory("Company events"),
      getLatestPostByCategory("Knowledge"),
      getLatestPostByCategory("Society"),
    ])
      .then(([cRes, kRes, sRes]) => {
        console.log("API company:", cRes);
        console.log("API knowledge:", kRes);
        console.log("API society:", sRes);
        setPosts({
          company: cRes.data ? cRes.data[0] : null,
          knowledge: kRes.data ? kRes.data[0] : null,
          society: sRes.data ? sRes.data[0] : null,
        });
      })
      .catch((err) => {
        console.error("API ERROR:", err);
      });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((idx) => (idx + 1) % keys.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const keys: Key[] = ["company", "knowledge", "society"];

  const prevIdx = (currentIdx + keys.length - 1) % keys.length;
  const nextIdx = (currentIdx + 1) % keys.length;
  const [isLoading, setIsLoading] = useState(true);
  const particles = useMemo(() => {
    return <ParticlesComponent />;
  }, []);

  const { t, i18n } = useTranslation(["common", "aboutUs", "communityCard"]);

  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getAboutUs()
      .then((res) => {
        setAboutUs(res.data);
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
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const scrollToContact = () => {
    if (!isLoading) {
      const contactSection = document.getElementById("contact-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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

  function truncate(text: string, maxLength = 100): string {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  }

  function formatDate(isoString: string): string {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className={aboutStyles["container"]}>
      <div
        className="overflow-x-hidden overflow-y-visible"
        style={{ scrollBehavior: "smooth", backgroundColor: "#000" }}
      >
        <div
          className={`bg-dark ${aboutStyles.heroSection}`}
          style={{ scrollSnapAlign: "start", width: "100%" }}
        >
          <div className={aboutStyles.particleWrapper}>{particles}</div>
          <div className={`${aboutStyles.contentLayout}`}>
            <div style={{ width: "100%" }}>
              <h1 className={aboutStyles.mainTitle}>{aboutUs?.heroTitle}</h1>
              <p
                className={`${aboutStyles.mainText} ${aboutStyles.mainTextS32}`}
              >
                {aboutUs?.heroContent}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`position-relative ${aboutStyles.serviceSection}`}
          style={{
            overflow: "hidden",
            scrollSnapAlign: "start",
          }}
        >
          {" "}
          <img
            src={BG_Service}
            alt="Background"
            className={`${aboutStyles.bgFade}`}
            aria-hidden="true"
          />
          <div className={aboutStyles.serviceHeading}>
            <h2>
              {t("aboutUs:service")}
              <br />
              {t("aboutUs:and")} <br />
              {t("aboutUs:solutions")}
            </h2>
          </div>
          <GemGroup />
          <div className={aboutStyles.gemFloorWrapper}>
            <img
              className={aboutStyles["gem-floor-img"]}
              src={GemFloor}
              aria-hidden="true"
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

        <section
          className={`${aboutStyles["community-layout"]} ${aboutStyles["bg-community"]}`}
        >
          <div
            className={`${aboutStyles.communityTitle} text-white position-absolute`}
          >
            <h1 className={aboutStyles["main-text-s64"]}>
              {t("aboutUs:ourCommunity")}
            </h1>
          </div>
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
                loading="lazy"
                aria-hidden="true"
              />
              <img
                className={`${aboutStyles["bg-wave"]} position-absolute`}
                src={BG_Wave}
                alt=""
                loading="lazy"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className={aboutStyles.carouselContainer}>
            {keys.map((key, i) => {
              let posClass = "";
              if (i === currentIdx) posClass = aboutStyles.current;
              else if (i === prevIdx) posClass = aboutStyles.prev;
              else if (i === nextIdx) posClass = aboutStyles.next;
              else posClass = "";

              return (
                <div
                  key={key}
                  className={`${aboutStyles.slide} ${posClass}`}
                  onClick={() => {
                    if (i === prevIdx) setCurrentIdx(prevIdx);
                    if (i === nextIdx) setCurrentIdx(nextIdx);
                  }}
                >
                  <CommunityCard
                    title={t(`communityCard:${key}`)}
                    imageUrl={getStrapiImageUrl(posts[key]?.main_image?.url)}
                    excerpt={truncate(posts[key]?.content)}
                    date={formatDate(posts[key]?.createdAt)}
                    onReadMore={() =>
                      navigate(`/blog/doc/${posts[key].documentId}`)
                    }
                  />
                  <div className={aboutStyles.cardCategoryTitle}>
                    {t(`communityCard:${key}`)}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="position-absolute text-white"
            style={{
              zIndex: 6,
              bottom: "3%",
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
        </section>

        <div id="contact-section" style={{ scrollSnapAlign: "start" }}>
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
