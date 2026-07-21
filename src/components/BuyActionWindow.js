import React, { useContext, useState } from "react";

import api from "../api/axiosInstance";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, marketPrice }) => {
  const [stockQuantity, setStockQuantity] = useState(1);

  const [productType, setProductType] = useState("CNC");

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const generalContext = useContext(GeneralContext);

  const handleBuyClick = async () => {
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
        mode: "BUY",
        product: productType,
      });

      generalContext.refreshTradingData();

      generalContext.closeBuyWindow();
    } catch (error) {
      console.error("BUY ERROR:", error);

      alert(error.response?.data?.message || "Failed to place buy order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window">
      <div className="regular-order">
        <h3>Buy {uid}</h3>

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
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? "Placing..." : "Buy"}
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

export default BuyActionWindow;
