import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Award,
  Leaf,
  Sun,
  Droplet,
  Calendar,
  Users,
  Heart,
  Shield,
  CheckCircle,
  ChevronDown,
  X,
} from "lucide-react";
import { SiMinutemailer } from "react-icons/si";

// Section Divider Component
const SectionDivider = () => (
  <motion.div
    className="h-px w-full my-16 bg-gradient-to-r from-transparent via-yellow-300 to-transparent"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
    style={{ originX: 0, willChange: "transform" }}
    viewport={{ once: true, amount: 0.3 }}
  />
);

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

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const slideIn = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

// Inject shimmer keyframes once
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

if (typeof window !== "undefined" && !document.getElementById("shimmer-keyframes")) {
  const style = document.createElement("style");
  style.id = "shimmer-keyframes";
  style.innerHTML = shimmerKeyframes;
  document.head.appendChild(style);
}

// Scroll Indicator with bounce animation
const ScrollIndicator = () => (
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: [0, 1, 1, 0], y: [0, 10, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
    aria-label="Scroll down indicator"
    viewport={{ once: true, amount: 0.3 }}
  >
    <ChevronDown className="w-8 h-8 text-yellow-400" />
  </motion.div>
);

const About = ({ t, lang = "en", id }) => {
  const [isDark, setIsDark] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  // Cursor motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Parallax derived from cursor
  const parallaxX = useTransform(
    cursorX,
    (x) => ((x / window.innerWidth) * 2 - 1) * 5
  );
  const parallaxY = useTransform(
    cursorY,
    (y) => ((y / window.innerHeight) * 2 - 1) * 5
  );

  // Ripple animation value
  const ripple = useMotionValue(0);

  // Detect dark mode changes
  useEffect(() => {
    const updateTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Trigger animations when in view
  useEffect(() => {
    if (isInView) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      prefersReducedMotion ? controls.set("visible") : controls.start("visible");
    }
  }, [isInView, controls]);

  // Update cursor position on mouse move
  useEffect(() => {
    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY]);

  // Ripple animation loop
  useEffect(() => {
    let animationFrameId;
    let start;

    const rippleLoop = (timestamp) => {
      if (!start) start = timestamp;
      const progress = ((timestamp - start) / 3000) % 1;
      ripple.set(progress);
      animationFrameId = requestAnimationFrame(rippleLoop);
    };

    animationFrameId = requestAnimationFrame(rippleLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [ripple]);

  // Sticky CTA visibility on scroll
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [isFloatingCtaVisible, setIsFloatingCtaVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const triggerPoint = rect.top + rect.height * 0.3;
      setShowStickyCTA(triggerPoint < windowHeight * 0.3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const theme = isDark ? COLORS.dark : COLORS.light;

  // Highlight text helper
  const highlightText = (text) =>
    text.split(/(<highlight>.*?<\/highlight>)/g).map((seg, i) =>
      seg.startsWith("<highlight>") ? (
        <span
          key={i}
          className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 font-serif"
        >
          {seg.replace(/<\/?highlight>/g, "")}
        </span>
      ) : (
        <span key={i}>{seg}</span>
      )
    );

  // Render text with line breaks and highlights
  const renderTextWithBreaks = (text) =>
    text.split("<br/>").map((part, index, arr) => (
      <span key={index} style={{ lineHeight: 1.6, letterSpacing: "0.02em" }}>
        {highlightText(part)}
        {index < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <>
      <section
        id={id}
        ref={sectionRef}
        className="relative w-full min-h-screen py-20 px-6 sm:px-10 lg:px-20"
        style={{ overflow: "visible", scrollMarginTop: "80px" }}
      >
        {/* Cursor Glow */}
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            borderRadius: "50%",
            width: 100,
            height: 100,
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            background: `radial-gradient(circle, ${
              isDark ? "rgba(255, 215, 0, 0.3)" : "rgba(181, 196, 142, 0.3)"
            } 0%, transparent 70%)`,
            mixBlendMode: "screen",
            filter: "blur(12px)",
            zIndex: 9999,
            willChange: "transform",
          }}
          transition={{ ease: "easeOut", duration: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        />

        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: theme.bg, opacity: 0.95 }} />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" /%3E%3C/svg%3E\')',
            }}
          />
        </div>

        {/* Parallax Background Element */}
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 opacity-10 z-10 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              isDark ? theme.gold : theme.olive600
            } 0%, transparent 70%)`,
            filter: "blur(40px)",
            willChange: "transform",
            x: parallaxX,
            y: parallaxY,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          viewport={{ once: true, amount: 0.3 }}
        />

        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={controls}
            variants={fadeUp}
            transition={{ duration: 0.8, delayChildren: 0, staggerChildren: 0.15 }}
            style={{ willChange: "transform, opacity" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: theme.text, letterSpacing: "0.02em", lineHeight: 1.2 }}
              variants={fadeUp}
              viewport={{ once: true, amount: 0.3 }}
            >
              {highlightText(t.about.title)}
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl font-light max-w-3xl mx-auto"
              style={{
                color: isDark ? "rgba(255,255,255,0.85)" : theme.olive800,
                letterSpacing: "0.02em",
                lineHeight: 1.6,
              }}
              variants={fadeUp}
              viewport={{ once: true, amount: 0.3 }}
            >
              {t.about.description}
            </motion.p>
          </motion.div>

          {/* Our Story Section */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={slideIn}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ willChange: "transform, opacity" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3
                  className="text-3xl sm:text-4xl font-bold mb-6"
                  style={{ color: theme.text, letterSpacing: "0.02em", lineHeight: 1.3 }}
                >
                  {highlightText(t.about.ourStoryTitle)}
                </h3>
                <div
                  className="text-lg leading-relaxed"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.85)" : theme.olive800,
                    letterSpacing: "0.02em",
                    lineHeight: 1.6,
                  }}
                >
                  <span className="text-gold">Maktaris </span>
                  {renderTextWithBreaks(t.about.ourStoryText)}
                </div>
              </div>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ willChange: "transform" }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div
                  className="aspect-square rounded-sm shadow-2xl overflow-hidden"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(0,0,0,0.3))"
                      : "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(245,245,220,0.5))",
                    boxShadow:
                      "inset 0 0 0.5px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.1)",
                    border: isDark
                      ? "1px solid rgba(255,215,0,0.2)"
                      : "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="/grove.jpeg"
                      alt="Olive Grove"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <SectionDivider />

          {/* Why Choose Us Section */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeUp}
            transition={{ delay: 0.4, duration: 0.8, staggerChildren: 0.15 }}
            style={{ willChange: "transform, opacity" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="text-center mb-12">
              <motion.h3
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: theme.text, letterSpacing: "0.02em", lineHeight: 1.3 }}
                variants={fadeUp}
                viewport={{ once: true, amount: 0.3 }}
              >
                {highlightText(t.about.whyChooseUs.title)}
              </motion.h3>
              <motion.p
                className="text-lg"
                style={{
                  color: isDark ? "rgba(255,255,255,0.75)" : theme.olive800,
                  letterSpacing: "0.02em",
                  lineHeight: 1.5,
                }}
                variants={fadeUp}
                viewport={{ once: true, amount: 0.3 }}
              >
                {t.about.whyChooseUs.subtitle}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.about.whyChooseUs.features.map((feature, i) => {
                const IconComponent = {
                  Award,
                  Leaf,
                  Sun,
                  Droplet,
                  Calendar,
                  Users,
                  Heart,
                  Shield,
                  CheckCircle,
                }[feature.icon];

                return (
                  <motion.div
                    key={i}
                    className="p-6 rounded-sm backdrop-blur-xl text-center group transform transition-transform duration-300 ease-out"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                      y: -4,
                      scale: 1.05,
                      boxShadow: isDark
                        ? "0 15px 30px rgba(255, 215, 0, 0.15)"
                        : "0 15px 30px rgba(85, 107, 47, 0.15)",
                    }}
                    whileTap={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      background: isDark
                        ? "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(0,0,0,0.2))"
                        : "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(245,245,220,0.4))",
                      borderColor: isDark
                        ? "rgba(255,215,0,0.2)"
                        : "rgba(85,107,47,0.2)",
                      letterSpacing: "0.02em",
                      lineHeight: 1.5,
                      backdropFilter: "blur(16px) saturate(180%)",
                      boxShadow:
                        "inset 0 0 0.5px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.1)",
                      border: isDark
                        ? "1px solid rgba(255,215,0,0.2)"
                        : "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {IconComponent && (
                      <IconComponent className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
                    )}
                    <h4
                      className="font-semibold text-lg mb-3"
                      style={{
                        color: isDark ? theme.goldLight : theme.olive800,
                        letterSpacing: "0.02em",
                        lineHeight: 1.3,
                      }}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className="text-sm opacity-90"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,0.75)"
                          : "rgba(0,0,0,0.7)",
                        letterSpacing: "0.02em",
                        lineHeight: 1.5,
                      }}
                    >
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <SectionDivider />

          {/* CTA Section */}
          <motion.div
            className="text-center"
            initial="hidden"
            animate={controls}
            variants={fadeUp}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{ willChange: "transform, opacity" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div
              className="max-w-4xl mx-auto p-12 rounded-sm backdrop-blur-xl"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(0,0,0,0.3))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(245,245,220,0.5))",
                borderColor: isDark
                  ? "rgba(255,215,0,0.2)"
                  : "rgba(85,107,47,0.2)",
                letterSpacing: "0.02em",
                lineHeight: 1.5,
                backdropFilter: "blur(16px) saturate(180%)",
                boxShadow:
                  "inset 0 0 0.5px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.1)",
                border: isDark
                  ? "1px solid rgba(255,215,0,0.2)"
                  : "1px solid rgba(255,255,255,0.2)",
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: theme.text, letterSpacing: "0.02em", lineHeight: 1.3 }}
              >
                {t.about.cta.title}
              </h3>
              <p
                className="text-lg"
                style={{
                  color: isDark ? "rgba(255,255,255,0.75)" : theme.olive800,
                  letterSpacing: "0.02em",
                  lineHeight: 1.5,
                }}
              >
                {t.about.cta.subtitle}
              </p>
            </div>
          </motion.div>
        </div>

        <ScrollIndicator />
      </section>

      {/* Floating CTA with Close Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={
          showStickyCTA && isFloatingCtaVisible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ position: "fixed", top: 100, left: 20, zIndex: 100 }}
        className="hidden sm:block"
        aria-live="polite"
      >
        <div className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xs bg-yellow-500 text-white font-medium shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">
          <a
            href={`mailto:agromaktaris@gmail.com?subject=${encodeURIComponent(
              t.about.floatingCta.mailtoSubject
            )}`}
            className="inline-flex items-center gap-2"
            aria-label="Contact us via email"
          >
            <SiMinutemailer className="w-5 h-5" />
            {t.about.floatingCta.text || "Contact Me"}
          </a>

          <button
            onClick={() => setIsFloatingCtaVisible(false)}
            aria-label="Close contact button"
            className="absolute top-0 right-0 p-1 hover:text-red-600 focus:outline-none focus:ring-2 text-white"
            style={{ lineHeight: 0 }}
            type="button"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default About;
