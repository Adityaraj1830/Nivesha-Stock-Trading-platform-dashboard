import React, { useContext, useState } from "react";

import api from "../api/axiosInstance";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, marketPrice }) => {
  const [stockQuantity, setStockQuantity] = useState(1);

  const [productType, setProductType] = useState("CNC");

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const generalContext = useContext(GeneralContext);

  const handleSellClick = async () => {
    const quantity = Number(stockQuantity);

    const price = Number(marketPrice);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");

      return;
    }

    try {
      setIsPlacingOrder(true);

      await api.post("/newOrder", {
        name: uid,
        qty: quantity,
        price,
        mode: "SELL",
        product: productType,
      });

      generalContext.refreshTradingData();

      generalContext.closeSellWindow();
    } catch (error) {
      console.error("SELL ERROR:", error);

      alert(error.response?.data?.message || "Failed to place sell order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  return (
    <div className="container" id="sell-window">
      <div className="regular-order">
        <h3>Sell {uid}</h3>

        <div className="product-selector">
          <button
            type="button"
            className={`product-option ${
              productType === "CNC" ? "active" : ""
            }`}
            onClick={() => setProductType("CNC")}
          >
            <span>CNC</span>
            <small>Delivery</small>
          </button>

          <button
            type="button"
            className={`product-option ${
              productType === "MIS" ? "active" : ""
            }`}
            onClick={() => setProductType("MIS")}
          >
            <span>MIS</span>
            <small>Intraday</small>
          </button>
        </div>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>

            <input
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Market Price</legend>

            <input type="number" value={marketPrice} readOnly />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>
          {productType} · Order value ₹
          {(Number(stockQuantity) * Number(marketPrice) || 0).toFixed(2)}
        </span>

        <div>
          <button
            className="btn btn-red"
            onClick={handleSellClick}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? "Placing..." : "Sell"}
          </button>

          <button
            className="btn btn-grey"
            onClick={handleCancelClick}
            disabled={isPlacingOrder}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
