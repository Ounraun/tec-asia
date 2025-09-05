import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BookingConfirm.module.css";

const REDIRECT_MS = 3000;
const ROOM_CACHE_KEY = (id: string) => `mr:${id}`;

type RoomSnapshot = {
  id: string; // documentId ของห้อง
  name: string;
  description: string;
  min: number;
  max: number;
};

export default function BookingConfirm() {
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { redirectTo?: string; room?: RoomSnapshot };
  };

  const redirectTo =
    location.state?.redirectTo ||
    new URLSearchParams(window.location.search).get("redirectTo") ||
    "/meeting-rooms";

  const handleClose = () => {
    navigate(redirectTo, { replace: true });
  };

  useEffect(() => {
    // เซฟ snapshot ห้องไว้ เพื่อให้หน้า MeetingRoomsBooking มีข้อมูลทันทีตอนกลับ
    try {
      const room = location.state?.room;
      if (room?.id) {
        sessionStorage.setItem(ROOM_CACHE_KEY(room.id), JSON.stringify(room));
      }
    } catch {
      // เงียบ ๆ ถ้า storage ใช้ไม่ได้
    }

    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, REDIRECT_MS);

    return () => clearTimeout(timer);
  }, [location.state, navigate, redirectTo]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>Meeting Room Booking Confirmed</h1>

        <div className={styles.message}>
          <p>Your booking has been successfully completed!</p>
          <p>
            The confirmation details have been sent to the email address
            provided.
          </p>
          <p className={styles.redirect}>
            Redirecting to the room timetable in 3 seconds...
          </p>
        </div>

        <button className={styles.closeBtn} onClick={handleClose}>
          Back to timetable
        </button>
      </div>
    </div>
  );
}
