import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { cn } from "@/lib/utils";
import { ASCIIHeader, TerminalPanel, TerminalButton } from "@/components/game/TerminalPanel";

// All classes that will eventually be available
const ALL_CLASSES = [
  { id: "warrior", name: "Warrior", description: "Melee powerhouse using rage from combat", resourceType: "rage", armorType: "plate", implemented: true },
  { id: "paladin", name: "Paladin", description: "Holy knight combining melee and divine magic", resourceType: "mana", armorType: "plate", implemented: false },
  { id: "hunter", name: "Hunter", description: "Ranged damage dealer with animal companions", resourceType: "mana", armorType: "mail", implemented: false },
  { id: "rogue", name: "Rogue", description: "Stealthy assassin using energy for strikes", resourceType: "energy", armorType: "leather", implemented: false },
  { id: "priest", name: "Priest", description: "Devoted healer who can harness shadow magic", resourceType: "mana", armorType: "cloth", implemented: true },
  { id: "mage", name: "Mage", description: "Master of arcane, fire, and frost magic", resourceType: "mana", armorType: "cloth", implemented: true },
  { id: "druid", name: "Druid", description: "Shapeshifter who can fill any role", resourceType: "mana", armorType: "leather", implemented: false },
];

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

interface ClassCardProps {
  classInfo: any;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}

function ClassCard({ classInfo, selected, onClick, disabled }: ClassCardProps) {
  const color = classColors[classInfo.id];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative border-2 p-4 cursor-pointer transition-all font-mono",
        selected && !disabled && "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]",
        !selected && !disabled && "border-green-700 hover:border-green-500",
        disabled && "border-stone-800 opacity-40 cursor-not-allowed"
      )}
      style={{
        backgroundColor: disabled ? "#0a0a0a" : selected ? "rgba(0, 0, 0, 0.8)" : "#000",
      }}
    >
      {/* Class icon placeholder (can be replaced with pixel art later) */}
      <div className="text-center mb-3">
        <pre className="text-4xl" style={{ color: disabled ? "#444" : color }}>
          {classInfo.id === "warrior" && "⚔"}
          {classInfo.id === "paladin" && "✚"}
          {classInfo.id === "hunter" && "⚑"}
          {classInfo.id === "rogue" && "†"}
          {classInfo.id === "priest" && "✞"}
          {classInfo.id === "mage" && "★"}
          {classInfo.id === "druid" && "❀"}
        </pre>
      </div>

      {/* Class Name */}
      <h3
        className="text-lg font-bold uppercase tracking-wider text-center mb-2"
        style={{ color: disabled ? "#666" : color }}
      >
        {classInfo.name}
      </h3>

      {/* Resource & Armor */}
      <div className="text-xs text-center space-y-1 mb-3">
        <div className={cn("uppercase", disabled ? "text-stone-600" : "text-green-500")}>
          {classInfo.resourceType}
        </div>
        <div className={cn("uppercase", disabled ? "text-stone-700" : "text-green-600")}>
          {classInfo.armorType} armor
        </div>
      </div>

      {/* Description */}
      <p className={cn("text-xs text-center leading-relaxed", disabled ? "text-stone-700" : "text-green-400")}>
        {classInfo.description}
      </p>

      {/* Status */}
      {disabled && (
        <div className="absolute top-2 right-2">
          <span className="text-xs text-stone-600 border border-stone-800 px-2 py-1 uppercase">
            Soon
          </span>
        </div>
      )}

      {selected && !disabled && (
        <div className="absolute -top-2 -right-2">
          <span className="text-yellow-400 text-2xl animate-pulse">✓</span>
        </div>
      )}
    </div>
  );
}

export default function CharacterCreate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
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
    const serverClass = serverClasses?.find((c: any) => c.id === localClass.id);
    return {
      ...localClass,
      ...serverClass,
      implemented: !!serverClass,
    };
  });

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
        description: `${character.name} the ${character.characterClass} is ready for adventure!`,
      });
      navigate("/");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a character name");
      return;
    }

    if (name.length < 2 || name.length > 24) {
      setError("Name must be between 2 and 24 characters");
      return;
    }

    if (!selectedClass) {
      setError("Please select a class");
      return;
    }

    createCharacterMutation.mutate({
      name: name.trim(),
      characterClass: selectedClass,
    });
  };

  const selectedClassInfo = classes.find(c => c.id === selectedClass);

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* ASCII Header */}
        <ASCIIHeader variant="double">Create New Character</ASCIIHeader>

        <p className="text-center text-green-500 mb-8 font-mono text-sm uppercase tracking-wide">
          &gt;&gt; Choose your class and begin your adventure in Idle Raiders &lt;&lt;
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Error Display */}
            {error && (
              <TerminalPanel variant="red">
                <div className="text-center">
                  <pre className="text-red-500 text-sm">
                    ╔════════════════════════════════╗{"\n"}
                    ║          ERROR                ║{"\n"}
                    ╚════════════════════════════════╝
                  </pre>
                  <p className="text-red-400 mt-2">{error}</p>
                </div>
              </TerminalPanel>
            )}

            {/* Character Name Input */}
            <TerminalPanel variant="green">
              <div className="space-y-3">
                <label className="text-green-400 uppercase tracking-wider text-sm font-bold">
                  Character Name
                </label>
                <input
                  type="text"
                  placeholder="Enter a name for your character..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={24}
                  className="w-full bg-black border-2 border-green-700 text-green-400 px-3 py-2 font-mono focus:border-green-500 focus:ring-2 focus:ring-green-500/50 focus:outline-none"
                />
                <div className="text-xs text-green-600">
                  {name.length}/24 characters
                </div>
              </div>
            </TerminalPanel>

            {/* Class Selection */}
            <div className="space-y-4">
              <div className="text-center">
                <pre className="text-green-600 text-xs leading-tight mb-2">
                  {"═".repeat(40)}
                </pre>
                <h2 className="text-yellow-400 uppercase tracking-wider text-lg font-bold">
                  Select Class
                </h2>
                <pre className="text-green-600 text-xs leading-tight mt-2">
                  {"═".repeat(40)}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((classInfo) => (
                  <ClassCard
                    key={classInfo.id}
                    classInfo={classInfo}
                    selected={selectedClass === classInfo.id}
                    onClick={() => classInfo.implemented && setSelectedClass(classInfo.id)}
                    disabled={!classInfo.implemented}
                  />
                ))}
              </div>
            </div>

            {/* Selected Class Preview */}
            {selectedClassInfo && (
              <TerminalPanel variant="yellow">
                <div className="text-center">
                  <h3
                    className="text-xl font-bold uppercase tracking-wider mb-3"
                    style={{ color: classColors[selectedClassInfo.id] }}
                  >
                    {selectedClassInfo.name} Preview
                  </h3>

                  <div className="space-y-3 text-left">
                    <p className="text-green-400 text-sm">
                      {selectedClassInfo.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm border-t border-yellow-800 pt-3">
                      <div>
                        <span className="text-yellow-600 uppercase text-xs">Resource:</span>{" "}
                        <span className="text-yellow-400 capitalize">{selectedClassInfo.resourceType}</span>
                      </div>
                      <div>
                        <span className="text-yellow-600 uppercase text-xs">Armor:</span>{" "}
                        <span className="text-yellow-400 capitalize">{selectedClassInfo.armorType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TerminalPanel>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 pt-4">
              <TerminalButton
                onClick={() => navigate("/")}
                variant="secondary"
                className="flex-1"
              >
                [←] Cancel
              </TerminalButton>
              <TerminalButton
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                variant="primary"
                disabled={!name.trim() || !selectedClass || createCharacterMutation.isPending}
                className="flex-1"
              >
                {createCharacterMutation.isPending ? "[...] Creating..." : "[✓] Create Character"}
              </TerminalButton>
            </div>
          </div>
        </form>

        {/* ASCII Footer */}
        <div className="mt-8 text-center">
          <pre className="text-green-800 text-xs leading-tight">
            {"═".repeat(60)}
          </pre>
        </div>
      </div>
    </div>
  );
}
