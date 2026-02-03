import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
import { PlusCircle, Trash2, Play, Swords } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, buildUrl } from "@shared/routes";
import { cn } from "@/lib/utils";

// Class colors
const classColors: Record<string, string> = {
  warrior: "text-amber-600",
  paladin: "text-pink-400",
  hunter: "text-green-500",
  rogue: "text-yellow-500",
  priest: "text-gray-400",
  mage: "text-cyan-400",
  druid: "text-orange-500",
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
  // Calculate XP percentage (simplified - would use actual XP formula)
  const xpPercent = (character.experience % 1000) / 10;

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={cn("text-xl", classColors[character.characterClass])}>
            {character.name}
          </CardTitle>
          <Badge variant="outline">Level {character.level}</Badge>
        </div>
        <CardDescription className="capitalize">
          {character.characterClass}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-red-500">Health</span>
            <span>{character.currentHealth} / {character.maxHealth}</span>
          </div>
          <Progress
            value={(character.currentHealth / character.maxHealth) * 100}
            className="h-2"
          />
        </div>

        {/* XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-purple-500">Experience</span>
            <span>{Math.floor(xpPercent)}%</span>
          </div>
          <Progress value={xpPercent} className="h-2 bg-purple-100" />
        </div>

        {/* Gold */}
        <div className="flex justify-between text-sm">
          <span className="text-yellow-600">Gold</span>
          <span className="font-medium">{character.gold.toLocaleString()}</span>
        </div>

        {/* Activity Status */}
        {character.currentActivity && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Swords className="w-4 h-4 animate-pulse" />
            <span className="capitalize">Currently {character.currentActivity}...</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {character.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                character and all associated progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button onClick={onPlay} className="flex-1">
          <Play className="w-4 h-4 mr-2" />
          Play
        </Button>
      </CardFooter>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
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
    // Navigate to game with selected character
    navigate(`/game/${characterId}`);
  };

  const maxCharacters = 10;
  const canCreateMore = (characters?.length ?? 0) < maxCharacters;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Idle Raiders</h1>
          <p className="text-muted-foreground text-lg">
            Select a character or create a new one to begin your adventure
          </p>
        </div>

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
            <Card
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-dashed"
              onClick={() => navigate("/create")}
            >
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-muted-foreground">
                <PlusCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Create New Character</p>
                <p className="text-sm">
                  {characters?.length ?? 0}/{maxCharacters} slots used
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Empty State */}
        {!isLoading && (!characters || characters.length === 0) && (
          <div className="text-center py-12">
            <Swords className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No Characters Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first character to start your journey!
            </p>
            <Button size="lg" onClick={() => navigate("/create")}>
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Character
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
