import React from "react";
import "./App.css";
import 'antd/dist/antd.dark.css';
import PriceSetter from "./pages/PriceSetter";
import MarketPricer from "./pages/MarketPricer";

function App() {
  return <div className="App">
    {/* <PriceSetter /> */}
    <MarketPricer />
  </div>;
}

export default App;
