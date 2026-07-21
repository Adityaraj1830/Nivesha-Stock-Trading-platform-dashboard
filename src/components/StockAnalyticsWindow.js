import React, { useContext } from "react";

import GeneralContext from "./GeneralContext";
import StockPriceChart from "./StockPriceChart";

const StockAnalyticsWindow = ({ stock }) => {
  const generalContext = useContext(GeneralContext);

  const price = Number(stock.price || 0);
  const isDown = stock.isDown;

  const handleClose = () => {
    generalContext.closeAnalyticsWindow();
  };

  return (
    <>
      <div className="analytics-overlay" onClick={handleClose}></div>

      <div className="stock-analytics-window">
        <div className="analytics-header">
          <div className="analytics-title-area">
            <div className="analytics-symbol-row">
              <h3>{stock.uid}</h3>
              <span className="market-badge">NSE</span>
            </div>

            <p>Market overview and performance</p>
          </div>

          <button
            className="analytics-close-btn"
            onClick={handleClose}
            aria-label="Close analytics"
          >
            ×
          </button>
        </div>

        <div className="analytics-price-section">
          <div>
            <span className="analytics-label">Last Traded Price</span>

            <h2>
              <span className="currency-symbol">₹</span>
              {price.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>

          <div
            className={`analytics-change-badge ${
              isDown ? "negative" : "positive"
            }`}
          >
            <span>{isDown ? "↓" : "↑"}</span>
            {stock.percent}
          </div>
        </div>

        <div className="analytics-divider"></div>

        <StockPriceChart price={price} isDown={isDown} />

        <div className="analytics-divider"></div>

        <div className="analytics-details">
          <div className="analytics-card">
            <span>Instrument</span>
            <strong>{stock.uid}</strong>
          </div>

          <div className="analytics-card">
            <span>Exchange</span>
            <strong>NSE</strong>
          </div>

          <div className="analytics-card">
            <span>Day Change</span>
            <strong className={isDown ? "loss" : "profit"}>
              {stock.percent}
            </strong>
          </div>

          <div className="analytics-card">
            <span>Price Direction</span>
            <strong className={isDown ? "loss" : "profit"}>
              {isDown ? "Down ↓" : "Up ↑"}
            </strong>
          </div>
        </div>

        <div className="analytics-market-status">
          <div className="market-status-dot"></div>

          <div>
            <strong>Market data</strong>
            <span>Latest simulated market price</span>
          </div>
        </div>

        <div className="analytics-footer">
          <button className="analytics-done-btn" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </>
  );
};

export default StockAnalyticsWindow;
