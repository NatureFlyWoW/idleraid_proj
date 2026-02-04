import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Characters" },
    { href: "/dev", label: "Dev" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-green-800 bg-black font-mono">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-sm">{">"}</span>
          <span className="font-bold text-yellow-400 tracking-wider">
            IDLE<span className="text-green-500">RAIDERS</span>
          </span>
          <span className="text-green-700 text-xs hidden sm:inline">v0.1.0</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1 text-sm transition-all duration-100 border",
                location === link.href
                  ? "border-green-600 text-green-400 bg-green-900/20"
                  : "border-transparent text-green-600 hover:text-green-400 hover:border-green-800"
              )}
            >
              [{link.label}]
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
