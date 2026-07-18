import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, marketPrice }) => {
  const [stockQuantity, setStockQuantity] = useState(1);

  // Automatically use the current watchlist market price
  const [stockPrice, setStockPrice] = useState(Number(marketPrice) || 0);

  const generalContext = useContext(GeneralContext);

  // ================= SELL ORDER =================

  const handleSellClick = async () => {
    const quantity = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid price");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: quantity,
        price,
        mode: "SELL",
      });

      toast.success(response.data?.message || `${uid} sold successfully`);

      // Refresh Orders and Holdings
      generalContext.refreshTradingData();

      // Close Sell window
      generalContext.closeSellWindow();
    } catch (error) {
      console.error("SELL ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to place sell order",
      );
    }
  };

  // ================= CANCEL =================

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  const orderValue = Number(stockQuantity) * Number(stockPrice);

  return (
    <div className="container" id="sell-window">
      <div className="regular-order">
        <h3>Sell {uid}</h3>

        <p>Market price: ₹{Number(marketPrice || 0).toFixed(2)}</p>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>

            <input
              type="number"
              min="1"
              step="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>

            <input
              type="number"
              min="0.01"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Order value ₹{(orderValue || 0).toFixed(2)}</span>

        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={handleSellClick}
          >
            Sell
          </button>

          <button
            type="button"
            className="btn btn-grey"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
