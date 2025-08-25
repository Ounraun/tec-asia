import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Contact from "../../components/Contact";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import required modules
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./BlogDetail.css";
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

        const postData = data.data[0];
        setPost(postData);

        if (postData?.category?.name) {
          try {
            const relatedResponse = await fetch(
              `${apiUrl}/api/blog-posts?populate=*&filters[category][name][$eq]=${postData.category.name}&filters[documentId][$ne]=${documentId}`
            );

            if (!relatedResponse.ok) {
              console.error("Failed to fetch related posts");
              return;
            }

            const relatedData = await relatedResponse.json();
            if (relatedData?.data) {
              setRelatedPosts(relatedData.data.slice(0, 3));
            }
          } catch (relatedError) {
            console.error("Error fetching related posts:", relatedError);
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    if (documentId) {
      fetchPost();
    }
  }, [documentId, apiUrl]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading post</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!post) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div className="blog-detail-container">
        <h1 className="blog-title">{post.title}</h1>

        <div className="main-content">
          {/* Main Image */}
          <div className="main-image">
            {getStrapiImageUrl(post?.mainImage?.url) ? (
              <img
                src={getStrapiImageUrl(post?.mainImage?.url)}
                alt={post.title}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
            ) : (
              <div className="no-image">No image available</div>
            )}
          </div>

          {/* Content */}
          <div className="blog-content">
            <p>{post.content}</p>
          </div>
        </div>

        {/* Gallery Section */}
        {post.gallery_image && post.gallery_image.length > 0 && (
          <div className="gallery-section">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={4}
              autoHeight={true}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }}
            >
              {post.gallery_image.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="gallery-item">
                    <img
                      src={`${image.url}`}
                      alt={`Gallery ${index + 1}`}
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

        {/* Related Posts */}
        {post.category && relatedPosts.length > 0 && (
          <div className="other-events">
            <h2>Other {post.category.name}</h2>
            <div className="related-posts-swiper">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={3}
                autoHeight={true}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
              >
                {relatedPosts.map((relatedPost) => (
                  <SwiperSlide key={relatedPost.id}>
                    <div
                      className="related-post-card"
                      onClick={() =>
                        navigate(`/blog/doc/${relatedPost.documentId}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {relatedPost.mainImage?.url && (
                        <img
                          src={`${relatedPost.mainImage.url}`}
                          alt={relatedPost.title}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                          }}
                        />
                      )}
                      <div className="card-content">
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
              className="all-events-btn"
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
