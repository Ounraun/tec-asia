import React, { useState, useMemo, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
import { getLatestPostByCategory } from "../../services/strapi";
import type { BlogPost } from "../../types/blogPost";

const CommunityCard = lazy(() => import("./CommunityCard"));

type Post = BlogPost;

const AboutUs = () => {
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<{
    company?: Post;
    knowledge?: Post;
    society?: Post;
  }>({});

  const particles = useMemo(() => {
    return <ParticlesComponent />;
  }, []);

  useEffect(() => {
    Promise.all([
      getLatestPostByCategory("Company events"),
      getLatestPostByCategory("Knowledge"),
      getLatestPostByCategory("Society"),
    ])
      .then(([cRes, kRes, sRes]) => {
        setPosts({
          company: cRes.data[0],
          knowledge: kRes.data[0],
          society: sRes.data[0],
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const { t, i18n } = useTranslation(["common", "aboutUs"]);
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  // Fetch About Us data when the component mounts or language changes
  // ใช้ useEffect เพื่อดึงข้อมูลจาก API
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
  // ตัดข้อความ
  function truncate(text: string, maxLength = 100): string {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  }

  // แปลงวันที่
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
        {/* hero  */}
        <div
          className={`bg-dark ${aboutStyles.heroSection}`}
          style={{ scrollSnapAlign: "start", width: "100%" }}
        >
          <div className={aboutStyles.particleWrapper}>{particles}</div>
          <div className={`${aboutStyles.contentLayout}`}>
            <div style={{ width: "100%", maxWidth: "700px" }}>
              <h1 className={aboutStyles.mainTitle}>{aboutUs?.heroTitle}</h1>
              <p
                className={`${aboutStyles.mainText} ${aboutStyles.mainTextS32}`}
              >
                {aboutUs?.heroContent}
              </p>
            </div>
          </div>
        </div>

        {/* service and solutions */}
        <div
          className={`position-relative ${aboutStyles.serviceSection}`}
          style={{
            // height: "293vh",
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
            aria-hidden="true"
          />
          {/* Background */}
          <div className={aboutStyles.serviceHeading}>
            <h2>
              {t("aboutUs:service")}
              <br />
              {t("aboutUs:and")} <br />
              {t("aboutUs:solutions")}
            </h2>
          </div>
          <GemGroup />
          {/* Gems floor */}
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

        {/* community */}
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
          {/* ซ่อน decoration บางอย่าง ใน CSS */}
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
          <Suspense fallback={<div>Loading community...</div>}>
            <Swiper
              modules={[Pagination, Navigation]}
              // pagination={{ clickable: true }}
              slidesPerView={3}
              breakpoints={{
                0: {
                  // เมื่อความกว้าง < 768 ให้เหลือ 1 ก้อน
                  slidesPerView: 1,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                  centeredSlides: true,
                },
              }}
              className="ourCommunitySwiper"
              style={{ overflow: "visible", zIndex: 5}}
            >
              {["company", "knowledge", "society"].map((key) => {
                const post = (posts as any)[key] as Post | undefined;
                if (!post) return null;
                const titleKey =
                  key === "company"
                    ? "communityCard:companyEvents"
                    : key === "knowledge"
                    ? "communityCard:knowledge"
                    : "communityCard:society";
                return (
                  <SwiperSlide key={key}>
                    <CommunityCard
                      title={t(titleKey)}
                      imageUrl={post.main_image?.url ?? ""}
                      excerpt={truncate(post.content)}
                      date={formatDate(post.createdAt)}
                      onReadMore={() => navigate(`/blog/doc/${post.id}`)}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Suspense>
          <div
            className="position-absolute text-white"
            style={{
              zIndex: 6,
              bottom: "-3%",
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

          {/* <div className={`${aboutStyles["backgroundSVG"]} position-absolute`}>
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
          </div> */}
        </section>

        {/* Contact Section */}
        <div id="contact-section" style={{ scrollSnapAlign: "start" }}>
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
