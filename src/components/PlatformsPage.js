import React from "react";
import { useNavigate } from "react-router-dom";
import "./PlatformsPage.css";

const PlatformsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="platforms-container">

      <h2 className="platforms-title">Our Platforms</h2>
      <p className="platforms-subtitle">
        Explore powerful tools to manage your investments
      </p>

      <div className="platforms-grid">

        {/* Trading Platform */}
        <div className="platform-card">
          <h3>Trading Platform</h3>
          <p>Execute trades and view market overview</p>
          <button onClick={() => navigate("/")}>
            Open
          </button>
        </div>

        {/* Analytics */}
        <div className="platform-card">
          <h3>Analytics</h3>
          <p>Track performance, P&L and insights</p>
          <button onClick={() => navigate("/")}>
            Open
          </button>
        </div>

        {/* Portfolio */}
        <div className="platform-card">
          <h3>Portfolio</h3>
          <p>View your holdings and investments</p>
          <button onClick={() => navigate("/holdings")}>
            Open
          </button>
        </div>

        {/* Funds */}
        <div className="platform-card">
          <h3>Funds Manager</h3>
          <p>Add or withdraw funds securely</p>
          <button onClick={() => navigate("/funds")}>
            Open
          </button>
        </div>

      </div>
    </div>
  );
};

export default PlatformsPage;