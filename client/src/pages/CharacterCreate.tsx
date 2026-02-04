import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { AsciiArtDisplay } from "@/components/game/AsciiArtDisplay";
import { getClassArt, ColorRegion } from "@/lib/asciiArt";

// All classes with descriptions
const ALL_CLASSES = [
  { id: "warrior", name: "Warrior", description: "Melee powerhouse using rage from combat. Masters of arms and protection.", resourceType: "rage", armorType: "plate" },
  { id: "mage", name: "Mage", description: "Master of arcane, fire, and frost magic. High damage, low armor.", resourceType: "mana", armorType: "cloth" },
  { id: "priest", name: "Priest", description: "Devoted healer channeling holy light. Can also harness shadow.", resourceType: "mana", armorType: "cloth" },
  { id: "rogue", name: "Rogue", description: "Stealthy assassin using energy for quick strikes and poisons.", resourceType: "energy", armorType: "leather" },
  { id: "hunter", name: "Hunter", description: "Ranged damage dealer with animal companions and traps.", resourceType: "mana", armorType: "mail" },
  { id: "warlock", name: "Warlock", description: "Dark caster commanding demons and afflictions.", resourceType: "mana", armorType: "cloth" },
  { id: "shaman", name: "Shaman", description: "Tribal elementalist calling upon fire, earth, and lightning.", resourceType: "mana", armorType: "mail" },
];

// Base stats by class
const CLASS_STATS: Record<string, { str: number; agi: number; int: number; sta: number; spi: number }> = {
  warrior: { str: 8, agi: 4, int: 2, sta: 8, spi: 3 },
  mage: { str: 2, agi: 3, int: 10, sta: 4, spi: 6 },
  priest: { str: 2, agi: 3, int: 8, sta: 4, spi: 8 },
  rogue: { str: 4, agi: 10, int: 2, sta: 5, spi: 4 },
  hunter: { str: 4, agi: 8, int: 4, sta: 6, spi: 4 },
  warlock: { str: 2, agi: 3, int: 9, sta: 5, spi: 6 },
  shaman: { str: 5, agi: 4, int: 7, sta: 6, spi: 4 },
};

// Class colors
const classColors: Record<string, string> = {
  warrior: "#C79C6E",
  mage: "#69CCF0",
  priest: "#FFFFFF",
  rogue: "#FFF569",
  hunter: "#ABD473",
  warlock: "#9482C9",
  shaman: "#0070DE",
};

export default function CharacterCreate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [phase, setPhase] = useState<"class" | "name" | "confirm">("class");
  const [error, setError] = useState<string | null>(null);

  // Fetch available classes from server
  const { data: serverClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await fetch(api.gameData.classes.path);
      if (!response.ok) throw new Error("Failed to fetch classes");
      return response.json();
    },
  });

  // Merge server data with local class info
  const classes = ALL_CLASSES.map(localClass => {
    const serverClass = serverClasses?.find((c: { id: string }) => c.id === localClass.id);
    return {
      ...localClass,
      implemented: !!serverClass,
    };
  });

  const implementedClasses = classes.filter(c => c.implemented);
  const selectedClass = implementedClasses[selectedIndex] || implementedClasses[0];

  // Get the ASCII art for the selected class
  const classArt = selectedClass ? getClassArt(selectedClass.id) : null;
  const stats = selectedClass ? CLASS_STATS[selectedClass.id] : null;

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (phase === "class") {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : implementedClasses.length - 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => (prev < implementedClasses.length - 1 ? prev + 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          setPhase("name");
          break;
        case "Escape":
          e.preventDefault();
          navigate("/");
          break;
        default:
          // Number key selection
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= implementedClasses.length) {
            setSelectedIndex(num - 1);
          } else if (num === 0) {
            navigate("/");
          }
          break;
      }
    } else if (phase === "name") {
      if (e.key === "Escape") {
        e.preventDefault();
        setPhase("class");
      } else if (e.key === "Enter" && name.trim().length >= 2) {
        e.preventDefault();
        setPhase("confirm");
      }
    } else if (phase === "confirm") {
      if (e.key === "Escape") {
        e.preventDefault();
        setPhase("name");
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleCreate();
      }
    }
  }, [phase, selectedIndex, implementedClasses.length, name, navigate]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const createCharacterMutation = useMutation({
    mutationFn: async (data: { name: string; characterClass: string }) => {
      const response = await fetch(api.characters.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create character");
      }
      return result;
    },
    onSuccess: (character) => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      toast({
        title: "Character Created!",
        description: `${character.name} the ${character.characterClass} is ready!`,
      });
      navigate("/");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleCreate = () => {
    setError(null);
    if (!name.trim() || name.length < 2 || name.length > 24) {
      setError("Name must be between 2 and 24 characters");
      return;
    }
    if (!selectedClass) {
      setError("Please select a class");
      return;
    }
    createCharacterMutation.mutate({
      name: name.trim(),
      characterClass: selectedClass.id,
    });
  };

  // Build the terminal display
  const termWidth = 80;
  const hLine = "+" + "-".repeat(termWidth - 2) + "+";

  const padLine = (content: string, color?: string): string => {
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

        {/* Title */}
        <div style={{ color: "#ffffff" }}>{padLine("Character Creation / " + (phase === "class" ? "Select Class" : phase === "name" ? "Enter Name" : "Confirm"))}</div>
        <div>{hLine}</div>

        {phase === "class" && (
          <>
            {/* ASCII Art Display - 60% of panel */}
            <div style={{ paddingLeft: "2ch", paddingRight: "2ch" }}>
              {classArt && (
                <AsciiArtDisplay
                  art={classArt.art}
                  colorRegions={classArt.colors as ColorRegion[]}
                  centered
                />
              )}
            </div>

            <div>{hLine}</div>

            {/* Class description */}
            <div style={{ color: "#ffffff" }}>{padLine(selectedClass?.name || "")}</div>
            <div>{padLine(selectedClass?.description || "")}</div>
            <div>{padLine("")}</div>

            {/* Stats line */}
            <div>
              {padLine("")}
              <span style={{ position: "relative", left: "4ch" }}>
                <span style={{ color: "#ffffff" }}>STR </span>
                <span style={{ color: "#00ff00" }}>{stats?.str || 0}</span>
                <span style={{ color: "#666666" }}> / </span>
                <span style={{ color: "#ffffff" }}>AGI </span>
                <span style={{ color: "#00ff00" }}>{stats?.agi || 0}</span>
                <span style={{ color: "#666666" }}> / </span>
                <span style={{ color: "#ffffff" }}>INT </span>
                <span style={{ color: "#00ff00" }}>{stats?.int || 0}</span>
                <span style={{ color: "#666666" }}> / </span>
                <span style={{ color: "#ffffff" }}>STA </span>
                <span style={{ color: "#00ff00" }}>{stats?.sta || 0}</span>
                <span style={{ color: "#666666" }}> / </span>
                <span style={{ color: "#ffffff" }}>SPI </span>
                <span style={{ color: "#00ff00" }}>{stats?.spi || 0}</span>
              </span>
            </div>

            {/* Class bonus */}
            <div style={{ color: "#ff00ff" }}>{padLine(`+${selectedClass?.resourceType?.toUpperCase()} resource  |  ${selectedClass?.armorType?.toUpperCase()} armor`)}</div>

            <div>{hLine}</div>

            {/* Menu */}
            <div style={{ padding: "0 2ch" }}>
              {implementedClasses.map((cls, idx) => {
                const isSelected = idx === selectedIndex;
                const prefix = isSelected ? ">" : " ";
                const color = isSelected ? "#ffff00" : "#00ff00";
                return (
                  <div
                    key={cls.id}
                    style={{ color, cursor: "pointer" }}
                    onClick={() => setSelectedIndex(idx)}
                    onDoubleClick={() => setPhase("name")}
                  >
                    {prefix} {idx + 1} - {cls.name}
                  </div>
                );
              })}
              <div style={{ marginTop: "0.5em" }}>
                <div
                  style={{ color: selectedIndex === -1 ? "#ffff00" : "#00ff00", cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  {"  "}0 - Back
                </div>
              </div>
            </div>

            <div>{hLine}</div>

            {/* Prompt */}
            <div style={{ color: "#666666" }}>{padLine("Arrow keys to navigate, Enter to select, 0 to go back")}</div>
          </>
        )}

        {phase === "name" && (
          <>
            {/* Show smaller version of selected class art */}
            <div style={{ padding: "0 2ch", textAlign: "center" }}>
              <div style={{ color: classColors[selectedClass?.id || "warrior"], fontSize: "1.5em", marginBottom: "1em" }}>
                {selectedClass?.name?.toUpperCase()}
              </div>
            </div>

            <div>{hLine}</div>

            {/* Name input */}
            <div style={{ padding: "1em 2ch" }}>
              <div style={{ color: "#ffffff", marginBottom: "0.5em" }}>Enter your character's name:</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#00ff00" }}>&gt; </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={24}
                  autoFocus
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#00ff00",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "inherit",
                    outline: "none",
                    width: "40ch",
                    caretColor: "#00ff00",
                  }}
                  placeholder="_"
                />
                <span style={{ color: "#666666", animation: "blink 1s infinite" }}>█</span>
              </div>
              <div style={{ color: "#666666", fontSize: "0.8em", marginTop: "0.5em" }}>
                {name.length}/24 characters (minimum 2)
              </div>
            </div>

            {error && (
              <>
                <div>{hLine}</div>
                <div style={{ color: "#ff0000" }}>{padLine("ERROR: " + error)}</div>
              </>
            )}

            <div>{hLine}</div>
            <div style={{ color: "#666666" }}>{padLine("Enter to continue, Escape to go back")}</div>
          </>
        )}

        {phase === "confirm" && (
          <>
            {/* Final confirmation with full art */}
            <div style={{ paddingLeft: "2ch", paddingRight: "2ch" }}>
              {classArt && (
                <AsciiArtDisplay
                  art={classArt.art}
                  colorRegions={classArt.colors as ColorRegion[]}
                  centered
                />
              )}
            </div>

            <div>{hLine}</div>

            {/* Character summary */}
            <div style={{ padding: "1em 2ch", textAlign: "center" }}>
              <div style={{ color: classColors[selectedClass?.id || "warrior"], fontSize: "1.2em" }}>
                {name}
              </div>
              <div style={{ color: "#ffffff" }}>
                Level 1 {selectedClass?.name}
              </div>
              <div style={{ marginTop: "1em" }}>
                <span style={{ color: "#ffffff" }}>STR </span>
                <span style={{ color: "#00ff00" }}>{stats?.str}</span>
                <span style={{ color: "#666666" }}> / </span>
                <span style={{ color: "#ffffff" }}>AGI </span>
                <span style={{ color: "#00ff00" }}>{stats?.agi}</span>
                <span style={{ color: "#666666" }}> / </span>
                <span style={{ color: "#ffffff" }}>INT </span>
                <span style={{ color: "#00ff00" }}>{stats?.int}</span>
                <span style={{ color: "#666666" }}> / </span>
                <span style={{ color: "#ffffff" }}>STA </span>
                <span style={{ color: "#00ff00" }}>{stats?.sta}</span>
                <span style={{ color: "#666666" }}> / </span>
                <span style={{ color: "#ffffff" }}>SPI </span>
                <span style={{ color: "#00ff00" }}>{stats?.spi}</span>
              </div>
            </div>

            {error && (
              <>
                <div>{hLine}</div>
                <div style={{ color: "#ff0000" }}>{padLine("ERROR: " + error)}</div>
              </>
            )}

            <div>{hLine}</div>

            {/* Confirm prompt */}
            <div style={{ padding: "1em 2ch", textAlign: "center" }}>
              <div
                style={{ color: "#ffff00", cursor: "pointer" }}
                onClick={handleCreate}
              >
                {">>> "} Press ENTER to begin your journey {"<<<"}
              </div>
              <div style={{ color: "#666666", marginTop: "0.5em" }}>
                (Escape to go back)
              </div>
            </div>
          </>
        )}

        {/* Bottom border */}
        <div>{hLine}</div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
