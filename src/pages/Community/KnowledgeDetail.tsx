// KnowledgeDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Contact from "../../components/Contact";

// เปลี่ยนมาใช้ CSS Module
import styles from "./KnowledgeDetail.module.css";
import { getStrapiImageUrl } from "../../services/strapi";

interface KnowledgePost {
  id: number;
  title: string;
  content: string;
  subtitle: string;
  main_image: {
    url: string;
    alternativeText: string;
  };
  createdAt: string;
}

const KnowledgeDetail: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [post, setPost] = useState<KnowledgePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setError(null);
        const response = await fetch(
          `${apiUrl}/api/blog-posts?populate=*&filters[documentId][$eq]=${documentId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (
          !data?.data ||
          !Array.isArray(data.data) ||
          data.data.length === 0
        ) {
          throw new Error("Post not found");
        }

        setPost(data.data[0]);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchPost();
    }
  }, [documentId, apiUrl]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || !post) {
    return <div className={styles.error}>{error || "Post not found"}</div>;
  }

  return (
    <div className={styles.knowledgeDetailContainer}>
      {/* Header Section with Image */}
      <div className={styles.headerSection}>
        <div className={styles.knowledgeHeader}>
          <h1 className={styles.mainTitle}>{post.title}</h1>
        </div>

        {/* Main Image */}
        <div className={styles.mainImageContainer}>
          <img
            src={getStrapiImageUrl(post?.main_image?.url)}
            alt={post.title}
            className={styles.mainImage}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.contentWrapper}>
          <div
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      {/* All Knowledge Link */}
      <div className={styles.allKnowledgeSection}>
        <a href="/community/knowledge" className={styles.allKnowledgeLink}>
          All Knowledge
        </a>
      </div>

      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default KnowledgeDetail;
