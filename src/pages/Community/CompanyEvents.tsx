import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Contact from "../../components/Contact";
import ParticlesComponent from "../../components/Particles/Particles";
import "./Community.css";

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
  main_image: {
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
        console.log("Fetching all blog posts...");
        const url = `${apiUrl}/api/blog-posts?filters[category][name][$eq]=Company%20events&populate=*`;
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

          // ตรวจสอบโพสต์ที่เป็น company events
          const companyEvents = data.data.filter(
            (item: any) =>
              item.category?.name?.toLowerCase() === "company events"
          );

          console.log("\nCompany Events posts:", companyEvents);
          setPosts(companyEvents);
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
          className="community-container"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="community-header">
            <h1>COMPANY EVENTS</h1>
          </div>

          <div className="events-grid">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : posts.length === 0 ? (
              <div className="no-posts">No company events found</div>
            ) : (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`event-card ${index % 2 === 0 ? "left" : "right"}`}
                  onClick={() => handlePostClick(post.documentId)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="event-content">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                  </div>
                  {post.main_image && (
                    <div className="event-image-container">
                      <img
                        src={`${post.main_image.url}`}
                        alt={post.main_image.alternativeText || post.title}
                        className="event-image"
                        onError={(e) => {
                          console.error("Image failed to load:", e);
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="w100 text-center">
            <button
              className="more-btn"
              onClick={() =>
                window.open("https://www.facebook.com/TecAsiaSupport", "_blank")
              }
            >
              <span>More from our page</span>
            </button>
          </div>
        </div>
        <Contact />
      </div>
    </div>
  );
};

export default CompanyEvents;
