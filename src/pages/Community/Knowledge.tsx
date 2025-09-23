import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Contact from "../../components/Contact";
import styles from "./Knowledge.module.css";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "../../types/blogPost";
import { getCompanyVideoUrl, getBlogPostsByCategory } from "../../services/strapi";
import { getStrapiImageUrl } from "../../services/strapi";

const Knowledge: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(["common", "knowledge"]);

  const [bridgeVideo, setBridgeVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const url = await getCompanyVideoUrl();
      setBridgeVideo(url);
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
        console.log("=== Knowledge Page Debug ===");
        console.log("Current i18n.language:", i18n.language);
        setLoading(true);
        
        // ใช้ชื่อ category ตาม locale
        const categoryName = i18n.language === 'th' ? 'คลังความรู้' : 'Knowledge';
        console.log("Using category name:", categoryName);
        
        console.log(`Calling getBlogPostsByCategory('${categoryName}')...`);
        const response = await getBlogPostsByCategory(categoryName);
        console.log("API Response:", response);
        console.log("Response data:", response.data);
        console.log("Is array?", Array.isArray(response.data));
        
        if (response.data && Array.isArray(response.data)) {
          console.log("Raw data before filter:", response.data);
          
          const knowledgePosts = response.data.filter(
            (item: BlogPost) => {
              const expectedCategory = i18n.language === 'th' ? 'คลังความรู้' : 'Knowledge';
              console.log(`Checking item: ${item.title} - Category: ${item.category?.name} (expected: ${expectedCategory})`);
              return item.category?.name === expectedCategory;
            }
          );
          
          console.log("Filtered knowledgePosts:", knowledgePosts);
          console.log("Number of posts after filter:", knowledgePosts.length);
          setPosts(knowledgePosts);
        } else {
          console.log("No data or not array");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [i18n.language]);

  useEffect(() => {
    console.log("Current posts state:", posts);
  }, [posts]);

  return (
    <>
      <div className={styles.knowledgeContainer}>
        <h1>{t("knowledge:knowledge")}</h1>
        <div className={styles.knowledgeTopSection}>
          <div className={styles.knowledgeHeader}>
            <p className={styles.knowledgeSubtitle}>
              {t("knowledge:subTitle")}
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
