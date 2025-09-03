import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BookingConfirm.module.css";

const REDIRECT_MS = 3000;

const BookingConfirm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo ||
    new URLSearchParams(location.search).get("redirectTo") ||
    "/meeting-rooms";

  const handleClose = () => {
    navigate(redirectTo);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo);
    }, REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [navigate, redirectTo]);

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
};

export default BookingConfirm;
