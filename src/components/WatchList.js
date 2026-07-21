import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

import { DoughnutChart } from "./DoughnoutChart";

const watchlistSymbols = [
  "INFY",
  "ONGC",
  "TCS",
  "KPITTECH",
  "QUICKHEAL",
  "WIPRO",
  "M&M",
  "RELIANCE",
  "HUL",
];

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMarketData = async () => {
    try {
      const response = await axios.get("http://localhost:3002/market-data");

      const filteredWatchlist = response.data.filter((stock) =>
        watchlistSymbols.includes(stock.name),
      );

      setWatchlist(filteredWatchlist);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const searchedStocks = watchlist.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const labels = watchlist.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg: INFY, TCS, WIPRO..."
          className="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <span className="counts">
          {searchedStocks.length} / {watchlist.length}
        </span>
      </div>

      <ul className="list">
        {searchedStocks.length > 0 ? (
          searchedStocks.map((stock) => (
            <WatchListItem stock={stock} key={stock.name} />
          ))
        ) : (
          <li className="no-results">No stocks found</li>
        )}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>

        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>

          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}

          <span className="price">₹{Number(stock.price).toFixed(2)}</span>
        </div>
      </div>

      {showWatchlistActions && <WatchListActions stock={stock} />}
    </li>
  );
};

const WatchListActions = ({ stock }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(stock.name, stock.price);
  };

  const handleSellClick = () => {
    generalContext.openSellWindow(stock.name, stock.price);
  };

  const handleAnalyticsClick = () => {
    generalContext.openAnalyticsWindow(
      stock.name,
      stock.price,
      stock.percent,
      stock.isDown,
    );
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="buy" onClick={handleBuyClick}>
            Buy
          </button>
        </Tooltip>

        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="sell" onClick={handleSellClick}>
            Sell
          </button>
        </Tooltip>

        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action" onClick={handleAnalyticsClick}>
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
