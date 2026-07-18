import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const { refreshKey } = useContext(GeneralContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3002/allOrders");

      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]);

  const filteredOrders =
    filter === "ALL" ? orders : orders.filter((order) => order.mode === filter);

  const handleCancel = async (id) => {
    try {
      await axios.post("http://localhost:3002/cancelOrder", { id });

      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to cancel order");
    }
  };

  return (
    <div className="orders-container">
      <h3 className="title">Orders</h3>

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
              <th>Stock</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.name}</td>

                <td className={order.mode === "BUY" ? "buy" : "sell"}>
                  {order.mode}
                </td>

                <td>{order.qty}</td>

                <td>₹{Number(order.price).toFixed(2)}</td>

                <td className={`status ${order.status?.toLowerCase()}`}>
                  {order.status || "PENDING"}
                </td>

                <td>{order.time || "—"}</td>

                <td>
                  {(order.status === "PENDING" || !order.status) && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
