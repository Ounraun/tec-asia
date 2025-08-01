import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MeetingRooms.css";
import { getStrapiImageUrl } from "../../services/strapi";
import { useTranslation } from "react-i18next";

// กำหนด Interface สำหรับห้องประชุม
interface MeetingRoom {
  max: number;
  min: number;
  description: string;
  name: string;
  picture: {
    url: string;
  };
  documentId: string;
  id: number;
  attributes: {
    title: string;
    subtitle: string;
    capacity: string;
    buttonText: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
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
      .then((response) => response.json())
      .then((data) => {
        console.log("Meeting Rooms:", data.data);
        setMeetingRooms(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Meeting Rooms:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setLoading(false);
      });
  }, [apiUrl, i18n.language]);

  if (loading) {
    return (
      <div className="meeting-rooms-container">
        <div className="loading">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meeting-rooms-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="meeting-rooms-container">
      <h1 className="page-title">{t("meetingRoom:meetingRoomServices")}</h1>
      <div className="rooms-grid">
        {meetingRooms.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-image">
              <img src={getStrapiImageUrl(room.picture.url)} alt={room.name} />
            </div>
            <div className="room-info">
              <h2>{room.name}</h2>
              <p className="subtitle">{room.description}</p>
              <p className="capacity">
                สำหรับ {room.min} - {room.max} ท่าน
              </p>
              <Link
                to={`/meeting-rooms-booking/${
                  room.documentId
                }?name=${encodeURIComponent(
                  room.name || ""
                )}&description=${encodeURIComponent(
                  room.description || ""
                )}&min=${room.min?.toString() || "0"}&max=${
                  room.max?.toString() || "0"
                }`}
                className="booking-button"
              >
                จองห้องประชุม
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="Ellipse_12_8_725"></div>
      <div className="Ellipse_11_8_727"></div>
    </div>
  );
};

export default MeetingRooms;
