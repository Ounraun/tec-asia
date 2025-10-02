// KnowledgeDetail.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Contact from "../../components/Contact";
import styles from "./KnowledgeDetail.module.css";
import { getStrapiImageUrl } from "../../services/strapi";
import DOMPurify from "dompurify";

interface KnowledgePost {
  id: number;
  title: string;
  content: string;
  subtitle: string;
  mainImage: {
    url: string;
    alternativeText: string;
  } | null;
  createdAt: string;
}

const KnowledgeDetail: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [post, setPost] = useState<KnowledgePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      if (!documentId) {
        return;
      }
      try {
        setError(null);
        const encodedId = encodeURIComponent(documentId);
        const res = await fetch(
          `${apiUrl}/api/blog-posts?populate=*&filters[documentId][$eq]=${encodedId}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!data?.data?.length) throw new Error("Post not found");
        setPost(data.data[0]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) fetchPost();
  }, [documentId, apiUrl]);

  const sanitizedContent = useMemo(
    () => ({ __html: DOMPurify.sanitize(post?.content ?? "") }),
    [post?.content]
  );

  if (loading) return <div className={styles.loading}>{t('loading', { ns: 'knowledgeDetail' })}</div>;
  if (error || !post)
    return <div className={styles.error}>{error || t('postNotFound', { ns: 'knowledgeDetail' })}</div>;

  const mainImageUrl = getStrapiImageUrl(post?.mainImage?.url);

  return (
    <> 
      <div className={styles.knowledgeDetailContainer}>
        <div className={styles.headerSection}>
          <div className={styles.knowledgeHeader}>
            <h1 className={styles.mainTitle}>{post.title}</h1>
          </div>
          <div className={styles.mainImageContainer}>
            {mainImageUrl ? (
              <img
                src={mainImageUrl}
                alt={post.mainImage?.alternativeText || post.title}
                className={styles.mainImage}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.jpg";
                }}
              />
            ) : null}
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.contentWrapper}>
            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={sanitizedContent}
            />
          </div>
        </div>

        <div className={styles.allKnowledgeSection}>
          <a href="/community/knowledge" className={styles.allKnowledgeLink}>
            {t('allKnowledge', { ns: 'knowledgeDetail' })}
          </a>
        </div>
      </div>
      <Contact />
    </>
  );
};

export default KnowledgeDetail;
