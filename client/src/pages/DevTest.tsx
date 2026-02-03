import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CharacterPortrait, ReferencePortrait } from "@/components/game/CharacterPortrait";
import { ClassCard } from "@/components/game/ClassCard";
import { OfflineProgressModalDemo } from "@/components/game/OfflineProgressModal";

// ============================================================================
// DEV TEST PAGE - Visual Component Sandbox
// ============================================================================

// Rarity colors
const RARITY_COLORS = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

// Class colors (WoW-style)
const CLASS_COLORS = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#FFFFFF",
  mage: "#69CCF0",
  druid: "#FF7D0A",
};

// Portrait colors for reference
const PORTRAIT_COLORS = {
  frostBright: "#00ffff",
  frostMid: "#66ffff",
  frostDark: "#0099cc",
  goldBright: "#ffd700",
  goldMid: "#ffaa00",
  goldDark: "#cc8800",
  fireBright: "#ffcc00",
  fireMid: "#ff6600",
  fireDark: "#ff3300",
  darkBase: "#1a1a1a",
  darkMid: "#333333",
  metalLight: "#aaaaaa",
  metalMid: "#888888",
  metalDark: "#666666",
};

// ============================================================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================================================

function Section({
  title,
  defaultOpen = true,
  children,
  badge,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  badge?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-8 border border-stone-700 bg-stone-900/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-stone-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-amber-500 font-mono">{isOpen ? "[-]" : "[+]"}</span>
          <span className="text-amber-400 font-mono font-bold">{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 bg-amber-900/50 text-amber-300 rounded font-mono">
              {badge}
            </span>
          )}
        </div>
        <span className="text-stone-500 font-mono text-xs">
          {isOpen ? "collapse" : "expand"}
        </span>
      </button>
      {isOpen && <div className="px-4 pb-4 pt-2 border-t border-stone-700">{children}</div>}
    </div>
  );
}

// ============================================================================
// COPY BUTTON COMPONENT
// ============================================================================

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "px-2 py-1 text-xs font-mono border transition-all",
        copied
          ? "border-green-500 text-green-400 bg-green-900/30"
          : "border-stone-600 text-stone-400 hover:border-stone-500 hover:text-stone-300"
      )}
    >
      {copied ? "Copied!" : label || "Copy"}
    </button>
  );
}

// ============================================================================
// COLOR SWATCH COMPONENT
// ============================================================================

function ColorSwatch({
  color,
  label,
  size = "md",
}: {
  color: string;
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="text-center">
      <div
        className={cn(sizes[size], "rounded border border-stone-600 mb-1")}
        style={{ backgroundColor: color }}
        title={color}
      />
      <div className="text-[10px] font-mono text-stone-500">{label}</div>
      <div className="text-[9px] font-mono text-stone-600">{color}</div>
    </div>
  );
}

// ============================================================================
// ASCII BOX COMPONENT
// ============================================================================

function ASCIIBox({
  title,
  children,
  variant = "single",
}: {
  title?: string;
  children: ReactNode;
  variant?: "single" | "double" | "rounded" | "heavy";
}) {
  const chars = {
    single: { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" },
    double: { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" },
    rounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│" },
    heavy: { tl: "┏", tr: "┓", bl: "┗", br: "┛", h: "━", v: "┃" },
  };
  const c = chars[variant];

  return (
    <div className="font-mono text-xs">
      <div className="text-amber-600">
        {c.tl}{c.h.repeat(title ? title.length + 2 : 20)}{c.tr}
      </div>
      {title && (
        <div className="text-amber-600">
          {c.v} <span className="text-amber-400">{title}</span> {c.v}
        </div>
      )}
      <div className="text-amber-600 flex">
        <span>{c.v}</span>
        <div className="flex-1 px-1 text-stone-300">{children}</div>
        <span>{c.v}</span>
      </div>
      <div className="text-amber-600">
        {c.bl}{c.h.repeat(title ? title.length + 2 : 20)}{c.br}
      </div>
    </div>
  );
}

// ============================================================================
// ANIMATION TEST COMPONENTS
// ============================================================================

function AnimationDemo({ name, children }: { name: string; children: ReactNode }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="border border-stone-700 p-3 bg-stone-900/50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-stone-400 text-xs font-mono">{name}</span>
        <button
          onClick={() => {
            setPlaying(false);
            setTimeout(() => setPlaying(true), 50);
          }}
          className="px-2 py-1 text-xs font-mono border border-stone-600 text-stone-400 hover:border-amber-600 hover:text-amber-400"
        >
          Play
        </button>
      </div>
      <div className="min-h-[60px] flex items-center justify-center">
        {playing ? children : <span className="text-stone-600 text-xs">Click Play</span>}
      </div>
    </div>
  );
}

// Combat hit animation
function CombatHitAnimation() {
  return (
    <div className="animate-pulse">
      <span className="text-red-500 text-2xl font-bold animate-bounce inline-block">
        -247
      </span>
      <span className="text-yellow-400 text-xs ml-2 animate-ping">CRIT!</span>
    </div>
  );
}

// Level up animation
function LevelUpAnimation() {
  return (
    <div className="text-center animate-pulse">
      <div className="text-amber-400 text-xl font-bold">LEVEL UP!</div>
      <div className="text-amber-300 text-sm">Level 42</div>
      <div className="text-green-400 text-xs mt-1">+5 Strength</div>
    </div>
  );
}

// Loot drop animation
function LootDropAnimation() {
  return (
    <div className="animate-bounce">
      <span style={{ color: RARITY_COLORS.epic }} className="font-mono text-sm font-bold">
        [Shadowfang]
      </span>
    </div>
  );
}

// ============================================================================
// PROGRESS BAR COMPONENT
// ============================================================================

function ProgressBar({
  value,
  max,
  color,
  label,
  showText = true,
}: {
  value: number;
  max: number;
  color: string;
  label?: string;
  showText?: boolean;
}) {
  const percent = Math.min(100, (value / max) * 100);

  return (
    <div className="w-full">
      {label && <div className="text-xs font-mono text-stone-500 mb-1">{label}</div>}
      <div className="h-4 bg-stone-800 border border-stone-700 relative overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white mix-blend-difference">
            {value} / {max}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// TOOLTIP DEMO
// ============================================================================

function TooltipDemo({
  rarity,
  children,
}: {
  rarity: keyof typeof RARITY_COLORS;
  children: ReactNode;
}) {
  return (
    <div
      className="p-3 bg-[#0a0908] border-2 max-w-xs font-mono text-xs"
      style={{ borderColor: RARITY_COLORS[rarity] }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// MAIN DEV TEST PAGE
// ============================================================================

export default function DevTest() {
  const [selectedClass, setSelectedClass] = useState("warrior");

  // Only render in development
  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-stone-500 font-mono">Dev page only available in development mode</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-300 p-6">
      {/* Header */}
      <header className="mb-8 border-b border-stone-700 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-400 font-mono">
              DEV TEST PAGE
            </h1>
            <p className="text-stone-500 font-mono text-sm">
              Visual Component Sandbox — Idle Raiders
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs font-mono border border-green-700">
              DEV MODE
            </span>
            <a
              href="/"
              className="px-3 py-1 text-xs font-mono border border-stone-600 text-stone-400 hover:border-amber-600 hover:text-amber-400"
            >
              Back to App
            </a>
          </div>
        </div>
      </header>

      {/* Quick Nav */}
      <nav className="mb-6 flex flex-wrap gap-2">
        {[
          "Portraits",
          "Colors",
          "Typography",
          "UI Components",
          "ASCII Art",
          "Animations",
          "Class Cards",
          "Modals",
        ].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            className="px-2 py-1 text-xs font-mono border border-stone-700 text-stone-500 hover:border-amber-600 hover:text-amber-400"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* ================================================================== */}
      {/* SECTION: CHARACTER PORTRAITS */}
      {/* ================================================================== */}
      <div id="portraits">
        <Section title="CHARACTER PORTRAITS" badge="4 reference + 3 generic">
          <div className="space-y-6">
            {/* Reference-Based Portraits */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">
                Reference-Based Portraits (from ref_pic/)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Frostblighted Armor</div>
                  <ReferencePortrait portraitType="frostblighted" borderRarity="rare" />
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Rogue Guildmaster</div>
                  <ReferencePortrait portraitType="rogue_guildmaster" borderRarity="epic" />
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Golden Paladin</div>
                  <ReferencePortrait portraitType="golden_paladin" borderRarity="legendary" />
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Ret Paladin + Flame</div>
                  <ReferencePortrait portraitType="ret_paladin_fire" borderRarity="epic" />
                </div>
              </div>
            </div>

            {/* Generic Class Portraits */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">
                Generic Class Portraits (Small / Medium / Large)
              </h3>
              <div className="flex flex-wrap gap-6 items-end">
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Small (8x12)</div>
                  <CharacterPortrait characterClass="warrior" size="small" borderRarity="common" />
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Medium (16x20)</div>
                  <CharacterPortrait characterClass="warrior" size="medium" borderRarity="uncommon" />
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Large (24x32)</div>
                  <CharacterPortrait characterClass="mage" size="large" borderRarity="rare" />
                </div>
              </div>
            </div>

            {/* Portrait States */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Portrait States</h3>
              <div className="flex flex-wrap gap-4">
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Idle</div>
                  <CharacterPortrait characterClass="warrior" size="medium" state="idle" borderRarity="rare" />
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Combat</div>
                  <CharacterPortrait characterClass="warrior" size="medium" state="combat" borderRarity="rare" />
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Damaged</div>
                  <CharacterPortrait characterClass="warrior" size="medium" state="damaged" borderRarity="rare" />
                </div>
                <div>
                  <div className="text-stone-500 text-xs font-mono mb-2">Casting</div>
                  <CharacterPortrait characterClass="mage" size="medium" state="casting" borderRarity="epic" />
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* SECTION: COLOR PALETTE */}
      {/* ================================================================== */}
      <div id="colors">
        <Section title="COLOR PALETTE TEST" badge="Rarity + Class + Portrait">
          <div className="space-y-6">
            {/* Rarity Colors */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Item Rarity Colors</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(RARITY_COLORS).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div
                      className="w-16 h-16 rounded border-2 mb-2"
                      style={{ borderColor: color, backgroundColor: "#0a0908" }}
                    />
                    <div className="font-mono text-xs capitalize" style={{ color }}>
                      {name}
                    </div>
                    <div className="font-mono text-[10px] text-stone-600">{color}</div>
                    <CopyButton text={color} label="Copy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Class Colors */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Class Colors (WoW-style)</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(CLASS_COLORS).map(([name, color]) => (
                  <ColorSwatch key={name} color={color} label={name} />
                ))}
              </div>
            </div>

            {/* Portrait Palette */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Portrait Color Palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-stone-900/50 p-3 border border-stone-700">
                  <div className="text-stone-400 text-xs mb-2">Frost/Ice</div>
                  <div className="flex gap-2">
                    <ColorSwatch color={PORTRAIT_COLORS.frostBright} label="Bright" size="sm" />
                    <ColorSwatch color={PORTRAIT_COLORS.frostMid} label="Mid" size="sm" />
                    <ColorSwatch color={PORTRAIT_COLORS.frostDark} label="Dark" size="sm" />
                  </div>
                </div>
                <div className="bg-stone-900/50 p-3 border border-stone-700">
                  <div className="text-stone-400 text-xs mb-2">Gold/Holy</div>
                  <div className="flex gap-2">
                    <ColorSwatch color={PORTRAIT_COLORS.goldBright} label="Bright" size="sm" />
                    <ColorSwatch color={PORTRAIT_COLORS.goldMid} label="Mid" size="sm" />
                    <ColorSwatch color={PORTRAIT_COLORS.goldDark} label="Dark" size="sm" />
                  </div>
                </div>
                <div className="bg-stone-900/50 p-3 border border-stone-700">
                  <div className="text-stone-400 text-xs mb-2">Fire/Flame</div>
                  <div className="flex gap-2">
                    <ColorSwatch color={PORTRAIT_COLORS.fireBright} label="Bright" size="sm" />
                    <ColorSwatch color={PORTRAIT_COLORS.fireMid} label="Mid" size="sm" />
                    <ColorSwatch color={PORTRAIT_COLORS.fireDark} label="Dark" size="sm" />
                  </div>
                </div>
                <div className="bg-stone-900/50 p-3 border border-stone-700">
                  <div className="text-stone-400 text-xs mb-2">Metal</div>
                  <div className="flex gap-2">
                    <ColorSwatch color={PORTRAIT_COLORS.metalLight} label="Light" size="sm" />
                    <ColorSwatch color={PORTRAIT_COLORS.metalMid} label="Mid" size="sm" />
                    <ColorSwatch color={PORTRAIT_COLORS.metalDark} label="Dark" size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* SECTION: TYPOGRAPHY */}
      {/* ================================================================== */}
      <div id="typography">
        <Section title="TYPOGRAPHY SCALE" badge="Headings + Body + Mono">
          <div className="space-y-4">
            <div className="border-b border-stone-800 pb-4">
              <h1 className="text-4xl font-bold text-amber-400">H1 - Page Title (text-4xl)</h1>
              <h2 className="text-2xl font-bold text-amber-400 mt-2">H2 - Section Header (text-2xl)</h2>
              <h3 className="text-xl font-semibold text-amber-500 mt-2">H3 - Subsection (text-xl)</h3>
              <h4 className="text-lg font-medium text-stone-300 mt-2">H4 - Card Title (text-lg)</h4>
            </div>

            <div className="border-b border-stone-800 pb-4">
              <p className="text-base text-stone-300">Body text (text-base) - Regular paragraph content.</p>
              <p className="text-sm text-stone-400 mt-2">Small text (text-sm) - Secondary information.</p>
              <p className="text-xs text-stone-500 mt-2">Extra small (text-xs) - Captions and labels.</p>
            </div>

            <div>
              <div className="font-mono text-base text-stone-300">Mono (font-mono) - Code and ASCII</div>
              <div className="font-mono text-sm text-amber-400 mt-2">Mono Small - UI elements</div>
              <div className="font-mono text-xs text-stone-500 mt-2">Mono XS - Technical details</div>
            </div>

            {/* ASCII Typography Test */}
            <div className="bg-stone-900/50 p-4 border border-stone-700 mt-4">
              <div className="font-mono text-amber-500 text-sm mb-2">ASCII Box Title Test:</div>
              <pre className="font-mono text-xs text-amber-600">
{`╔══════════════════════════════════════╗
║     THROGNAR THE MIGHTY              ║
║     Level 45 Warrior                 ║
╠══════════════════════════════════════╣
║  Health: [████████████░░░░] 75%      ║
╚══════════════════════════════════════╝`}
              </pre>
            </div>
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* SECTION: UI COMPONENTS */}
      {/* ================================================================== */}
      <div id="ui-components">
        <Section title="UI COMPONENTS" badge="Buttons + Progress + Tooltips">
          <div className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-amber-600 text-white font-mono text-sm hover:bg-amber-500 transition-colors">
                  Primary
                </button>
                <button className="px-4 py-2 border border-amber-600 text-amber-400 font-mono text-sm hover:bg-amber-900/30 transition-colors">
                  Secondary
                </button>
                <button className="px-4 py-2 border border-stone-600 text-stone-400 font-mono text-sm hover:border-stone-500 transition-colors">
                  Ghost
                </button>
                <button className="px-4 py-2 bg-red-600 text-white font-mono text-sm hover:bg-red-500 transition-colors">
                  Danger
                </button>
                <button className="px-4 py-2 bg-stone-700 text-stone-500 font-mono text-sm cursor-not-allowed" disabled>
                  Disabled
                </button>
              </div>
            </div>

            {/* Progress Bars */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Progress Bars</h3>
              <div className="space-y-3 max-w-md">
                <ProgressBar value={2829} max={3450} color="#dc2626" label="Health" />
                <ProgressBar value={32} max={100} color="#ea580c" label="Rage" />
                <ProgressBar value={450} max={500} color="#2563eb" label="Mana" />
                <ProgressBar value={80} max={100} color="#facc15" label="Energy" />
                <ProgressBar value={12450} max={24000} color="#a855f7" label="Experience" />
              </div>
            </div>

            {/* Item Tooltips */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Item Tooltips</h3>
              <div className="flex flex-wrap gap-4">
                <TooltipDemo rarity="common">
                  <div style={{ color: RARITY_COLORS.common }} className="font-bold">Worn Dagger</div>
                  <div className="text-stone-500 text-[10px]">Item Level 12</div>
                  <div className="text-stone-400 mt-2">12-18 Damage</div>
                </TooltipDemo>

                <TooltipDemo rarity="rare">
                  <div style={{ color: RARITY_COLORS.rare }} className="font-bold">Blade of Cunning</div>
                  <div className="text-stone-500 text-[10px]">Item Level 52</div>
                  <div className="text-stone-400 mt-2">65-98 Damage</div>
                  <div className="text-green-400 mt-1">+15 Agility</div>
                  <div className="text-green-400">+12 Stamina</div>
                </TooltipDemo>

                <TooltipDemo rarity="legendary">
                  <div style={{ color: RARITY_COLORS.legendary }} className="font-bold">Sulfuras, Hand of Ragnaros</div>
                  <div className="text-stone-500 text-[10px]">Item Level 80</div>
                  <div className="text-stone-400 mt-2">223-372 Damage</div>
                  <div className="text-green-400 mt-1">+12 Strength</div>
                  <div className="text-green-400">+30 Fire Resistance</div>
                  <div style={{ color: RARITY_COLORS.legendary }} className="mt-2 italic text-[10px]">
                    Chance on hit: Hurls a fiery ball
                  </div>
                </TooltipDemo>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* SECTION: ASCII ART */}
      {/* ================================================================== */}
      <div id="ascii-art">
        <Section title="ASCII ART TESTS" badge="Boxes + Frames + Dividers">
          <div className="space-y-6">
            {/* Box Drawing Variants */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Box Drawing Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ASCIIBox title="Single" variant="single">
                  Content here
                </ASCIIBox>
                <ASCIIBox title="Double" variant="double">
                  Content here
                </ASCIIBox>
                <ASCIIBox title="Rounded" variant="rounded">
                  Content here
                </ASCIIBox>
                <ASCIIBox title="Heavy" variant="heavy">
                  Content here
                </ASCIIBox>
              </div>
            </div>

            {/* Block Elements */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Block Elements</h3>
              <div className="bg-stone-900/50 p-4 border border-stone-700 font-mono text-sm">
                <div className="text-stone-400 mb-2">Shading: ░▒▓█</div>
                <div className="flex gap-2 text-2xl">
                  <span className="text-stone-700">░</span>
                  <span className="text-stone-600">▒</span>
                  <span className="text-stone-500">▓</span>
                  <span className="text-stone-400">█</span>
                </div>
                <div className="text-stone-400 mt-4 mb-2">Half blocks: ▀▄▌▐</div>
                <div className="flex gap-2 text-2xl text-amber-500">
                  <span>▀</span>
                  <span>▄</span>
                  <span>▌</span>
                  <span>▐</span>
                </div>
              </div>
            </div>

            {/* Dividers */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Dividers</h3>
              <div className="space-y-4 font-mono text-xs">
                <div className="text-amber-600">════════════════════════════════════════</div>
                <div className="text-stone-600">────────────────────────────────────────</div>
                <div className="text-amber-500">═══════════ SECTION TITLE ══════════════</div>
                <div className="text-stone-500">─── Subsection ────────────────────────</div>
                <div className="text-amber-600">╔══════════════════════════════════════╗</div>
                <div className="text-stone-600">┌──────────────────────────────────────┐</div>
              </div>
            </div>

            {/* Copy-able ASCII Strings */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Copy ASCII Strings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: "Box Double", text: "╔═══╗║   ║╚═══╝" },
                  { label: "Box Single", text: "┌───┐│   │└───┘" },
                  { label: "Shading", text: "░▒▓█" },
                  { label: "Arrows", text: "←↑→↓↖↗↘↙" },
                  { label: "Stars", text: "★☆✦✧◆◇" },
                  { label: "Symbols", text: "✝☩⚔🔥❤💀" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-2 bg-stone-900/50 border border-stone-700"
                  >
                    <div>
                      <div className="text-stone-400 text-xs">{item.label}</div>
                      <div className="font-mono text-amber-400">{item.text}</div>
                    </div>
                    <CopyButton text={item.text} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* SECTION: ANIMATIONS */}
      {/* ================================================================== */}
      <div id="animations">
        <Section title="ANIMATION TESTS" badge="Combat + Level Up + Loot">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnimationDemo name="Combat Hit">
              <CombatHitAnimation />
            </AnimationDemo>
            <AnimationDemo name="Level Up">
              <LevelUpAnimation />
            </AnimationDemo>
            <AnimationDemo name="Loot Drop">
              <LootDropAnimation />
            </AnimationDemo>
          </div>

          {/* CSS Animation Classes */}
          <div className="mt-6">
            <h3 className="text-amber-500 font-mono text-sm mb-3">CSS Animation Classes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-stone-700">
                <div className="animate-pulse text-amber-400 text-xl">●</div>
                <div className="text-stone-500 text-xs mt-2">animate-pulse</div>
              </div>
              <div className="text-center p-4 border border-stone-700">
                <div className="animate-bounce text-green-400 text-xl">↑</div>
                <div className="text-stone-500 text-xs mt-2">animate-bounce</div>
              </div>
              <div className="text-center p-4 border border-stone-700">
                <div className="animate-spin text-blue-400 text-xl">◌</div>
                <div className="text-stone-500 text-xs mt-2">animate-spin</div>
              </div>
              <div className="text-center p-4 border border-stone-700">
                <div className="animate-ping text-red-400 text-xl">●</div>
                <div className="text-stone-500 text-xs mt-2">animate-ping</div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* SECTION: CLASS CARDS */}
      {/* ================================================================== */}
      <div id="class-cards">
        <Section title="CLASS CARDS" badge="Selection UI">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "warrior", name: "Warrior", description: "Masters of martial combat", resourceType: "rage", armorType: "plate" },
              { id: "mage", name: "Mage", description: "Wielders of arcane magic", resourceType: "mana", armorType: "cloth" },
              { id: "priest", name: "Priest", description: "Divine healers and protectors", resourceType: "mana", armorType: "cloth" },
              { id: "rogue", name: "Rogue", description: "Stealthy assassins", resourceType: "energy", armorType: "leather" },
              { id: "paladin", name: "Paladin", description: "Holy knights of justice", resourceType: "mana", armorType: "plate" },
              { id: "druid", name: "Druid", description: "Shapeshifters of nature", resourceType: "mana", armorType: "leather" },
            ].map((classInfo) => (
              <ClassCard
                key={classInfo.id}
                classInfo={classInfo}
                selected={selectedClass === classInfo.id}
                onClick={() => setSelectedClass(classInfo.id)}
                disabled={classInfo.id === "druid"}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* SECTION: MODALS */}
      {/* ================================================================== */}
      <div id="modals">
        <Section title="MODALS" badge="Dialogs + Overlays">
          <div className="space-y-6">
            {/* Offline Progress Modal */}
            <div>
              <h3 className="text-amber-500 font-mono text-sm mb-3">Offline Progress Modal</h3>
              <p className="text-stone-500 text-xs font-mono mb-3">
                Shown when player returns after being away. Claims accumulated XP, gold, and loot.
              </p>
              <OfflineProgressModalDemo />
            </div>

            {/* Placeholder for more modals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {["Level Up Modal", "Loot Drop Modal", "Death Modal", "Achievement Modal"].map((name) => (
                <div
                  key={name}
                  className="p-4 border-2 border-dashed border-stone-700 text-center"
                >
                  <div className="text-stone-600 font-mono text-sm">{name}</div>
                  <div className="text-stone-700 text-xs mt-1">Coming Soon</div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* SECTION: PLACEHOLDERS */}
      {/* ================================================================== */}
      <Section title="FUTURE COMPONENTS" badge="Placeholder" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "Inventory Grid",
            "Equipment Slots",
            "Talent Tree",
            "Quest Log",
            "Combat Log",
            "Party Frames",
            "Minimap",
            "Action Bar",
            "Buff/Debuff Icons",
          ].map((name) => (
            <div
              key={name}
              className="p-6 border-2 border-dashed border-stone-700 text-center"
            >
              <div className="text-stone-600 font-mono text-sm">{name}</div>
              <div className="text-stone-700 text-xs mt-1">Coming Soon</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-stone-700 text-center">
        <div className="text-stone-600 font-mono text-xs">
          Idle Raiders — Dev Test Page — Last updated: {new Date().toLocaleDateString()}
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// DEV BADGE COMPONENT - For other pages
// ============================================================================

export function DevBadge() {
  if (!import.meta.env.DEV) return null;

  return (
    <a
      href="/dev"
      className="fixed bottom-4 right-4 z-50 px-3 py-1 bg-green-900/90 text-green-400 text-xs font-mono border border-green-700 hover:bg-green-800 transition-colors shadow-lg"
      title="Open Dev Test Page"
    >
      DEV
    </a>
  );
}
