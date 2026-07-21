import React from "react";
import Menu from "./Menu";

const TopBar = () => {
  const marketIndices = [
    {
      name: "NIFTY 50",
      value: "25,090.70",
      change: "+0.42%",
      isPositive: true,
    },
    {
      name: "SENSEX",
      value: "81,796.15",
      change: "+0.35%",
      isPositive: true,
    },
  ];

  return (
    <div className="topbar-container">
      <div className="indices-container">
        {marketIndices.map((index) => (
          <div className="nivesha-market-index" key={index.name}>
            <div className="nivesha-index-heading">
              <span className="nivesha-index-live-dot"></span>
              <span>{index.name}</span>
            </div>

            <div className="nivesha-index-data">
              <strong>{index.value}</strong>

              <span
                className={
                  index.isPositive
                    ? "nivesha-index-positive"
                    : "nivesha-index-negative"
                }
              >
                <i
                  className={`fa ${
                    index.isPositive ? "fa-caret-up" : "fa-caret-down"
                  }`}
                  aria-hidden="true"
                ></i>

                {index.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
