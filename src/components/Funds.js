import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import GeneralContext from "./GeneralContext";

const Funds = () => {
  const { refreshKey } = useContext(GeneralContext);

  const [funds, setFunds] = useState({
    availableBalance: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [modalType, setModalType] = useState(null);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const fetchFunds = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("http://localhost:3002/funds");

      setFunds(response.data);
    } catch (error) {
      console.error("Failed to fetch funds:", error);
      toast.error("Unable to load funds");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [refreshKey]);

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openFundsModal = (type) => {
    setModalType(type);
    setAmount("");
  };

  const closeFundsModal = () => {
    if (isProcessing) {
      return;
    }

    setModalType(null);
    setAmount("");
  };

  const handleFundTransaction = async (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (
      modalType === "WITHDRAW" &&
      numericAmount > Number(funds.availableBalance)
    ) {
      toast.error("Insufficient available balance");
      return;
    }

    try {
      setIsProcessing(true);

      const endpoint =
        modalType === "ADD"
          ? "http://localhost:3002/addFunds"
          : "http://localhost:3002/withdrawFunds";

      const response = await axios.post(endpoint, {
        amount: numericAmount,
      });

      setFunds(response.data.funds);

      toast.success(response.data.message);

      setModalType(null);
      setAmount("");
    } catch (error) {
      console.error("Fund transaction failed:", error);

      toast.error(
        error.response?.data?.message || "Unable to process transaction",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const openTransactionHistory = async () => {
    try {
      setShowTransactions(true);
      setTransactionsLoading(true);

      const response = await axios.get(
        "http://localhost:3002/fund-transactions",
      );

      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);

      toast.error("Unable to load transaction history");
    } finally {
      setTransactionsLoading(false);
    }
  };

  const closeTransactionHistory = () => {
    setShowTransactions(false);
  };

  const getTransactionSign = (type) => {
    if (type === "DEPOSIT" || type === "SELL") {
      return "+";
    }

    return "-";
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "Deposit";

      case "WITHDRAWAL":
        return "Withdrawal";

      case "BUY":
        return "Buy";

      case "SELL":
        return "Sell";

      default:
        return type;
    }
  };

  const netDeposited =
    Number(funds.totalDeposited) - Number(funds.totalWithdrawn);

  return (
    <>
      <div className="funds-page">
        <div className="funds-page-header">
          <div>
            <h2>Funds</h2>

            <p>Manage your trading balance and account funds</p>
          </div>

          <div className="funds-actions">
            <button
              className="funds-add-btn"
              onClick={() => openFundsModal("ADD")}
            >
              + Add funds
            </button>

            <button
              className="funds-withdraw-btn"
              onClick={() => openFundsModal("WITHDRAW")}
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="funds-summary-grid">
          <div className="fund-summary-card primary">
            <span>Available balance</span>

            <h2>
              {isLoading
                ? "Loading..."
                : formatCurrency(funds.availableBalance)}
            </h2>

            <p>Available for trading</p>
          </div>

          <div className="fund-summary-card">
            <span>Total deposited</span>

            <h2>
              {isLoading ? "Loading..." : formatCurrency(funds.totalDeposited)}
            </h2>

            <p>Total funds added to your account</p>
          </div>

          <div className="fund-summary-card">
            <span>Total withdrawn</span>

            <h2>
              {isLoading ? "Loading..." : formatCurrency(funds.totalWithdrawn)}
            </h2>

            <p>Total funds withdrawn from your account</p>
          </div>
        </div>

        <div className="funds-content-grid">
          <div className="funds-details-card">
            <div className="funds-card-header">
              <div>
                <h3>Equity</h3>
                <p>Trading account balance</p>
              </div>

              <span className="funds-account-badge">ACTIVE</span>
            </div>

            <div className="funds-balance-details">
              <div className="fund-detail-row">
                <span>Available cash</span>

                <strong className="fund-positive">
                  {isLoading
                    ? "Loading..."
                    : formatCurrency(funds.availableBalance)}
                </strong>
              </div>

              <div className="fund-detail-row">
                <span>Total deposits</span>

                <strong>
                  {isLoading
                    ? "Loading..."
                    : formatCurrency(funds.totalDeposited)}
                </strong>
              </div>

              <div className="fund-detail-row">
                <span>Total withdrawals</span>

                <strong>
                  {isLoading
                    ? "Loading..."
                    : formatCurrency(funds.totalWithdrawn)}
                </strong>
              </div>

              <div className="fund-detail-row">
                <span>Net funds added</span>

                <strong>
                  {isLoading ? "Loading..." : formatCurrency(netDeposited)}
                </strong>
              </div>
            </div>

            <div className="funds-info-box">
              <div className="funds-info-icon">₹</div>

              <div>
                <strong>Instant fund transfers</strong>

                <p>Add funds securely to continue trading on Nivesha.</p>
              </div>
            </div>
          </div>

          <div className="funds-side-card">
            <div className="funds-side-icon">₹</div>

            <h3>Manage your funds</h3>

            <p>
              Add money to your simulated trading balance or withdraw available
              funds from your account.
            </p>

            <button
              className="funds-side-action"
              onClick={openTransactionHistory}
            >
              View transactions
            </button>
          </div>
        </div>
      </div>

      {/* Add / Withdraw Modal */}

      {modalType && (
        <div className="funds-modal-overlay" onMouseDown={closeFundsModal}>
          <div
            className="funds-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="funds-modal-header">
              <div>
                <span className="funds-modal-label">NIVESHA FUNDS</span>

                <h3>{modalType === "ADD" ? "Add funds" : "Withdraw funds"}</h3>
              </div>

              <button
                className="funds-modal-close"
                onClick={closeFundsModal}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="funds-modal-balance">
              <span>Available balance</span>

              <strong>{formatCurrency(funds.availableBalance)}</strong>
            </div>

            <form onSubmit={handleFundTransaction}>
              <label className="funds-amount-label">Amount</label>

              <div className="funds-amount-input">
                <span>₹</span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  autoFocus
                />
              </div>

              <p className="funds-modal-note">
                {modalType === "ADD"
                  ? "The amount will be added to your simulated trading balance."
                  : "The amount will be deducted from your available trading balance."}
              </p>

              <div className="funds-modal-actions">
                <button
                  type="button"
                  className="funds-modal-cancel"
                  onClick={closeFundsModal}
                  disabled={isProcessing}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={
                    modalType === "ADD"
                      ? "funds-modal-submit add"
                      : "funds-modal-submit withdraw"
                  }
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing..."
                    : modalType === "ADD"
                      ? "Add funds"
                      : "Withdraw"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}

      {showTransactions && (
        <div
          className="funds-modal-overlay"
          onMouseDown={closeTransactionHistory}
        >
          <div
            className="transaction-history-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="transaction-history-header">
              <div>
                <span className="funds-modal-label">NIVESHA LEDGER</span>

                <h3>Transaction history</h3>

                <p>Your complete funds and trading activity</p>
              </div>

              <button
                className="funds-modal-close"
                onClick={closeTransactionHistory}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="transaction-summary">
              <div>
                <span>Current balance</span>

                <strong>{formatCurrency(funds.availableBalance)}</strong>
              </div>

              <div>
                <span>Total transactions</span>

                <strong>{transactions.length}</strong>
              </div>
            </div>

            <div className="transaction-list">
              {transactionsLoading ? (
                <div className="transaction-empty">
                  <div className="transaction-loader" />

                  <p>Loading transaction history...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="transaction-empty">
                  <div className="transaction-empty-icon">₹</div>

                  <h4>No transactions yet</h4>

                  <p>Your deposits, withdrawals and trades will appear here.</p>
                </div>
              ) : (
                transactions.map((transaction) => {
                  const isCredit =
                    transaction.type === "DEPOSIT" ||
                    transaction.type === "SELL";

                  return (
                    <div className="transaction-item" key={transaction._id}>
                      <div
                        className={`transaction-type-icon ${transaction.type.toLowerCase()}`}
                      >
                        {transaction.type === "DEPOSIT"
                          ? "↓"
                          : transaction.type === "WITHDRAWAL"
                            ? "↑"
                            : transaction.type === "BUY"
                              ? "B"
                              : "S"}
                      </div>

                      <div className="transaction-info">
                        <div className="transaction-title-row">
                          <strong>{transaction.description}</strong>

                          <span
                            className={`transaction-badge ${transaction.type.toLowerCase()}`}
                          >
                            {getTransactionLabel(transaction.type)}
                          </span>
                        </div>

                        <div className="transaction-meta">
                          <span>{formatDate(transaction.createdAt)}</span>

                          <span className="transaction-dot">•</span>

                          <span>{formatTime(transaction.createdAt)}</span>

                          {transaction.stockName && (
                            <>
                              <span className="transaction-dot">•</span>

                              <span>{transaction.stockName}</span>
                            </>
                          )}

                          {transaction.quantity && (
                            <>
                              <span className="transaction-dot">•</span>

                              <span>Qty {transaction.quantity}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="transaction-amount-section">
                        <strong
                          className={
                            isCredit
                              ? "transaction-credit"
                              : "transaction-debit"
                          }
                        >
                          {getTransactionSign(transaction.type)}
                          {formatCurrency(transaction.amount)}
                        </strong>

                        <span>
                          Balance {formatCurrency(transaction.balanceAfter)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Funds;
