import React, { useContext, useEffect, useState } from "react";

import api from "../api/axiosInstance";

import GeneralContext from "./GeneralContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [filter, setFilter] = useState("ALL");

  const [productFilter, setProductFilter] = useState("ALL");

  const [isLoading, setIsLoading] = useState(true);

  const { refreshKey } = useContext(GeneralContext);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/allOrders");

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

  const filteredOrders = orders.filter((order) => {
    const matchesOrderType = filter === "ALL" || order.mode === filter;

    const orderProduct = order.product || "CNC";

    const matchesProduct =
      productFilter === "ALL" || orderProduct === productFilter;

    return matchesOrderType && matchesProduct;
  });

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h3 className="title">Orders</h3>

          <p className="orders-subtitle">
            View and track your complete trading activity
          </p>
        </div>

        <span className="orders-count">
          {filteredOrders.length}{" "}
          {filteredOrders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="orders-filter-section">
        <div className="orders-filter-group">
          <span className="orders-filter-label">Order type</span>

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
        </div>

        <div className="orders-filter-group">
          <span className="orders-filter-label">Product</span>

          <div className="order-filters product-filters">
            {["ALL", "CNC", "MIS"].map((type) => (
              <button
                key={type}
                className={productFilter === type ? "active-filter" : ""}
                onClick={() => setProductFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Type</th>
              <th>Product</th>
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

                const product = order.product || "CNC";

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

                    <td>
                      <span
                        className={`order-product ${
                          product === "MIS"
                            ? "order-product-mis"
                            : "order-product-cnc"
                        }`}
                      >
                        {product}
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
              {filter === "ALL" && productFilter === "ALL"
                ? "Your trading activity will appear here."
                : "No orders match the selected filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
