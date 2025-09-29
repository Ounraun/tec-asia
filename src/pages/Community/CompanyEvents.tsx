import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatTextWithLineBreaks } from "../../utils/textFormatter";
import Contact from "../../components/Contact";
import ParticlesComponent from "../../components/Particles/Particles";
import styles from "./Community.module.css";
import {
  getStrapiImageUrl,
  getBlogPostsByCategory,
} from "../../services/strapi";
import type { BlogPost } from "../../types/blogPost";

const CompanyEvents = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["common", "companyEvents"]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const categoryName =
          i18n.language === "th" ? "กิจกรรมองค์กร" : "Company events";
        const response = await getBlogPostsByCategory(categoryName);

        if (response.data && Array.isArray(response.data)) {
          const companyEvents = response.data.filter((item: BlogPost) => {
            const expectedCategory =
              i18n.language === "th" ? "กิจกรรมองค์กร" : "Company events";
            return item.category?.name === expectedCategory;
          });

          setPosts(companyEvents);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [i18n.language]);
  const handlePostClick = (documentId: string) => {
    navigate(`/blog/doc/${documentId}`);
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#0d0d0e",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <ParticlesComponent />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "transparent",
        }}
      >
        <div
          className={styles.communityContainer}
          style={{ backgroundColor: "transparent" }}
        >
          <div className={styles.communityHeader}>
            <h1 className={styles.headerTitle}>{t("companyEvents:title")}</h1>
          </div>

          <div className={styles.eventsGrid}>
            {loading ? (
              <div className={styles.loading}>{t("companyEvents:loading")}</div>
            ) : posts.length === 0 ? (
              <div>{t("companyEvents:noEvents")}</div>
            ) : (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`${styles.eventCard} ${
                    index % 2 === 0 ? styles.left : styles.right
                  }`}
                  onClick={() => handlePostClick(String(post.documentId))}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.eventContent}>
                    <h3 className={styles.eventTitle}>{post.title}</h3>
                    <div className={styles.eventText}>
                      {formatTextWithLineBreaks(post.content)}
                    </div>
                  </div>

                  {getStrapiImageUrl(post?.mainImage?.url) && (
                    <div className={styles.eventImageContainer}>
                      <img
                        src={getStrapiImageUrl(post?.mainImage?.url)}
                        alt={post.title}
                        className={styles.eventImage}
                        onError={(e) => {
                          console.error("Image failed to load:", e);
                          (e.currentTarget as HTMLImageElement).src =
                            "/placeholder.jpg";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className={`${styles.fullWidth} text-center`}>
            <button
              className={styles.moreBtn}
              onClick={() =>
                window.open("https://www.facebook.com/TecAsiaSupport", "_blank")
              }
            >
              <span className={styles.moreBtnLabel}>
                {t("companyEvents:moreFromPage")}
              </span>
            </button>
          </div>
        </div>

        <Contact />
      </div>
    </div>
  );
};

export default CompanyEvents;
