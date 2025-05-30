import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingConfirm.css";

const BookingConfirm = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/meeting-rooms");
  };

  // Auto redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/meeting-rooms");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="booking-confirm-container">
      <div className="booking-confirm-box">
        <h1 className="confirm-title">Meeting Room Booking Confirmed</h1>

        <div className="confirm-message">
          <p>Your booking has been successfully completed!</p>
          <p>
            The confirmation details have been sent to the email address
            provided.
          </p>
          <p className="redirect-message">
            Redirecting to meeting rooms in 3 seconds...
          </p>
        </div>

        <button className="close-button" onClick={handleClose}>
          Back to Meeting Rooms
        </button>
      </div>
    </div>
  );
};

export default BookingConfirm;
