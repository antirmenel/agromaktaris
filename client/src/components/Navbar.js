import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Lazy load icons from lucide-react
const iconImports = {
  Globe: lazy(() => import("lucide-react").then(mod => ({ default: mod.Globe }))),
  Menu: lazy(() => import("lucide-react").then(mod => ({ default: mod.Menu }))),
  X: lazy(() => import("lucide-react").then(mod => ({ default: mod.X }))),
  Sun: lazy(() => import("lucide-react").then(mod => ({ default: mod.Sun }))),
  Moon: lazy(() => import("lucide-react").then(mod => ({ default: mod.Moon }))),
  MapPin: lazy(() => import("lucide-react").then(mod => ({ default: mod.MapPin }))),
  Mail: lazy(() => import("lucide-react").then(mod => ({ default: mod.Mail }))),
  Phone: lazy(() => import("lucide-react").then(mod => ({ default: mod.Phone }))),
  Info: lazy(() => import("lucide-react").then(mod => ({ default: mod.Info }))),
};

const {
  Globe,
  Menu,
  X,
  Sun,
  Moon,
  MapPin,
  Mail,
  Phone,
  Info,
} = iconImports;

const NAVBAR_HEIGHT_LG = 64;
const NAVBAR_HEIGHT_SM = 48;

const oliveColors = {
  olive800: "hsl(91, 41%, 33%)",
  olive700: "hsl(92, 38%, 39%)",
  olive600: "hsl(93, 34%, 45%)",
  olive500: "hsl(94, 30%, 51%)",
  oliveDark: "hsl(95, 30%, 20%)",
  oliveDarker: "hsl(95, 35%, 15%)",
  cream: "hsl(60, 29%, 96%)",
  gold: "hsl(45, 100%, 50%)",
  lightGold: "hsl(45, 100%, 85%)",
};

// Mobile menu component (memoized)
const MobileMenu = React.memo(
  ({
    isOpen,
    darkMode,
    navItems,
    handleNavigation,
    activeSection,
    getTextColor,
    closeMenu,
  }) => {
    const menuRef = useRef(null);
    if (!isOpen) return null;

    return (
      <div
        ref={menuRef}
        className="lg:hidden shadow-xl px-5 py-3 space-y-2 border-t backdrop-blur-md rounded-b-md fixed top-16 left-0 w-full z-[104]"
        style={{
          backgroundColor: darkMode ? oliveColors.olive800 : oliveColors.cream,
          borderColor: darkMode ? oliveColors.olive600 : oliveColors.olive500,
        }}
      >
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={e => {
              e.preventDefault();
              handleNavigation(id);
            }}
            className="w-full text-left px-4 py-2 font-medium rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400"
            style={{ color: getTextColor(activeSection === id) }}
          >
            <div className="flex items-center justify-between">
              <span>{label}</span>
              {activeSection === id && (
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }
);

// Contact tooltip component (memoized)
const ContactTooltip = React.memo(({ show, darkMode }) => {
  if (!show) return null;

  return (
    <div
      className="fixed top-16 left-6 z-[105] p-4 rounded-md shadow-2xl text-sm max-w-xs border backdrop-blur-md"
      style={{
        backgroundColor: darkMode ? oliveColors.olive800 : oliveColors.cream,
        color: darkMode ? oliveColors.cream : oliveColors.olive800,
        borderColor: darkMode ? oliveColors.olive600 : oliveColors.olive500,
      }}
    >
      <div className="flex items-center gap-3 mb-3 font-medium tracking-wide">
        <Suspense fallback={<div className="w-4 h-4" />}>
          <MapPin className="w-4 h-4" />
        </Suspense>
        <span>Makther siliyana Tunisia</span>
      </div>
      <div className="flex items-center gap-3 mb-3 font-medium tracking-wide">
        <Suspense fallback={<div className="w-4 h-4" />}>
          <Mail className="w-4 h-4" />
        </Suspense>
        <a
          href="mailto:agromaktaris@gmail.com"
          className="underline hover:no-underline transition-colors"
          style={{ color: darkMode ? oliveColors.gold : oliveColors.olive600 }}
        >
          agromaktaris@gmail.com
        </a>
      </div>
      <div className="flex items-center gap-3 font-medium tracking-wide">
        <Suspense fallback={<div className="w-4 h-4" />}>
          <Phone className="w-4 h-4" />
        </Suspense>
        <a
          href="tel:+1234567890"
          className="underline hover:no-underline transition-colors"
          style={{ color: darkMode ? oliveColors.gold : oliveColors.olive600 }}
        >
          +1 234 567 890
        </a>
      </div>
    </div>
  );
});

export default function Navbar({
  t,
  id,
  language,
  toggleLanguage,
  darkMode,
  toggleDarkMode,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showContactTooltip, setShowContactTooltip] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [scrollUpdateRequested, setScrollUpdateRequested] = useState(false);

  const mobileMenuRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const navigateRouter = useNavigate();
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { id: "home", label: t.nav.home },
      { id: "about", label: t.nav.about },
      { id: "products", label: t.nav.products },
      { id: "contact", label: t.nav.contact },
    ],
    [t]
  );

  // Detect screen size and reduced motion preference
  useEffect(() => {
    const checkScreenSize = () => {
      const small = window.innerWidth < 640;
      setIsSmallScreen(small);
      if (small) setReduceMotion(true);
    };

    checkScreenSize();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches || window.innerWidth < 640);

    const handler = e => setReduceMotion(e.matches || window.innerWidth < 640);
    mediaQuery.addEventListener("change", handler);
    window.addEventListener("resize", checkScreenSize);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Scroll to section with offset for navbar height
  const scrollToSection = useCallback(
    sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = isSmallScreen ? NAVBAR_HEIGHT_SM : NAVBAR_HEIGHT_LG;
        let offset = sectionId === "home" ? 0 : element.offsetTop - navbarHeight - 20;

        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    },
    [isSmallScreen]
  );

  const closeMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setShowContactTooltip(false);
  }, []);

  // Handle navigation and URL updates
  const handleNavigation = useCallback(
    sectionId => {
      setActiveSection(sectionId);
      closeMenu();

      if (location.pathname !== "/") {
        navigateRouter(`/#${sectionId}`);
        setTimeout(() => scrollToSection(sectionId), 50);
      } else {
        window.history.replaceState(null, null, `/#${sectionId}`);
        scrollToSection(sectionId);
      }
    },
    [location.pathname, navigateRouter, scrollToSection, closeMenu]
  );

  // Scroll event handler for updating navbar state and active section
  useEffect(() => {
    const onScroll = () => {
      if (!scrollUpdateRequested) {
        setScrollUpdateRequested(true);
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          const scrollPosition = window.scrollY;
          const navbarHeight = isSmallScreen ? NAVBAR_HEIGHT_SM : NAVBAR_HEIGHT_LG;

          let current = "home";
          if (scrollPosition < navbarHeight) {
            current = "home";
          } else {
            for (const { id } of navItems) {
              if (id === "home") continue;
              const el = document.getElementById(id);
              if (el) {
                const elTop = el.offsetTop - navbarHeight - 20;
                const elHeight = el.offsetHeight;
                if (scrollPosition >= elTop && scrollPosition < elTop + elHeight) {
                  current = id;
                  break;
                }
              }
            }
          }
          setActiveSection(current);
          setScrollUpdateRequested(false);
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navItems, isSmallScreen, scrollUpdateRequested]);

  // Close menu on outside click or Escape key
  useEffect(() => {
    const onClickOutside = e => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest("button[aria-label='Toggle mobile menu']") &&
        !e.target.closest("button[aria-label='Toggle contact info']")
      ) {
        closeMenu();
      }
    };

    const onKeyDown = e => {
      if (e.key === "Escape") {
        if (isMobileMenuOpen) closeMenu();
        if (showContactTooltip) setShowContactTooltip(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen, showContactTooltip, closeMenu]);

  // Manage focus when mobile menu opens/closes
  useEffect(() => {
    if (isMobileMenuOpen) {
      previouslyFocusedRef.current = document.activeElement;
    } else {
      setTimeout(() => previouslyFocusedRef.current?.focus(), 0);
    }
  }, [isMobileMenuOpen]);

  // Determine text color based on active state and dark mode
  const getTextColor = (isActive = false) => {
    if (isActive) {
      return darkMode ? oliveColors.gold : oliveColors.olive700;
    }
    return darkMode ? oliveColors.cream : oliveColors.olive600;
  };

  const contactBarStyle = {
    background: darkMode
      ? `linear-gradient(135deg, ${oliveColors.oliveDarker} 0%, ${oliveColors.oliveDark} 100%)`
      : `linear-gradient(135deg, ${oliveColors.olive800} 0%, ${oliveColors.olive700} 100%)`,
  };

  const navbarVariants = {
    initial: {
      backgroundColor: darkMode ? oliveColors.olive800 : oliveColors.cream,
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
      borderBottom: `1px solid ${darkMode ? oliveColors.olive600 : "rgba(75, 83, 32, 0.1)"}`,
    },
    scrolledLight: {
      backgroundColor: "rgba(245, 245, 220, 0.98)",
      backdropFilter: "saturate(180%) blur(18px)",
      boxShadow: "0 8px 40px rgba(75, 83, 32, 0.15)",
      borderBottom: "1px solid rgba(75, 83, 32, 0.2)",
    },
    scrolledDark: {
      backgroundColor: "rgba(39, 52, 18, 0.98)",
      backdropFilter: "saturate(180%) blur(18px)",
      boxShadow: "0 8px 40px rgba(0, 0, 0, 0.45)",
      borderBottom: "1px solid rgba(147, 163, 45, 0.3)",
    },
  };

  const navbarState = isScrolled
    ? darkMode
      ? "scrolledDark"
      : "scrolledLight"
    : "initial";

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-2 left-2 z-[110] px-4 py-2 rounded-md focus-visible:ring-4 focus-visible:ring-yellow-400 font-medium tracking-tight"
        style={{
          backgroundColor: darkMode ? oliveColors.olive800 : oliveColors.cream,
          color: darkMode ? oliveColors.cream : oliveColors.olive800,
        }}
      >
        Skip to content
      </a>

      <div className="fixed top-0 left-0 w-full z-[100]" id={id}>
        {/* Contact bar (visible on sm and up) */}
        <div
          className="w-full text-sm flex items-center justify-center gap-4 px-6 py-1 shadow-md hidden sm:flex select-none"
          style={contactBarStyle}
        >
          <div className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors cursor-default font-medium tracking-wide">
            <Suspense fallback={<div className="w-3.5 h-3.5" />}>
              <MapPin className="w-3.5 h-3.5" />
            </Suspense>
            <span>Makther siliyana Tunisia</span>
          </div>
          <div className="w-px h-4 bg-white/20" aria-hidden="true" />
          <a
            href="mailto:agromaktaris@gmail.com"
            className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors hover:underline font-medium tracking-wide"
          >
            <Suspense fallback={<div className="w-3.5 h-3.5" />}>
              <Mail className="w-3.5 h-3.5" />
            </Suspense>
            <span>agromaktaris@gmail.com</span>
          </a>
          <div className="w-px h-4 bg-white/20" aria-hidden="true" />
          <a
            href="tel:+1234567890"
            className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors hover:underline font-medium tracking-wide"
          >
            <Suspense fallback={<div className="w-3.5 h-3.5" />}>
              <Phone className="w-3.5 h-3.5" />
            </Suspense>
            <span>+1 234 567 890</span>
          </a>
        </div>

        {/* Navigation bar */}
        <motion.nav
          className="w-full"
          role="navigation"
          aria-label="Primary Navigation"
          variants={reduceMotion ? null : navbarVariants}
          initial="initial"
          animate={navbarState}
        >
          <div
            className={`w-full flex items-center justify-between px-6 sm:px-10 lg:px-14 ${
              isSmallScreen ? "h-12" : "h-16"
            }`}
          >
            {/* Logo / Home button */}
            <button
              onClick={() => handleNavigation("home")}
              className="flex items-center gap-2 sm:text-2xl text-lg font-serif font-semibold tracking-tight focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 rounded-md px-2 py-1 select-none"
              aria-label="Agro Maktaris Homepage"
              style={{ color: getTextColor() }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
                Agro Maktaris
              </span>
            </button>

            {/* Desktop navigation items */}
            <div className="hidden lg:flex items-center space-x-4 font-medium tracking-tight text-base mx-auto">
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleNavigation(id)}
                  className="relative px-4 py-2 rounded-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 transition-colors duration-300"
                  aria-label={`Navigate to ${label}`}
                  aria-current={activeSection === id ? "page" : undefined}
                  style={{
                    color: getTextColor(activeSection === id),
                    backgroundColor:
                      activeSection === id
                        ? darkMode
                          ? "rgba(147, 163, 45, 0.1)"
                          : "rgba(75, 83, 32, 0.1)"
                        : "transparent",
                  }}
                >
                  {label}
                  {activeSection === id && (
                    <div
                      className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-yellow-500"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Controls: language, dark mode, contact info, mobile menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1 rounded-md font-medium tracking-tight focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 transition-colors duration-300"
                title="Toggle Language"
                style={{ color: getTextColor() }}
              >
                <Suspense fallback={<div className="w-5 h-5" />}>
                  <Globe className="w-5 h-5" />
                </Suspense>
                <span className="text-sm">{language.toUpperCase()}</span>
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 transition-colors duration-300"
                aria-label="Toggle Dark Mode"
                title="Toggle Dark Mode"
                style={{ color: getTextColor() }}
              >
                <Suspense fallback={<div className="w-5 h-5" />}>
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Suspense>
              </button>

              <button
                onClick={() => setShowContactTooltip(v => !v)}
                className="lg:hidden p-2 rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 transition-colors duration-300"
                aria-label="Toggle contact info"
                title="Contact Info"
                style={{ color: getTextColor() }}
              >
                <Suspense fallback={<div className="w-5 h-5" />}>
                  <Info className="w-5 h-5" />
                </Suspense>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(v => !v);
                  setShowContactTooltip(false);
                }}
                className="lg:hidden p-2 rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 transition-colors duration-300"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                style={{ color: getTextColor() }}
              >
                <Suspense fallback={<div className="w-5 h-5" />}>
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Suspense>
              </button>
            </div>
          </div>

          <MobileMenu
            isOpen={isMobileMenuOpen}
            darkMode={darkMode}
            navItems={navItems}
            handleNavigation={handleNavigation}
            activeSection={activeSection}
            getTextColor={getTextColor}
            closeMenu={closeMenu}
          />
        </motion.nav>
      </div>

      <ContactTooltip show={showContactTooltip} darkMode={darkMode} />
    </>
  );
}
