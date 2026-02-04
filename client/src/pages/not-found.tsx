import { useLocation } from "wouter";
import { AsciiArtDisplay } from "@/components/game/AsciiArtDisplay";
import { SKULL_ART, SKULL_COLORS } from "@/lib/asciiArt";

export default function NotFound() {
  const [, navigate] = useLocation();

  const termWidth = 60;
  const hLine = "+" + "-".repeat(termWidth - 2) + "+";

  const padLine = (content: string): string => {
    const innerWidth = termWidth - 4;
    const trimmed = content.slice(0, innerWidth);
    const padding = " ".repeat(Math.max(0, innerWidth - trimmed.length));
    return "| " + trimmed + padding + " |";
  };

  return (
    <div
      className="min-h-screen p-4 flex items-center justify-center"
      style={{
        backgroundColor: "#000000",
        fontFamily: "'Courier New', monospace",
        color: "#00ff00",
      }}
    >
      <div
        style={{
          width: `${termWidth}ch`,
          lineHeight: 1.15,
          whiteSpace: "pre",
        }}
      >
        {/* Top border */}
        <div>{hLine}</div>
        <div style={{ color: "#ff0000" }}>{padLine("ERROR 404 - PAGE NOT FOUND")}</div>
        <div>{hLine}</div>

        {/* Skull Art */}
        <div style={{ padding: "1em 2ch" }}>
          <AsciiArtDisplay
            art={SKULL_ART}
            colorRegions={SKULL_COLORS}
            centered
          />
        </div>

        <div>{hLine}</div>

        {/* Error message */}
        <div style={{ color: "#ffffff" }}>{padLine("You have wandered into")}</div>
        <div style={{ color: "#ffffff" }}>{padLine("uncharted territory...")}</div>
        <div>{padLine("")}</div>
        <div style={{ color: "#666666" }}>{padLine("The path you seek does not exist.")}</div>

        <div>{hLine}</div>

        {/* Navigation options */}
        <div style={{ padding: "0.5em 2ch" }}>
          <div
            style={{ color: "#ffff00", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            {">"} 1. Return to Safety (Home)
          </div>
          <div
            style={{ color: "#00ff00", cursor: "pointer", marginTop: "0.25em" }}
            onClick={() => window.history.back()}
          >
            {"  "}2. Go Back
          </div>
        </div>

        <div>{hLine}</div>

        {/* Footer prompt */}
        <div style={{ color: "#666666" }}>{padLine("Press 1 or 2 to choose your path")}</div>

        {/* Bottom border */}
        <div>{hLine}</div>
      </div>
    </div>
  );
}
