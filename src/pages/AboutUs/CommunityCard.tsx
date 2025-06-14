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
  title, imageUrl, excerpt, date, onReadMore,
}) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <img src={imageUrl} alt={title} className={styles.myImage} />
    </div>
    <div className={styles.cardBody}>
      <p className={styles.excerpt}>{excerpt}</p>
      <p className={styles.date}>{date}</p>
      <button className={styles.readMore} onClick={onReadMore}>
        Read more
      </button>
    </div>
    <h3 className={styles.cardTitle}>{title}</h3>
  </div>
);

export default CommunityCard;
