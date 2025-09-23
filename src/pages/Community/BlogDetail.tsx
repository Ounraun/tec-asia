// src/pages/Community/BlogDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Contact from "../../components/Contact";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./BlogDetail.module.css";
import { getStrapiImageUrl, callStrapi } from "../../services/strapi";
import { formatTextWithLineBreaks } from "../../utils/textFormatter";

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
  const { i18n } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Always start at top when opening this page
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      const docEl = document.documentElement;
      const body = document.body;
      if (docEl) docEl.scrollTop = 0;
      if (body) body.scrollTop = 0;
      const mainEl = document.querySelector("main");
      if (mainEl && (mainEl as HTMLElement).scrollTop !== undefined) {
        (mainEl as HTMLElement).scrollTop = 0;
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!documentId) return;
      
      try {
        console.log("=== BlogDetail Debug ===");
        console.log("Current i18n.language:", i18n.language);
        console.log("DocumentId:", documentId);

        setError(null);

        // ใช้ callStrapi แทน fetch API โดยตรง
        const response = await callStrapi<{ data: BlogPost[] }>(
          "/api/blog-posts",
          {
            populate: "*",
            "filters[documentId][$eq]": documentId,
          }
        );

        console.log("Blog post response:", response);

        if (
          !response?.data ||
          !Array.isArray(response.data) ||
          response.data.length === 0
        ) {
          console.log("No post found in current language, keeping existing post");
          // ถ้าไม่เจอข้อมูลในภาษาใหม่ ไม่ต้องเปลี่ยนแปลง post state
          // แค่ return เพื่อไม่ให้แสดงหน้า error
          return;
        }

        const postData = response.data[0];
        console.log("Post data:", postData);
        setPost(postData);

        // ดึง related posts โดยใช้ชื่อ category ที่ถูกต้องตาม locale
        if (postData?.category?.name) {
          try {
            console.log(
              "Fetching related posts for category:",
              postData.category.name
            );

            const relatedResponse = await callStrapi<{ data: BlogPost[] }>(
              "/api/blog-posts",
              {
                populate: "*",
                "filters[category][name][$eq]": postData.category.name,
                "filters[documentId][$ne]": documentId,
              }
            );

            console.log("Related posts response:", relatedResponse);

            if (relatedResponse?.data && relatedResponse.data.length > 0) {
              setRelatedPosts(relatedResponse.data.slice(0, 3));
            } else {
              console.log("No related posts found in current language, keeping existing related posts");
              // ไม่ล้าง relatedPosts ถ้าไม่เจอข้อมูลใหม่
            }
          } catch (err) {
            console.error("Error fetching related posts:", err);
            // ไม่ล้าง relatedPosts ถ้า API error
          }
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchPost();
  }, [documentId, i18n.language]);

  // After content is ready, nudge scroll to top again (Edge reliability)
  useEffect(() => {
    if (!post) return;
    const doScroll = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        const docEl = document.documentElement;
        const body = document.body;
        if (docEl) docEl.scrollTop = 0;
        if (body) body.scrollTop = 0;
        const mainEl = document.querySelector("main");
        if (mainEl && (mainEl as HTMLElement).scrollTop !== undefined) {
          (mainEl as HTMLElement).scrollTop = 0;
        }
      } catch {
        /* ignore */
      }
    };
    const raf = requestAnimationFrame(doScroll);
    const t1 = setTimeout(doScroll, 80);
    const t2 = setTimeout(doScroll, 240);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [post]);

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
            <div>{formatTextWithLineBreaks(post.content)}</div>
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
                        <div>
                          {formatTextWithLineBreaks(relatedPost.content)}
                        </div>
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
