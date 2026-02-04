# ASCII Art Style Guide — Idle Raiders

This skill defines the visual style rules for all ASCII art and terminal UI in Idle Raiders. Reference this guide for every frontend visual change.

---

## CHARACTER DENSITY SHADING SCALE

Use these characters for shading gradients from darkest to lightest:

| Density | Characters |
|---------|------------|
| **DARKEST** | `@ # & % 8 W M N` |
| **DARK** | `$ 0 Q O D B G` |
| **MEDIUM** | `d b q p m w k h` |
| **LIGHT** | `l t r i j f c z s n u v x` |
| **LIGHTEST** | `: ; , . ' \` " ^ ~ - _` |
| **EMPTY** | ` ` (space) |

When creating shaded art, use characters from multiple density levels to create depth and form.

---

## ART SIZE REQUIREMENTS

Art must be the **HERO** of the screen — occupying **50-70% of the panel area**.

| Art Type | Minimum Size |
|----------|--------------|
| Class/character portraits | 30 lines tall, 40-60 chars wide |
| Zone/dungeon art | 20 lines tall, full terminal width |
| Title logo | 20-30 lines tall, full terminal width |
| Small item sprites | 4-8 lines tall, 10-20 chars wide |

---

## TERMINAL COLOR PALETTE

```css
/* Core Colors */
--bg-primary: #000000;        /* Pure black background */
--bg-secondary: #0a0a0a;      /* Slightly lifted black */

/* Text Colors */
--text-primary: #00ff00;      /* Terminal green - primary text & stat values */
--text-header: #ffffff;       /* White - headers */
--text-disabled: #666666;     /* Dark gray - disabled/inactive */

/* Semantic Colors */
--color-highlight: #ffff00;   /* Yellow - selected/highlighted items */
--color-bonus: #ff00ff;       /* Magenta/Pink - bonuses, special effects */
--color-damage: #ff0000;      /* Red - damage, danger, health loss */
--color-magic: #00ffff;       /* Cyan - magical effects, rare items */

/* Item Rarity Colors */
--rarity-epic: #a335ee;       /* Purple - epic items */
--rarity-legendary: #ff8000;  /* Orange - legendary items */
```

### Color Usage Rules:
- **Green (#00ff00)**: Stat values, health, positive numbers
- **Yellow (#ffff00)**: Selected menu items, highlights, gold/currency
- **Magenta (#ff00ff)**: Bonuses, procs, special abilities
- **Red (#ff0000)**: Damage numbers, danger warnings, health loss
- **Cyan (#00ffff)**: Magical effects, mana, rare quality items
- **White (#ffffff)**: Headers, titles, important labels
- **Gray (#666666)**: Disabled options, inactive elements
- **Purple (#a335ee)**: Epic quality items
- **Orange (#ff8000)**: Legendary quality items

---

## BORDER AND FRAME RULES

### Panel Borders
Every panel must be wrapped in a dashed border:
```
+----------------------------------+
|  Panel content here              |
|                                  |
+----------------------------------+
```
- Top/bottom: `+` corners with `-` horizontal lines
- Sides: `|` vertical bars
- Corners: `+`

### Section Dividers
Use horizontal lines to separate sections:
- Light divider: `-` or `─`
- Heavy divider: `=` or `═`

### Box-Drawing Characters for Structured Layouts
```
┌─────────┬─────────┐
│  Cell   │  Cell   │
├─────────┼─────────┤
│  Cell   │  Cell   │
└─────────┴─────────┘
```
Available characters: `│ ─ ├ ┤ ┬ ┴ ┼ ┌ ┐ └ ┘`

---

## LAYOUT HIERARCHY

Every screen follows this top-to-bottom structure:

```
┌──────────────────────────────────────────┐
│ 1. HEADER BAR                            │  ← Breadcrumb or screen title
├──────────────────────────────────────────┤
│                                          │
│ 2. ART PANEL                             │  ← Large ASCII centerpiece (bordered)
│    (50-70% of screen)                    │
│                                          │
├──────────────────────────────────────────┤
│ 3. DESCRIPTION ZONE                      │  ← 2-4 lines of narrative text
├──────────────────────────────────────────┤
│ 4. STATS LINE                            │  ← Colored stat display
├──────────────────────────────────────────┤
│ 5. MENU/ACTION ZONE                      │  ← Numbered options
│    [1] Option One                        │     Yellow highlight on selection
│    [2] Option Two                        │
├──────────────────────────────────────────┤
│ 6. INPUT PROMPT                          │  ← "Enter - Accept", etc.
└──────────────────────────────────────────┘
```

---

## FONT RULES

```css
/* Required font stack */
font-family: 'Courier New', 'Lucida Console', 'Monaco', monospace;

/* Tight line-height for ASCII art (no gaps between lines) */
line-height: 1.1;  /* Acceptable range: 1.1 to 1.2 */

/* No letter spacing */
letter-spacing: 0;

/* Preserve all whitespace */
white-space: pre;
```

---

## ART CONTENT RULES

### Art Must Be Figurative
- Art depicts **recognizable things**: a warrior, a skull, a dungeon entrance, a sword
- **NOT** abstract patterns or simple geometric shapes
- The viewer should identify what it is **at a glance**

### Color Regions in Art
- Different parts of ASCII art can have different colors
- Example: sword blade in white, hilt in yellow, magical glow in cyan
- Implement via `<span>` elements wrapping character ranges within each line
- **Maximum 3-4 colors per art piece** — keep color usage purposeful

Example implementation:
```jsx
<pre className="ascii-art">
  <span className="text-white">    /\    </span>  {/* blade */}
  <span className="text-white">   /  \   </span>
  <span className="text-yellow">  |====|  </span>  {/* crossguard */}
  <span className="text-amber-800">   |  |   </span>  {/* hilt */}
  <span className="text-cyan">   ~~~~   </span>  {/* magic glow */}
</pre>
```

---

## FILE CHANGE ANALYSIS CHECKLIST

**Every time a frontend file is modified, verify:**

- [ ] **1. Terminal Color Palette?** — No stray blues, no white backgrounds
- [ ] **2. Monospace Font?** — All text uses monospace font family
- [ ] **3. Standard Border Chars?** — Uses `+`, `-`, `|`, `=` for borders
- [ ] **4. Tight Line-Height?** — 1.1-1.2 for ASCII art (no gaps)
- [ ] **5. Full Density Gradient?** — Art uses multiple shading levels
- [ ] **6. Minimum Size Met?** — Art meets size requirements for its type
- [ ] **7. Layout Hierarchy?** — Follows header→art→desc→stats→menu→prompt order
- [ ] **8. Color Semantics?** — Green=stats, yellow=selected, magenta=bonuses, red=damage, cyan=magic

---

## Quick Reference Card

```
SHADING:  @ # & % 8 → $ 0 Q O D → d b q p m → l t r i j → : ; , . ' → (space)
          [DARKEST]   [DARK]      [MEDIUM]    [LIGHT]     [LIGHTEST]   [EMPTY]

COLORS:   #00ff00 green   = stats, health, text
          #ffff00 yellow  = selected, highlight
          #ff00ff magenta = bonus, special
          #ff0000 red     = damage, danger
          #00ffff cyan    = magic, rare
          #a335ee purple  = epic items
          #ff8000 orange  = legendary items

BORDERS:  +---+  corners and horizontals
          |   |  verticals
          ├───┤  box-drawing for tables

LAYOUT:   Header → Art (BIG!) → Description → Stats → Menu → Prompt

FONT:     Courier New, monospace, line-height: 1.1, white-space: pre
```
