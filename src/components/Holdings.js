import React, { useContext, useEffect, useState } from "react";

import api from "../api/axiosInstance";

import GeneralContext from "./GeneralContext";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { refreshKey } = useContext(GeneralContext);

  const fetchHoldings = async () => {
    try {
      setIsLoading(true);

      const [holdingsResponse, marketResponse, ordersResponse] =
        await Promise.all([
          api.get("/allHoldings"),
          api.get("/market-data"),
          api.get("/allOrders"),
        ]);

      const holdings = holdingsResponse.data;
      const marketData = marketResponse.data;
      const orders = ordersResponse.data;

      const updatedHoldings = holdings.map((holding) => {
        const marketStock = marketData.find(
          (stock) => stock.name === holding.name,
        );

        const realizedPnL = orders
          .filter(
            (order) =>
              order.name === holding.name &&
              order.mode === "SELL" &&
              order.status === "COMPLETED",
          )
          .reduce((total, order) => total + Number(order.realizedPnL || 0), 0);

        return {
          ...holding,
          ltp: marketStock ? marketStock.price : holding.price,
          day: marketStock ? marketStock.percent : holding.day,
          isDown: marketStock ? marketStock.isDown : false,
          realizedPnL,
        };
      });

      setAllHoldings(updatedHoldings);
    } catch (error) {
      console.error("Failed to fetch holdings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, [refreshKey]);

  const totalInvestment = allHoldings.reduce((total, stock) => {
    return total + Number(stock.avg) * Number(stock.qty);
  }, 0);

  const currentValue = allHoldings.reduce((total, stock) => {
    return total + Number(stock.ltp) * Number(stock.qty);
  }, 0);

  const totalProfitLoss = currentValue - totalInvestment;

  const profitLossPercentage =
    totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  const totalProfitClass = totalProfitLoss >= 0 ? "profit" : "loss";

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Current Market Price",
        data: allHoldings.map((stock) => stock.ltp),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  if (isLoading) {
    return (
      <>
        <h3 className="title">
          <i
            className="fa fa-briefcase section-icon holdings-icon"
            aria-hidden="true"
          ></i>
          Holdings
        </h3>

        <div className="portfolio-empty-state">
          <p>Loading your holdings...</p>
        </div>
      </>
    );
  }

  if (allHoldings.length === 0) {
    return (
      <>
        <h3 className="title">
          <i
            className="fa fa-briefcase section-icon holdings-icon"
            aria-hidden="true"
          ></i>
          Holdings (0)
        </h3>

        <div className="portfolio-empty-state">
          <div className="portfolio-empty-icon">
            <i className="fa fa-briefcase" aria-hidden="true"></i>
          </div>

          <h3>No holdings yet</h3>

          <p>
            Buy stocks using CNC from your watchlist to start building your
            long-term portfolio.
          </p>

          <span>Your purchased CNC stocks will appear here.</span>
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="title">
        <i
          className="fa fa-briefcase section-icon holdings-icon"
          aria-hidden="true"
        ></i>
        Holdings ({allHoldings.length})
      </h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>UnRealized P&L</th>
              <th>Realized P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock) => {
              const stockCurrentValue = Number(stock.ltp) * Number(stock.qty);

              const stockInvestment = Number(stock.avg) * Number(stock.qty);

              const stockProfitLoss = stockCurrentValue - stockInvestment;

              const profitPercentage =
                stockInvestment > 0
                  ? (stockProfitLoss / stockInvestment) * 100
                  : 0;

              const profitClass = stockProfitLoss >= 0 ? "profit" : "loss";

              const realizedClass = stock.realizedPnL >= 0 ? "profit" : "loss";

              const dayClass = stock.isDown ? "loss" : "profit";

              return (
                <tr key={stock._id}>
                  <td>{stock.name}</td>

                  <td>{stock.qty}</td>

                  <td>₹{Number(stock.avg).toFixed(2)}</td>

                  <td>₹{Number(stock.ltp).toFixed(2)}</td>

                  <td>₹{stockCurrentValue.toFixed(2)}</td>

                  <td className={profitClass}>
                    {stockProfitLoss >= 0 ? "+" : ""}₹
                    {stockProfitLoss.toFixed(2)}
                  </td>

                  <td className={realizedClass}>
                    {stock.realizedPnL >= 0 ? "+" : "-"}₹
                    {Math.abs(stock.realizedPnL).toFixed(2)}
                  </td>

                  <td className={profitClass}>
                    {profitPercentage >= 0 ? "+" : ""}
                    {profitPercentage.toFixed(2)}%
                  </td>

                  <td className={dayClass}>{stock.day || "0.00%"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            ₹
            {totalInvestment.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h5>

          <p>Total investment</p>
        </div>

        <div className="col">
          <h5>
            ₹
            {currentValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h5>

          <p>Current value</p>
        </div>

        <div className="col">
          <h5 className={totalProfitClass}>
            {totalProfitLoss >= 0 ? "+" : ""}₹
            {totalProfitLoss.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            {" ("}
            {profitLossPercentage >= 0 ? "+" : ""}
            {profitLossPercentage.toFixed(2)}
            {"%)"}
          </h5>

          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
