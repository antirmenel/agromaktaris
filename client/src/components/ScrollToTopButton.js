import { useState, useEffect } from "react";
import { MdOutlineArrowDropUp } from "react-icons/md";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="
        fixed bottom-6 right-6
        w-10 h-10
        rounded-full
        bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500
        text-yellow-900
        shadow-lg
        flex items-center justify-center
        z-[9999]
        font-sans font-semibold text-2xl
        select-none
        transition transform
        hover:scale-110 hover:shadow-2xl hover:brightness-110
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-yellow-300
        cursor-pointer
      "
      style={{
        boxShadow: "0 0 8px 3px rgba(252, 211, 77, 0.7), 0 4px 8px rgba(250, 204, 21, 0.3)",
      }}
    >
      <MdOutlineArrowDropUp />
    </button>
  );
}
