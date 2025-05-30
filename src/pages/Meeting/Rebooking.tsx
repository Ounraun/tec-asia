import React from "react";
import { useNavigate } from "react-router-dom";
import "./Rebooking.css";

const Rebooking = () => {
  const navigate = useNavigate();

  const handleConfirmBooking = () => {
    navigate("/booking-confirm");
  };

  return (
    <div className="rebooking-container">
      <h1 className="rebooking-title">Rebooking</h1>

      {/* ฟอร์มการจองใหม่ */}
      <div className="rebooking-form">
        <div className="form-group">
          <label>epm id / email</label>
          <input type="email" placeholder="id / email" />
        </div>

        <button className="request-rebooking">Request rebooking</button>

        <div className="form-group">
          <label>Room type</label>
          <select>
            <option value="">room number</option>
          </select>
        </div>

        <div className="form-group">
          <label>meeting date</label>
          <div className="date-inputs">
            <select>
              <option>12</option>
            </select>
            <select>
              <option>01</option>
            </select>
            <select>
              <option>2025</option>
            </select>
          </div>
        </div>

        <div className="form-group time-group">
          <div>
            <label>time : start</label>
            <div className="time-inputs">
              <select>
                <option>11</option>
              </select>
              <select>
                <option>00am</option>
              </select>
            </div>
          </div>
          <div>
            <label>time : finish</label>
            <div className="time-inputs">
              <select>
                <option>12</option>
              </select>
              <select>
                <option>00am</option>
              </select>
            </div>
          </div>
        </div>

        <div className="additional-emails">
          <div className="form-group">
            <label>epm id / email</label>
            <input type="email" placeholder="id / email" />
          </div>
          <div className="form-group">
            <label>epm id / email</label>
            <input type="email" placeholder="id / email" />
          </div>
          <div className="form-group">
            <label>epm id / email</label>
            <input type="email" placeholder="id / email" />
          </div>
        </div>

        <button className="add-more">
          <span className="plus-icon">+</span> add more
        </button>

        <button className="confirm-booking" onClick={handleConfirmBooking}>
          Confirm booking
        </button>
      </div>
    </div>
  );
};

export default Rebooking;
