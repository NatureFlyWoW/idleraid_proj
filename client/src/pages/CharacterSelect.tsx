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
import { cn } from "@/lib/utils";
import { ASCIIHeader, TerminalPanel, TerminalButton } from "@/components/game/TerminalPanel";

// Class colors matching WoW palette
const classColors: Record<string, string> = {
  warrior: "text-[#C79C6E]",
  paladin: "text-[#F58CBA]",
  hunter: "text-[#ABD473]",
  rogue: "text-[#FFF569]",
  priest: "text-[#FFFFFF]",
  mage: "text-[#69CCF0]",
  druid: "text-[#FF7D0A]",
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

function CharacterCard({
  character,
  onPlay,
  onDelete,
}: {
  character: Character;
  onPlay: () => void;
  onDelete: () => void;
}) {
  const xpPercent = (character.experience % 1000) / 10;
  const healthPercent = (character.currentHealth / character.maxHealth) * 100;

  // Generate ASCII health bar
  const barLength = 20;
  const filledBars = Math.floor((healthPercent / 100) * barLength);
  const healthBar = "█".repeat(filledBars) + "░".repeat(barLength - filledBars);

  const xpBars = Math.floor((xpPercent / 100) * barLength);
  const xpBar = "█".repeat(xpBars) + "░".repeat(barLength - xpBars);

  return (
    <TerminalPanel variant="green" className="hover:border-green-500 transition-all">
      <div className="space-y-3">
        {/* Character Name & Level */}
        <div className="flex items-center justify-between border-b border-green-800 pb-2">
          <h3 className={cn("text-lg font-bold uppercase tracking-wider", classColors[character.characterClass])}>
            {character.name}
          </h3>
          <span className="text-yellow-400 text-sm font-bold px-2 py-1 border border-yellow-600">
            LVL {character.level}
          </span>
        </div>

        {/* Class */}
        <div className="text-xs text-green-500 uppercase tracking-wider">
          {character.characterClass}
        </div>

        {/* Health Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-red-400">HP</span>
            <span className="text-green-300">
              {character.currentHealth}/{character.maxHealth}
            </span>
          </div>
          <pre className="text-red-500 text-xs leading-none">{healthBar}</pre>
        </div>

        {/* XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-purple-400">XP</span>
            <span className="text-green-300">{Math.floor(xpPercent)}%</span>
          </div>
          <pre className="text-purple-500 text-xs leading-none">{xpBar}</pre>
        </div>

        {/* Gold */}
        <div className="flex justify-between text-xs border-t border-green-800 pt-2">
          <span className="text-yellow-600">GOLD</span>
          <span className="text-yellow-400 font-bold">{character.gold.toLocaleString()}</span>
        </div>

        {/* Activity Status */}
        {character.currentActivity && (
          <div className="text-xs text-cyan-400 border border-cyan-700 p-2 bg-cyan-950/20">
            <span className="animate-pulse">▶</span> {character.currentActivity.toUpperCase()}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <TerminalButton variant="danger" className="flex-1 text-xs py-1">
                [X] DEL
              </TerminalButton>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black border-2 border-red-600 font-mono">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-400 uppercase">
                  Delete {character.name}?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-green-400 font-mono">
                  This action cannot be undone. This will permanently delete your character and all associated progress.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="terminal-button">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-transparent border-2 border-red-600 text-red-400 hover:bg-red-600/20"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <TerminalButton onClick={onPlay} className="flex-1 text-xs py-1">
            [▶] PLAY
          </TerminalButton>
        </div>
      </div>
    </TerminalPanel>
  );
}

function LoadingSkeleton() {
  return (
    <TerminalPanel variant="green">
      <div className="space-y-3 animate-pulse">
        <div className="h-6 bg-green-900/30 w-3/4"></div>
        <div className="h-4 bg-green-900/30 w-1/2"></div>
        <div className="h-3 bg-green-900/30 w-full"></div>
        <div className="h-3 bg-green-900/30 w-full"></div>
        <div className="h-8 bg-green-900/30 w-full"></div>
      </div>
    </TerminalPanel>
  );
}

export default function CharacterSelect() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handlePlay = (characterId: number) => {
    navigate(`/game/${characterId}`);
  };

  const maxCharacters = 10;
  const canCreateMore = (characters?.length ?? 0) < maxCharacters;

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* ASCII Header */}
        <ASCIIHeader variant="double">Idle Raiders</ASCIIHeader>

        <p className="text-center text-green-500 mb-8 font-mono text-sm uppercase tracking-wide">
          &gt;&gt; Select a character or create a new one to begin your adventure &lt;&lt;
        </p>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Characters */}
          {isLoading ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : (
            characters?.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onPlay={() => handlePlay(character.id)}
                onDelete={() => deleteCharacterMutation.mutate(character.id)}
              />
            ))
          )}

          {/* Create New Character Card */}
          {canCreateMore && (
            <TerminalPanel
              variant="yellow"
              className="cursor-pointer hover:border-yellow-500 transition-all hover:shadow-[0_0_15px_rgba(202,138,4,0.3)]"
              onClick={() => navigate("/create")}
            >
              <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-yellow-400">
                <pre className="text-5xl mb-4">╋</pre>
                <p className="text-lg font-bold uppercase tracking-wider mb-2">
                  Create New Character
                </p>
                <p className="text-xs text-yellow-600">
                  {characters?.length ?? 0}/{maxCharacters} slots used
                </p>
              </div>
            </TerminalPanel>
          )}
        </div>

        {/* Empty State */}
        {!isLoading && (!characters || characters.length === 0) && (
          <div className="text-center py-12">
            <TerminalPanel variant="cyan" className="max-w-md mx-auto">
              <pre className="text-6xl text-cyan-400 mb-4">⚔</pre>
              <h2 className="text-2xl font-bold mb-2 text-cyan-400 uppercase">
                No Characters Yet
              </h2>
              <p className="text-green-400 mb-6 text-sm">
                Create your first character to start your journey!
              </p>
              <TerminalButton
                onClick={() => navigate("/create")}
                variant="primary"
                className="w-full"
              >
                [+] Create Character
              </TerminalButton>
            </TerminalPanel>
          </div>
        )}

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
