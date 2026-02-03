import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Map,
  Swords,
  Backpack,
  Castle,
  Trophy,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { api, buildUrl } from "@shared/routes";
import { cn } from "@/lib/utils";
import { OfflineProgressModal, useOfflineProgress } from "@/components/game/OfflineProgressModal";

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
  currentResource: number;
  maxResource: number;
  baseStrength: number;
  baseAgility: number;
  baseIntellect: number;
  baseStamina: number;
  baseSpirit: number;
  currentActivity: string | null;
  activityStartedAt: string | null;
  activityCompletesAt: string | null;
}

function StatBar({
  label,
  current,
  max,
  color,
}: {
  label: string;
  current: number;
  max: number;
  color: string;
}) {
  const percent = max > 0 ? (current / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={color}>{label}</span>
        <span>
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <Progress value={percent} className="h-3" />
    </div>
  );
}

function CharacterPanel({ character }: { character: Character }) {
  // Get resource type based on class
  const resourceType =
    character.characterClass === "warrior"
      ? "Rage"
      : character.characterClass === "rogue"
      ? "Energy"
      : "Mana";

  const resourceColor =
    character.characterClass === "warrior"
      ? "text-red-500"
      : character.characterClass === "rogue"
      ? "text-yellow-500"
      : "text-blue-500";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(classColors[character.characterClass])}>
            {character.name}
          </CardTitle>
          <Badge variant="outline">Level {character.level}</Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {character.characterClass}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health */}
        <StatBar
          label="Health"
          current={character.currentHealth}
          max={character.maxHealth}
          color="text-red-500"
        />

        {/* Resource */}
        <StatBar
          label={resourceType}
          current={character.currentResource}
          max={character.maxResource}
          color={resourceColor}
        />

        {/* XP */}
        <StatBar
          label="Experience"
          current={character.experience % 1000}
          max={1000}
          color="text-purple-500"
        />

        {/* Gold */}
        <div className="flex justify-between pt-2 border-t">
          <span className="text-yellow-600 font-medium">Gold</span>
          <span className="font-bold">{character.gold.toLocaleString()}</span>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Strength</span>
            <span className="font-medium">{character.baseStrength}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Agility</span>
            <span className="font-medium">{character.baseAgility}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Intellect</span>
            <span className="font-medium">{character.baseIntellect}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stamina</span>
            <span className="font-medium">{character.baseStamina}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Spirit</span>
            <span className="font-medium">{character.baseSpirit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityPanel({ character }: { character: Character }) {
  if (!character.currentActivity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="w-5 h-5" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p className="mb-4">Your character is idle.</p>
          <p className="text-sm">
            Start an activity from the World Map or Dungeons tab!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate progress
  let progressPercent = 0;
  if (character.activityStartedAt && character.activityCompletesAt) {
    const now = Date.now();
    const start = new Date(character.activityStartedAt).getTime();
    const end = new Date(character.activityCompletesAt).getTime();
    progressPercent = Math.min(100, ((now - start) / (end - start)) * 100);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Swords className="w-5 h-5 animate-pulse" />
          Current Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-lg font-medium capitalize">
            {character.currentActivity}
          </p>
          <Progress value={progressPercent} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {Math.floor(progressPercent)}% complete
          </p>
        </div>
        <Button variant="destructive" className="w-full">
          Stop Activity
        </Button>
      </CardContent>
    </Card>
  );
}

function WorldMapTab() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Elwynn Forest</CardTitle>
          <p className="text-muted-foreground">Level 1-10 | Starting Zone</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            The peaceful forests around Stormwind, home to wolves and kobolds.
          </p>
          <Button className="w-full">
            Start Questing
          </Button>
        </CardContent>
      </Card>

      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Westfall</CardTitle>
          <p className="text-muted-foreground">Level 10-20 | Locked</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Reach level 10 to unlock this zone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function DungeonsTab() {
  return (
    <div className="grid gap-4">
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Deadmines</CardTitle>
          <p className="text-muted-foreground">Level 15-21 | Locked</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Reach level 15 to enter this dungeon.
          </p>
        </CardContent>
      </Card>

      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Wailing Caverns</CardTitle>
          <p className="text-muted-foreground">Level 15-25 | Locked</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Reach level 15 to enter this dungeon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function InventoryTab() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Backpack className="w-12 h-12 mx-auto mb-4" />
      <p>Your inventory is empty.</p>
      <p className="text-sm mt-2">
        Complete activities to earn items!
      </p>
    </div>
  );
}

export default function Game() {
  const params = useParams<{ characterId: string }>();
  const [, navigate] = useLocation();

  const characterId = parseInt(params.characterId || "0");

  const { data: character, isLoading } = useQuery({
    queryKey: ["character", characterId],
    queryFn: async () => {
      const response = await fetch(
        buildUrl(api.characters.get.path, { id: characterId })
      );
      if (!response.ok) throw new Error("Failed to fetch character");
      return response.json() as Promise<Character>;
    },
    enabled: characterId > 0,
  });

  // Offline progress modal
  const {
    showModal: showOfflineModal,
    progress: offlineProgress,
    checkOfflineProgress,
    closeModal: closeOfflineModal,
  } = useOfflineProgress(characterId);

  // Check for offline progress on mount (after character is loaded)
  useEffect(() => {
    if (character && characterId > 0) {
      checkOfflineProgress();
    }
  }, [character, characterId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96 col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-xl mb-4">Character not found</p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Character Select
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Characters
          </Button>
          <h1 className="text-2xl font-bold">Idle Raiders</h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Character Info */}
          <div className="space-y-4">
            <CharacterPanel character={character} />
            <ActivityPanel character={character} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="world" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="character" className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Character</span>
                </TabsTrigger>
                <TabsTrigger value="world" className="flex items-center gap-1">
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">World</span>
                </TabsTrigger>
                <TabsTrigger value="dungeons" className="flex items-center gap-1">
                  <Castle className="w-4 h-4" />
                  <span className="hidden sm:inline">Dungeons</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-1">
                  <Backpack className="w-4 h-4" />
                  <span className="hidden sm:inline">Inventory</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="character" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Character Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Detailed character stats, equipment, and talents will be displayed here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="world" className="mt-4">
                <WorldMapTab />
              </TabsContent>

              <TabsContent value="dungeons" className="mt-4">
                <DungeonsTab />
              </TabsContent>

              <TabsContent value="inventory" className="mt-4">
                <InventoryTab />
              </TabsContent>

              <TabsContent value="achievements" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4" />
                    <p>No achievements unlocked yet.</p>
                    <p className="text-sm mt-2">
                      Complete activities to earn achievements!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Offline Progress Modal */}
      {offlineProgress && (
        <OfflineProgressModal
          isOpen={showOfflineModal}
          onClose={closeOfflineModal}
          characterId={characterId}
          characterName={character.name}
          characterClass={character.characterClass}
          currentLevel={character.level}
          currentXp={character.experience}
          xpToNextLevel={1000} // TODO: Get from game config based on level
          progress={offlineProgress}
        />
      )}
    </div>
  );
}
