import React, { useEffect, useState } from "react";
import styles from "./CommunityCard.module.css"; // Ensure CSS module is typed
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import communityFloor from "../../assets/AboutUs/Community-floor.svg";

const apiUrl = import.meta.env.VITE_API_URL;

interface CommunityCardProps {
  // Define the expected props here
  title?: string; // Example property
}

const CommunityCard: React.FC<CommunityCardProps> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "communityCard"]);
  const handleRadioChange = () => {
    // Toggle class "blue" ใน body เมื่อมีการเปลี่ยนแปลง
    document.body.classList.toggle("blue");
  };

  interface Post {
    main_image?: { url: string };
    documentId?: string;
    [key: string]: string | number | boolean | object | undefined; // Add other properties as needed
  }

  const [latestPosts, setLatestPosts] = useState<{
    companyEvents: Post | null;
    knowledge: Post | null;
    society: Post | null;
  }>({
    companyEvents: null,
    knowledge: null,
    society: null,
  });
  type CategoryType = "Company events" | "Knowledge" | "Society";

  // ฟังก์ชันสำหรับดึงข้อมูลของแต่ละ Category
  const fetchLatestPost = async (category: CategoryType, key: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/blog-posts?filters[category][name][$eq]=${encodeURIComponent(
          category
        )}&sort=updatedAt:desc&pagination[pageSize]=1&populate=*`
      );
      const data = await response.json();
      // เพิ่ม Code ส่วนนี้:
      if (data.data && data.data.length > 0) {
        setLatestPosts((prev) => ({ ...prev, [key]: data.data[0] }));
      } else {
        setLatestPosts((prev) => ({ ...prev, [key]: null })); // หรือค่าเริ่มต้นอื่น
      }
    } catch (error) {
      console.error(`Error fetching ${category}:`, error);
    }
  };

  useEffect(() => {
    fetchLatestPost("Company events", "companyEvents");
    fetchLatestPost("Knowledge", "knowledge");
    fetchLatestPost("Society", "society");
  }, []);

  const companyEventsImageUrl = latestPosts.companyEvents?.main_image?.url;
  const companyEventsContent = latestPosts.companyEvents?.content;
  const companyEventsDate = latestPosts.companyEvents?.createdAt
    ? new Date(
        latestPosts.companyEvents.createdAt as string
      ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date not available";

  const societyImageUrl = latestPosts.society?.main_image?.url;
  const societyContent = latestPosts.society?.content;
  const societyDate = latestPosts.society?.createdAt
    ? new Date(latestPosts.society.createdAt as string).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Date not available";

  const knowledgeImageUrl = latestPosts.knowledge?.main_image?.url;
  const knowledgeContent = latestPosts.knowledge?.content;
  const knowledgeDate = latestPosts.knowledge?.createdAt
    ? new Date(latestPosts.knowledge.createdAt as string).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Date not available";

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handlePostClick = (documentId: string) => {
    navigate(`/blog/doc/${documentId}`);
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        zIndex: 99,
        position: "relative",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className={styles.container}>
        <input
          type="radio"
          name="slider"
          id="item-1"
          defaultChecked
          onChange={handleRadioChange}
        />
        <input
          type="radio"
          name="slider"
          id="item-2"
          onChange={handleRadioChange}
        />
        <input
          type="radio"
          name="slider"
          id="item-3"
          onChange={handleRadioChange}
        />

        <div className="cards">
          {latestPosts.companyEvents ? (
            <label
              className={styles.cardLayout}
              htmlFor="item-1"
              id="communityEvents"
            >
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <img
                    className={styles.myImage}
                    src={`${companyEventsImageUrl}`}
                    alt="companyEvents"
                  />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.description}>
                    {truncateText(String(companyEventsContent))}
                  </p>
                  <p className={styles.date}>{companyEventsDate}</p>
                  <a
                    href="#"
                    className={styles.readMore}
                    onClick={(e) => {
                      e.preventDefault();
                      if (latestPosts.companyEvents?.documentId) {
                        handlePostClick(latestPosts.companyEvents.documentId);
                      }
                    }}
                  >
                    {t("communityCard:readMore")}
                  </a>
                </div>
              </div>
              <div className={styles.cardTitle}>
                {t("communityCard:companyEvents")}
              </div>
            </label>
          ) : (
            <p>Loading...</p>
          )}

          <label className={styles.cardLayout} htmlFor="item-2" id="knowledge">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  className={styles.myImage}
                  src={`${knowledgeImageUrl}`}
                  alt="knowledge"
                />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.description}>
                  {truncateText(String(knowledgeContent))}
                </p>
                <p className={styles.date}>{knowledgeDate}</p>
                <a
                  href="#"
                  className={styles.readMore}
                  onClick={(e) => {
                    e.preventDefault();
                    if (latestPosts.knowledge?.documentId) {
                      handlePostClick(latestPosts.knowledge.documentId);
                    }
                  }}
                >
                  {t("communityCard:readMore")}
                </a>
              </div>
            </div>
            <div className={styles.cardTitle}>
              {t("communityCard:knowledge")}
            </div>
          </label>
          <label className={styles.cardLayout} htmlFor="item-3" id="society">
            <div className={styles.card}>
              {/* ส่วนรูปภาพด้านบน + ชื่อ GrandWorld */}
              <div className={styles.cardHeader}>
                {/* <div className={styles.cardTitle}>GRANDWORLD</div> */}
                <img
                  className={styles.myImage}
                  src={`${societyImageUrl}`}
                  alt="society"
                />
              </div>

              {/* ส่วนเนื้อหา (คำอธิบาย, วันที่, ลิงก์) */}
              <div className={styles.cardBody}>
                <p className={styles.description}>
                  {truncateText(String(societyContent))}
                </p>
                <p className={styles.date}>{societyDate}</p>
                <a
                  href="#"
                  className={styles.readMore}
                  onClick={(e) => {
                    e.preventDefault();
                    if (latestPosts.society?.documentId) {
                      handlePostClick(latestPosts.society.documentId);
                    }
                  }}
                >
                  {t("communityCard:readMore")}
                </a>
              </div>
            </div>
            <div className={styles.cardTitle}>{t("communityCard:society")}</div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
