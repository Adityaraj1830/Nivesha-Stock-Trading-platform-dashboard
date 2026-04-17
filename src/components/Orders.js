import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");

  // 🔥 FETCH ORDERS FROM BACKEND
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/allOrders"
      );
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();

    // 🔥 AUTO REFRESH (REAL-TIME FEEL)
    const interval = setInterval(fetchOrders, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 FILTER
  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.mode === filter);

  // 🔥 CANCEL ORDER
  const handleCancel = async (id) => {
    await axios.post("http://localhost:3002/cancelOrder", { id });
    fetchOrders();
  };

  return (
    <div className="orders-container">
      <h3 className="title">Orders</h3>

      {/* FILTER */}
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

      {/* TABLE */}
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
            {filteredOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.name}</td>

                <td className={order.mode === "BUY" ? "buy" : "sell"}>
                  {order.mode}
                </td>

                <td>{order.qty}</td>
                <td>₹{order.price}</td>

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