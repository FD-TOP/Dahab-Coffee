import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import Stores from "./pages/Stores";
import Franchise from "./pages/Franchise";
import About from "./pages/About";
import Join from "./pages/Join";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="stores" element={<Stores />} />
          <Route path="franchise" element={<Franchise />} />
          <Route path="a-propos" element={<About />} />
          <Route path="recrutement" element={<Join />} />
        </Route>
      </Routes>
    </>
  );
}
