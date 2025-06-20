// Knowledge.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Contact from "../../components/Contact";

// เปลี่ยนเป็น import CSS Module แทน .css ปกติ
import styles from "./Knowledge.module.css";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "../../types/blogPost";
import { getCompanyVideoUrl } from "../../services/strapi";

const Knowledge: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { t } = useTranslation(["common", "knowledge"]);

  const [bridgeVideo, setBridgeVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const url = await getCompanyVideoUrl();
      setBridgeVideo(url);

      // รอให้ state update แล้ว reload video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().catch((err) => {
            console.warn("Autoplay blocked:", err);
          });
        }
      }, 100);
    };

    fetchVideo();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching all blog posts...");
        const url = `${apiUrl}/api/blog-posts?filters[category][name][$eq]=Knowledge&populate=*`;
        console.log("API URL:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("Raw API Response:", data);

        if (data.data && Array.isArray(data.data)) {
          const knowledgePosts = data.data.filter(
            (item: any) => item.category?.name?.toLowerCase() === "knowledge"
          );
          console.log("\nKnowledge posts:", knowledgePosts);
          setPosts(knowledgePosts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [apiUrl]);

  useEffect(() => {
    console.log("Current posts state:", posts);
  }, [posts]);

  return (
    <>
      <div className={styles.knowledgeContainer}>
        <h1>{t("knowledge:knowledge")}</h1>

        {/* Top Section */}
        <div className={styles.knowledgeTopSection}>
          <div className={styles.knowledgeHeader}>
            <p className={styles.knowledgeSubtitle}>
              {t("knowledge:subTitle1")}
              <br />
              {t("knowledge:subTitle2")}
              <br />
              {t("knowledge:subTitle3")}
            </p>
            <button className={styles.moreKnowledgeBtn}>
              <a
                href="https://www.facebook.com/TecAsiaSupport"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {t("knowledge:moreKnowledge")}
              </a>
            </button>
          </div>
          <div className={styles.videoContainer}>
            <video
              className={styles.videoPlayer}
              ref={videoRef}
              controls
              muted
              autoPlay
              poster="/path-to-video-thumbnail.jpg"
            >
              <source src={bridgeVideo ?? ""} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* AI Trends Grid */}
        <div className={styles.trendsGrid}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : posts.length === 0 ? (
            <div className={styles.noPosts}>No knowledge posts found</div>
          ) : (
            posts.map((post, index) => (
              <div key={post.id} className={styles.trendCard}>
                {post.main_image && (
                  <img
                    src={`${post.main_image.url}`}
                    alt={post.main_image.alternativeText || post.title}
                    className={styles.cardImage}
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                )}
                <div className={styles.cardContent}>
                  <div className={styles.cardBottom}>
                    <h3 className="text-white">{post.title}</h3>
                    <Link
                      to={`/community/knowledge/doc/${post.documentId}`}
                      className={styles.readMore}
                    >
                      {t("knowledge:readMore")}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Contact />
    </>
  );
};

export default Knowledge;
