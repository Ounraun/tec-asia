import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BookingDeleteConfirm.module.css";

const BookingDeleteConfirm: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => navigate("/meeting-rooms"), 3000);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>Booking Deleted</h1>
        <div className={styles.message}>
          <p>ลบการจองเรียบร้อยแล้ว</p>
          <p className={styles.redirectNote}>
            กำลังกลับไปหน้าห้องประชุมใน 3 วินาที…
          </p>
        </div>
        <button
          className={styles.closeButton}
          onClick={() => navigate("/meeting-rooms")}
        >
          Back to Meeting Rooms
        </button>
      </div>
    </div>
  );
};

export default BookingDeleteConfirm;
