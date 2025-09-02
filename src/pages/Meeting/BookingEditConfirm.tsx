import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BookingEditConfirm.module.css";

const BookingEditConfirm: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/meeting-rooms");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/meeting-rooms");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.bookingConfirmContainer}>
      <div className={styles.bookingConfirmBox}>
        <h1 className={styles.confirmTitle}>Booking Updated</h1>

        <div className={styles.confirmMessage}>
          <p>Your booking changes have been saved successfully.</p>
          <p>The updated details have been sent to the provided email.</p>
          <p className={styles.redirectMessage}>
            Redirecting to meeting rooms in 3 seconds...
          </p>
        </div>

        <button className={styles.closeButton} onClick={handleClose}>
          Back to Meeting Rooms
        </button>
      </div>
    </div>
  );
};

export default BookingEditConfirm;
