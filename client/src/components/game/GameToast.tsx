import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Gift,
  Star,
  Skull,
  Trophy,
  Coins,
  ArrowUp,
  X,
} from "lucide-react";

// ============================================================================
// GAME TOAST NOTIFICATIONS - ASCII-themed toast system
// ============================================================================

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loot"
  | "xp"
  | "gold"
  | "levelup"
  | "death"
  | "achievement";

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  // For special toasts
  amount?: number;
  itemName?: string;
  itemRarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  level?: number;
  achievementName?: string;
}

const TOAST_CONFIG: Record<
  ToastType,
  { icon: typeof Info; color: string; bgColor: string; borderColor: string }
> = {
  success: {
    icon: CheckCircle2,
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.5)",
  },
  error: {
    icon: XCircle,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  warning: {
    icon: AlertTriangle,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.5)",
  },
  info: {
    icon: Info,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.5)",
  },
  loot: {
    icon: Gift,
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.1)",
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
  xp: {
    icon: Star,
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.1)",
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
  gold: {
    icon: Coins,
    color: "#fbbf24",
    bgColor: "rgba(251, 191, 36, 0.1)",
    borderColor: "rgba(251, 191, 36, 0.5)",
  },
  levelup: {
    icon: ArrowUp,
    color: "#fbbf24",
    bgColor: "rgba(251, 191, 36, 0.15)",
    borderColor: "rgba(251, 191, 36, 0.6)",
  },
  death: {
    icon: Skull,
    color: "#dc2626",
    bgColor: "rgba(220, 38, 38, 0.1)",
    borderColor: "rgba(220, 38, 38, 0.5)",
  },
  achievement: {
    icon: Trophy,
    color: "#fbbf24",
    bgColor: "rgba(251, 191, 36, 0.15)",
    borderColor: "rgba(251, 191, 36, 0.6)",
  },
};

const RARITY_COLORS: Record<string, string> = {
  common: "#9d9d9d",
  uncommon: "#1eff00",
  rare: "#0070dd",
  epic: "#a335ee",
  legendary: "#ff8000",
};

// ============================================================================
// SINGLE TOAST COMPONENT
// ============================================================================

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const config = TOAST_CONFIG[toast.type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  // Special rendering for different toast types
  const renderContent = () => {
    switch (toast.type) {
      case "loot":
        const rarityColor = RARITY_COLORS[toast.itemRarity || "common"];
        return (
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4" style={{ color: rarityColor }} />
            <div>
              <div className="text-xs font-mono text-stone-400">Loot received:</div>
              <div className="font-mono text-sm" style={{ color: rarityColor }}>
                {toast.itemName || toast.title}
                {toast.amount && toast.amount > 1 && ` x${toast.amount}`}
              </div>
            </div>
          </div>
        );

      case "xp":
        return (
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-400" />
            <div className="font-mono">
              <span className="text-purple-400 text-lg font-bold">
                +{toast.amount?.toLocaleString() || 0}
              </span>
              <span className="text-purple-300 text-sm"> XP</span>
            </div>
          </div>
        );

      case "gold":
        return (
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <div className="font-mono">
              <span className="text-yellow-400 text-lg font-bold">
                +{toast.amount?.toLocaleString() || 0}
              </span>
              <span className="text-yellow-300 text-sm"> Gold</span>
            </div>
          </div>
        );

      case "levelup":
        return (
          <div className="text-center">
            <pre className="font-mono text-[10px] leading-none text-amber-500 mb-1">
{`┌─────────────────┐
│ ↑ LEVEL UP! ↑  │
└─────────────────┘`}
            </pre>
            <div className="font-mono">
              <span className="text-amber-400 text-xl font-bold">
                Level {toast.level}
              </span>
            </div>
            {toast.message && (
              <div className="text-xs text-amber-300/70 mt-1">{toast.message}</div>
            )}
          </div>
        );

      case "death":
        return (
          <div className="flex items-center gap-3">
            <Skull className="w-6 h-6 text-red-500" />
            <div>
              <div className="font-mono text-red-400 font-bold">{toast.title}</div>
              {toast.message && (
                <div className="text-xs text-red-300/70">{toast.message}</div>
              )}
            </div>
          </div>
        );

      case "achievement":
        return (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono text-amber-500">ACHIEVEMENT UNLOCKED</span>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="font-mono text-amber-300 font-bold">
              {toast.achievementName || toast.title}
            </div>
            {toast.message && (
              <div className="text-xs text-stone-400 mt-1">{toast.message}</div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-start gap-3">
            <IconComponent className="w-5 h-5 flex-shrink-0" style={{ color: config.color }} />
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm font-bold" style={{ color: config.color }}>
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-xs text-stone-400 mt-0.5">{toast.message}</div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "relative p-3 border-2 backdrop-blur-sm animate-slide-in-right",
        "transition-all duration-300",
        toast.type === "levelup" || toast.type === "achievement"
          ? "min-w-[200px]"
          : "min-w-[250px] max-w-[350px]"
      )}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        boxShadow: `0 0 20px ${config.bgColor}`,
      }}
    >
      {/* Dismiss button */}
      {toast.dismissible !== false && (
        <button
          onClick={() => onDismiss(toast.id)}
          className="absolute top-2 right-2 text-stone-500 hover:text-stone-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {renderContent()}

      {/* Progress bar for timed toasts */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-800">
          <div
            className="h-full transition-all ease-linear"
            style={{
              backgroundColor: config.color,
              animation: `shrink ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TOAST CONTAINER
// ============================================================================

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

const POSITION_CLASSES: Record<string, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

export function ToastContainer({
  toasts,
  onDismiss,
  position = "top-right",
}: ToastContainerProps) {
  return (
    <div className={cn("fixed z-50 flex flex-col gap-2", POSITION_CLASSES[position])}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ============================================================================
// TOAST CONTEXT & HOOK
// ============================================================================

interface ToastContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // Convenience methods
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  loot: (itemName: string, rarity?: ToastData["itemRarity"], amount?: number) => string;
  xp: (amount: number) => string;
  gold: (amount: number) => string;
  levelUp: (level: number, message?: string) => string;
  death: (message?: string) => string;
  achievement: (name: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({
  children,
  position = "top-right",
  defaultDuration = 4000,
}: {
  children: ReactNode;
  position?: ToastContainerProps["position"];
  defaultDuration?: number;
}) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastData, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastData = {
        ...toast,
        id,
        duration: toast.duration ?? defaultDuration,
        dismissible: toast.dismissible ?? true,
      };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [defaultDuration]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (title: string, message?: string) => addToast({ type: "success", title, message }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) => addToast({ type: "error", title, message }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => addToast({ type: "warning", title, message }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) => addToast({ type: "info", title, message }),
    [addToast]
  );

  const loot = useCallback(
    (itemName: string, rarity?: ToastData["itemRarity"], amount?: number) =>
      addToast({ type: "loot", title: itemName, itemName, itemRarity: rarity || "common", amount }),
    [addToast]
  );

  const xp = useCallback(
    (amount: number) => addToast({ type: "xp", title: "XP Gained", amount }),
    [addToast]
  );

  const gold = useCallback(
    (amount: number) => addToast({ type: "gold", title: "Gold Gained", amount }),
    [addToast]
  );

  const levelUp = useCallback(
    (level: number, message?: string) =>
      addToast({ type: "levelup", title: "Level Up!", level, message, duration: 6000 }),
    [addToast]
  );

  const death = useCallback(
    (message?: string) =>
      addToast({ type: "death", title: "You Died", message: message || "Return to the nearest graveyard" }),
    [addToast]
  );

  const achievement = useCallback(
    (name: string, description?: string) =>
      addToast({
        type: "achievement",
        title: "Achievement Unlocked",
        achievementName: name,
        message: description,
        duration: 6000,
      }),
    [addToast]
  );

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
    loot,
    xp,
    gold,
    levelUp,
    death,
    achievement,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} position={position} />
    </ToastContext.Provider>
  );
}

export function useGameToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useGameToast must be used within a ToastProvider");
  }
  return context;
}

// ============================================================================
// CSS ANIMATIONS (add to index.css)
// ============================================================================

/*
Add these to your index.css:

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
*/

// ============================================================================
// DEMO COMPONENT
// ============================================================================

export function GameToastDemo() {
  const [demoToasts, setDemoToasts] = useState<ToastData[]>([]);
  let toastCounter = 0;

  const addDemoToast = (toast: Omit<ToastData, "id">) => {
    const id = `demo-${toastCounter++}`;
    setDemoToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeDemoToast = (id: string) => {
    setDemoToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => addDemoToast({ type: "success", title: "Quest Completed", message: "You have completed the quest!", duration: 3000 })}
          className="px-3 py-2 bg-green-900/30 border border-green-700 text-green-400 font-mono text-xs"
        >
          Success
        </button>
        <button
          onClick={() => addDemoToast({ type: "error", title: "Not Enough Gold", message: "You need 50 more gold", duration: 3000 })}
          className="px-3 py-2 bg-red-900/30 border border-red-700 text-red-400 font-mono text-xs"
        >
          Error
        </button>
        <button
          onClick={() => addDemoToast({ type: "warning", title: "Low Health", message: "Find a safe place to heal", duration: 3000 })}
          className="px-3 py-2 bg-yellow-900/30 border border-yellow-700 text-yellow-400 font-mono text-xs"
        >
          Warning
        </button>
        <button
          onClick={() => addDemoToast({ type: "info", title: "Server Restart", message: "Server will restart in 15 minutes", duration: 3000 })}
          className="px-3 py-2 bg-blue-900/30 border border-blue-700 text-blue-400 font-mono text-xs"
        >
          Info
        </button>
        <button
          onClick={() => addDemoToast({ type: "loot", title: "Loot", itemName: "Sword of the Phoenix", itemRarity: "epic", duration: 3000 })}
          className="px-3 py-2 bg-purple-900/30 border border-purple-700 text-purple-400 font-mono text-xs"
        >
          Epic Loot
        </button>
        <button
          onClick={() => addDemoToast({ type: "xp", title: "XP", amount: 1250, duration: 3000 })}
          className="px-3 py-2 bg-purple-900/30 border border-purple-700 text-purple-400 font-mono text-xs"
        >
          XP Gain
        </button>
        <button
          onClick={() => addDemoToast({ type: "gold", title: "Gold", amount: 150, duration: 3000 })}
          className="px-3 py-2 bg-yellow-900/30 border border-yellow-700 text-yellow-400 font-mono text-xs"
        >
          Gold
        </button>
        <button
          onClick={() => addDemoToast({ type: "levelup", title: "Level Up", level: 10, message: "New abilities unlocked!", duration: 5000 })}
          className="px-3 py-2 bg-amber-900/30 border border-amber-700 text-amber-400 font-mono text-xs"
        >
          Level Up
        </button>
        <button
          onClick={() => addDemoToast({ type: "death", title: "Death", message: "Slain by Hogger", duration: 4000 })}
          className="px-3 py-2 bg-red-900/30 border border-red-700 text-red-400 font-mono text-xs"
        >
          Death
        </button>
        <button
          onClick={() => addDemoToast({ type: "achievement", title: "Achievement", achievementName: "Kobold Slayer", message: "Kill 100 Kobolds", duration: 5000 })}
          className="px-3 py-2 bg-amber-900/30 border border-amber-700 text-amber-400 font-mono text-xs"
        >
          Achievement
        </button>
      </div>

      {/* Demo toast display */}
      <div className="relative h-64 border border-stone-700 bg-stone-900/50 overflow-hidden">
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {demoToasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={removeDemoToast} />
          ))}
        </div>
        <div className="absolute bottom-4 left-4 text-xs font-mono text-stone-500">
          Click buttons to see toasts →
        </div>
      </div>
    </div>
  );
}
