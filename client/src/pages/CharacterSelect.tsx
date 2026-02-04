import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { api, buildUrl } from "@shared/routes";
import { AsciiArtDisplay } from "@/components/game/AsciiArtDisplay";
import { TITLE_LOGO_ART, TITLE_LOGO_COLORS } from "@/lib/asciiArt";

// Class colors matching WoW palette
const classColors: Record<string, string> = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  mage: "#69CCF0",
  druid: "#FF7D0A",
};

interface Character {
  id: number;
  name: string;
  characterClass: string;
  level: number;
  experience: number;
  gold: number;
  currentHealth: number;
  maxHealth: number;
  currentActivity: string | null;
}

export default function CharacterSelect() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showTitle, setShowTitle] = useState(true);

  const { data: characters, isLoading } = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const response = await fetch(api.characters.list.path);
      if (!response.ok) throw new Error("Failed to fetch characters");
      return response.json() as Promise<Character[]>;
    },
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(buildUrl(api.characters.delete.path, { id }), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete character");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      toast({
        title: "Character Deleted",
        description: "Your character has been permanently deleted.",
      });
    },
  });

  const maxCharacters = 10;
  const charCount = characters?.length ?? 0;
  const canCreateMore = charCount < maxCharacters;

  // Build menu items: characters + create new (if possible)
  const menuItems = [
    ...(characters?.map(c => ({ type: "character" as const, data: c })) || []),
    ...(canCreateMore ? [{ type: "create" as const, data: null }] : []),
  ];

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showDeleteConfirm !== null) return; // Don't navigate during delete confirmation

    if (showTitle) {
      // Any key dismisses title animation
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        setShowTitle(false);
      }
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : menuItems.length - 1));
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < menuItems.length - 1 ? prev + 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        const selected = menuItems[selectedIndex];
        if (selected?.type === "character") {
          navigate(`/game/${selected.data.id}`);
        } else if (selected?.type === "create") {
          navigate("/create");
        }
        break;
      case "Delete":
      case "Backspace":
        e.preventDefault();
        const item = menuItems[selectedIndex];
        if (item?.type === "character") {
          setShowDeleteConfirm(item.data.id);
        }
        break;
      default:
        // Number key selection
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= menuItems.length) {
          setSelectedIndex(num - 1);
        }
        break;
    }
  }, [showTitle, showDeleteConfirm, selectedIndex, menuItems, navigate]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Auto-dismiss title after animation
  useEffect(() => {
    if (showTitle) {
      const timer = setTimeout(() => setShowTitle(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);

  const termWidth = 80;
  const hLine = "+" + "-".repeat(termWidth - 2) + "+";

  const padLine = (content: string): string => {
    const innerWidth = termWidth - 4;
    const trimmed = content.slice(0, innerWidth);
    const padding = " ".repeat(Math.max(0, innerWidth - trimmed.length));
    return "| " + trimmed + padding + " |";
  };

  // Render ASCII health bar
  const renderBar = (current: number, max: number, width: number = 15): string => {
    const percent = max > 0 ? current / max : 0;
    const filled = Math.round(percent * width);
    return "[" + "█".repeat(filled) + "░".repeat(width - filled) + "]";
  };

  return (
    <div
      className="min-h-screen p-4 flex flex-col items-center justify-center"
      style={{
        backgroundColor: "#000000",
        fontFamily: "'Courier New', monospace",
        color: "#00ff00",
      }}
    >
      {/* Title Screen with Logo */}
      <div style={{ marginBottom: "2em" }}>
        <AsciiArtDisplay
          art={TITLE_LOGO_ART}
          colorRegions={TITLE_LOGO_COLORS}
          animate={showTitle}
          animationDelay={40}
          centered
        />
      </div>

      {/* Main Content */}
      <div
        style={{
          width: `${termWidth}ch`,
          lineHeight: 1.15,
          whiteSpace: "pre",
        }}
      >
        {/* Top border */}
        <div>{hLine}</div>
        <div style={{ color: "#ffffff" }}>{padLine("Character Selection")}</div>
        <div>{hLine}</div>

        {/* Loading state */}
        {isLoading && (
          <>
            <div>{padLine("")}</div>
            <div style={{ color: "#666666" }}>{padLine("Loading characters...")}</div>
            <div>{padLine("")}</div>
          </>
        )}

        {/* Empty state */}
        {!isLoading && charCount === 0 && (
          <>
            <div>{padLine("")}</div>
            <div style={{ color: "#00ffff", textAlign: "center" }}>{padLine("No characters yet!")}</div>
            <div style={{ color: "#666666" }}>{padLine("Create your first character to begin.")}</div>
            <div>{padLine("")}</div>
          </>
        )}

        {/* Character List */}
        {!isLoading && characters && characters.length > 0 && (
          <div style={{ padding: "0.5em 2ch" }}>
            {characters.map((char, idx) => {
              const isSelected = idx === selectedIndex;
              const prefix = isSelected ? ">" : " ";
              const classColor = classColors[char.characterClass] || "#00ff00";

              return (
                <div
                  key={char.id}
                  style={{
                    marginBottom: "0.5em",
                    cursor: "pointer",
                    padding: "0.25em 0",
                    borderLeft: isSelected ? "2px solid #ffff00" : "2px solid transparent",
                    paddingLeft: "0.5ch",
                  }}
                  onClick={() => setSelectedIndex(idx)}
                  onDoubleClick={() => navigate(`/game/${char.id}`)}
                >
                  <div style={{ color: isSelected ? "#ffff00" : "#00ff00" }}>
                    {prefix} {idx + 1}. <span style={{ color: classColor }}>{char.name}</span>
                    <span style={{ color: "#666666" }}> - </span>
                    <span style={{ color: "#ffffff" }}>Lv.{char.level} {char.characterClass}</span>
                  </div>
                  {isSelected && (
                    <div style={{ marginLeft: "4ch", color: "#666666", fontSize: "0.9em" }}>
                      <span style={{ color: "#ff6666" }}>HP {renderBar(char.currentHealth, char.maxHealth, 10)}</span>
                      <span style={{ marginLeft: "1ch", color: "#ffff00" }}>{char.gold}g</span>
                      {char.currentActivity && (
                        <span style={{ marginLeft: "1ch", color: "#00ffff" }}>[{char.currentActivity}]</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Create New Option */}
        {canCreateMore && (
          <>
            <div>{hLine}</div>
            <div
              style={{
                padding: "0.5em 2ch",
                cursor: "pointer",
                color: selectedIndex === charCount ? "#ffff00" : "#00ff00",
              }}
              onClick={() => setSelectedIndex(charCount)}
              onDoubleClick={() => navigate("/create")}
            >
              {selectedIndex === charCount ? ">" : " "} {charCount + 1}. [+] Create New Character
              <span style={{ color: "#666666" }}> ({charCount}/{maxCharacters} slots)</span>
            </div>
          </>
        )}

        <div>{hLine}</div>

        {/* Controls */}
        <div style={{ color: "#666666" }}>{padLine("Arrow keys: Navigate | Enter: Select | Delete: Remove")}</div>

        {/* Bottom border */}
        <div>{hLine}</div>

        {/* Version */}
        <div style={{ textAlign: "center", marginTop: "1em", color: "#333333" }}>
          v0.1.0 | Idle Raiders
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm !== null && (
        <AlertDialog open={true} onOpenChange={() => setShowDeleteConfirm(null)}>
          <AlertDialogContent
            style={{
              backgroundColor: "#000000",
              border: "2px solid #ff0000",
              fontFamily: "'Courier New', monospace",
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle style={{ color: "#ff0000" }}>
                DELETE CHARACTER?
              </AlertDialogTitle>
              <AlertDialogDescription style={{ color: "#00ff00" }}>
                This action cannot be undone. This will permanently delete the character and all progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #00ff00",
                  color: "#00ff00",
                }}
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #ff0000",
                  color: "#ff0000",
                }}
                onClick={() => {
                  if (showDeleteConfirm !== null) {
                    deleteCharacterMutation.mutate(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }
                }}
              >
                DELETE
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
