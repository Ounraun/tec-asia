import React from "react";
import { formatTextWithAllLineBreaks } from "@/utils/textFormatter";
import styles from "./Card.module.css";
import type { NetworkContent } from "../../types/networkSecurity";

interface Props {
  item: NetworkContent;
  isGrouped?: boolean;
}

const ContentCard: React.FC<Props> = ({ item, isGrouped = false }) => (
  <div
    className={isGrouped ? `${styles.card} ${styles.groupedCard}` : styles.card}
  >
    <h2 className={styles.cardTitle}>
      {formatTextWithAllLineBreaks(item.title)}
    </h2>
    {item.subTitle && (
      <h3 className={styles.cardSubtitle}>
        {formatTextWithAllLineBreaks(item.subTitle)}
      </h3>
    )}
    <div className={styles.cardContent}>
      <p>{formatTextWithAllLineBreaks(item.content)}</p>
    </div>
  </div>
);

export default ContentCard;
