import React, { useEffect, useState } from "react";
import axios from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([]);

  const fetchPositions = async () => {
    try {
      const [positionsResponse, marketResponse] = await Promise.all([
        axios.get("http://localhost:3002/allPositions"),
        axios.get("http://localhost:3002/market-data"),
      ]);

      const positionsData = positionsResponse.data;
      const marketData = marketResponse.data;

      const updatedPositions = positionsData.map((position) => {
        const marketStock = marketData.find(
          (stock) => stock.name === position.name,
        );

        return {
          ...position,
          ltp: marketStock ? marketStock.price : position.price,
          change: marketStock ? marketStock.percent : position.day,
          isDown: marketStock ? marketStock.isDown : position.isLoss,
        };
      });

      setPositions(updatedPositions);
    } catch (error) {
      console.error("Failed to fetch positions:", error);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((stock) => {
              const currentValue = Number(stock.ltp) * Number(stock.qty);

              const investment = Number(stock.avg) * Number(stock.qty);

              const profitLoss = currentValue - investment;

              const profitClass = profitLoss >= 0 ? "profit" : "loss";

              const changeClass = stock.isDown ? "loss" : "profit";

              return (
                <tr key={stock._id}>
                  <td>{stock.product}</td>

                  <td>{stock.name}</td>

                  <td>{stock.qty}</td>

                  <td>₹{Number(stock.avg).toFixed(2)}</td>

                  <td>₹{Number(stock.ltp).toFixed(2)}</td>

                  <td className={profitClass}>
                    {profitLoss >= 0 ? "+" : ""}₹{profitLoss.toFixed(2)}
                  </td>

                  <td className={changeClass}>{stock.change || "0.00%"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
