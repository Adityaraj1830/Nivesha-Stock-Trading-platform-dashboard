import React from "react";

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

const StockPriceChart = ({ price, isDown }) => {
  const currentPrice = Number(price);

  const labels = ["9:15", "10:00", "11:00", "12:00", "1:00", "2:00", "3:30"];

  const movement = isDown
    ? [1.012, 1.008, 1.01, 1.003, 1.005, 0.998, 1]
    : [0.988, 0.992, 0.99, 0.997, 0.995, 1.002, 1];

  const prices = movement.map((value) =>
    Number((currentPrice * value).toFixed(2)),
  );

  const data = {
    labels,
    datasets: [
      {
        data: prices,
        borderColor: isDown ? "#dc2626" : "#059669",
        backgroundColor: isDown
          ? "rgba(220, 38, 38, 0.06)"
          : "rgba(5, 150, 105, 0.06)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
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
          <h4>Today's Price Movement</h4>
          <span>Simulated intraday data</span>
        </div>

        <span className="chart-timeframe">1D</span>
      </div>

      <div className="stock-chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default StockPriceChart;
