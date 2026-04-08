import React from "react";
import { Route, Routes } from "react-router-dom";

import PlatformsPage from "./PlatformsPage";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      
      {/* LEFT SIDE WATCHLIST */}
      <GeneralContextProvider>
        <WatchList />
      </GeneralContextProvider>

      {/* RIGHT SIDE CONTENT */}
      <div className="content">
        <Routes>
          {/* DEFAULT PAGE */}
          <Route path="/" element={<Summary />} />

          <Route path="orders" element={<Orders />} />
          <Route path="holdings" element={<Holdings />} />
          <Route path="positions" element={<Positions />} />
          <Route path="funds" element={<Funds />} />
          <Route path="platforms" element={<PlatformsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;