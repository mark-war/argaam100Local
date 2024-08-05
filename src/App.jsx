import "./App.css";
// import { useLocation } from "react-router-dom";
// import Screener from "./components/common/PageSubHeader";
// import ScreenerTopCompanies from "./components/common/TopCompaniesSubHeader";

import AppRoutes from "./components/routes/AppRoutes";

function App() {
  // const ScreenerOrTopCompanies = () => {
  //   const location = useLocation();

  //   if (
  //     location.pathname === "/top-10" ||
  //     location.pathname === "/ranking" ||
  //     location.pathname === "/stock-performance" ||
  //     location.pathname === "/arr-multiple" ||
  //     location.pathname === "/financial-ratios-top-companies" ||
  //     location.pathname === "/growth-and-dividends"
  //   ) {
  //     return <ScreenerTopCompanies />;
  //   } else {
  //     return <Screener />;
  //   }
  // };

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
