import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="topbar-container">

      {/* MARKET INDICES */}
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2}</p>
        </div>

        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
        </div>
      </div>

      {/* 🔥 PASS DARK MODE TO MENU */}
      <Menu darkMode={darkMode} setDarkMode={setDarkMode} />

    </div>
  );
};

export default TopBar;