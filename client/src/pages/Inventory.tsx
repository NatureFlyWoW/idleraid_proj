import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { api, buildUrl } from "@shared/routes";
import { InventoryGridSkeleton, ItemSlotSkeleton } from "@/components/game/LoadingStates";
import { ASCIIHeader, TerminalPanel, TerminalButton } from "@/components/game/TerminalPanel";
import { ItemSprite, mapSlotToItemType } from "@/components/game/items";

// ============================================================================
// INVENTORY PAGE - Grid of items with tooltips
// ============================================================================

// Rarity colors
const RARITY_COLORS: Record<string, string> = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

const RARITY_NAMES: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

// Equipment slot display names
const SLOT_NAMES: Record<string, string> = {
  head: "Head",
  neck: "Neck",
  shoulders: "Shoulders",
  chest: "Chest",
  back: "Back",
  wrist: "Wrist",
  hands: "Hands",
  waist: "Waist",
  legs: "Legs",
  feet: "Feet",
  ring: "Ring",
  trinket: "Trinket",
  mainHand: "Main Hand",
  offHand: "Off Hand",
  twoHand: "Two-Hand",
};

interface Item {
  id: number;
  name: string;
  description?: string;
  slot: string;
  rarity: string;
  itemLevel: number;
  requiredLevel: number;
  stats: {
    strength?: number;
    agility?: number;
    intellect?: number;
    stamina?: number;
    spirit?: number;
    critRating?: number;
    attackPower?: number;
    spellPower?: number;
  };
  sellPrice?: number;
}

interface Character {
  id: number;
  name: string;
  characterClass: string;
  level: number;
  gold: number;
}

// ============================================================================
// ITEM TOOLTIP COMPONENT
// ============================================================================

function ItemTooltip({ item, position }: { item: Item; position: { x: number; y: number } }) {
  const rarityColor = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;
  const hasStats = Object.values(item.stats).some((v) => v && v > 0);

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 15,
        top: position.y,
        transform: "translateY(-50%)",
      }}
    >
      <div
        className="bg-[#0d0b08] border-2 p-3 font-mono text-xs min-w-[200px] max-w-[280px] shadow-xl"
        style={{ borderColor: rarityColor }}
      >
        {/* Item Name */}
        <div className="font-bold" style={{ color: rarityColor }}>
          {item.name}
        </div>

        {/* Item Level */}
        <div className="text-stone-500 text-[10px]">
          Item Level {item.itemLevel}
        </div>

        {/* Divider */}
        <div className="border-t border-stone-700 my-2" />

        {/* Slot and Type */}
        <div className="flex justify-between text-stone-400">
          <span>{SLOT_NAMES[item.slot] || item.slot}</span>
          <span>{RARITY_NAMES[item.rarity]}</span>
        </div>

        {/* Stats */}
        {hasStats && (
          <>
            <div className="border-t border-stone-700 my-2" />
            <div className="text-green-400 space-y-0.5">
              {item.stats.strength && item.stats.strength > 0 && (
                <div>+{item.stats.strength} Strength</div>
              )}
              {item.stats.agility && item.stats.agility > 0 && (
                <div>+{item.stats.agility} Agility</div>
              )}
              {item.stats.intellect && item.stats.intellect > 0 && (
                <div>+{item.stats.intellect} Intellect</div>
              )}
              {item.stats.stamina && item.stats.stamina > 0 && (
                <div>+{item.stats.stamina} Stamina</div>
              )}
              {item.stats.spirit && item.stats.spirit > 0 && (
                <div>+{item.stats.spirit} Spirit</div>
              )}
              {item.stats.critRating && item.stats.critRating > 0 && (
                <div>+{item.stats.critRating} Critical Strike</div>
              )}
              {item.stats.attackPower && item.stats.attackPower > 0 && (
                <div>+{item.stats.attackPower} Attack Power</div>
              )}
              {item.stats.spellPower && item.stats.spellPower > 0 && (
                <div>+{item.stats.spellPower} Spell Power</div>
              )}
            </div>
          </>
        )}

        {/* Description */}
        {item.description && (
          <>
            <div className="border-t border-stone-700 my-2" />
            <div className="text-amber-400/80 italic text-[10px]">
              "{item.description}"
            </div>
          </>
        )}

        {/* Requirements */}
        {item.requiredLevel > 1 && (
          <>
            <div className="border-t border-stone-700 my-2" />
            <div className="text-stone-500">
              Requires Level {item.requiredLevel}
            </div>
          </>
        )}

        {/* Sell Price */}
        {item.sellPrice !== undefined && item.sellPrice > 0 && (
          <>
            <div className="border-t border-stone-700 my-2" />
            <div className="text-stone-500">
              Sell Price:{" "}
              <span className="text-yellow-500">{item.sellPrice}g</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// INVENTORY SLOT COMPONENT
// ============================================================================

function InventorySlot({
  item,
  onHover,
  onLeave,
  onClick,
}: {
  item?: Item | null;
  onHover: (e: React.MouseEvent) => void;
  onLeave: () => void;
  onClick?: () => void;
}) {
  const rarityColor = item ? RARITY_COLORS[item.rarity] || RARITY_COLORS.common : "#166534";

  return (
    <div
      className={cn(
        "w-12 h-12 border-2 flex items-center justify-center cursor-pointer transition-all",
        "hover:brightness-125 hover:shadow-[0_0_5px_rgba(34,197,94,0.3)]",
        item ? "bg-black" : "bg-green-950/20"
      )}
      style={{ borderColor: rarityColor }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {item ? (
        <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
          <ItemSprite
            itemType={mapSlotToItemType(item.slot)}
            rarity={item.rarity as "common" | "uncommon" | "rare" | "epic" | "legendary"}
            size="small"
            showGlow={item.rarity !== "common"}
          />
        </div>
      ) : (
        <div className="text-green-900 text-xs">·</div>
      )}
    </div>
  );
}

// ============================================================================
// EQUIPMENT PANEL COMPONENT
// ============================================================================

function EquipmentPanel({
  equippedItems,
  onHoverItem,
  onLeaveItem,
  onUnequipItem,
}: {
  equippedItems: Record<string, Item | null>;
  onHoverItem: (item: Item, e: React.MouseEvent) => void;
  onLeaveItem: () => void;
  onUnequipItem: (item: Item) => void;
}) {
  const slots = [
    ["head", "neck", "shoulders"],
    ["chest", "back", "wrist"],
    ["hands", "waist", "legs"],
    ["feet", "ring1", "ring2"],
    ["mainHand", "offHand", "trinket1"],
  ];

  return (
    <div className="bg-black border-2 border-green-700 p-4 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
      <div className="text-green-400 font-mono text-xs mb-3 text-center uppercase">
        ═══ Equipped ═══
      </div>
      <p className="text-green-600 text-[10px] font-mono text-center mb-2">Click to unequip</p>
      <div className="space-y-2">
        {slots.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-2">
            {row.map((slotId) => {
              const item = equippedItems[slotId];
              return (
                <InventorySlot
                  key={slotId}
                  item={item}
                  onHover={(e) => item && onHoverItem(item, e)}
                  onLeave={onLeaveItem}
                  onClick={item ? () => onUnequipItem(item) : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BAG GRID COMPONENT
// ============================================================================

function BagGrid({
  items,
  bagSize,
  onHoverItem,
  onLeaveItem,
  onEquipItem,
}: {
  items: Item[];
  bagSize: number;
  onHoverItem: (item: Item, e: React.MouseEvent) => void;
  onLeaveItem: () => void;
  onEquipItem: (item: Item) => void;
}) {
  const slots = Array(bagSize).fill(null);

  // Fill slots with items
  items.forEach((item, idx) => {
    if (idx < bagSize) {
      slots[idx] = item;
    }
  });

  return (
    <div className="bg-black border-2 border-green-700 p-4 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
      <div className="text-green-400 font-mono text-xs mb-3 text-center uppercase">
        ═══ Bag ({items.length}/{bagSize}) ═══
      </div>
      <p className="text-green-600 text-[10px] font-mono text-center mb-2">Click to equip</p>
      <div className="grid grid-cols-6 gap-1">
        {slots.map((item, idx) => (
          <InventorySlot
            key={idx}
            item={item}
            onHover={(e) => item && onHoverItem(item, e)}
            onLeave={onLeaveItem}
            onClick={item ? () => onEquipItem(item) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN INVENTORY PAGE COMPONENT
// ============================================================================

export default function Inventory() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const characterId = parseInt(params.id || "0");
  const queryClient = useQueryClient();

  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch character data
  const { data: character, isLoading: charLoading, error: charError } = useQuery({
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

  // Fetch inventory from API
  const { data: inventoryData, isLoading: inventoryLoading, error: inventoryError } = useQuery({
    queryKey: ["inventory", characterId],
    queryFn: async () => {
      const response = await fetch(
        buildUrl(api.inventory.list.path, { characterId })
      );
      if (!response.ok) throw new Error("Failed to fetch inventory");
      return response.json();
    },
    enabled: characterId > 0,
  });

  // Equip item mutation
  const equipMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await fetch(
        buildUrl(api.inventory.equip.path, { characterId, itemId }),
        { method: "POST" }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to equip item");
      }
      return response.json();
    },
    onSuccess: () => {
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["inventory", characterId] });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(null), 3000);
    },
  });

  // Unequip item mutation
  const unequipMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await fetch(
        buildUrl(api.inventory.unequip.path, { characterId, itemId }),
        { method: "POST" }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to unequip item");
      }
      return response.json();
    },
    onSuccess: () => {
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["inventory", characterId] });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(null), 3000);
    },
  });

  // Handler for equipping bag items
  const handleEquipItem = (item: Item) => {
    equipMutation.mutate(item.id);
  };

  // Handler for unequipping equipped items
  const handleUnequipItem = (item: Item) => {
    unequipMutation.mutate(item.id);
  };

  // Process inventory data into bag items and equipped items
  const bagItems: Item[] = inventoryData?.filter((item: any) => !item.isEquipped).map((item: any) => ({
    id: item.id,
    name: item.name || `Item #${item.itemId}`,
    description: item.description,
    slot: item.slot || "trinket",
    rarity: item.rarity || "common",
    itemLevel: item.itemLevel || 1,
    requiredLevel: item.requiredLevel || 1,
    stats: item.stats || {},
    sellPrice: item.sellPrice || 0,
  })) || [];

  const equippedItems: Record<string, Item | null> = {
    head: null, neck: null, shoulders: null, chest: null, back: null,
    wrist: null, hands: null, waist: null, legs: null, feet: null,
    ring1: null, ring2: null, trinket1: null, mainHand: null, offHand: null,
  };

  // Populate equipped items from API data
  inventoryData?.filter((item: any) => item.isEquipped).forEach((item: any) => {
    const mappedItem: Item = {
      id: item.id,
      name: item.name || `Item #${item.itemId}`,
      description: item.description,
      slot: item.slot || "trinket",
      rarity: item.rarity || "common",
      itemLevel: item.itemLevel || 1,
      requiredLevel: item.requiredLevel || 1,
      stats: item.stats || {},
      sellPrice: item.sellPrice || 0,
    };
    if (item.slot && equippedItems.hasOwnProperty(item.slot)) {
      equippedItems[item.slot] = mappedItem;
    }
  });

  // Fallback mock data if API returns empty (for demo purposes)
  const fallbackBagItems: Item[] = [
    {
      id: 1,
      name: "Worn Leather Belt",
      slot: "waist",
      rarity: "common",
      itemLevel: 8,
      requiredLevel: 5,
      stats: { stamina: 2 },
      sellPrice: 12,
    },
    {
      id: 2,
      name: "Blade of Cunning",
      description: "A swift blade favored by rogues.",
      slot: "mainHand",
      rarity: "rare",
      itemLevel: 24,
      requiredLevel: 20,
      stats: { agility: 8, stamina: 5, critRating: 12 },
      sellPrice: 85,
    },
    {
      id: 3,
      name: "Shadowfang",
      description: "Darkness seeps from this ancient blade.",
      slot: "mainHand",
      rarity: "epic",
      itemLevel: 32,
      requiredLevel: 28,
      stats: { strength: 15, agility: 10, attackPower: 24 },
      sellPrice: 250,
    },
    {
      id: 4,
      name: "Minor Health Potion",
      slot: "trinket",
      rarity: "common",
      itemLevel: 5,
      requiredLevel: 1,
      stats: {},
      description: "Restores 100 health.",
      sellPrice: 5,
    },
  ];

  // Use API data if available, otherwise fallback to mock
  const displayBagItems = bagItems.length > 0 ? bagItems : fallbackBagItems;
  const displayEquippedItems = equippedItems;

  const handleHoverItem = (item: Item, e: React.MouseEvent) => {
    setHoveredItem(item);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleLeaveItem = () => {
    setHoveredItem(null);
  };

  if (charLoading || inventoryLoading) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-4xl mx-auto">
          <ASCIIHeader variant="double">Inventory</ASCIIHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TerminalPanel variant="green">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-green-900/30 rounded w-1/2 mx-auto"></div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(15)].map((_, i) => (
                    <ItemSlotSkeleton key={i} size="medium" />
                  ))}
                </div>
              </div>
            </TerminalPanel>
            <TerminalPanel variant="green">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-green-900/30 rounded w-1/2 mx-auto"></div>
                <InventoryGridSkeleton slots={24} />
              </div>
            </TerminalPanel>
          </div>
        </div>
      </div>
    );
  }

  if (charError || inventoryError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
        <ASCIIHeader variant="double">Error</ASCIIHeader>
        <TerminalPanel variant="red" className="max-w-md">
          <div className="text-center">
            <p className="text-red-400 mb-4">
              {charError?.message || inventoryError?.message || "Failed to load inventory"}
            </p>
            <div className="flex gap-4 justify-center">
              <TerminalButton variant="secondary" onClick={() => navigate("/")}>
                [←] Characters
              </TerminalButton>
              <TerminalButton variant="primary" onClick={() => window.location.reload()}>
                [↻] Retry
              </TerminalButton>
            </div>
          </div>
        </TerminalPanel>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
        <TerminalPanel variant="red" className="max-w-md">
          <div className="text-center">
            <p className="text-red-400 mb-4">Character not found</p>
            <TerminalButton variant="secondary" onClick={() => navigate("/")}>
              [←] Back to Characters
            </TerminalButton>
          </div>
        </TerminalPanel>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <TerminalButton variant="secondary" onClick={() => navigate(`/game/${characterId}`)}>
            [←] Back
          </TerminalButton>
          <h1 className="text-xl font-bold text-yellow-400 font-mono uppercase tracking-wider">
            Inventory
          </h1>
          <div className="w-24" />
        </div>

        {/* Gold Display */}
        <TerminalPanel variant="yellow" className="mb-6">
          <div className="text-center font-mono text-sm">
            <span className="text-yellow-600">Gold:</span>{" "}
            <span className="text-yellow-400 font-bold">{character.gold.toLocaleString()} G</span>
          </div>
        </TerminalPanel>

        {/* Error Message */}
        {errorMessage && (
          <TerminalPanel variant="red" className="mb-4">
            <div className="text-center text-red-400 font-mono text-sm">
              {errorMessage}
            </div>
          </TerminalPanel>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Panel */}
          <EquipmentPanel
            equippedItems={displayEquippedItems}
            onHoverItem={handleHoverItem}
            onLeaveItem={handleLeaveItem}
            onUnequipItem={handleUnequipItem}
          />

          {/* Bag Grid */}
          <BagGrid
            items={displayBagItems}
            bagSize={24}
            onHoverItem={handleHoverItem}
            onLeaveItem={handleLeaveItem}
            onEquipItem={handleEquipItem}
          />
        </div>

        {/* Inventory Stats */}
        <TerminalPanel variant="green" className="mt-6">
          <div className="font-mono text-xs text-green-600 text-center mb-2 uppercase">
            ═══ Inventory Summary ═══
          </div>
          <div className="flex justify-center gap-8 font-mono text-xs">
            <span>
              <span className="text-green-600">Items:</span>{" "}
              <span className="text-green-400">{displayBagItems.length}/24</span>
            </span>
            <span>
              <span className="text-green-600">Equipped:</span>{" "}
              <span className="text-cyan-400">
                {Object.values(displayEquippedItems).filter(Boolean).length}/15
              </span>
            </span>
            <span>
              <span className="text-green-600">Total Value:</span>{" "}
              <span className="text-yellow-400">
                {displayBagItems.reduce((sum, item) => sum + (item.sellPrice || 0), 0)}g
              </span>
            </span>
          </div>
        </TerminalPanel>

        {/* Quick Actions */}
        <div className="mt-4 flex justify-center gap-4">
          <TerminalButton
            variant="secondary"
            onClick={() => navigate(`/character/${characterId}/stats`)}
          >
            [☺] Character Sheet
          </TerminalButton>
          <TerminalButton
            variant="primary"
            onClick={() => navigate(`/game/${characterId}`)}
          >
            [▶] Return to Game
          </TerminalButton>
        </div>

        {/* ASCII Footer */}
        <div className="mt-8 text-center">
          <pre className="text-green-800 text-xs leading-tight">
            {"═".repeat(50)}
          </pre>
        </div>
      </div>

      {/* Item Tooltip */}
      {hoveredItem && <ItemTooltip item={hoveredItem} position={tooltipPosition} />}
    </div>
  );
}
