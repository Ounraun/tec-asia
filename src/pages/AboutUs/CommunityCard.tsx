// src/components/CommunityCard/CommunityCard.tsx
import React from "react";
import styles from "./CommunityCard.module.css";

export interface CommunityCardProps {
  title: string;
  imageUrl: string;
  excerpt: string;
  date: string;
  onReadMore: () => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  title,
  imageUrl,
  excerpt,
  date,
  onReadMore,
}) => (
  <div className={styles["card"]}>
    <div className={styles["cardHeader"]}>
      <img
        src={imageUrl}
        alt={title || "Community image"}
        loading="lazy"
        decoding="async"
      />
    </div>

    <div className={styles["cardBody"]}>
      <p className={styles["excerpt"]}>{excerpt}</p>
      <p className={styles["date"]}>{date}</p>
      <button
        type="button"
        className={styles["readMore"]}
        onClick={() => {
          try {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            const docEl = document.documentElement;
            const body = document.body;
            if (docEl) docEl.scrollTop = 0;
            if (body) body.scrollTop = 0;
          } catch {
            /* ignore */
          }
          onReadMore();
        }}
        aria-label={`Read more about ${title}`}
      >
        Read more
      </button>
    </div>
  </div>
);

export default CommunityCard;
