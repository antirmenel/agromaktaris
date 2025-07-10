import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  ChevronDown,
  Award,
  Leaf,
  Sun,
  Droplet,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
    text: "hsl(60, 29%, 96%)", // same as dark theme text color
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const pulse = {
  animate: { y: [0, 6, 0, 6, 0] },
};

const icons = [Award, Leaf, Sun, Droplet, Calendar];

const Hero = ({ t, lang = "en" }) => {
  const [isDark, setIsDark] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [ripple, setRipple] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  const controls = useAnimation();
  const cursorRef = useRef({ x: -100, y: -100 });
  const intervalRef = useRef(null);

  const oliveGroveImages = [
    { src: "/olive1.jpg", alt: "Olive Grove 1" },
    { src: "/olive2.jpg", alt: "Olive Grove 2" },
  ];

  // Preload images
  useEffect(() => {
    oliveGroveImages.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Detect dark mode changes
  const updateTheme = useCallback(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [updateTheme]);

  // Reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    prefersReducedMotion ? controls.set("visible") : controls.start("visible");
  }, [controls]);

  // Track mouse position normalized (-1 to 1)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth cursor animation following mouse
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
    const rippleLoop = (timestamp, start = timestamp) => {
      setRipple(((timestamp - start) / 3000) % 1);
      requestAnimationFrame((t) => rippleLoop(t, start));
    };
    requestAnimationFrame(rippleLoop);
  }, []);

  // Carousel auto-advance interval
  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % oliveGroveImages.length);
    }, 5000);
  }, [oliveGroveImages.length]);

  // Manage interval based on hover state
  useEffect(() => {
    if (!isHoveringCarousel) startInterval();
    return () => clearInterval(intervalRef.current);
  }, [isHoveringCarousel, startInterval]);

  // Carousel navigation handlers
  const handleNext = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % oliveGroveImages.length);
    if (!isHoveringCarousel) startInterval();
  }, [oliveGroveImages.length, isHoveringCarousel, startInterval]);

  const handlePrev = useCallback(() => {
    setCurrentImage((prev) =>
      (prev - 1 + oliveGroveImages.length) % oliveGroveImages.length
    );
    if (!isHoveringCarousel) startInterval();
  }, [oliveGroveImages.length, isHoveringCarousel, startInterval]);

  const theme = isDark ? COLORS.dark : COLORS.light;

  const parallax = { x: mousePos.x * 10, y: mousePos.y * 10 };

  const glowColor = isDark
    ? `rgba(255, 215, 0, ${0.4 + 0.15 * Math.sin(ripple * 2 * Math.PI)})`
    : `rgba(181, 196, 142, ${0.4 + 0.15 * Math.sin(ripple * 2 * Math.PI)})`;

  // Highlight text wrapped in <highlight> tags with gradient
  const highlightText = (text) =>
    text.split(/(<highlight>.*?<\/highlight>)/g).map((segment, i) =>
      segment.startsWith("<highlight>") ? (
        <span
          key={i}
          className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 font-serif"
        >
          {segment.replace(/<\/?highlight>/g, "")}
        </span>
      ) : (
        <span key={i}>{segment}</span>
      )
    );

  // Render text with <br/> line breaks
  const renderTextWithBreaks = (text) =>
    text.split("<br/>").map((part, i, arr) => (
      <span key={i} style={{ lineHeight: 1.1, letterSpacing: "0.02em" }}>
        {highlightText(part)}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 px-6 sm:px-10 lg:px-20"
      style={{ overflow: "visible" }}
    >
      {/* Cursor Glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          borderRadius: "50%",
          width: 150,
          height: 150,
          transform: `translate3d(${cursor.x - 75}px, ${cursor.y - 75}px, 0)`,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          mixBlendMode: "screen",
          filter: "blur(20px)",
          zIndex: 9999,
        }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-visible">
        <div
          className="absolute inset-0"
          style={{ background: theme.bg, opacity: 0.6 }}
        />
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

      {/* Background Image Carousel with Navigation */}
      <div
        className="absolute inset-0 z-10 overflow-hidden"
        onMouseEnter={() => {
          setIsHoveringCarousel(true);
          clearInterval(intervalRef.current);
        }}
        onMouseLeave={() => {
          setIsHoveringCarousel(false);
          startInterval();
        }}
      >
        {oliveGroveImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${image.src})`,
              backgroundPosition: "center 40%",
              backgroundSize: "cover",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.9) 30%, transparent 100%)",
            }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{
              scale: currentImage === index ? 1 : 1.1,
              opacity: currentImage === index ? 1 : 0,
              ...(currentImage === index ? parallax : {}),
            }}
            transition={{
              duration: 1.2,
              ease: [0.83, 0, 0.17, 1],
              opacity: { duration: 0.8 },
            }}
          >
            {/* Overlay for clarity */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          </motion.div>
        ))}

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full backdrop-blur-md bg-black/20 hover:bg-black/30 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full backdrop-blur-md bg-black/20 hover:bg-black/30 transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl w-full text-center space-y-10 sm:space-y-12 px-4 sm:px-6 lg:px-0">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] drop-shadow-lg"
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          style={{
            color: theme.text,
            textShadow: isDark
              ? "0 2px 10px rgba(0,0,0,0.5)"
              : "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {highlightText(t.hero.title)}
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl font-light max-w-prose mx-auto drop-shadow-md"
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{
            color: "rgba(255, 255, 255, 0.9)",
            textShadow: isDark
              ? "0 1px 3px rgba(0,0,0,0.5)"
              : "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {renderTextWithBreaks(t.hero.description)}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
          }}
        >
          {t.hero.premiumFeatures.map(({ title, description }, i) => {
            const IconComponent = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                className="p-6 rounded-md shadow-lg backdrop-blur-xl border text-center transition-all duration-300 group"
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  boxShadow: isDark
                    ? "0 20px 40px rgba(255, 215, 0, 0.25)"
                    : "0 20px 40px rgba(85, 107, 47, 0.25)",
                }}
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(0,0,0,0.2))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(245,245,220,0.4))",
                  borderColor: isDark ? "rgba(255,215,0,0.2)" : "rgba(85,107,47,0.2)",
                }}
              >
                <div
                  className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? "bg-yellow-900/40" : "bg-yellow-200/60"
                  } transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(255,215,0,0.7)]`}
                >
                  <IconComponent className="w-5 h-5 text-yellow-400" strokeWidth={2.5} />
                </div>

                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: isDark ? theme.goldLight : theme.olive800 }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm opacity-90"
                  style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.8)" }}
                >
                  {description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.a
          href="#products"
          className="text-xs font-medium tracking-widest uppercase flex flex-col items-center group mt-10"
          style={{ color: isDark ? "rgba(255,255,255,0.8)" : theme.olive600 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="mb-2">{t.hero.scrollIndicator}</span>
          <motion.div
            className="relative"
            animate={pulse.animate}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1 }}
          >
            <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
            <motion.div
              className="absolute inset-0 rounded-full border opacity-0 group-hover:opacity-100"
              style={{ borderColor: isDark ? theme.gold : theme.olive600 }}
              animate={{ scale: [1, 1.5], opacity: [0, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
