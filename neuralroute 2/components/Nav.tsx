"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/chat", label: "Chat" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/api-keys", label: "API Keys" },
  { href: "/n8n", label: "n8n Builds" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080c10]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#00e5c3]/10 border border-[#00e5c3]/30 flex items-center justify-center group-hover:bg-[#00e5c3]/20 transition-all">
              <Zap size={16} className="text-[#00e5c3]" />
            </div>
            <span className="font-display font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Neural<span className="text-[#00e5c3]">Route</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === l.href
                    ? "bg-[#00e5c3]/10 text-[#00e5c3] border border-[#00e5c3]/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-white/40 mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              API Live
            </div>
            <Link
              href="/chat"
              className="px-4 py-2 rounded-lg bg-[#00e5c3] text-[#080c10] text-sm font-bold hover:bg-[#00e5c3]/90 transition-all glow-border"
            >
              Try Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white/60" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0d1117] px-4 py-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                pathname === l.href
                  ? "bg-[#00e5c3]/10 text-[#00e5c3]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
