import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function RootLayout() {
  const location = useLocation();
  const isWindowsOnArmPage = location.pathname === "/learn/windows-on-arm";
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Header />
      <main
        id="main-content"
        className={`flex-1 ${isWindowsOnArmPage || isHomePage ? "pt-0" : "pt-24"}`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
