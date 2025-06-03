// src/App.tsx
import React from "react";
import Header from "./components/header/Header";
import AppRouter from "./routes/AppRouter";
import Footer from "./components/footer/Footer";

const App = () => (
  <div className="app-flex">
    <Header />
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <AppRouter />
    </div>
    <Footer />
  </div>
);

export default App;
