import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface TerminalFrameProps {
  title?: string;
  footer?: string;
  children: ReactNode;
  className?: string;
  minWidth?: number;
}

/**
 * TerminalFrame - Wraps content in a dashed ASCII border.
 *
 * Renders:
 * +------------------------------------------+
 * | Title / Breadcrumb                       |
 * +------------------------------------------+
 * | Content area with 1-char padding         |
 * |                                          |
 * +------------------------------------------+
 * | Footer prompt                            |
 * +------------------------------------------+
 */
export function TerminalFrame({
  title,
  footer,
  children,
  className = '',
  minWidth = 60,
}: TerminalFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [charWidth, setCharWidth] = useState(minWidth);

  // Calculate available character width based on container
  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        // Approximate character width for monospace font (8px per char at default size)
        const containerWidth = containerRef.current.offsetWidth;
        const charPixelWidth = 9.6; // Approximate for Courier New at 16px
        const availableChars = Math.floor(containerWidth / charPixelWidth);
        // Clamp between minWidth and a reasonable max
        setCharWidth(Math.max(minWidth, Math.min(availableChars, 120)));
      }
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, [minWidth]);

  // Generate horizontal border line
  const horizontalLine = '+' + '-'.repeat(charWidth - 2) + '+';

  // Pad content line to fit within borders
  const padLine = (content: string): string => {
    const innerWidth = charWidth - 4; // Account for "| " and " |"
    const trimmed = content.slice(0, innerWidth);
    const padding = ' '.repeat(Math.max(0, innerWidth - trimmed.length));
    return '| ' + trimmed + padding + ' |';
  };

  return (
    <div
      ref={containerRef}
      className={`terminal-base ${className}`}
      style={{
        backgroundColor: '#000000',
        color: '#00ff00',
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        lineHeight: 1.15,
        letterSpacing: 0,
        whiteSpace: 'pre',
      }}
    >
      {/* Top border */}
      <div>{horizontalLine}</div>

      {/* Title row (if provided) */}
      {title && (
        <>
          <div style={{ color: '#ffffff' }}>{padLine(title)}</div>
          <div>{horizontalLine}</div>
        </>
      )}

      {/* Content area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TerminalContentWrapper charWidth={charWidth}>
          {children}
        </TerminalContentWrapper>
      </div>

      {/* Footer separator and row (if provided) */}
      {footer && (
        <>
          <div>{horizontalLine}</div>
          <div style={{ color: '#666666' }}>{padLine(footer)}</div>
        </>
      )}

      {/* Bottom border */}
      <div>{horizontalLine}</div>
    </div>
  );
}

interface TerminalContentWrapperProps {
  charWidth: number;
  children: ReactNode;
}

/**
 * Wraps children with left/right borders and padding.
 */
function TerminalContentWrapper({ charWidth, children }: TerminalContentWrapperProps) {
  const innerWidth = charWidth - 4; // Account for "| " and " |"

  return (
    <div style={{ position: 'relative' }}>
      {/* Left border */}
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2ch',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {'| '}
      </span>

      {/* Content with padding */}
      <div
        style={{
          marginLeft: '2ch',
          marginRight: '2ch',
          maxWidth: `${innerWidth}ch`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Right border - handled by line endings in content */}
    </div>
  );
}

/**
 * Helper component for rendering bordered content lines.
 * Use this for simple text content that should respect the frame boundaries.
 */
export function TerminalLine({
  children,
  color = '#00ff00',
}: {
  children: string;
  color?: string;
}) {
  return (
    <div style={{ color, whiteSpace: 'pre' }}>
      {children}
    </div>
  );
}

export default TerminalFrame;
