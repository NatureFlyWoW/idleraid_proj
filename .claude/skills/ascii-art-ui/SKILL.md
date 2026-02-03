---
name: ascii-art-ui
description: Use when building any game UI component, creating item sprites, designing character screens, talent tree visualizations, combat logs, inventory panels, or any visual element. The game uses advanced ASCII art rendered in the browser with a dark terminal aesthetic.
---

# ASCII Art UI Standards

## Visual Language
- Dark background: terminal black or dark gray (never white or light)
- Box-drawing characters for ALL panels and frames: ┌ ─ ┐ │ └ ─ ┘ ├ ┤ ┬ ┴ ┼
- Stats displayed as colored key-value pairs in fixed-width columns
- Progress bars: █ (filled) and ░ (empty), example: ████████░░░░ 67%
- Equipment slots as bracketed placeholders: [Helmet] [Chest] [Ring1]

## Item Rarity Colors — Must Be Identical Everywhere
- Common: gray or white (default text color)
- Uncommon: green (#1EFF00)
- Rare: blue (#0070DD)
- Epic: purple (#A335EE)
- Legendary: orange (#FF8000)

## UI Component Patterns
- Character panel: ASCII art portrait + stat panel right side + equipment list below
- Equipment panel: paper doll layout with labeled gear slots, stat summary sidebar
- Talent tree: node grid with connection lines, rank indicators (1/5) or (3/3), color per tree
- Combat log: timestamped scrolling text, colored damage/heal numbers, threat warnings
- Threat meter: horizontal bar chart like: Thrognar (Tank) ████████████ 100%
- Inventory: grid of item slots with rarity-colored names, tooltip on hover

## Technical Implementation
- Monospace font family for ALL alignment-dependent elements
- React components with Tailwind CSS for layout
- Rarity color CSS classes defined in client/src/index.css
- Desktop-first design — game panels can use fixed widths for alignment
- Reference materials: ref_pic/ directory and IdleRaiders_Concept.pdf
- Primary inspiration: Melvor Idle UI | Secondary: WoW Classic character screen
