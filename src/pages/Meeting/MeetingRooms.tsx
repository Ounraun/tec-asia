import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./MeetingRooms.module.css";
import { getStrapiImageUrl } from "../../services/strapi";
import { useTranslation } from "react-i18next";

interface MeetingRoom {
  max: number;
  min: number;
  description: string;
  name: string;
  picture: { url: string };
  documentId: string;
  id: number;
  attributes: {
    title: string;
    subtitle: string;
    capacity: string;
    buttonText: string;
    image: { data: { attributes: { url: string } } };
  };
}

const MeetingRooms: React.FC = () => {
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation(["common", "meetingRoom"]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/meeting-rooms?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        setMeetingRooms(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setLoading(false);
      });
  }, [apiUrl, i18n.language]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>
        {t("meetingRoom:meetingRoomServices")}
      </h1>

      <div className={styles.roomsGrid}>
        {meetingRooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomImage}>
              <img
                src={getStrapiImageUrl(room.picture.url)}
                alt={room.name}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className={styles.roomInfo}>
              <h2 className={styles.roomTitle}>{room.name}</h2>
              <p className={styles.roomSubtitle}>{room.description}</p>
              <p className={styles.roomCapacity}>
                สำหรับ {room.min} - {room.max} ท่าน
              </p>

              <Link
                to={`/meeting-rooms-booking/${
                  room.documentId
                }?name=${encodeURIComponent(
                  room.name || ""
                )}&description=${encodeURIComponent(
                  room.description || ""
                )}&min=${room.max?.toString() || "0"}&max=${
                  room.max?.toString() || "0"
                }`}
                className={styles.bookingButton}
              >
                จองห้องประชุม
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles["Ellipse_12_8_725"]} />
      <div className={styles["Ellipse_11_8_727"]} />
    </div>
  );
};

export default MeetingRooms;
