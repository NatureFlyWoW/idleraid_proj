import React, { useState, useEffect, useMemo } from 'react';

interface ColorRegion {
  line: number;
  start: number;
  end: number;
  color: string;
}

interface AsciiArtDisplayProps {
  art: string[];
  colorRegions?: ColorRegion[];
  animate?: boolean;
  animationDelay?: number;
  className?: string;
  centered?: boolean;
}

/**
 * AsciiArtDisplay - Renders ASCII art with optional color regions and animation.
 *
 * Features:
 * - Renders each line with white-space: pre to preserve spacing
 * - Supports color regions to highlight specific character ranges
 * - Optional typing animation (lines appear one at a time)
 * - Centers art horizontally by default
 */
export function AsciiArtDisplay({
  art,
  colorRegions = [],
  animate = false,
  animationDelay = 30,
  className = '',
  centered = true,
}: AsciiArtDisplayProps) {
  const [visibleLines, setVisibleLines] = useState(animate ? 0 : art.length);

  // Animation effect - reveal lines one at a time
  useEffect(() => {
    if (!animate) {
      setVisibleLines(art.length);
      return;
    }

    setVisibleLines(0);
    let lineIndex = 0;

    const interval = setInterval(() => {
      lineIndex++;
      setVisibleLines(lineIndex);

      if (lineIndex >= art.length) {
        clearInterval(interval);
      }
    }, animationDelay);

    return () => clearInterval(interval);
  }, [animate, animationDelay, art.length]);

  // Group color regions by line for efficient lookup
  const regionsByLine = useMemo(() => {
    const grouped: Map<number, ColorRegion[]> = new Map();
    for (const region of colorRegions) {
      const existing = grouped.get(region.line) || [];
      existing.push(region);
      grouped.set(region.line, existing);
    }
    return grouped;
  }, [colorRegions]);

  // Render a single line with color regions applied
  const renderLine = (line: string, lineIndex: number): React.ReactNode => {
    const regions = regionsByLine.get(lineIndex);

    if (!regions || regions.length === 0) {
      // No color regions - render plain line
      return line;
    }

    // Sort regions by start position
    const sortedRegions = [...regions].sort((a, b) => a.start - b.start);

    const segments: React.ReactNode[] = [];
    let currentPos = 0;

    for (const region of sortedRegions) {
      // Add uncolored segment before this region
      if (region.start > currentPos) {
        segments.push(
          <span key={`plain-${currentPos}`}>
            {line.slice(currentPos, region.start)}
          </span>
        );
      }

      // Add colored segment
      const endPos = Math.min(region.end, line.length);
      segments.push(
        <span key={`colored-${region.start}`} style={{ color: region.color }}>
          {line.slice(region.start, endPos)}
        </span>
      );

      currentPos = endPos;
    }

    // Add remaining uncolored segment
    if (currentPos < line.length) {
      segments.push(
        <span key={`plain-end-${currentPos}`}>
          {line.slice(currentPos)}
        </span>
      );
    }

    return segments;
  };

  return (
    <div
      className={`ascii-art-display ${className}`}
      style={{
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        lineHeight: 1.15,
        letterSpacing: 0,
        whiteSpace: 'pre',
        textAlign: centered ? 'center' : 'left',
        color: '#00ff00',
      }}
    >
      {art.slice(0, visibleLines).map((line, index) => (
        <div key={index} style={{ minHeight: '1.15em' }}>
          {renderLine(line, index)}
        </div>
      ))}
      {/* Placeholder lines for animation to prevent layout shift */}
      {animate && visibleLines < art.length && (
        <>
          {art.slice(visibleLines).map((_, index) => (
            <div key={`placeholder-${index}`} style={{ minHeight: '1.15em' }}>
              {' '}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/**
 * Helper to create color regions from a simple mapping.
 * Example: createColorRegions([[0, 10, 20, '#ff0000'], [1, 5, 15, '#00ffff']])
 */
export function createColorRegions(
  regions: Array<[number, number, number, string]>
): ColorRegion[] {
  return regions.map(([line, start, end, color]) => ({
    line,
    start,
    end,
    color,
  }));
}

export default AsciiArtDisplay;
