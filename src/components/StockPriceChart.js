import React, { useEffect, useState } from "react";

import axios from "axios";

import config from "../config/config";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

const StockPriceChart = ({ symbol, price, isDown }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `${config.API_URL}/market/history/${encodeURIComponent(symbol)}`,
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          setHistory(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch historical market data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchStockHistory();
    }
  }, [symbol]);

  if (isLoading) {
    return (
      <div className="stock-chart-section">
        <div className="stock-chart-header">
          <div>
            <h4>Stock Price Performance</h4>
            <span>Loading historical market data...</span>
          </div>

          <span className="chart-timeframe">1W</span>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="stock-chart-section">
        <div className="stock-chart-header">
          <div>
            <h4>Stock Price Performance</h4>
            <span>Historical market data unavailable</span>
          </div>

          <span className="chart-timeframe">1W</span>
        </div>
      </div>
    );
  }

  const labels = history.map((item) =>
    new Date(item.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  );

  const prices = history.map((item) => Number(item.close.toFixed(2)));

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];

  const chartIsDown = lastPrice < firstPrice;

  const data = {
    labels,

    datasets: [
      {
        data: prices,

        borderColor: chartIsDown ? "#dc2626" : "#059669",

        backgroundColor: chartIsDown
          ? "rgba(220, 38, 38, 0.06)"
          : "rgba(5, 150, 105, 0.06)",

        borderWidth: 2,

        pointRadius: 3,

        pointHoverRadius: 5,

        tension: 0.35,

        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        displayColors: false,

        callbacks: {
          label: (context) => `₹${Number(context.raw).toFixed(2)}`,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#9ca3af",

          font: {
            size: 10,
          },
        },
      },

      y: {
        position: "right",

        grid: {
          color: "#eef0f2",
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#9ca3af",

          font: {
            size: 10,
          },

          callback: (value) => `₹${value}`,
        },
      },
    },

    interaction: {
      intersect: false,

      mode: "index",
    },
  };

  return (
    <div className="stock-chart-section">
      <div className="stock-chart-header">
        <div>
          <h4>Stock Price Performance</h4>

          <span>Historical NSE market data</span>
        </div>

        <span className="chart-timeframe">1W</span>
      </div>

      <div className="stock-chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default StockPriceChart;
