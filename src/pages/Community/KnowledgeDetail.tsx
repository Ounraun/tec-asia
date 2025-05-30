import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Contact from "../../components/Contact";
import "./KnowledgeDetail.css";

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
    return <div className="loading">Loading...</div>;
  }

  if (error || !post) {
    return <div className="error">{error || "Post not found"}</div>;
  }

  return (
    <div className="knowledge-detail-container">
      {/* Header Section with Image */}
      <div className="header-section">
        <div className="knowledge-header">
          <div className="title-tag">
            {/* <span className="tag">title topic / main article / example</span> */}
          </div>
          <h1 className="main-title">{post.title}</h1>
        </div>

        {/* Main Image */}
        <div className="main-image-container">
          <img
            src={`${post.main_image?.url}`}
            alt={post.main_image?.alternativeText || post.title}
            className="main-image"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="content-wrapper">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      {/* All Knowledge Link */}
      <div className="all-knowledge-section">
        <a href="/community/knowledge" className="all-knowledge-link">
          All Knowledge
        </a>
      </div>

      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default KnowledgeDetail;
