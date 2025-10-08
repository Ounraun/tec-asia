import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Contact from "../../components/Contact";
import styles from "./Knowledge.module.css";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "../../types/blogPost";
import {
  getCompanyVideoUrl,
  getBlogPostsByCategory,
  getCategoryByName,
} from "../../services/strapi";
import { getStrapiImageUrl } from "../../services/strapi";

const Knowledge: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtitle, setSubtitle] = useState<string>("");
  const { t, i18n } = useTranslation(["common", "knowledge"]);

  const [bridgeVideo, setBridgeVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const url = await getCompanyVideoUrl();
        const resolvedUrl = url ? getStrapiImageUrl(url) : null;
        setBridgeVideo(resolvedUrl);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch((err) => {
              console.warn("Knowledge page: autoplay blocked", err);
            });
          }
        }, 100);
      } catch (error) {
        console.error("Knowledge page: failed to fetch knowledge video URL", error);
      }
    };
    fetchVideo();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const categoryName = i18n.language === "th" ? "คลังความรู้" : "Knowledge";
        const [postsResponse, categoryResponse] = await Promise.all([
          getBlogPostsByCategory(categoryName),
          getCategoryByName(categoryName),
        ]);
        
        if (postsResponse.data && Array.isArray(postsResponse.data)) {
          const knowledgePosts = postsResponse.data.filter(
            (item: BlogPost) => {
              const expectedCategory = i18n.language === "th" ? "คลังความรู้" : "Knowledge";
              return item.category?.name === expectedCategory;
            }
          );
          setPosts(knowledgePosts);
        } else {
          setPosts([]);
        }

        const description = categoryResponse.data?.[0]?.description;
        setSubtitle(description ?? "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [i18n.language]);

  return (
    <>
      <div className={styles.knowledgeContainer}>
        <div className={styles.communityHeader}>
          <h1 className={styles.headerTitle}>{t("knowledge:knowledge")}</h1>
        </div>
        <div className={styles.knowledgeTopSection}>
          <div className={styles.knowledgeHeader}>
            <p className={styles.knowledgeSubtitle}>
              {subtitle}
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
              <source
                src={bridgeVideo ?? "/knowledge/knowledge.mp4"}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className={styles.trendsGrid}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : posts.length === 0 ? (
            <div className={styles.noPosts}>No knowledge posts found</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={styles.trendCard}>
                {getStrapiImageUrl(post?.mainImage?.url) && (
                  <img
                    src={getStrapiImageUrl(post?.mainImage?.url)}
                    alt={post.title}
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
