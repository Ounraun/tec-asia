import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BookingEditConfirm.module.css";

const REDIRECT_MS = 3000;

const BookingEditConfirm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo ||
    new URLSearchParams(location.search).get("redirectTo") ||
    "/meeting-rooms";

  const handleClose = () => navigate(redirectTo);

  useEffect(() => {
    const timer = setTimeout(() => navigate(redirectTo), REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [navigate, redirectTo]);

  return (
    <div className={styles.bookingConfirmContainer}>
      <div className={styles.bookingConfirmBox}>
        <h1 className={styles.confirmTitle}>Booking Updated</h1>

        <div className={styles.confirmMessage}>
          <p>Your booking changes have been saved successfully.</p>
          <p>The updated details have been sent to the provided email.</p>
          <p className={styles.redirectMessage}>
            Redirecting to the room timetable in 3 seconds...
          </p>
        </div>

        <button className={styles.closeButton} onClick={handleClose}>
          Back to timetable
        </button>
      </div>
    </div>
  );
};

export default BookingEditConfirm;
