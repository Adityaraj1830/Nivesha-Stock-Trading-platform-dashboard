import React, { useContext, useState } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, marketPrice }) => {
  const [stockQuantity, setStockQuantity] = useState(1);

  const generalContext = useContext(GeneralContext);

  const handleBuyClick = async () => {
    try {
      await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(marketPrice),
        mode: "BUY",
      });

      generalContext.refreshTradingData();
      generalContext.closeBuyWindow();
    } catch (error) {
      console.error("BUY ERROR:", error);

      alert(error.response?.data?.message || "Failed to place buy order");
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window">
      <div className="regular-order">
        <h3>Buy {uid}</h3>

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
          Order value ₹
          {(Number(stockQuantity) * Number(marketPrice) || 0).toFixed(2)}
        </span>

        <div>
          <button className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>

          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
