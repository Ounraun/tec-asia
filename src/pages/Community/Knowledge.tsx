import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Contact from "../../components/Contact";
import "./Knowledge.css";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "../../types/blogPost";
import { getCompanyVideoUrl } from "../../services/strapi";

const Knowledge = () => {
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

      // รอให้ state update เสร็จ
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load(); // โหลดใหม่
          videoRef.current.play().catch((err) => {
            console.warn("Autoplay blocked:", err);
          });
        }
      }, 100); // ดีเล็กน้อยให้ DOM update ก่อน
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
          // แสดงข้อมูลดิบทั้งหมดก่อน
          console.log("All raw posts:", JSON.stringify(data.data, null, 2));

          // แสดงข้อมูลแต่ละโพสต์แบบละเอียด
          data.data.forEach((item: any, index: number) => {
            console.log(`\nPost ${index + 1} details:`, {
              id: item.id,
              title: item.title,
              content: item.content,
              category: item.category?.name,
              main_image: item.main_image,
              show_main: item.show_main,
              documentId: item.documentId,
            });
          });

          // ตรวจสอบโพสต์ที่เป็น knowledge
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

  // Log when posts state changes
  useEffect(() => {
    console.log("Current posts state:", posts);
  }, [posts]);

  return (
    <>
      <div className="knowledge-container">
        <h1>{t("knowledge:knowledge")}</h1>
        {/* Header Section */}
        <div className="knowledge-top-section">
          <div className="knowledge-header">
            <p className="knowledge-subtitle">
              {t("knowledge:subTitle1")}
              <br />
              {t("knowledge:subTitle2")}
              <br />
              {t("knowledge:subTitle3")}
            </p>
            <button className="more-knowledge-btn">
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
          <div className="video-container">
            <video
              className="video-player"
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
        <div className="trends-grid">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts">No knowledge posts found</div>
          ) : (
            posts.map((post, index) => (
              <div key={post.id} className="trend-card">
                {post.main_image && (
                  <img
                    src={`${post.main_image.url}`}
                    alt={post.main_image.alternativeText || post.title}
                    className="card-image"
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                )}
                <div className="card-content">
                  <div className="card-bottom">
                    <h3>{post.title}</h3>
                    <h4>{post.category?.name}</h4>
                    <p>{post.content}</p>
                    <Link
                      to={`/community/knowledge/doc/${post.documentId}`}
                      className="read-more"
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
