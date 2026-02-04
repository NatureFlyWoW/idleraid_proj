import React from 'react';

interface AsciiProgressBarProps {
  current: number;
  max: number;
  width?: number;
  label?: string;
  color?: string;
  emptyColor?: string;
  showFraction?: boolean;
  showPercent?: boolean;
  className?: string;
}

/**
 * AsciiProgressBar - A text-based progress bar.
 *
 * Renders: HP: [████████░░░░░░] 67/100
 *
 * - Uses █ (U+2588) for filled portion
 * - Uses ░ (U+2591) for empty portion
 * - Label on left, fraction on right
 * - Color applied to filled portion
 */
export function AsciiProgressBar({
  current,
  max,
  width = 20,
  label,
  color = '#00ff00',
  emptyColor = '#333333',
  showFraction = true,
  showPercent = false,
  className = '',
}: AsciiProgressBarProps) {
  // Calculate fill amount
  const percent = max > 0 ? Math.min(Math.max(current / max, 0), 1) : 0;
  const filledCount = Math.round(percent * width);
  const emptyCount = width - filledCount;

  // Build the bar characters
  const filledBar = '█'.repeat(filledCount);
  const emptyBar = '░'.repeat(emptyCount);

  // Format the fraction/percent display
  const fractionText = showFraction ? ` ${current}/${max}` : '';
  const percentText = showPercent ? ` ${Math.round(percent * 100)}%` : '';

  return (
    <div
      className={`ascii-progress-bar ${className}`}
      style={{
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        lineHeight: 1.4,
        letterSpacing: 0,
        whiteSpace: 'pre',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5ch',
      }}
    >
      {/* Label */}
      {label && (
        <span style={{ color: '#ffffff' }}>{label}:</span>
      )}

      {/* Bar container */}
      <span>
        <span style={{ color: '#666666' }}>[</span>
        <span style={{ color }}>{filledBar}</span>
        <span style={{ color: emptyColor }}>{emptyBar}</span>
        <span style={{ color: '#666666' }}>]</span>
      </span>

      {/* Fraction/Percent */}
      <span style={{ color: '#00ff00' }}>
        {fractionText}
        {percentText}
      </span>
    </div>
  );
}

/**
 * Compact progress bar for tight spaces.
 * Renders: [████░░░░] 50%
 */
export function AsciiProgressCompact({
  current,
  max,
  width = 10,
  color = '#00ff00',
  className = '',
}: {
  current: number;
  max: number;
  width?: number;
  color?: string;
  className?: string;
}) {
  const percent = max > 0 ? Math.min(Math.max(current / max, 0), 1) : 0;
  const filledCount = Math.round(percent * width);
  const emptyCount = width - filledCount;

  return (
    <span
      className={`ascii-progress-compact ${className}`}
      style={{
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        whiteSpace: 'pre',
      }}
    >
      <span style={{ color: '#666666' }}>[</span>
      <span style={{ color }}>{'\u2588'.repeat(filledCount)}</span>
      <span style={{ color: '#333333' }}>{'\u2591'.repeat(emptyCount)}</span>
      <span style={{ color: '#666666' }}>]</span>
      <span style={{ color: '#00ff00' }}> {Math.round(percent * 100)}%</span>
    </span>
  );
}

/**
 * XP bar with level display.
 * Renders: Lvl 5 [████████░░░░] 1200/2000 XP
 */
export function AsciiXpBar({
  level,
  currentXp,
  requiredXp,
  width = 15,
  className = '',
}: {
  level: number;
  currentXp: number;
  requiredXp: number;
  width?: number;
  className?: string;
}) {
  const percent = requiredXp > 0 ? Math.min(currentXp / requiredXp, 1) : 0;
  const filledCount = Math.round(percent * width);
  const emptyCount = width - filledCount;

  return (
    <div
      className={`ascii-xp-bar ${className}`}
      style={{
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        lineHeight: 1.4,
        whiteSpace: 'pre',
      }}
    >
      <span style={{ color: '#ffff00' }}>Lvl {level}</span>
      {' '}
      <span style={{ color: '#666666' }}>[</span>
      <span style={{ color: '#a335ee' }}>{'\u2588'.repeat(filledCount)}</span>
      <span style={{ color: '#333333' }}>{'\u2591'.repeat(emptyCount)}</span>
      <span style={{ color: '#666666' }}>]</span>
      {' '}
      <span style={{ color: '#00ff00' }}>{currentXp}/{requiredXp}</span>
      {' '}
      <span style={{ color: '#666666' }}>XP</span>
    </div>
  );
}

/**
 * Health bar with color coding based on percentage.
 * Green > 50%, Yellow 25-50%, Red < 25%
 */
export function AsciiHealthBar({
  current,
  max,
  width = 20,
  className = '',
}: {
  current: number;
  max: number;
  width?: number;
  className?: string;
}) {
  const percent = max > 0 ? current / max : 0;

  // Determine color based on health percentage
  let color = '#00ff00'; // Green
  if (percent <= 0.25) {
    color = '#ff0000'; // Red
  } else if (percent <= 0.5) {
    color = '#ffff00'; // Yellow
  }

  return (
    <AsciiProgressBar
      current={current}
      max={max}
      width={width}
      label="HP"
      color={color}
      showFraction={true}
      className={className}
    />
  );
}

/**
 * Mana bar in cyan.
 */
export function AsciiManaBar({
  current,
  max,
  width = 20,
  className = '',
}: {
  current: number;
  max: number;
  width?: number;
  className?: string;
}) {
  return (
    <AsciiProgressBar
      current={current}
      max={max}
      width={width}
      label="MP"
      color="#00ffff"
      showFraction={true}
      className={className}
    />
  );
}

export default AsciiProgressBar;
