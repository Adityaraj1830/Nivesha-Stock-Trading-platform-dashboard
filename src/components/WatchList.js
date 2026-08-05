import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import config from "../config/config";

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
      const response = await axios.get(`${config.API_URL}/market-data`, {
  withCredentials: true,
});

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
      <div className="watchlist-header">
        <div>
          <span className="watchlist-eyebrow">MARKET</span>
          <h2>My Watchlist</h2>
        </div>

        <div className="watchlist-stock-count">
          <span>{watchlist.length}</span>
          <small>Stocks</small>
        </div>
      </div>

      <div className="search-container">
        <div className="watchlist-search-icon">
          <i className="fa fa-search" aria-hidden="true"></i>
        </div>

        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search stocks..."
          className="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <span className="counts">
          {searchedStocks.length} / {watchlist.length}
        </span>
      </div>

      <div className="watchlist-column-header">
        <span>Instrument</span>

        <div>
          <span>Change</span>
          <span>LTP</span>
        </div>
      </div>

      <ul className="list">
        {searchedStocks.length > 0 ? (
          searchedStocks.map((stock) => (
            <WatchListItem stock={stock} key={stock.name} />
          ))
        ) : (
          <li className="no-results">
            <div className="no-results-icon">
              <i className="fa fa-search" aria-hidden="true"></i>
            </div>

            <strong>No stocks found</strong>
            <span>Try searching with another stock symbol.</span>
          </li>
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
      className="watchlist-stock-row"
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <div className="watchlist-stock-identity">
          <div
            className={`watchlist-stock-avatar ${
              stock.isDown ? "stock-down" : "stock-up"
            }`}
          >
            {stock.name.charAt(0)}
          </div>

          <div className="watchlist-stock-name">
            <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
            <span>NSE · Equity</span>
          </div>
        </div>

        <div className="item-info">
          <div
            className={`watchlist-change ${
              stock.isDown ? "stock-down" : "stock-up"
            }`}
          >
            {stock.isDown ? (
              <KeyboardArrowDown className="watchlist-trend-icon" />
            ) : (
              <KeyboardArrowUp className="watchlist-trend-icon" />
            )}

            <span className="percent">{stock.percent}</span>
          </div>

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
          <button
            className="action"
            onClick={handleAnalyticsClick}
            aria-label={`View ${stock.name} analytics`}
          >
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
