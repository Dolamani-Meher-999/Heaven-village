import { useState, useEffect } from "react";

const NAV_LINKS = ["Properties", "How It Works", "About", "Contact"];

export default function Navbar({ onLogin, onRegister }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500 ${
      scrolled
        ? "px-12 py-3 bg-white shadow-[0_2px_20px_rgba(26,26,46,0.1)] border-b border-gray-100"
        : "px-12 py-5 bg-transparent"
    }`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg orange-gradient flex items-center justify-center text-lg font-black text-white">
          H
        </div>
        <span className="font-display text-xl font-bold text-charcoal">
          Heaven <span className="orange-text">Village</span>
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-9">
        {NAV_LINKS.map((link) => (
          <a key={link} href="#"
            className="font-body text-sm font-medium tracking-wide text-charcoal/60 hover:text-orange transition-colors duration-200">
            {link}
          </a>
        ))}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <button onClick={onLogin}
          className="font-body text-sm font-semibold text-orange px-5 py-2 rounded-lg border border-orange/30 hover:bg-orange/5 transition-all duration-200">
          Sign In
        </button>
        <button onClick={onRegister}
          className="font-body text-sm font-bold text-white px-5 py-2 rounded-lg orange-gradient hover:opacity-90 transition-opacity shadow-orange">
          Get Started
        </button>
      </div>
    </nav>
  );
}
