import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClassCard } from "@/components/game/ClassCard";
import { useToast } from "@/hooks/use-toast";
import { api, buildUrl } from "@shared/routes";

// All classes that will eventually be available
const ALL_CLASSES = [
  { id: "warrior", name: "Warrior", description: "Melee powerhouse that uses rage generated from combat.", resourceType: "rage", armorType: "plate", implemented: true },
  { id: "paladin", name: "Paladin", description: "Holy knight combining melee prowess with divine magic.", resourceType: "mana", armorType: "plate", implemented: false },
  { id: "hunter", name: "Hunter", description: "Ranged damage dealer with animal companions.", resourceType: "mana", armorType: "mail", implemented: false },
  { id: "rogue", name: "Rogue", description: "Stealthy assassin using energy for quick strikes.", resourceType: "energy", armorType: "leather", implemented: false },
  { id: "priest", name: "Priest", description: "Devoted healer who can also harness shadow magic.", resourceType: "mana", armorType: "cloth", implemented: true },
  { id: "mage", name: "Mage", description: "Master of arcane, fire, and frost magic.", resourceType: "mana", armorType: "cloth", implemented: true },
  { id: "druid", name: "Druid", description: "Shapeshifter who can fill any role.", resourceType: "mana", armorType: "leather", implemented: false },
];

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
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Create New Character</CardTitle>
          <CardDescription>
            Choose your class and begin your adventure in Idle Raiders
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Character Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">Character Name</Label>
              <Input
                id="name"
                placeholder="Enter a name for your character..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                className="max-w-md text-lg"
              />
              <p className="text-sm text-muted-foreground">
                {name.length}/24 characters
              </p>
            </div>

            {/* Class Selection */}
            <div className="space-y-4">
              <Label className="text-lg">Select Class</Label>
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
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {selectedClassInfo.name} Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {selectedClassInfo.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Resource:</span>{" "}
                      <span className="capitalize">{selectedClassInfo.resourceType}</span>
                    </div>
                    <div>
                      <span className="font-medium">Armor:</span>{" "}
                      <span className="capitalize">{selectedClassInfo.armorType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !selectedClass || createCharacterMutation.isPending}
            >
              {createCharacterMutation.isPending ? "Creating..." : "Create Character"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
