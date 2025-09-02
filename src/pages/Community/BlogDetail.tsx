// src/pages/Community/BlogDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Contact from "../../components/Contact";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./BlogDetail.module.css";
import { getStrapiImageUrl } from "../../services/strapi";

interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  content: string;
  mainImage: {
    url: string;
    alternativeText: string;
  } | null;
  gallery_image: Array<{
    url: string;
    alternativeText: string;
  }> | null;
  category: {
    name: string;
  } | null;
}

const BlogDetail = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setError(null);
        const response = await fetch(
          `${apiUrl}/api/blog-posts?populate=*&filters[documentId][$eq]=${documentId}`
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (
          !data?.data ||
          !Array.isArray(data.data) ||
          data.data.length === 0
        ) {
          throw new Error("Post not found");
        }

        const postData = data.data[0];
        setPost(postData);

        if (postData?.category?.name) {
          try {
            const relatedResponse = await fetch(
              `${apiUrl}/api/blog-posts?populate=*&filters[category][name][$eq]=${postData.category.name}&filters[documentId][$ne]=${documentId}`
            );
            if (!relatedResponse.ok) return;

            const relatedData = await relatedResponse.json();
            if (relatedData?.data)
              setRelatedPosts(relatedData.data.slice(0, 3));
          } catch (err) {
            console.error("Error fetching related posts:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    if (documentId) fetchPost();
  }, [documentId, apiUrl]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error loading post</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!post) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <div className={styles.blogDetailContainer}>
        <h1 className={styles.blogTitle}>{post.title}</h1>

        <div className={styles.mainContent}>
          <div className={styles.mainImage}>
            {getStrapiImageUrl(post?.mainImage?.url) ? (
              <img
                src={getStrapiImageUrl(post?.mainImage?.url)}
                alt={post.title}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
            ) : (
              <div className={styles.noImage}>No image available</div>
            )}
          </div>

          <div className={styles.blogContent}>
            <p>{post.content}</p>
          </div>
        </div>

        {post.gallery_image && post.gallery_image.length > 0 && (
          <div className={styles.gallerySection}>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={4}
              autoHeight
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
            >
              {post.gallery_image.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.galleryItem}>
                    <img
                      src={getStrapiImageUrl(image?.url)}
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {post.category && relatedPosts.length > 0 && (
          <div className={styles.otherEvents}>
            <h2>Other {post.category.name}</h2>
            <div className={styles.relatedPostsSwiper}>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={3}
                autoHeight
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 30 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
              >
                {relatedPosts.map((relatedPost) => (
                  <SwiperSlide key={relatedPost.id}>
                    <div
                      className={styles.relatedPostCard}
                      onClick={() =>
                        navigate(`/blog/doc/${relatedPost.documentId}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {relatedPost.mainImage?.url && (
                        <img
                          src={getStrapiImageUrl(relatedPost.mainImage?.url)}
                          alt={relatedPost.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                          }}
                        />
                      )}
                      <div className={styles.cardContent}>
                        <h3>{relatedPost.title}</h3>
                        <p>{relatedPost.content}</p>
                        <span className="read-more">Read more »</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button
              className={styles.allEventsBtn}
              onClick={() =>
                navigate(
                  `/community/${post.category?.name
                    .toLowerCase()
                    .replace(" ", "-")}`
                )
              }
            >
              All {post.category.name}
            </button>
          </div>
        )}
      </div>
      <Contact />
    </>
  );
};

export default BlogDetail;
