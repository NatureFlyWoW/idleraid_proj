import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TerminalPanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
  variant?: "green" | "yellow" | "cyan" | "red";
}

/**
 * Terminal-style panel with ASCII borders
 * Matches Melvor Idle aesthetic
 */
export function TerminalPanel({
  children,
  title,
  className,
  variant = "green",
}: TerminalPanelProps) {
  const colors = {
    green: {
      border: "border-green-600",
      text: "text-green-400",
      bg: "bg-black",
      glow: "shadow-[0_0_10px_rgba(34,197,94,0.2)]",
    },
    yellow: {
      border: "border-yellow-600",
      text: "text-yellow-400",
      bg: "bg-stone-950",
      glow: "shadow-[0_0_10px_rgba(202,138,4,0.2)]",
    },
    cyan: {
      border: "border-cyan-600",
      text: "text-cyan-400",
      bg: "bg-black",
      glow: "shadow-[0_0_10px_rgba(6,182,212,0.2)]",
    },
    red: {
      border: "border-red-600",
      text: "text-red-400",
      bg: "bg-stone-950",
      glow: "shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    },
  };

  const style = colors[variant];

  return (
    <div
      className={cn(
        "relative border-2 p-4 font-mono",
        style.border,
        style.text,
        style.bg,
        style.glow,
        "shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {title && (
        <div className="absolute -top-3 left-4 px-2 bg-black">
          <span className={cn("text-sm font-bold tracking-wider uppercase", style.text)}>
            {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

interface ASCIIHeaderProps {
  children: string;
  variant?: "simple" | "double" | "thick";
}

/**
 * ASCII-styled header text with decorative borders
 */
export function ASCIIHeader({ children, variant = "simple" }: ASCIIHeaderProps) {
  const borders = {
    simple: { char: "=", count: 40 },
    double: { char: "═", count: 40 },
    thick: { char: "█", count: 40 },
  };

  const border = borders[variant];
  const borderLine = border.char.repeat(border.count);

  return (
    <div className="font-mono text-center my-4">
      <pre className="text-green-600 text-xs leading-tight">{borderLine}</pre>
      <h1 className="text-2xl font-bold text-yellow-400 tracking-wider my-2 uppercase">
        {children}
      </h1>
      <pre className="text-green-600 text-xs leading-tight">{borderLine}</pre>
    </div>
  );
}

interface TerminalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
}

/**
 * Terminal-style button with ASCII aesthetic
 */
export function TerminalButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className,
}: TerminalButtonProps) {
  const variants = {
    primary: {
      border: "border-green-600",
      text: "text-green-400",
      hover: "hover:bg-green-600/20 hover:border-green-500 hover:text-green-300",
      active: "active:bg-green-600/30",
      glow: "shadow-[0_0_5px_rgba(34,197,94,0.3)]",
      glowHover: "hover:shadow-[0_0_10px_rgba(34,197,94,0.5)]",
    },
    secondary: {
      border: "border-yellow-600",
      text: "text-yellow-400",
      hover: "hover:bg-yellow-600/20 hover:border-yellow-500 hover:text-yellow-300",
      active: "active:bg-yellow-600/30",
      glow: "shadow-[0_0_5px_rgba(202,138,4,0.3)]",
      glowHover: "hover:shadow-[0_0_10px_rgba(202,138,4,0.5)]",
    },
    danger: {
      border: "border-red-600",
      text: "text-red-400",
      hover: "hover:bg-red-600/20 hover:border-red-500 hover:text-red-300",
      active: "active:bg-red-600/30",
      glow: "shadow-[0_0_5px_rgba(239,68,68,0.3)]",
      glowHover: "hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]",
    },
  };

  const style = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-transparent border-2 px-4 py-2 font-mono uppercase tracking-wider transition-all duration-100",
        style.border,
        style.text,
        style.hover,
        style.active,
        style.glow,
        style.glowHover,
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
        className
      )}
    >
      {children}
    </button>
  );
}

interface ASCIIBorderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Simple ASCII border using box-drawing characters
 */
export function ASCIIBorder({ children, className }: ASCIIBorderProps) {
  return (
    <div className={cn("relative p-4", className)}>
      <div className="absolute inset-0 border-2 border-green-600 pointer-events-none"></div>
      {children}
    </div>
  );
}
