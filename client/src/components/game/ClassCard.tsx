import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClassInfo {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  armorType: string;
}

interface ClassCardProps {
  classInfo: ClassInfo;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

// Class colors matching WoW Classic theming
const classColors: Record<string, string> = {
  warrior: "bg-amber-700",
  paladin: "bg-pink-400",
  hunter: "bg-green-500",
  rogue: "bg-yellow-400",
  priest: "bg-gray-100",
  mage: "bg-cyan-400",
  druid: "bg-orange-500",
};

const resourceColors: Record<string, string> = {
  rage: "bg-red-500 text-white",
  mana: "bg-blue-500 text-white",
  energy: "bg-yellow-500 text-black",
};

const armorLabels: Record<string, string> = {
  cloth: "Cloth",
  leather: "Leather",
  mail: "Mail",
  plate: "Plate",
};

export function ClassCard({ classInfo, selected, onClick, disabled }: ClassCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:scale-105 hover:shadow-lg",
        selected && "ring-2 ring-primary shadow-lg",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={cn("w-4 h-4 rounded-full", classColors[classInfo.id] || "bg-gray-400")} />
            {classInfo.name}
          </CardTitle>
          {disabled && (
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          )}
        </div>
        <CardDescription className="text-sm">
          {classInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          <Badge className={cn("text-xs", resourceColors[classInfo.resourceType])}>
            {classInfo.resourceType.charAt(0).toUpperCase() + classInfo.resourceType.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {armorLabels[classInfo.armorType] || classInfo.armorType}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
