import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BookingConfirm.module.css";

const REDIRECT_MS = 3000;

const BookingConfirm = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/meeting-rooms");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/meeting-rooms");
    }, REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

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
            Redirecting to meeting rooms in 3 seconds...
          </p>
        </div>

        <button className={styles.closeBtn} onClick={handleClose}>
          Back to Meeting Rooms
        </button>
      </div>
    </div>
  );
};

export default BookingConfirm;
