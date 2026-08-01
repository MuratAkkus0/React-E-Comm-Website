import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useRefreshMutation } from "./api/authApi";

function App() {
  const isDarkTheme = useSelector((state) => state.ui.isDarkTheme);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    // Silently try to exchange the httpOnly refresh cookie (if any) for a
    // fresh access token on first load, so a returning user doesn't have
    // to log in again every time they open the app.
    refresh();
  }, [refresh]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkTheme ? "dark" : "light";
  }, [isDarkTheme]);

  return (
    <>
      <Toaster closeButton position="top-right" expand={false} richColors />
      <Header />
      <main className="app__main">
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

export default App;
