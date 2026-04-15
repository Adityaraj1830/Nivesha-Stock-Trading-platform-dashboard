import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      
      {/* ✅ LOGO */}
      <img src="/Nivesha Kite.png" alt="logo" style={{ width: "100px" }} />

      <div className="menus">
        <ul>

          {/* DASHBOARD */}
          <li>
            <Link style={{ textDecoration: "none" }} to="/">
              <p className={location.pathname === "/" ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>

          {/* ORDERS */}
          <li>
            <Link style={{ textDecoration: "none" }} to="/orders">
              <p className={location.pathname.includes("orders") ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>

          {/* HOLDINGS */}
          <li>
            <Link style={{ textDecoration: "none" }} to="/holdings">
              <p className={location.pathname.includes("holdings") ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>

          {/* POSITIONS */}
          <li>
            <Link style={{ textDecoration: "none" }} to="/positions">
              <p className={location.pathname.includes("positions") ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>

          {/* FUNDS */}
          <li>
            <Link style={{ textDecoration: "none" }} to="/funds">
              <p className={location.pathname.includes("funds") ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>

          {/* PLATFORMS */}
          <li>
            <Link style={{ textDecoration: "none" }} to="/platforms">
              <p className={location.pathname.includes("platforms") ? activeMenuClass : menuClass}>
                Platforms
              </p>
            </Link>
          </li>

        </ul>

        <hr />

        {/* 🔥 PROFILE + DARK MODE */}
        <div className="profile-section">

          {/* DARK MODE TOGGLE */}
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* PROFILE */}
          <div className="profile" onClick={handleProfileClick}>
            <div className="avatar">ZU</div>
            <p className="username">USERID</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Menu;