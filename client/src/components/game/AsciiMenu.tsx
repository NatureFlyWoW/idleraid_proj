import React, { useEffect, useCallback } from 'react';

interface MenuItem {
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

interface AsciiMenuProps {
  items: MenuItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onConfirm: (index: number) => void;
  backEnabled?: boolean;
  backLabel?: string;
  confirmLabel?: string;
  className?: string;
}

/**
 * AsciiMenu - A numbered menu with keyboard navigation and yellow highlight.
 *
 * Renders:
 * > 1 - Warrior          <- Selected (yellow)
 *   2 - Mage
 *   3 - Priest           <- Disabled (gray)
 *   0 - Back
 *
 *   Enter - Accept
 *
 * Keyboard:
 * - Arrow Up/Down: Change selection (wraps)
 * - Enter: Confirm selection
 * - Number keys: Direct selection
 */
export function AsciiMenu({
  items,
  selectedIndex,
  onSelect,
  onConfirm,
  backEnabled = false,
  backLabel = 'Back',
  confirmLabel = 'Enter - Accept',
  className = '',
}: AsciiMenuProps) {
  // Calculate total items (including back if enabled)
  const totalItems = backEnabled ? items.length + 1 : items.length;

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onSelect(selectedIndex > 0 ? selectedIndex - 1 : totalItems - 1);
          break;

        case 'ArrowDown':
          event.preventDefault();
          onSelect(selectedIndex < totalItems - 1 ? selectedIndex + 1 : 0);
          break;

        case 'Enter':
          event.preventDefault();
          // Check if selection is valid (not disabled)
          if (backEnabled && selectedIndex === items.length) {
            // Back option selected
            onConfirm(-1); // -1 signals back
          } else if (!items[selectedIndex]?.disabled) {
            onConfirm(selectedIndex);
          }
          break;

        default:
          // Number key selection (1-9 for items, 0 for back)
          const num = parseInt(event.key, 10);
          if (!isNaN(num)) {
            if (num === 0 && backEnabled) {
              onSelect(items.length); // Select back option
            } else if (num >= 1 && num <= items.length) {
              onSelect(num - 1);
            }
          }
          break;
      }
    },
    [selectedIndex, totalItems, items, backEnabled, onSelect, onConfirm]
  );

  // Attach keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Render a single menu item
  const renderItem = (
    item: MenuItem,
    index: number,
    displayNumber: number
  ): React.ReactNode => {
    const isSelected = index === selectedIndex;
    const isDisabled = item.disabled;

    // Determine color
    let color = '#00ff00'; // Default green
    if (isSelected) {
      color = '#ffff00'; // Yellow for selected
    } else if (isDisabled) {
      color = '#666666'; // Gray for disabled
    }

    const prefix = isSelected ? '>' : ' ';
    const numberStr = displayNumber.toString();

    return (
      <div
        key={index}
        style={{
          color,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          whiteSpace: 'pre',
        }}
        onClick={() => {
          if (!isDisabled) {
            onSelect(index);
          }
        }}
        onDoubleClick={() => {
          if (!isDisabled) {
            onConfirm(index);
          }
        }}
      >
        {prefix} {numberStr} - {item.label}
        {item.sublabel && (
          <span style={{ color: '#666666' }}> {item.sublabel}</span>
        )}
      </div>
    );
  };

  // Render back option
  const renderBackOption = (): React.ReactNode => {
    const isSelected = selectedIndex === items.length;
    const color = isSelected ? '#ffff00' : '#00ff00';
    const prefix = isSelected ? '>' : ' ';

    return (
      <div
        style={{
          color,
          cursor: 'pointer',
          whiteSpace: 'pre',
          marginTop: '0.5em',
        }}
        onClick={() => onSelect(items.length)}
        onDoubleClick={() => onConfirm(-1)}
      >
        {prefix} 0 - {backLabel}
      </div>
    );
  };

  return (
    <div
      className={`ascii-menu ${className}`}
      style={{
        fontFamily: "'Courier New', 'Lucida Console', 'Monaco', monospace",
        lineHeight: 1.4,
        letterSpacing: 0,
      }}
    >
      {/* Menu items */}
      {items.map((item, index) => renderItem(item, index, index + 1))}

      {/* Back option */}
      {backEnabled && renderBackOption()}

      {/* Confirm prompt */}
      <div
        style={{
          color: '#666666',
          marginTop: '1em',
          whiteSpace: 'pre',
        }}
      >
        {confirmLabel}
      </div>
    </div>
  );
}

export default AsciiMenu;
