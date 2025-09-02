import React, { useState, useMemo, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ParticlesComponent from "../../components/Particles/Particles";
import Contact from "../../components/Contact";
import aboutStyles from "./AboutUs.module.css";
import { getAboutUs } from "../../services/strapi";
import type { AboutUs } from "../../types/aboutUs";
import GemGroup from "./GemGroup";
import BG_Service from "@/assets/AboutUs/bg_service.webp";
import GemFloor from "@/assets/AboutUs/Gem-floor.svg";
import BG_Wave from "@/assets/AboutUs/bg-wave.svg";
import BG_Wave_Service from "@/assets/AboutUs/bg-wave-service.svg";
import {
  getLatestPostByCategory,
  getStrapiImageUrl,
} from "../../services/strapi";

function usePreloadImages(urls: string[]) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const jobs = urls.filter(Boolean).map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
          const d = (img as any).decode?.();
          if (d && typeof d.then === "function") {
            d.catch(() => {}).finally(() => resolve());
          }
        })
    );

    Promise.all(jobs).finally(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [urls.join("|")]);

  return ready;
}

const CommunityCard = lazy(() => import("./CommunityCard"));
type Key = "company" | "knowledge" | "society";

const AboutUs = () => {
  const keys: Key[] = ["company", "knowledge", "society"];
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Record<Key, any>>({} as any);

  const imagesReady = usePreloadImages([
    BG_Service,
    BG_Wave,
    BG_Wave_Service,
    GemFloor,
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const ready = !isLoading && imagesReady;

  const particles = useMemo(() => {
    return isLoading ? null : <ParticlesComponent />;
  }, [isLoading]);

  const { t, i18n } = useTranslation(["common", "aboutUs", "communityCard"]);
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);

  useEffect(() => {
    Promise.all([
      getLatestPostByCategory("Company events"),
      getLatestPostByCategory("Knowledge"),
      getLatestPostByCategory("Society"),
    ])
      .then(([cRes, kRes, sRes]) => {
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
    if (!ready) return;
    const id = setInterval(() => {
      setCurrentIdx((idx) => (idx + 1) % keys.length);
    }, 3000);
    return () => clearInterval(id);
  }, [ready, keys.length]);

  useEffect(() => {
    setIsLoading(true);
    getAboutUs()
      .then((res) => {
        setAboutUs(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed fetching AboutUs:", err);
        setIsLoading(false);
      });
  }, [i18n.language]);

  const prevIdx = (currentIdx + keys.length - 1) % keys.length;
  const nextIdx = (currentIdx + 1) % keys.length;

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
    if (ready && window.location.hash === "#contact-section") {
      scrollToContact();
    }
  }, [ready]);

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
    <div
      className={`${aboutStyles["container"]} ${
        ready ? aboutStyles["fadeIn"] : ""
      }`}
      aria-hidden={!ready}
    >
      {!ready && (
        <div
          className={aboutStyles["loadingOverlay"]}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className={aboutStyles["spinner"]} />
        </div>
      )}

      <div
        className="overflow-x-hidden overflow-y-visible"
        style={{ scrollBehavior: "smooth", backgroundColor: "#000" }}
      >
        <div
          className={`bg-dark ${aboutStyles["heroSection"]}`}
          style={{ scrollSnapAlign: "start", width: "100%" }}
        >
          <div className={aboutStyles["particleWrapper"]}>{particles}</div>
          <div className={aboutStyles["contentLayout"]}>
            <div style={{ width: "100%" }}>
              <h1 className={aboutStyles["main-title"]}>
                {aboutUs?.heroTitle}
              </h1>
              <p
                className={`${aboutStyles["main-text"]} ${aboutStyles["main-text-s32"]}`}
              >
                {aboutUs?.heroContent}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`position-relative ${aboutStyles["serviceSection"]}`}
          style={{ overflow: "hidden", scrollSnapAlign: "start" }}
        >
          {imagesReady ? (
            <img
              src={BG_Service}
              alt="Background"
              className={aboutStyles["bgFade"]}
              aria-hidden="true"
              decoding="async"
              fetchPriority="high"
            />
          ) : (
            <div style={{ width: "100%", height: 600 }} />
          )}

          <div className={aboutStyles["serviceHeading"]}>
            <h2>
              {t("aboutUs:service")}
              <br />
              {t("aboutUs:and")} <br />
              {t("aboutUs:solutions")}
            </h2>
          </div>

          {imagesReady && <GemGroup />}

          <div className={aboutStyles["gemFloorWrapper"]}>
            {imagesReady && (
              <img
                className={aboutStyles["gem-floor-img"]}
                src={GemFloor}
                aria-hidden="true"
                decoding="async"
              />
            )}
          </div>

          <div className={aboutStyles["vl"]}></div>

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
            className={`${aboutStyles["communityTitle"]} text-white position-absolute`}
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
            {imagesReady && (
              <div
                className={`${aboutStyles["wave-bg-community"]} position-relative w-100 h-100`}
              >
                <img
                  className={`${aboutStyles["bg-wave-filter"]} position-absolute`}
                  src={BG_Wave_Service}
                  alt=""
                  loading="eager"
                  decoding="async"
                  aria-hidden="true"
                />
                <img
                  className={`${aboutStyles["bg-wave"]} position-absolute`}
                  src={BG_Wave}
                  alt=""
                  loading="eager"
                  decoding="async"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <div className={aboutStyles["carouselContainer"]}>
            {keys.map((key, i) => {
              let posClass = "";
              if (i === currentIdx) posClass = aboutStyles["current"];
              else if (i === prevIdx) posClass = aboutStyles["prev"];
              else if (i === nextIdx) posClass = aboutStyles["next"];

              const rawUrl = posts[key]?.mainImage?.url;
              const imageUrl = getStrapiImageUrl(rawUrl);

              return (
                <div
                  key={key}
                  className={`${aboutStyles["slide"]} ${posClass}`}
                  onClick={() => {
                    if (i === prevIdx) setCurrentIdx(prevIdx);
                    if (i === nextIdx) setCurrentIdx(nextIdx);
                  }}
                >
                  <Suspense fallback={null}>
                    <CommunityCard
                      title={t(`communityCard:${key}`)}
                      imageUrl={imageUrl}
                      excerpt={truncate(posts[key]?.content)}
                      date={formatDate(posts[key]?.createdAt)}
                      onReadMore={() =>
                        navigate(`/blog/doc/${posts[key].documentId}`)
                      }
                    />
                  </Suspense>
                  <div className={aboutStyles["cardCategoryTitle"]}>
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
