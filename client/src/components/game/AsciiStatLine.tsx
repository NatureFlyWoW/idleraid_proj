import React from 'react';

interface Stat {
  name: string;
  value: number | string;
  color?: string;
}

interface AsciiStatLineProps {
  stats: Stat[];
  label?: string;
  bonusText?: string;
  separator?: string;
  className?: string;
}

/**
 * AsciiStatLine - Displays stats in colored terminal format.
 *
 * Renders:
 * Character stats: STR 4 / AGI 4 / INT 6 / STA 6
 * +4 to ministry
 *
 * - Label (optional) in white
 * - Stat names in white, values in green
 * - Slash separators in gray
 * - Bonus text in magenta
 */
export function AsciiStatLine({
  stats,
  label,
  bonusText,
  separator = ' / ',
  className = '',
}: AsciiStatLineProps) {
  return (
    <div
      className={`ascii-stat-line ${className}`}
      style={{
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        lineHeight: 1.4,
        letterSpacing: 0,
        whiteSpace: 'pre',
      }}
    >
      {/* Main stat line */}
      <div>
        {/* Label */}
        {label && (
          <span style={{ color: '#ffffff' }}>{label}: </span>
        )}

        {/* Stats */}
        {stats.map((stat, index) => (
          <React.Fragment key={stat.name}>
            {/* Separator (except for first item) */}
            {index > 0 && (
              <span style={{ color: '#666666' }}>{separator}</span>
            )}

            {/* Stat name */}
            <span style={{ color: '#ffffff' }}>{stat.name} </span>

            {/* Stat value */}
            <span style={{ color: stat.color || '#00ff00' }}>
              {stat.value}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Bonus text */}
      {bonusText && (
        <div style={{ color: '#ff00ff', marginTop: '0.25em' }}>
          {bonusText}
        </div>
      )}
    </div>
  );
}

/**
 * Compact stat display for inline use.
 * Renders: STR 4 AGI 4 INT 6
 */
export function AsciiStatCompact({
  stats,
  className = '',
}: {
  stats: Stat[];
  className?: string;
}) {
  return (
    <span
      className={`ascii-stat-compact ${className}`}
      style={{
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        whiteSpace: 'pre',
      }}
    >
      {stats.map((stat, index) => (
        <React.Fragment key={stat.name}>
          {index > 0 && ' '}
          <span style={{ color: '#ffffff' }}>{stat.name}</span>
          {' '}
          <span style={{ color: stat.color || '#00ff00' }}>{stat.value}</span>
        </React.Fragment>
      ))}
    </span>
  );
}

/**
 * Vertical stat display for detailed panels.
 * Renders:
 * STR: 4
 * AGI: 4
 * INT: 6
 */
export function AsciiStatVertical({
  stats,
  labelWidth = 10,
  className = '',
}: {
  stats: Stat[];
  labelWidth?: number;
  className?: string;
}) {
  return (
    <div
      className={`ascii-stat-vertical ${className}`}
      style={{
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        lineHeight: 1.4,
        letterSpacing: 0,
        whiteSpace: 'pre',
      }}
    >
      {stats.map((stat) => {
        const paddedName = stat.name.padEnd(labelWidth);
        return (
          <div key={stat.name}>
            <span style={{ color: '#ffffff' }}>{paddedName}</span>
            <span style={{ color: stat.color || '#00ff00' }}>{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export default AsciiStatLine;
