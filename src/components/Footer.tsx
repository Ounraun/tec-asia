import React from "react";

// File: /c:/Users/ASUS/OneDrive/Desktop/Excellent/frontend/src/components/Footer.tsx

const Footer: React.FC = () => {
  return (
    <footer
      style={{ textAlign: "center", padding: "1rem", background: "#f1f1f1" }}
    >
      <p>&copy; {new Date().getFullYear()} Excellent. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
