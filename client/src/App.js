import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import translations from "./translations";
import Navbar from "./components/Navbar";
import Hero from "./components/Header/Hero";
import About from "./components/About/About";
import Products from "./components/Products/Products";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Premium404Page from "./pages/404Page";

const AnimatedPage = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div
      className={`transition-opacity duration-700 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

function App() {
  const [language, setLanguage] = useState("en");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [pendingScrollId, setPendingScrollId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return stored === "dark" || (!stored && prefersDark);
  });

  const location = useLocation();
  const t = translations[language];

  // Sync dark mode with HTML class and localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Sync admin login from localStorage
  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") === "true") {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Smooth scroll handler
  const scrollToSection = (id) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(null, null, `#${id}`);
      }
    } else {
      setPendingScrollId(id);
    }
  };

  // Scroll on hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      scrollToSection(id);
    }
  }, [location]);

  // Retry scroll if element was not ready
  useEffect(() => {
    if (location.pathname === "/" && pendingScrollId) {
      const interval = setInterval(() => {
        const el = document.getElementById(pendingScrollId);
        if (el) {
          scrollToSection(pendingScrollId);
          setPendingScrollId(null);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [location.pathname, pendingScrollId]);

  // Language toggle
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <div className="min-h-screen bg-cream dark:bg-olive-dark transition-colors duration-500">
              <Navbar
                t={t}
                language={language}
                toggleLanguage={toggleLanguage}
                scrollToSection={scrollToSection}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
              <main id="home">
                <Hero t={t} darkMode={darkMode} />
                <About id="about" t={t} darkMode={darkMode} />
                <Products id="products" t={t} darkMode={darkMode} />
                <Contact id="contact" t={t} darkMode={darkMode} />
              </main>
              <Footer t={t} darkMode={darkMode} />
              <ScrollToTopButton />
            </div>
          </AnimatedPage>
        }
      />

      {/* Optional: add protected/admin routes here if needed */}

      <Route
        path="*"
        element={
          <AnimatedPage>
            <Premium404Page />
          </AnimatedPage>
        }
      />
    </Routes>
  );
}

export default App;
