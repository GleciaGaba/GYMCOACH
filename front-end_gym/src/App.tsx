// src/App.tsx
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import AppRouter from "./routes/AppRouter";

const App = () => (
  <>
    <Header />
    <AppRouter />
    <Footer />
  </>
);

export default App;
