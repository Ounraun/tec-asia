import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BookingDeleteConfirm.module.css";

const BookingDeleteConfirm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo ||
    new URLSearchParams(location.search).get("redirectTo") ||
    "/meeting-rooms";

  useEffect(() => {
    const id = setTimeout(() => navigate(redirectTo), 3000);
    return () => clearTimeout(id);
  }, [navigate, redirectTo]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>Booking Deleted</h1>
        <div className={styles.message}>
          <p>ลบการจองเรียบร้อยแล้ว</p>
          <p className={styles.redirectNote}>
            กำลังกลับไปตารางห้องประชุมใน 3 วินาที…
          </p>
        </div>
        <button
          className={styles.closeButton}
          onClick={() => navigate(redirectTo)}
        >
          Back to timetable
        </button>
      </div>
    </div>
  );
};

export default BookingDeleteConfirm;
