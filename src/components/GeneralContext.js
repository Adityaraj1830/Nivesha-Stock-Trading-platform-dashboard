import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
  openSellWindow: () => {},
  closeSellWindow: () => {},

  refreshKey: 0,
  refreshTradingData: () => {},
});

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);

  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);

  // Selected stock information
  const [selectedStock, setSelectedStock] = useState({
    uid: "",
    price: 0,
  });

  // Used to refresh trading-related data
  const [refreshKey, setRefreshKey] = useState(0);

  // ================= BUY WINDOW =================

  const handleOpenBuyWindow = (uid, price) => {
    setSelectedStock({
      uid,
      price: Number(price),
    });

    setIsSellWindowOpen(false);
    setIsBuyWindowOpen(true);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);

    setSelectedStock({
      uid: "",
      price: 0,
    });
  };

  // ================= SELL WINDOW =================

  const handleOpenSellWindow = (uid, price) => {
    setSelectedStock({
      uid,
      price: Number(price),
    });

    setIsBuyWindowOpen(false);
    setIsSellWindowOpen(true);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);

    setSelectedStock({
      uid: "",
      price: 0,
    });
  };

  // ================= DATA REFRESH =================

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
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
