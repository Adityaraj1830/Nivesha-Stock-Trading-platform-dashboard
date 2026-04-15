import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./PlatformsPage.css";

import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const PlatformsPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="platforms-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="platforms-title">Our Platforms</h2>
      <p className="platforms-subtitle">
        Explore powerful tools to manage your investments
      </p>

      <div className="platforms-grid">

        {/* Analytics */}
        <motion.div 
          className="platform-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
        >
          <BarChartIcon className="platform-icon" />
          <h3>Analytics</h3>
          <p>Track performance, P&L and insights</p>
        </motion.div>

        {/* Portfolio */}
        <motion.div 
          className="platform-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/holdings")}
        >
          <AccountBalanceWalletIcon className="platform-icon" />
          <h3>Portfolio</h3>
          <p>View your holdings and investments</p>
        </motion.div>

        {/* Funds */}
        <motion.div 
          className="platform-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/funds")}
        >
          <MonetizationOnIcon className="platform-icon" />
          <h3>Funds Manager</h3>
          <p>Add or withdraw funds securely</p>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default PlatformsPage;