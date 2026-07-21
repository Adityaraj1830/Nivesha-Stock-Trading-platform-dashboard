import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const { refreshKey } = useContext(GeneralContext);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("http://localhost:3002/allOrders");

      const sortedOrders = [...response.data].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]);

  const filteredOrders =
    filter === "ALL" ? orders : orders.filter((order) => order.mode === filter);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h3 className="title">Orders</h3>
          <p className="orders-subtitle">View your recent trading activity</p>
        </div>

        <span className="orders-count">{filteredOrders.length} orders</span>
      </div>

      <div className="order-filters">
        {["ALL", "BUY", "SELL"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active-filter" : ""}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Order Value</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {!isLoading &&
              filteredOrders.map((order) => {
                const orderValue = Number(order.price) * Number(order.qty);

                const status = order.status || "COMPLETED";

                return (
                  <tr key={order._id}>
                    <td className="order-instrument">{order.name}</td>

                    <td>
                      <span
                        className={`order-type ${
                          order.mode === "BUY" ? "order-buy" : "order-sell"
                        }`}
                      >
                        {order.mode}
                      </span>
                    </td>

                    <td>{order.qty}</td>

                    <td>
                      ₹
                      {Number(order.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td>
                      ₹
                      {orderValue.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td>
                      <span className={`order-status ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>

                    <td>{order.time || "—"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {isLoading && (
          <div className="orders-empty-state">
            <p>Loading your orders...</p>
          </div>
        )}

        {!isLoading && filteredOrders.length === 0 && (
          <div className="orders-empty-state">
            <h4>No orders found</h4>
            <p>
              {filter === "ALL"
                ? "Your trading activity will appear here."
                : `You don't have any ${filter.toLowerCase()} orders yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
