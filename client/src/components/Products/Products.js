import React, { useEffect, useState, useRef } from "react";
import {
  Leaf,
  Sun,
  Droplet,
  Star,
  Award,
  Shield,
  Heart,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// Scroll Indicator with bounce animation
const ScrollIndicator = () => {
  useEffect(() => {
    const bounceKeyframes = `
      @keyframes bounce {
        0%, 100% { opacity: 0; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(10px); }
      }
    `;
    const style = document.createElement("style");
    style.textContent = bounceKeyframes;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      style={{ animation: "bounce 2s infinite ease-in-out" }}
      aria-label="Scroll down indicator"
    >
      <ChevronDown className="w-8 h-8 text-yellow-400" />
    </div>
  );
};

// Animation wrapper for fade/scale effects on scroll into view
const AnimatedElement = ({
  children,
  className = "",
  delay = 0,
  animation = "fadeUp",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold: 0.1, rootMargin: "-100px" }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [delay, hasAnimated]);

  const baseClasses = "transition-all duration-800 ease-out";
  const animationStyles = {
    fadeUp: isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
    scaleIn: isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
    default: isVisible ? "opacity-100" : "opacity-0",
  };

  return (
    <div
      ref={elementRef}
      className={`${baseClasses} ${animationStyles[animation] || animationStyles.default} ${className}`}
    >
      {children}
    </div>
  );
};

// Individual product card component
const ProductCard = ({ product, isDark, theme, index, translations }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [iconAnimated, setIconAnimated] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIconAnimated(true), 500 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    const img = new Image();
    img.src = product.image;
    img.onload = () => setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  }, [product.image]);

  const IconComponent = {
    Award,
    Leaf,
    Sun,
    Heart,
    Shield,
    Star,
    Droplet,
    CheckCircle,
  }[product.icon];

  const toggleZoom = () => setIsZoomed((v) => !v);
  const featureKeys = Object.keys(translations.featureLabels);

  return (
    <>
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={toggleZoom}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <div
        className={`group min-h-[540px] h-full transition-all duration-300 ${
          isHovered ? "transform -translate-y-3 scale-105" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          filter: isHovered
            ? isDark
              ? "drop-shadow(0 20px 40px rgba(255, 215, 0, 0.25))"
              : "drop-shadow(0 20px 40px rgba(85, 107, 47, 0.25))"
            : "none",
        }}
      >
        <div
          className="p-6 h-full flex flex-col justify-between rounded-sm backdrop-blur-xl text-center relative z-20"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(0,0,0,0.2))"
              : "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(245,245,220,0.4))",
            border: isDark
              ? "1px solid rgba(255,215,0,0.2)"
              : "1px solid rgba(255,255,255,0.2)",
            boxShadow: "inset 0 0 0.5px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div className="mb-6 relative">
            <div
              className="mx-auto w-full h-52 relative flex justify-center items-center cursor-zoom-in"
              style={{ minWidth: 144, minHeight: 208 }}
              onClick={toggleZoom}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleZoom()}
              aria-label={`Zoom image of ${product.name}`}
            >
              <img
                ref={imageRef}
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110"
              />
              <div
                className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  iconAnimated ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                style={{
                  background: "linear-gradient(135deg, rgba(255,215,0,0.9), rgba(255,193,7,0.9))",
                  boxShadow: "0 4px 12px rgba(255,215,0,0.3)",
                }}
              >
                {IconComponent && <IconComponent className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <span
                  className="text-xs font-medium px-2 py-1"
                  style={{
                    background: isDark ? "rgba(255,215,0,0.2)" : "rgba(85,107,47,0.2)",
                    color: isDark ? theme.goldLight : theme.olive800,
                  }}
                >
                  {product.variety}
                </span>
              </div>
              <h3
                className="font-bold text-xl mb-3"
                style={{ color: isDark ? theme.goldLight : theme.olive800 }}
              >
                {product.name}
              </h3>
              <p
                className="text-sm mb-4"
                style={{
                  color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)",
                }}
              >
                {product.description}
              </p>
            </div>

            <div className="mt-6 text-xs">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th
                      className="pb-2 text-yellow-400 font-semibold"
                      style={{ minWidth: 130 }}
                    >
                      Feature
                    </th>
                    <th className="pb-2 text-yellow-400 font-semibold">Included</th>
                  </tr>
                </thead>
                <tbody>
                  {featureKeys.map((key, idx) => (
                    <tr
                      key={key}
                      className="border-t border-yellow-100/20"
                      style={{
                        backgroundColor:
                          idx % 2 === 0
                            ? isDark
                              ? "rgba(255,215,0,0.05)"
                              : "rgba(255, 255, 224, 0.3)"
                            : "transparent",
                      }}
                    >
                      <td className="py-1 pr-4">{translations.featureLabels[key]}</td>
                      <td className="py-1">
                        {product.features.includes(key) ? (
                          <CheckCircle className="w-4 h-4 text-yellow-400 inline-block" />
                        ) : (
                          <span className="text-gray-400 select-none">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Color themes
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

// Main Products section component
const Products = ({ t, id }) => {
  const [isDark, setIsDark] = useState(false);
  const sectionRef = useRef(null);

  // Cursor motion values for parallax effect
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Parallax transforms
  const parallaxX = useTransform(cursorX, (x) => ((x / window.innerWidth) * 2 - 1) * 5);
  const parallaxY = useTransform(cursorY, (y) => ((y / window.innerHeight) * 2 - 1) * 5);

  useEffect(() => {
    const updateTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY]);

  const theme = isDark ? COLORS.dark : COLORS.light;
  const translations = t.products;

  // Helpers for highlighted text
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

  const renderTextWithBreaks = (text) =>
    text.split("<br/>").map((part, idx, arr) => (
      <span key={idx} style={{ lineHeight: 1.1, letterSpacing: "0.02em" }}>
        {highlightText(part)}
        {idx < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 px-6 sm:px-10 lg:px-20 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: theme.bg, opacity: 0.95 }} />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" /%3E%3C/svg%3E')",
          }}
        />
      </div>

      {/* Radial Gradient Glow with Parallax */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 opacity-10 z-10 rounded-full"
        style={{
          background: `radial-gradient(circle, ${isDark ? theme.gold : theme.olive600} 0%, transparent 70%)`,
          filter: "blur(40px)",
          willChange: "transform",
          x: parallaxX,
          y: parallaxY,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        viewport={{ once: true, amount: 0.3 }}
      />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Title and Description */}
        <AnimatedElement animation="fadeUp">
          <div className="text-center mb-16">
            <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-sm backdrop-blur-xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ color: theme.text }}>
                {renderTextWithBreaks(translations.title)}
              </h2>
              <p
                className="text-lg sm:text-xl font-light"
                style={{ color: isDark ? "rgba(255,255,255,0.85)" : theme.olive800 }}
              >
                {translations.description}
              </p>
            </div>
          </div>
        </AnimatedElement>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {translations.items.map((product, i) => (
            <ProductCard
              key={i}
              product={product}
              isDark={isDark}
              theme={theme}
              index={i}
              translations={translations}
            />
          ))}
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default Products;
