// src/pages/Community/CompanyEvents.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Contact from "../../components/Contact";
import ParticlesComponent from "../../components/Particles/Particles";
import styles from "./Community.module.css";
import { getStrapiImageUrl } from "../../services/strapi";

interface Category {
  createdAt: string;
  description: string | null;
  documentId: string;
  id: number;
  name: string;
  publishedAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: number;
  content: string;
  createdAt: string;
  documentId: string;
  gallery_image: null | any;
  mainImage: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    url: string;
  } | null;
  show_main: boolean;
  title: string;
  updatedAt: string;
  publishedAt: string;
  category: Category;
}

const CompanyEvents = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = `${apiUrl}/api/blog-posts?filters[category][name][$eq]=Company%20events&populate=*`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          const companyEvents = data.data.filter(
            (item: any) =>
              item.category?.name?.toLowerCase() === "company events"
          );
          setPosts(companyEvents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [apiUrl]);

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
            <h1 className={styles.headerTitle}>COMPANY EVENTS</h1>
          </div>

          <div className={styles.eventsGrid}>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : posts.length === 0 ? (
              <div>No company events found</div>
            ) : (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`${styles.eventCard} ${
                    index % 2 === 0 ? styles.left : styles.right
                  }`}
                  onClick={() => handlePostClick(post.documentId)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.eventContent}>
                    <h3 className={styles.eventTitle}>{post.title}</h3>
                    <p className={styles.eventText}>{post.content}</p>
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

          {/* ถ้ายังอยากใช้ Bootstrap class อย่าง text-center ต่อไป ก็ผสมได้แบบนี้ */}
          <div className={`${styles.fullWidth} text-center`}>
            <button
              className={styles.moreBtn}
              onClick={() =>
                window.open("https://www.facebook.com/TecAsiaSupport", "_blank")
              }
            >
              <span className={styles.moreBtnLabel}>More from our page</span>
            </button>
          </div>
        </div>

        <Contact />
      </div>
    </div>
  );
};

export default CompanyEvents;
