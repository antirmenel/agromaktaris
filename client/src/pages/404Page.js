import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { Home, ArrowLeft, Globe, Sun, Moon, AlertCircle, Compass } from "lucide-react";

const COLORS = {
  dark: {
    olive800: "hsl(91, 41%, 23%)",
    olive700: "hsl(92, 38%, 29%)",
    gold: "hsl(45, 100%, 50%)",
    goldLight: "hsl(45, 100%, 70%)",
    text: "hsl(60, 29%, 96%)",
    bg: `linear-gradient(145deg, hsl(91, 41%, 23%) 0%, hsl(92, 38%, 29%) 100%)`,
  },
  light: {
    olive800: "hsl(91, 41%, 28%)",
    olive600: "hsl(93, 34%, 35%)",
    cream: "hsl(60, 29%, 98%)",
    bg: `linear-gradient(145deg, hsl(60, 29%, 98%) 0%, white 100%)`,
    text: "hsl(91, 41%, 28%)",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const float = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, -2, 0],
  },
};

const glitch = {
  animate: {
    x: [0, -2, 2, -1, 1, 0],
    filter: [
      "hue-rotate(0deg)",
      "hue-rotate(90deg)",
      "hue-rotate(180deg)",
      "hue-rotate(270deg)",
      "hue-rotate(360deg)",
    ],
  },
};

const RIPPLE_DURATION = 3000;
const CURSOR_GLOW_SIZE = 150;

const IconButton = React.memo(({ onClick, title, ariaLabel, isDark, children, styleOverrides = {} }) => {
  const baseStyle = {
    background: isDark
      ? "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(0,0,0,0.15))"
      : "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(245,245,220,0.3))",
    borderColor: isDark ? "rgba(255,215,0,0.15)" : "rgba(85,107,47,0.15)",
    color: isDark ? COLORS.dark.gold : COLORS.light.olive600,
    transition: "all 0.3s",
  };

  return (
    <motion.button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      className="p-2 rounded-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-4"
      style={{ ...baseStyle, ...styleOverrides }}
      whileHover={{
        scale: 1.05,
        boxShadow: isDark
          ? "0 8px 25px rgba(255, 215, 0, 0.25)"
          : "0 8px 25px rgba(85, 107, 47, 0.25)",
      }}
      whileTap={{ scale: 0.95 }}
      type="button"
    >
      {children}
    </motion.button>
  );
});

const Premium404Page = () => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("en");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [ripple, setRipple] = useState(0);
  const controls = useAnimation();
  const cursorRef = useRef({ x: -100, y: -100 });

  // Load theme and language from localStorage and system preferences
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(storedTheme === "dark" || (!storedTheme && prefersDark));

    const storedLang = localStorage.getItem("language") || "en";
    setLanguage(storedLang);
  }, []);

  // Animate controls respecting reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    prefersReducedMotion ? controls.set("visible") : controls.start("visible");
  }, [controls]);

  // Throttled mousemove event handler using requestAnimationFrame
  useEffect(() => {
    let frameId = null;

    const handleMouseMove = (e) => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePos({ x, y });
        cursorRef.current = { x: e.clientX, y: e.clientY };
        frameId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Smooth cursor animation loop
  useEffect(() => {
    const animateCursor = () => {
      setCursor((prev) => {
        const dx = cursorRef.current.x - prev.x;
        const dy = cursorRef.current.y - prev.y;
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return prev;
        return { x: prev.x + dx * 0.15, y: prev.y + dy * 0.15 };
      });
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }, []);

  // Ripple animation loop
  useEffect(() => {
    const rippleLoop = (ts, start = ts) => {
      setRipple(((ts - start) / RIPPLE_DURATION) % 1);
      requestAnimationFrame((t) => rippleLoop(t, start));
    };
    requestAnimationFrame(rippleLoop);
  }, []);

  const theme = isDark ? COLORS.dark : COLORS.light;
  const glowColor = isDark
    ? `rgba(255, 215, 0, ${0.4 + 0.15 * Math.sin(ripple * 2 * Math.PI)})`
    : `rgba(181, 196, 142, ${0.4 + 0.15 * Math.sin(ripple * 2 * Math.PI)})`;

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === "en" ? "fr" : "en";
      localStorage.setItem("language", next);
      return next;
    });
  }, []);

  const getTextColor = useCallback(
    (isActive = false) => {
      if (isActive) return isDark ? COLORS.dark.gold : COLORS.light.olive600;
      return isDark ? COLORS.dark.text : COLORS.light.text;
    },
    [isDark]
  );

  const handleGoHome = useCallback(() => {
    window.location.href = "/";
  }, []);

  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 lg:px-20"
      style={{ overflow: "visible" }}
    >
      {/* Aria-live region for language change announcements */}
      <div aria-live="polite" className="sr-only" key={language}>
        {language === "en" ? "Language switched to English" : "Langue changée en Français"}
      </div>

      {/* Top Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-3">
        <IconButton onClick={toggleLanguage} title="Toggle Language" isDark={isDark}>
          <Globe className="w-4 h-4" />
          <span className="text-sm font-semibold">{language.toUpperCase()}</span>
        </IconButton>

        <IconButton onClick={toggleDarkMode} title="Toggle Dark Mode" isDark={isDark}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </IconButton>
      </div>

      {/* Cursor Glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          borderRadius: "50%",
          width: CURSOR_GLOW_SIZE,
          height: CURSOR_GLOW_SIZE,
          transform: `translate3d(${cursor.x - CURSOR_GLOW_SIZE / 2}px, ${cursor.y - CURSOR_GLOW_SIZE / 2}px, 0)`,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          mixBlendMode: "screen",
          filter: "blur(20px)",
          zIndex: 9999,
        }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-visible">
        <div className="absolute inset-0" style={{ background: theme.bg, opacity: 0.95 }} />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" /%3E%3C/svg%3E')",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 opacity-20"
        animate={float.animate}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <AlertCircle className="w-8 h-8" style={{ color: theme.text }} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-16 opacity-20"
        animate={float.animate}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
      >
        <Compass className="w-6 h-6" style={{ color: theme.text }} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl w-full text-center space-y-8 px-4 sm:px-6 lg:px-0">
        {/* 404 Number */}
        <motion.div
          className="relative"
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-8xl sm:text-9xl lg:text-[12rem] font-bold tracking-tight leading-none select-none"
            style={{
              color: isDark ? "rgba(255, 215, 0, 0.9)" : theme.olive800,
              textShadow: isDark
                ? "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)"
                : "0 0 20px rgba(85, 107, 47, 0.2)",
            }}
            animate={glitch.animate}
            transition={{
              repeat: Infinity,
              duration: 0.5,
              ease: "easeInOut",
              repeatDelay: 8,
            }}
          >
            404
          </motion.h1>

          {/* Glowing underline */}
          <motion.div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 rounded-full"
            style={{
              width: "60%",
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.8), transparent)"
                : "linear-gradient(90deg, transparent, rgba(85, 107, 47, 0.8), transparent)",
              boxShadow: isDark
                ? "0 0 10px rgba(255, 215, 0, 0.5)"
                : "0 0 10px rgba(85, 107, 47, 0.3)",
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleX: [0.8, 1.2, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Error Messages */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.text }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 font-serif">
              {language === "en" ? "Oops!" : "Oups!"}
            </span>{" "}
            {language === "en" ? "Page Not Found" : "Page Non Trouvée"}
          </h2>

          <p
            className="text-lg font-light max-w-2xl mx-auto"
            style={{ color: isDark ? "rgba(255,255,255,0.85)" : theme.olive800 }}
            dangerouslySetInnerHTML={{
              __html:
                language === "en"
                  ? "The page you're looking for seems to have wandered off into the digital wilderness.<br/>Don't worry, we'll help you find your way back home."
                  : "La page que vous cherchez semble s'être égarée dans la nature numérique.<br/>Ne vous inquiétez pas, nous vous aiderons à retrouver votre chemin.",
            }}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
          }}
        >
          <motion.button
            onClick={handleGoHome}
            className="px-8 py-4 rounded-sm font-semibold text-lg transition-all duration-300 group flex items-center gap-3 min-w-[200px] justify-center"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(255,215,0,0.9), rgba(255,215,0,0.7))"
                : "linear-gradient(135deg, rgba(85,107,47,0.9), rgba(85,107,47,0.7))",
              color: isDark ? theme.olive800 : "white",
              boxShadow: isDark ? "0 8px 25px rgba(255, 215, 0, 0.3)" : "0 8px 25px rgba(85, 107, 47, 0.3)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: isDark
                ? "0 12px 35px rgba(255, 215, 0, 0.4)"
                : "0 12px 35px rgba(85, 107, 47, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            variants={fadeUp}
            type="button"
          >
            <Home className="w-5 h-5" />
            {language === "en" ? "Go Home" : "Accueil"}
          </motion.button>

          <motion.button
            onClick={handleGoBack}
            className="px-8 py-4 rounded-sm font-semibold text-lg transition-all duration-300 group flex items-center gap-3 min-w-[200px] justify-center backdrop-blur-xl border"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(0,0,0,0.15))"
                : "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(245,245,220,0.3))",
              borderColor: isDark ? "rgba(255,215,0,0.15)" : "rgba(85,107,47,0.15)",
              color: isDark ? theme.goldLight : theme.olive800,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: isDark
                ? "0 12px 35px rgba(255, 215, 0, 0.25)"
                : "0 12px 35px rgba(85, 107, 47, 0.25)",
            }}
            whileTap={{ scale: 0.95 }}
            variants={fadeUp}
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === "en" ? "Go Back" : "Retour"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Premium404Page;
