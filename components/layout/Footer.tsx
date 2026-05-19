"use client";

import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Web App", href: "#webapp" },
    { label: "CLI", href: "#cli" },
    { label: "Mobile", href: "#mobile" },
  ],
  Resources: [
    { label: "Docs", href: "#" },
    { label: "API Ref", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Connect: [
    { label: "GitHub", href: "https://github.com" },
    { label: "Twitter", href: "https://twitter.com" },
    { label: "Discord", href: "https://discord.com" },
  ],
};

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      className="relative"
      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      id="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div
              className="text-xl font-bold tracking-[0.05em] mb-3"
              style={{
                fontFamily: "var(--font-geist-mono)",
                color: "var(--accent-cyan)",
              }}
            >
              StrataNodex
            </div>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Open-source productivity. One ecosystem.
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              © 2026 StrataNodex
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p
                className="text-xs mb-3"
                style={{ color: "var(--text-secondary)", letterSpacing: "0.05em" }}
              >
                Stay updated
              </p>
              <form
                className="flex gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-primary)",
                  }}
                  id="footer-email"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: "rgba(0,191,255,0.1)",
                    border: "1px solid rgba(0,191,255,0.3)",
                    color: "var(--accent-cyan)",
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="text-xs font-semibold mb-4"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "var(--text-primary)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "var(--text-secondary)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p
            className="text-xs text-center sm:text-left"
            style={{ color: "var(--text-muted)" }}
          >
            Built with ❤ and too many terminal sessions.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted)" }}
              className="hover:text-[#e0f8ff] transition-colors duration-200"
              aria-label="GitHub"
            >
              <GithubIcon />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted)" }}
              className="hover:text-[#e0f8ff] transition-colors duration-200"
              aria-label="Twitter"
            >
              <TwitterIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
