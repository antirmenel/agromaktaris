import React from "react";
import { motion } from "framer-motion";
import { useThemeMode } from "../../hooks/useThemeMode";
import { socialLinks } from "./socialLinks";

const Footer = ({ t }) => {
  const isDark = useThemeMode();
  const year = new Date().getFullYear();

  const baseClasses = isDark
    ? "bg-gradient-to-br from-[#3b582b] to-[#446533] text-[#f7f6eb] border-t border-yellow-400/20"
    : "bg-gradient-to-br from-[#fdfdfb] to-white text-[#2D4A22] border-t border-black/5";

  return (
    <footer
      className={`w-full px-6 sm:px-10 lg:px-20 py-10 transition-colors duration-300 backdrop-blur-md ${baseClasses}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-center sm:text-left font-light tracking-wide leading-relaxed">
          © {year} Agro Maktaris. {t.footer.rights}
        </p>

        <div className="flex gap-5">
          {socialLinks.map(({ icon: Icon, href, color }, idx) => (
            <motion.a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${href.replace(/^https?:\/\//, "")}`}
              className="p-2 rounded-full transition-all"
              style={{
                background: isDark
                  ? "rgba(255, 215, 0, 0.08)"
                  : "rgba(229, 231, 235, 0.4)",
              }}
              whileHover={{
                scale: 1.15,
                boxShadow: `0 6px 14px ${color}50`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: isDark ? "#f7f6eb" : "#2D4A22" }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
