import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import StockAnalyticsWindow from "./StockAnalyticsWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
  openSellWindow: () => {},
  closeSellWindow: () => {},
  openAnalyticsWindow: () => {},
  closeAnalyticsWindow: () => {},

  refreshKey: 0,
  refreshTradingData: () => {},
});

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [isAnalyticsWindowOpen, setIsAnalyticsWindowOpen] = useState(false);

  const [selectedStock, setSelectedStock] = useState({
    uid: "",
    price: 0,
    percent: "0.00%",
    isDown: false,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenBuyWindow = (uid, price) => {
    setSelectedStock({
      uid,
      price: Number(price),
      percent: "0.00%",
      isDown: false,
    });

    setIsSellWindowOpen(false);
    setIsAnalyticsWindowOpen(false);
    setIsBuyWindowOpen(true);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
  };

  const handleOpenSellWindow = (uid, price) => {
    setSelectedStock({
      uid,
      price: Number(price),
      percent: "0.00%",
      isDown: false,
    });

    setIsBuyWindowOpen(false);
    setIsAnalyticsWindowOpen(false);
    setIsSellWindowOpen(true);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
  };

  const handleOpenAnalyticsWindow = (uid, price, percent, isDown) => {
    setSelectedStock({
      uid,
      price: Number(price),
      percent,
      isDown,
    });

    setIsBuyWindowOpen(false);
    setIsSellWindowOpen(false);
    setIsAnalyticsWindowOpen(true);
  };

  const handleCloseAnalyticsWindow = () => {
    setIsAnalyticsWindowOpen(false);
  };

  const refreshTradingData = () => {
    setRefreshKey((previousKey) => previousKey + 1);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,

        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,

        openAnalyticsWindow: handleOpenAnalyticsWindow,
        closeAnalyticsWindow: handleCloseAnalyticsWindow,

        refreshKey,
        refreshTradingData,
      }}
    >
      {children}

      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStock.uid}
          marketPrice={selectedStock.price}
        />
      )}

      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedStock.uid}
          marketPrice={selectedStock.price}
        />
      )}

      {isAnalyticsWindowOpen && <StockAnalyticsWindow stock={selectedStock} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
