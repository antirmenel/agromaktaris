import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useThemeMode } from "../../hooks/useThemeMode";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const slideIn = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const Contact = ({ t = {}, id = "contact" }) => {
  const isDark = useThemeMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("idle"); // idle, sending, success, error

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const parallaxX = useTransform(
    cursorX,
    (x) => ((x / window.innerWidth) * 2 - 1) * 15
  );
  const parallaxY = useTransform(
    cursorY,
    (y) => ((y / window.innerHeight) * 2 - 1) * 15
  );

  useEffect(() => {
    if (isInView) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      prefersReducedMotion
        ? controls.set("visible")
        : controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setFormStatus("error");
      return;
    }

    setFormStatus("sending");

    try {
      const response = await fetch("https://agromaktaris.netlify.app/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      setFormStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error) {
      console.error("Error:", error);
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t.contact?.contactInfo?.visitFarm,
      value: t.contact?.contactInfo?.visitFarmValue,
      href: "https://maps.google.com",
    },
    {
      icon: Phone,
      title: t.contact?.contactInfo?.callUs,
      value: t.contact?.contactInfo?.callUsValue,
      href: "tel:+21673123456",
    },
    {
      icon: Mail,
      title: t.contact?.contactInfo?.emailUs,
      value: t.contact?.contactInfo?.emailUsValue,
      href: "mailto:contact@agromaktaris.com",
    },
    {
      icon: Clock,
      title: t.contact?.contactInfo?.workingHours,
      value: t.contact?.contactInfo?.workingHoursValue,
      href: null,
    },
  ];

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full min-h-screen pt-24 px-6 sm:px-12 lg:px-24 pb-24"
      style={{ scrollMarginTop: "80px" }}
    >
      {/* Cursor Glow */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          borderRadius: "50%",
          width: 120,
          height: 120,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          background: isDark
            ? "radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0) 70%)"
            : "radial-gradient(circle, rgba(181,196,142,0.15) 0%, rgba(181,196,142,0) 70%)",
          mixBlendMode: "screen",
          filter: "blur(8px)",
          zIndex: 9999,
          willChange: "transform",
        }}
        transition={{ ease: "easeOut", duration: 0.3 }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(145deg, hsl(91, 41%, 18%) 0%, hsl(92, 38%, 25%) 100%)"
              : "linear-gradient(145deg, hsl(60, 29%, 97%) 0%, hsl(60, 29%, 99%) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" /%3E%3C/svg%3E\')',
          }}
        />
        <div
          className="absolute inset-0 opacity-[3%]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-10 bg-cover bg-center opacity-100"
        style={{
          backgroundImage: `url('/bg.png')`,
          backgroundPosition: "center 40%",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.8) 20%, transparent 100%)",
          x: parallaxX,
          y: parallaxY,
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          animate={controls}
          variants={fadeUp}
          transition={{ duration: 0.8, staggerChildren: 0.15 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight"
            variants={fadeUp}
          >
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300"
              dangerouslySetInnerHTML={{ __html: t.contact?.title || "" }}
            />
          </motion.h2>
          <motion.p
            className={`text-lg sm:text-xl font-medium max-w-3xl mx-auto tracking-normal leading-relaxed ${
              isDark ? "text-white/80" : "text-olive-dark/90"
            }`}
            variants={fadeUp}
            dangerouslySetInnerHTML={{ __html: t.contact?.subtitle || "" }}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={slideIn}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div
              className={`p-10 rounded-sm backdrop-blur-sm border shadow-lg ${
                isDark
                  ? "bg-yellow-500/5 border-yellow-400/15"
                  : "bg-white/70 border-yellow-200/40"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {["name", "email", "subject"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className={`block text-sm font-medium mb-3 tracking-wide ${
                        isDark ? "text-white/90" : "text-olive-dark/90"
                      }`}
                    >
                      {t.contact?.form?.[field]}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                      placeholder={t.contact?.form?.[`${field}Placeholder`]}
                      className={`w-full px-4 py-3.5 rounded-sm outline-none transition-all duration-200 border ${
                        isDark
                          ? "bg-black/20 text-white border-white/20 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30"
                          : "bg-white/90 text-olive-dark border-gray-200 focus:border-yellow-400/70 focus:ring-1 focus:ring-yellow-400/20"
                      }`}
                    />
                  </div>
                ))}

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium mb-3 tracking-wide ${
                      isDark ? "text-white/90" : "text-olive-dark/90"
                    }`}
                  >
                    {t.contact?.form?.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder={t.contact?.form?.messagePlaceholder}
                    className={`w-full px-4 py-3 rounded-sm outline-none transition-all duration-200 border resize-none ${
                      isDark
                        ? "bg-black/20 text-white border-white/20 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30"
                        : "bg-white/90 text-olive-dark border-gray-200 focus:border-yellow-400/70 focus:ring-1 focus:ring-yellow-400/20"
                    }`}
                  />
                </div>

                {/* Validation Error */}
                {formStatus === "error" &&
                  (!formData.name ||
                    !formData.email ||
                    !formData.subject ||
                    !formData.message) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm"
                    >
                      Please fill all required fields
                    </motion.div>
                  )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className={`w-full py-4 px-6 rounded-sm font-medium text-white tracking-wide ${
                    formStatus === "sending"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500"
                  } shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50`}
                  whileHover={formStatus !== "sending" ? { scale: 1.01 } : {}}
                  whileTap={formStatus !== "sending" ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center justify-center gap-2">
                    {formStatus === "sending" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.contact?.form?.sending}
                      </>
                    ) : (
                      t.contact?.form?.send
                    )}
                  </div>
                </motion.button>

                {/* Status Messages */}
                {formStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-500 text-sm mt-3"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t.contact?.form?.success}
                  </motion.div>
                )}
                {formStatus === "error" &&
                  formData.name &&
                  formData.email &&
                  formData.subject &&
                  formData.message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-500 text-sm mt-3"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {t.contact?.form?.error}
                    </motion.div>
                  )}
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeUp}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="space-y-10">
              <h3
                className={`text-3xl sm:text-4xl font-bold mb-6 tracking-tight ${
                  isDark ? "text-white/90" : "text-olive-dark"
                }`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: t.contact?.infoTitle || "",
                  }}
                />
              </h3>

              <div className="grid gap-6">
                {contactInfo.map(({ icon: Icon, title, value, href }, i) => (
                  <motion.div
                    key={i}
                    className="group"
                    variants={scaleIn}
                    transition={{
                      delay: 0.4 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <div
                      className={`p-6 rounded-sm backdrop-blur-sm border transition-all duration-300 ${
                        isDark
                          ? "bg-yellow-500/5 border-yellow-400/15 hover:bg-yellow-500/10 hover:border-yellow-400/30"
                          : "bg-white/60 border-yellow-200/40 hover:bg-white/80 hover:border-yellow-400/60"
                      }`}
                    >
                      <div className="flex items-start gap-5">
                        <div
                          className={`p-3 rounded-full transition-all duration-300 ${
                            isDark
                              ? "bg-yellow-400/10 group-hover:bg-yellow-400/20"
                              : "bg-yellow-400/20 group-hover:bg-yellow-400/30"
                          }`}
                        >
                          <Icon className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                          <h4
                            className={`font-medium text-lg mb-2 tracking-wide ${
                              isDark ? "text-white/90" : "text-olive-dark"
                            }`}
                          >
                            {title}
                          </h4>
                          <div
                            className={`text-sm ${
                              isDark ? "text-white/80" : "text-gray-700"
                            }`}
                          >
                            {href ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline transition-all duration-200"
                                dangerouslySetInnerHTML={{ __html: value }}
                              />
                            ) : (
                              <span
                                dangerouslySetInnerHTML={{ __html: value }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
