// src/App.tsx

import { useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import AppRouter from "./routes/AppRouter";
import Footer from "./components/footer/Footer";

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="app-flex">
      {!isHomePage && <Header />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
};

export default App;
