"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Settings, CreditCard, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "CLI", href: "#cli" },
  { label: "Web App", href: "#webapp" },
  { label: "Mobile", href: "#mobile" },
  { label: "Pricing", href: "#pricing" },
];

// Web app URL: use env var if set, fall back to local dev port
const WEB_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173";

const profileMenuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: `${WEB_APP_URL}/dashboard` },
  { label: "Profile Settings", icon: User, href: "#" },
  { label: "Account Settings", icon: Settings, href: "#" },
  { label: "Subscriptions", icon: CreditCard, href: "#" },
];

interface StoredUser {
  name?: string;
  email: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [user, setUser] = useState<StoredUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Read user from localStorage on mount + listen for auth changes
  useEffect(() => {
    const readUser = () => {
      try {
        const raw = localStorage.getItem("sn_user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };
    readUser();
    window.addEventListener("sn_auth_change", readUser);
    return () => window.removeEventListener("sn_auth_change", readUser);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const sections = ["features", "cli", "webapp", "mobile"];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const el = document.getElementById(href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("sn_token");
    localStorage.removeItem("sn_user");
    setUser(null);
    setProfileOpen(false);
    window.dispatchEvent(new Event("sn_auth_change"));
  };

  // Avatar initials from name or email
  const initials = user
    ? (user.name ?? user.email).split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: scrolled ? "rgba(27,29,33,0.95)" : "rgba(27,29,33,0.3)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
        id="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-bold tracking-[0.05em]"
              style={{ fontFamily: "var(--font-geist-mono)", color: "var(--accent-cyan)" }}
            >
              StrataNodex
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm transition-colors duration-200"
                    style={{ color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = isActive ? "var(--accent-cyan)" : "var(--text-secondary)")}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Right side: Auth buttons OR Profile */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                /* ── Logged-in: Avatar + Name + Dropdown ── */
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200"
                    style={{
                      background: profileOpen ? "rgba(255,255,255,0.06)" : "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                    onMouseLeave={(e) => !profileOpen && ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    id="profile-menu-btn"
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                  >
                    {/* Avatar circle */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(0,191,255,0.2), rgba(0,200,150,0.2))",
                        border: "1px solid rgba(0,191,255,0.3)",
                        color: "var(--accent-cyan)",
                      }}
                    >
                      {initials}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {user.name?.split(" ")[0] ?? user.email.split("@")[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className="opacity-50 transition-transform duration-200"
                      style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl overflow-hidden shadow-2xl z-50"
                        style={{
                          background: "rgba(50,54,60,0.97)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                        id="profile-dropdown"
                        role="menu"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {user.name ?? "User"}
                          </p>
                          <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {user.email}
                          </p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                          {profileMenuItems.map(({ label, icon: Icon, href }) => (
                            <a
                              key={label}
                              href={href}
                              target={label === "Dashboard" ? "_blank" : undefined}
                              rel={label === "Dashboard" ? "noopener noreferrer" : undefined}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                              style={{ color: "var(--text-secondary)" }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                              }}
                              role="menuitem"
                            >
                              <Icon size={15} className="opacity-60" />
                              {label}
                            </a>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-[rgba(255,255,255,0.08)] py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                            style={{ color: "#ff4466" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,68,102,0.07)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                            role="menuitem"
                            id="logout-btn"
                          >
                            <LogOut size={15} className="opacity-70" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── Logged-out: Sign In + Get Started ── */
                <>
                  <GlowButton variant="ghost" href="/auth">Sign In</GlowButton>
                  <GlowButton variant="primary" href="/auth" id="navbar-cta">Get Started →</GlowButton>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMenuOpen((v) => !v)}
              style={{ color: "var(--text-secondary)" }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
            style={{
              background: "rgba(27,29,33,0.97)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
            id="mobile-menu"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base py-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                {user ? (
                  <>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      Signed in as {user.name ?? user.email}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-sm py-2 text-left"
                      style={{ color: "#ff4466" }}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <GlowButton variant="ghost" href="/auth">Sign In</GlowButton>
                    <GlowButton variant="primary" href="/auth">Get Started →</GlowButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
