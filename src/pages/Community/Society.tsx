import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Contact from "../../components/Contact";
import ParticlesComponent from "../../components/Particles/Particles";
import styles from "./Community.module.css";
import {
  getStrapiImageUrl,
  getBlogPostsByCategory,
} from "../../services/strapi";
import { formatTextWithLineBreaks } from "../../utils/textFormatter";
import type { BlogPost } from "../../types/blogPost";

const Society = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["common", "society"]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("=== Society Page Debug ===");
        console.log("Current i18n.language:", i18n.language);
        setLoading(true);

        const categoryName =
          i18n.language === "th" ? "กิจกรรมเพื่อสังคม" : "Society";
        console.log("Using category name:", categoryName);

        console.log(`Calling getBlogPostsByCategory('${categoryName}')...`);
        const response = await getBlogPostsByCategory(categoryName);
        console.log("API Response:", response);
        console.log("Response data:", response.data);
        console.log("Is array?", Array.isArray(response.data));

        if (response.data && Array.isArray(response.data)) {
          console.log("Raw data before filter:", response.data);

          const societyPosts = response.data.filter((item: BlogPost) => {
            const expectedCategory =
              i18n.language === "th" ? "กิจกรรมเพื่อสังคม" : "Society";
            console.log(
              `Checking item: ${item.title} - Category: ${item.category?.name} (expected: ${expectedCategory})`
            );
            return item.category?.name === expectedCategory;
          });

          console.log("Filtered societyPosts:", societyPosts);
          console.log("Number of posts after filter:", societyPosts.length);
          setPosts(societyPosts);
        } else {
          console.log("No data or not array");
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
      {/* BG particles */}
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
            <h1 className={styles.headerTitle}>{t("society:title")}</h1>
          </div>

          <div className={styles.eventsGrid}>
            {loading ? (
              <div className={styles.loading}>{t("society:loading")}</div>
            ) : posts.length === 0 ? (
              <div>{t("society:noEvents")}</div>
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
                      {formatTextWithLineBreaks(post.content || "")}
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

          {/* ใช้ util fullWidth จาก module + bootstrap text-center ได้ */}
          <div className={`${styles.fullWidth} text-center`}>
            <button
              className={styles.moreKnowledgeBtn}
              onClick={() =>
                window.open("https://www.facebook.com/TecAsiaSupport", "_blank")
              }
            >
              {t("society:moreFromPage")}
            </button>
          </div>
        </div>

        <Contact />
      </div>
    </div>
  );
};

export default Society;
