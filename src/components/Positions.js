import React, { useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

import GeneralContext from "./GeneralContext";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { refreshKey } = useContext(GeneralContext);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);

      const [positionsResponse, marketResponse] = await Promise.all([
        api.get("/allPositions"),
        api.get("/market-data"),
      ]);

      const positionsData = positionsResponse.data;
      const marketData = marketResponse.data;

      const updatedPositions = positionsData.map((position) => {
        const marketStock = marketData.find(
          (stock) => stock.name === position.name,
        );

        const ltp = marketStock
          ? Number(marketStock.price)
          : Number(position.price);

        const quantity = Number(position.qty);
        const averagePrice = Number(position.avg);

        const investment = averagePrice * quantity;

        const currentValue = ltp * quantity;

        const profitLoss = currentValue - investment;

        const profitLossPercentage =
          investment > 0 ? (profitLoss / investment) * 100 : 0;

        return {
          ...position,
          ltp,
          investment,
          currentValue,
          profitLoss,
          profitLossPercentage,
          change: marketStock ? marketStock.percent : position.day || "0.00%",
          isDown: marketStock ? marketStock.isDown : position.isLoss,
        };
      });

      setPositions(updatedPositions);
    } catch (error) {
      console.error("Failed to fetch positions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [refreshKey]);

  const totalInvestment = positions.reduce(
    (total, position) => total + position.investment,
    0,
  );

  const totalCurrentValue = positions.reduce(
    (total, position) => total + position.currentValue,
    0,
  );

  const totalPnL = positions.reduce(
    (total, position) => total + position.profitLoss,
    0,
  );

  const totalReturnPercentage =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  const profitablePositions = positions.filter(
    (position) => position.profitLoss >= 0,
  ).length;

  const losingPositions = positions.filter(
    (position) => position.profitLoss < 0,
  ).length;

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatPercentage = (value) => {
    const number = Number(value || 0);

    return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
  };

  const getPerformanceClass = (value) =>
    Number(value) >= 0 ? "profit" : "loss";

  return (
    <div className="nivesha-positions-page">
      <div className="nivesha-positions-header">
        <div>
          <span className="nivesha-positions-eyebrow">INTRADAY TRADING</span>

          <h1>Open positions</h1>

          <p>
            Track your active MIS trades and their performance at current market
            prices.
          </p>
        </div>

        <div className="nivesha-position-status">
          <span className="nivesha-position-status-dot"></span>

          <div>
            <strong>
              {positions.length} active{" "}
              {positions.length === 1 ? "position" : "positions"}
            </strong>

            <small>Live portfolio calculations</small>
          </div>
        </div>
      </div>

      <div className="nivesha-position-stats">
        <div className="nivesha-position-stat-card">
          <div className="nivesha-position-stat-icon position-count">
            <i className="fa fa-bolt" aria-hidden="true"></i>
          </div>

          <div>
            <span>Open positions</span>

            <strong>{isLoading ? "..." : positions.length}</strong>

            <small>Active intraday trades</small>
          </div>
        </div>

        <div className="nivesha-position-stat-card">
          <div className="nivesha-position-stat-icon position-value">
            <i className="fa fa-inr" aria-hidden="true"></i>
          </div>

          <div>
            <span>Position value</span>

            <strong>
              {isLoading ? "Loading..." : formatCurrency(totalCurrentValue)}
            </strong>

            <small>Current market value</small>
          </div>
        </div>

        <div className="nivesha-position-stat-card">
          <div
            className={`nivesha-position-stat-icon ${
              totalPnL >= 0 ? "position-profit" : "position-loss"
            }`}
          >
            <i
              className={`fa ${
                totalPnL >= 0 ? "fa-line-chart" : "fa-area-chart"
              }`}
              aria-hidden="true"
            ></i>
          </div>

          <div>
            <span>Unrealized P&L</span>

            <strong className={getPerformanceClass(totalPnL)}>
              {isLoading ? "Loading..." : formatCurrency(totalPnL)}
            </strong>

            <small className={getPerformanceClass(totalPnL)}>
              {formatPercentage(totalReturnPercentage)} return
            </small>
          </div>
        </div>

        <div className="nivesha-position-stat-card">
          <div className="nivesha-position-stat-icon position-performance">
            <i className="fa fa-bar-chart" aria-hidden="true"></i>
          </div>

          <div>
            <span>Performance</span>

            <strong>
              {profitablePositions} / {positions.length}
            </strong>

            <small>
              {profitablePositions} profitable · {losingPositions} losing
            </small>
          </div>
        </div>
      </div>

      <div className="nivesha-positions-card">
        <div className="nivesha-positions-card-header">
          <div>
            <span>ACTIVE TRADES</span>

            <h2>Your positions</h2>

            <p>Current performance of your open intraday positions.</p>
          </div>

          <div className="nivesha-mis-badge">
            MIS
            <small>Intraday</small>
          </div>
        </div>

        {isLoading ? (
          <div className="nivesha-positions-state">
            <div className="nivesha-position-loader"></div>

            <h3>Loading positions</h3>

            <p>Fetching your latest trading data.</p>
          </div>
        ) : positions.length === 0 ? (
          <div className="nivesha-positions-state">
            <div className="nivesha-empty-position-icon">
              <i className="fa fa-line-chart" aria-hidden="true"></i>
            </div>

            <h3>No open positions</h3>

            <p>
              Buy a stock using the MIS product type and your intraday position
              will appear here.
            </p>
          </div>
        ) : (
          <div className="nivesha-positions-table-wrapper">
            <table className="nivesha-positions-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. price</th>
                  <th>LTP</th>
                  <th>Position value</th>
                  <th>P&L</th>
                  <th>Return</th>
                  <th>Day chg.</th>
                </tr>
              </thead>

              <tbody>
                {positions.map((stock) => {
                  const performanceClass = getPerformanceClass(
                    stock.profitLoss,
                  );

                  const changeClass = stock.isDown ? "loss" : "profit";

                  return (
                    <tr key={stock._id}>
                      <td>
                        <span className="nivesha-position-product">
                          {stock.product || "MIS"}
                        </span>
                      </td>

                      <td>
                        <div className="nivesha-position-stock">
                          <div className="nivesha-position-stock-icon">
                            {stock.name.charAt(0)}
                          </div>

                          <strong>{stock.name}</strong>
                        </div>
                      </td>

                      <td>{stock.qty}</td>

                      <td>{formatCurrency(stock.avg)}</td>

                      <td>{formatCurrency(stock.ltp)}</td>

                      <td>{formatCurrency(stock.currentValue)}</td>

                      <td className={performanceClass}>
                        {stock.profitLoss >= 0 ? "+" : ""}
                        {formatCurrency(stock.profitLoss)}
                      </td>

                      <td>
                        <span
                          className={`nivesha-position-return ${performanceClass}`}
                        >
                          {formatPercentage(stock.profitLossPercentage)}
                        </span>
                      </td>

                      <td className={changeClass}>{stock.change || "0.00%"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {positions.length > 0 && (
          <div className="nivesha-positions-summary">
            <div>
              <span>Capital deployed</span>

              <strong>{formatCurrency(totalInvestment)}</strong>
            </div>

            <div>
              <span>Current value</span>

              <strong>{formatCurrency(totalCurrentValue)}</strong>
            </div>

            <div>
              <span>Total P&L</span>

              <strong className={getPerformanceClass(totalPnL)}>
                {totalPnL >= 0 ? "+" : ""}
                {formatCurrency(totalPnL)}
              </strong>
            </div>

            <div>
              <span>Overall return</span>

              <strong className={getPerformanceClass(totalPnL)}>
                {formatPercentage(totalReturnPercentage)}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Positions;
