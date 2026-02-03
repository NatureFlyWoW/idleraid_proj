import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Swords, Heart, Zap, Shield, Skull, Sparkles, AlertTriangle } from "lucide-react";

// ============================================================================
// COMBAT LOG COMPONENT - Real-time combat event display
// ============================================================================

export type CombatEventType =
  | "attack"
  | "spell"
  | "heal"
  | "buff"
  | "debuff"
  | "damage_taken"
  | "dodge"
  | "parry"
  | "block"
  | "miss"
  | "crit"
  | "death"
  | "loot"
  | "xp"
  | "system";

export interface CombatEvent {
  id: string;
  timestamp: number;
  type: CombatEventType;
  source: string;
  target?: string;
  ability?: string;
  amount?: number;
  isCrit?: boolean;
  message?: string;
}

// Event type configuration
const EVENT_CONFIG: Record<
  CombatEventType,
  { icon: typeof Swords; color: string; bgColor: string }
> = {
  attack: { icon: Swords, color: "#f59e0b", bgColor: "#f59e0b20" },
  spell: { icon: Zap, color: "#8b5cf6", bgColor: "#8b5cf620" },
  heal: { icon: Heart, color: "#22c55e", bgColor: "#22c55e20" },
  buff: { icon: Sparkles, color: "#3b82f6", bgColor: "#3b82f620" },
  debuff: { icon: AlertTriangle, color: "#ef4444", bgColor: "#ef444420" },
  damage_taken: { icon: Shield, color: "#ef4444", bgColor: "#ef444420" },
  dodge: { icon: Shield, color: "#6b7280", bgColor: "#6b728020" },
  parry: { icon: Shield, color: "#6b7280", bgColor: "#6b728020" },
  block: { icon: Shield, color: "#6b7280", bgColor: "#6b728020" },
  miss: { icon: Swords, color: "#6b7280", bgColor: "#6b728020" },
  crit: { icon: Swords, color: "#ff8000", bgColor: "#ff800020" },
  death: { icon: Skull, color: "#dc2626", bgColor: "#dc262620" },
  loot: { icon: Sparkles, color: "#fbbf24", bgColor: "#fbbf2420" },
  xp: { icon: Sparkles, color: "#a855f7", bgColor: "#a855f720" },
  system: { icon: AlertTriangle, color: "#94a3b8", bgColor: "#94a3b820" },
};

// ============================================================================
// SINGLE EVENT LINE
// ============================================================================

function CombatEventLine({ event }: { event: CombatEvent }) {
  const config = EVENT_CONFIG[event.type];
  const IconComponent = config.icon;

  // Format the event message
  const formatMessage = () => {
    switch (event.type) {
      case "attack":
        return (
          <>
            <span className="text-amber-400">{event.source}</span>
            {" hits "}
            <span className="text-red-400">{event.target}</span>
            {event.ability && (
              <>
                {" with "}
                <span className="text-amber-300">{event.ability}</span>
              </>
            )}
            {event.amount && (
              <>
                {" for "}
                <span className={event.isCrit ? "text-orange-400 font-bold" : "text-white"}>
                  {event.amount}
                  {event.isCrit && "*"}
                </span>
                {" damage"}
              </>
            )}
          </>
        );

      case "spell":
        return (
          <>
            <span className="text-amber-400">{event.source}</span>
            {" casts "}
            <span className="text-purple-400">{event.ability}</span>
            {event.target && (
              <>
                {" on "}
                <span className="text-red-400">{event.target}</span>
              </>
            )}
            {event.amount && (
              <>
                {" for "}
                <span className={event.isCrit ? "text-orange-400 font-bold" : "text-white"}>
                  {event.amount}
                  {event.isCrit && "*"}
                </span>
                {" damage"}
              </>
            )}
          </>
        );

      case "heal":
        return (
          <>
            <span className="text-amber-400">{event.source}</span>
            {event.ability && (
              <>
                {"'s "}
                <span className="text-green-300">{event.ability}</span>
              </>
            )}
            {" heals "}
            <span className="text-green-400">{event.target || event.source}</span>
            {" for "}
            <span className={event.isCrit ? "text-orange-400 font-bold" : "text-green-400"}>
              {event.amount}
              {event.isCrit && "*"}
            </span>
          </>
        );

      case "buff":
        return (
          <>
            <span className="text-amber-400">{event.source}</span>
            {" gains "}
            <span className="text-blue-400">{event.ability}</span>
          </>
        );

      case "debuff":
        return (
          <>
            <span className="text-red-400">{event.target}</span>
            {" is afflicted by "}
            <span className="text-red-300">{event.ability}</span>
          </>
        );

      case "damage_taken":
        return (
          <>
            <span className="text-red-400">{event.target}</span>
            {" takes "}
            <span className="text-red-300">{event.amount}</span>
            {" damage from "}
            <span className="text-amber-400">{event.source}</span>
          </>
        );

      case "dodge":
        return (
          <>
            <span className="text-green-400">{event.target}</span>
            {" dodges "}
            <span className="text-amber-400">{event.source}</span>
            {"'s attack"}
          </>
        );

      case "parry":
        return (
          <>
            <span className="text-green-400">{event.target}</span>
            {" parries "}
            <span className="text-amber-400">{event.source}</span>
            {"'s attack"}
          </>
        );

      case "block":
        return (
          <>
            <span className="text-green-400">{event.target}</span>
            {" blocks "}
            <span className="text-stone-400">{event.amount}</span>
            {" damage"}
          </>
        );

      case "miss":
        return (
          <>
            <span className="text-amber-400">{event.source}</span>
            {"'s attack "}
            <span className="text-stone-500">misses</span>
          </>
        );

      case "death":
        return (
          <>
            <span className="text-red-400">{event.target}</span>
            <span className="text-red-600"> has died!</span>
          </>
        );

      case "loot":
        return (
          <>
            <span className="text-amber-400">{event.source}</span>
            {" receives "}
            <span className="text-yellow-400">{event.message}</span>
          </>
        );

      case "xp":
        return (
          <>
            <span className="text-amber-400">{event.source}</span>
            {" gains "}
            <span className="text-purple-400">{event.amount} XP</span>
          </>
        );

      case "system":
        return <span className="text-stone-400">{event.message}</span>;

      default:
        return event.message || "Unknown event";
    }
  };

  // Format timestamp
  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      className="flex items-start gap-2 py-1 px-2 text-xs font-mono border-l-2"
      style={{ borderLeftColor: config.color, backgroundColor: config.bgColor }}
    >
      <span className="text-stone-600 flex-shrink-0">[{formatTime(event.timestamp)}]</span>
      <IconComponent className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: config.color }} />
      <span className="text-stone-300">{formatMessage()}</span>
    </div>
  );
}

// ============================================================================
// COMBAT LOG CONTAINER
// ============================================================================

interface CombatLogProps {
  events: CombatEvent[];
  maxHeight?: number;
  autoScroll?: boolean;
  showTimestamp?: boolean;
  className?: string;
}

export function CombatLog({
  events,
  maxHeight = 300,
  autoScroll = true,
  className,
}: CombatLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events, autoScroll]);

  return (
    <div className={cn("bg-stone-900/80 border border-stone-700", className)}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-stone-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-mono text-amber-400">COMBAT LOG</span>
        </div>
        <span className="text-[10px] font-mono text-stone-500">{events.length} events</span>
      </div>

      {/* Events */}
      <div
        ref={containerRef}
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {events.length === 0 ? (
          <div className="p-4 text-center text-stone-500 text-xs font-mono">
            No combat events yet...
          </div>
        ) : (
          <div className="divide-y divide-stone-800">
            {events.map((event) => (
              <CombatEventLine key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT COMBAT LOG (for sidebars)
// ============================================================================

export function CompactCombatLog({
  events,
  maxEvents = 5,
  className,
}: {
  events: CombatEvent[];
  maxEvents?: number;
  className?: string;
}) {
  const recentEvents = events.slice(-maxEvents);

  return (
    <div className={cn("bg-stone-900/50 border border-stone-700", className)}>
      <div className="px-2 py-1 border-b border-stone-700">
        <span className="text-[10px] font-mono text-stone-500">RECENT</span>
      </div>
      <div className="text-[10px] font-mono">
        {recentEvents.length === 0 ? (
          <div className="p-2 text-stone-600">Waiting...</div>
        ) : (
          recentEvents.map((event) => {
            const config = EVENT_CONFIG[event.type];
            return (
              <div
                key={event.id}
                className="px-2 py-1 border-l-2 truncate"
                style={{ borderLeftColor: config.color }}
              >
                <span style={{ color: config.color }}>
                  {event.type === "attack" && `${event.source} → ${event.target}: ${event.amount}`}
                  {event.type === "heal" && `+${event.amount} HP`}
                  {event.type === "death" && `${event.target} died`}
                  {event.type === "dodge" && "Dodged!"}
                  {event.type === "miss" && "Miss!"}
                  {event.type === "xp" && `+${event.amount} XP`}
                  {!["attack", "heal", "death", "dodge", "miss", "xp"].includes(event.type) &&
                    event.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================================
// DEMO / SAMPLE DATA
// ============================================================================

export const SAMPLE_COMBAT_EVENTS: CombatEvent[] = [
  {
    id: "1",
    timestamp: Date.now() - 10000,
    type: "system",
    source: "System",
    message: "Combat started with Kobold Worker",
  },
  {
    id: "2",
    timestamp: Date.now() - 9000,
    type: "attack",
    source: "Thoradin",
    target: "Kobold Worker",
    ability: "Heroic Strike",
    amount: 45,
    isCrit: false,
  },
  {
    id: "3",
    timestamp: Date.now() - 8000,
    type: "damage_taken",
    source: "Kobold Worker",
    target: "Thoradin",
    amount: 12,
  },
  {
    id: "4",
    timestamp: Date.now() - 7000,
    type: "dodge",
    source: "Kobold Worker",
    target: "Thoradin",
  },
  {
    id: "5",
    timestamp: Date.now() - 6000,
    type: "attack",
    source: "Thoradin",
    target: "Kobold Worker",
    ability: "Mortal Strike",
    amount: 98,
    isCrit: true,
  },
  {
    id: "6",
    timestamp: Date.now() - 5000,
    type: "spell",
    source: "Thoradin",
    target: "Kobold Worker",
    ability: "Execute",
    amount: 156,
    isCrit: false,
  },
  {
    id: "7",
    timestamp: Date.now() - 4000,
    type: "death",
    source: "Thoradin",
    target: "Kobold Worker",
  },
  {
    id: "8",
    timestamp: Date.now() - 3000,
    type: "xp",
    source: "Thoradin",
    amount: 125,
  },
  {
    id: "9",
    timestamp: Date.now() - 2000,
    type: "loot",
    source: "Thoradin",
    message: "Large Candle x2",
  },
];

export function CombatLogDemo() {
  return (
    <div className="space-y-4">
      <CombatLog events={SAMPLE_COMBAT_EVENTS} maxHeight={250} />
      <div className="grid grid-cols-2 gap-4">
        <CompactCombatLog events={SAMPLE_COMBAT_EVENTS} maxEvents={3} />
        <CompactCombatLog events={SAMPLE_COMBAT_EVENTS.slice(0, 3)} maxEvents={5} />
      </div>
    </div>
  );
}
