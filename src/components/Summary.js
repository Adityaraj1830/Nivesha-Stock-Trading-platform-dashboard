import React, { useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import GeneralContext from "./GeneralContext";

const Summary = () => {
  const { refreshKey } = useContext(GeneralContext);

  const [funds, setFunds] = useState({
    availableBalance: 0,
  });

  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setIsLoading(true);

        const [
          fundsResponse,
          holdingsResponse,
          positionsResponse,
          marketResponse,
        ] = await Promise.all([
          api.get("/funds"),
          api.get("/allHoldings"),
          api.get("/allPositions"),
          api.get("/market-data"),
        ]);

        const marketData = marketResponse.data;

        const updatedHoldings = holdingsResponse.data.map((holding) => {
          const marketStock = marketData.find(
            (stock) => stock.name === holding.name,
          );

          const ltp = marketStock
            ? Number(marketStock.price)
            : Number(holding.price);

          const quantity = Number(holding.qty);
          const averagePrice = Number(holding.avg);

          const investment = averagePrice * quantity;
          const currentValue = ltp * quantity;
          const pnl = currentValue - investment;

          const pnlPercentage = investment > 0 ? (pnl / investment) * 100 : 0;

          return {
            ...holding,
            ltp,
            investment,
            currentValue,
            pnl,
            pnlPercentage,
          };
        });

        const updatedPositions = positionsResponse.data.map((position) => {
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
          const pnl = currentValue - investment;

          const pnlPercentage = investment > 0 ? (pnl / investment) * 100 : 0;

          return {
            ...position,
            ltp,
            investment,
            currentValue,
            pnl,
            pnlPercentage,
          };
        });

        setFunds(fundsResponse.data);
        setHoldings(updatedHoldings);
        setPositions(updatedPositions);
      } catch (error) {
        console.error("Failed to fetch summary data:", error);
      } finally {
        setIsLoading(false);
      }
    };

  fetchSummaryData();

  const intervalId = setInterval(() => {
    fetchSummaryData();
  }, 60 * 1000);

  return () => clearInterval(intervalId);
}, [refreshKey]);

  const totalInvestment = holdings.reduce(
    (total, stock) => total + Number(stock.investment || 0),
    0,
  );

  const currentValue = holdings.reduce(
    (total, stock) => total + Number(stock.currentValue || 0),
    0,
  );

  const totalPnL = currentValue - totalInvestment;

  const pnlPercentage =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  const availableBalance = Number(funds.availableBalance || 0);

  const totalAccountValue = availableBalance + currentValue;

  const investedPercentage =
    totalAccountValue > 0 ? (currentValue / totalAccountValue) * 100 : 0;

  const cashPercentage =
    totalAccountValue > 0 ? (availableBalance / totalAccountValue) * 100 : 0;

  const totalPositionInvestment = positions.reduce(
    (total, position) => total + Number(position.investment || 0),
    0,
  );

  const totalPositionValue = positions.reduce(
    (total, position) => total + Number(position.currentValue || 0),
    0,
  );

  const totalPositionPnL = positions.reduce(
    (total, position) => total + Number(position.pnl || 0),
    0,
  );

  const totalPositionReturn =
    totalPositionInvestment > 0
      ? (totalPositionPnL / totalPositionInvestment) * 100
      : 0;

  const sortedByPerformance = [...holdings].sort(
    (a, b) => b.pnlPercentage - a.pnlPercentage,
  );

  const bestPerformer =
    sortedByPerformance.length > 0 ? sortedByPerformance[0] : null;

  const worstPerformer =
    sortedByPerformance.length > 0
      ? sortedByPerformance[sortedByPerformance.length - 1]
      : null;

  const topHoldings = [...holdings]
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 5);

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
    <div className="nivesha-summary">
      <div className="nivesha-summary-hero">
        <div className="nivesha-summary-hero-content">
          <span className="nivesha-summary-eyebrow">PORTFOLIO OVERVIEW</span>

          <h1>
            Your financial journey, <span>in focus</span>
          </h1>

          <p>
            A complete view of your investments, available capital and portfolio
            performance.
          </p>
        </div>

        <div className="nivesha-summary-live">
          <span className="nivesha-summary-live-dot"></span>

          <div>
            <strong>Portfolio updated</strong>
            <small>Latest market prices applied</small>
          </div>
        </div>

        <div className="nivesha-hero-glow-one"></div>
        <div className="nivesha-hero-glow-two"></div>
      </div>

      <div className="nivesha-stat-grid">
        <div className="nivesha-stat-card net-worth">
          <div className="nivesha-stat-card-top">
            <div className="nivesha-stat-icon net-worth-icon">
              <i className="fa fa-line-chart" aria-hidden="true"></i>
            </div>

            <span>Total net worth</span>
          </div>

          <h2>
            {isLoading ? "Loading..." : formatCurrency(totalAccountValue)}
          </h2>

          <div className="nivesha-stat-footer">
            <span>Total account value</span>
            <span className="nivesha-active-pill">Active</span>
          </div>
        </div>

        <div className="nivesha-stat-card">
          <div className="nivesha-stat-card-top">
            <div className="nivesha-stat-icon cash-icon">
              <i className="fa fa-inr" aria-hidden="true"></i>
            </div>

            <span>Available cash</span>
          </div>

          <h2>{isLoading ? "Loading..." : formatCurrency(availableBalance)}</h2>

          <div className="nivesha-stat-footer">
            <span>Ready to invest</span>
            <strong>{cashPercentage.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="nivesha-stat-card">
          <div className="nivesha-stat-card-top">
            <div className="nivesha-stat-icon portfolio-icon">
              <i className="fa fa-briefcase" aria-hidden="true"></i>
            </div>

            <span>Portfolio value</span>
          </div>

          <h2>{isLoading ? "Loading..." : formatCurrency(currentValue)}</h2>

          <div className="nivesha-stat-footer">
            <span>
              {holdings.length} {holdings.length === 1 ? "holding" : "holdings"}
            </span>

            <strong>{investedPercentage.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="nivesha-stat-card">
          <div className="nivesha-stat-card-top">
            <div
              className={`nivesha-stat-icon ${
                totalPnL >= 0 ? "pnl-positive-icon" : "pnl-negative-icon"
              }`}
            >
              <i
                className={`fa ${
                  totalPnL >= 0 ? "fa-line-chart" : "fa-area-chart"
                }`}
                aria-hidden="true"
              ></i>
            </div>

            <span>Unrealized P&L</span>
          </div>

          <h2 className={getPerformanceClass(totalPnL)}>
            {isLoading ? "Loading..." : formatCurrency(totalPnL)}
          </h2>

          <div className="nivesha-stat-footer">
            <span>Overall return</span>

            <strong className={getPerformanceClass(totalPnL)}>
              {formatPercentage(pnlPercentage)}
            </strong>
          </div>
        </div>
      </div>

      <div className="nivesha-summary-main-grid">
        <div className="nivesha-portfolio-overview">
          <div className="nivesha-section-heading">
            <div>
              <span>PORTFOLIO</span>
              <h2>Portfolio overview</h2>
              <p>Your investment performance at current market prices.</p>
            </div>

            <div className="nivesha-holding-count">
              <strong>{holdings.length}</strong>
              <span>Holdings</span>
            </div>
          </div>

          <div className="nivesha-portfolio-numbers">
            <div>
              <span>Total investment</span>
              <strong>{formatCurrency(totalInvestment)}</strong>
              <small>Original invested capital</small>
            </div>

            <div className="nivesha-number-divider"></div>

            <div>
              <span>Current value</span>
              <strong>{formatCurrency(currentValue)}</strong>
              <small>Based on current market prices</small>
            </div>

            <div className="nivesha-number-divider"></div>

            <div>
              <span>Unrealized P&L</span>

              <strong className={getPerformanceClass(totalPnL)}>
                {formatCurrency(totalPnL)}
              </strong>

              <small className={getPerformanceClass(totalPnL)}>
                {formatPercentage(pnlPercentage)} return
              </small>
            </div>
          </div>

          <div className="nivesha-allocation-box">
            <div className="nivesha-allocation-heading">
              <div>
                <h3>Asset allocation</h3>
                <p>How your total account value is distributed</p>
              </div>

              <strong>{formatCurrency(totalAccountValue)}</strong>
            </div>

            <div className="nivesha-allocation-track">
              <div
                className="nivesha-invested-bar"
                style={{ width: `${investedPercentage}%` }}
              ></div>

              <div
                className="nivesha-cash-bar"
                style={{ width: `${cashPercentage}%` }}
              ></div>
            </div>

            <div className="nivesha-allocation-labels">
              <div>
                <span className="nivesha-allocation-dot invested"></span>

                <div>
                  <small>Invested</small>
                  <strong>{investedPercentage.toFixed(1)}%</strong>
                </div>
              </div>

              <div>
                <span className="nivesha-allocation-dot cash"></span>

                <div>
                  <small>Available cash</small>
                  <strong>{cashPercentage.toFixed(1)}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="nivesha-performance-panel">
          <div className="nivesha-performance-heading">
            <div className="nivesha-performance-heading-icon">
              <i className="fa fa-line-chart" aria-hidden="true"></i>
            </div>

            <div>
              <span>PERFORMANCE</span>
              <h3>Portfolio health</h3>
            </div>
          </div>

          <div className="nivesha-return-area">
            <div
              className={`nivesha-return-ring ${
                totalPnL >= 0 ? "positive" : "negative"
              }`}
              style={{
                "--return-angle": `${Math.min(
                  Math.abs(pnlPercentage) * 3.6,
                  360,
                )}deg`,
              }}
            >
              <div className="nivesha-return-inner">
                <strong>{formatPercentage(pnlPercentage)}</strong>
                <span>Return</span>
              </div>
            </div>
          </div>

          <div className="nivesha-performance-stats">
            <div>
              <span>Invested capital</span>
              <strong>{formatCurrency(totalInvestment)}</strong>
            </div>

            <div>
              <span>Market value</span>
              <strong>{formatCurrency(currentValue)}</strong>
            </div>

            <div>
              <span>Portfolio P&L</span>

              <strong className={getPerformanceClass(totalPnL)}>
                {formatCurrency(totalPnL)}
              </strong>
            </div>
          </div>

          <div
            className={`nivesha-performance-message ${
              totalPnL >= 0 ? "positive" : "negative"
            }`}
          >
            <i
              className={`fa ${
                totalPnL >= 0 ? "fa-line-chart" : "fa-area-chart"
              }`}
              aria-hidden="true"
            ></i>

            <div>
              <strong>
                {totalPnL >= 0
                  ? "Portfolio in profit"
                  : "Portfolio below investment"}
              </strong>

              <p>
                {totalPnL >= 0
                  ? "Your holdings are currently trading above your average investment cost."
                  : "Your holdings are currently trading below your average investment cost."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="nivesha-intraday-overview">
        <div className="nivesha-intraday-heading">
          <div>
            <span>INTRADAY</span>
            <h2>Active MIS positions</h2>
            <p>A quick overview of your currently open intraday trades.</p>
          </div>

          <div className="nivesha-mis-badge">
            MIS
            <small>Intraday</small>
          </div>
        </div>

        {positions.length > 0 ? (
          <div className="nivesha-intraday-stats">
            <div>
              <span>Open positions</span>
              <strong>{positions.length}</strong>
              <small>Active MIS trades</small>
            </div>

            <div>
              <span>Capital deployed</span>
              <strong>{formatCurrency(totalPositionInvestment)}</strong>
              <small>Original position value</small>
            </div>

            <div>
              <span>Current value</span>
              <strong>{formatCurrency(totalPositionValue)}</strong>
              <small>At current market prices</small>
            </div>

            <div>
              <span>Unrealized P&L</span>
              <strong className={getPerformanceClass(totalPositionPnL)}>
                {totalPositionPnL >= 0 ? "+" : ""}
                {formatCurrency(totalPositionPnL)}
              </strong>

              <small className={getPerformanceClass(totalPositionPnL)}>
                {formatPercentage(totalPositionReturn)} return
              </small>
            </div>
          </div>
        ) : (
          <div className="nivesha-intraday-empty">
            <div className="nivesha-empty-position-icon">
              <i className="fa fa-bolt" aria-hidden="true"></i>
            </div>

            <div>
              <h3>No active MIS positions</h3>
              <p>
                Your open intraday trades will appear here when you buy a stock
                using MIS.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="nivesha-market-insights-grid">
        <div className="nivesha-performer-card best">
          <div className="nivesha-performer-top">
            <div className="nivesha-performer-icon">
              <i className="fa fa-line-chart" aria-hidden="true"></i>
            </div>

            <span>BEST PERFORMER</span>
          </div>

          {bestPerformer ? (
            <>
              <div className="nivesha-performer-content">
                <div>
                  <h3>{bestPerformer.name}</h3>
                  <p>Your strongest holding by return</p>
                </div>

                <strong className="profit">
                  {formatPercentage(bestPerformer.pnlPercentage)}
                </strong>
              </div>

              <div className="nivesha-performer-footer">
                <span>Current P&L</span>

                <strong className={getPerformanceClass(bestPerformer.pnl)}>
                  {formatCurrency(bestPerformer.pnl)}
                </strong>
              </div>
            </>
          ) : (
            <div className="nivesha-no-data">No holdings available</div>
          )}
        </div>

        <div className="nivesha-performer-card worst">
          <div className="nivesha-performer-top">
            <div className="nivesha-performer-icon">
              <i className="fa fa-area-chart" aria-hidden="true"></i>
            </div>

            <span>NEEDS ATTENTION</span>
          </div>

          {worstPerformer ? (
            <>
              <div className="nivesha-performer-content">
                <div>
                  <h3>{worstPerformer.name}</h3>
                  <p>Your lowest performing holding</p>
                </div>

                <strong
                  className={getPerformanceClass(worstPerformer.pnlPercentage)}
                >
                  {formatPercentage(worstPerformer.pnlPercentage)}
                </strong>
              </div>

              <div className="nivesha-performer-footer">
                <span>Current P&L</span>

                <strong className={getPerformanceClass(worstPerformer.pnl)}>
                  {formatCurrency(worstPerformer.pnl)}
                </strong>
              </div>
            </>
          ) : (
            <div className="nivesha-no-data">No holdings available</div>
          )}
        </div>
      </div>

      <div className="nivesha-top-holdings-card">
        <div className="nivesha-top-holdings-heading">
          <div>
            <span>YOUR INVESTMENTS</span>
            <h2>Top holdings</h2>
            <p>Your largest positions based on current market value.</p>
          </div>

          <div className="nivesha-top-holdings-badge">
            Top {topHoldings.length}
          </div>
        </div>

        {topHoldings.length > 0 ? (
          <div className="nivesha-top-holdings-table">
            <div className="nivesha-holdings-table-head">
              <span>Instrument</span>
              <span>Quantity</span>
              <span>Avg. price</span>
              <span>Current value</span>
              <span>Return</span>
            </div>

            {topHoldings.map((stock) => (
              <div className="nivesha-holding-row" key={stock._id}>
                <div className="nivesha-stock-name">
                  <div className="nivesha-stock-avatar">
                    {stock.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{stock.name}</strong>
                    <small>Equity</small>
                  </div>
                </div>

                <span>{stock.qty}</span>
                <span>{formatCurrency(stock.avg)}</span>
                <strong>{formatCurrency(stock.currentValue)}</strong>

                <span
                  className={`nivesha-return-pill ${getPerformanceClass(
                    stock.pnlPercentage,
                  )}`}
                >
                  {formatPercentage(stock.pnlPercentage)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="nivesha-empty-holdings">
            <div className="nivesha-empty-icon">
              <i className="fa fa-briefcase" aria-hidden="true"></i>
            </div>

            <h3>No holdings yet</h3>

            <p>
              Your investments will appear here after you purchase your first
              stock.
            </p>
          </div>
        )}
      </div>

      <div className="nivesha-summary-footer-cards">
        <div className="nivesha-footer-stat">
          <div className="nivesha-footer-stat-icon buying-power-icon">
            <i className="fa fa-inr" aria-hidden="true"></i>
          </div>

          <div>
            <span>Buying power</span>
            <strong>{formatCurrency(availableBalance)}</strong>
          </div>
        </div>

        <div className="nivesha-footer-stat">
          <div className="nivesha-footer-stat-icon active-holdings-icon">
            <i className="fa fa-briefcase" aria-hidden="true"></i>
          </div>

          <div>
            <span>Active holdings</span>
            <strong>{holdings.length}</strong>
          </div>
        </div>

        <div className="nivesha-footer-stat">
          <div className="nivesha-footer-stat-icon capital-icon">
            <i className="fa fa-pie-chart" aria-hidden="true"></i>
          </div>

          <div>
            <span>Active MIS positions</span>
            <strong>{positions.length}</strong>
          </div>
        </div>

        <div className="nivesha-footer-stat">
          <div className="nivesha-footer-stat-icon account-value-icon">
            <i className="fa fa-line-chart" aria-hidden="true"></i>
          </div>

          <div>
            <span>Account value</span>
            <strong>{formatCurrency(totalAccountValue)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
