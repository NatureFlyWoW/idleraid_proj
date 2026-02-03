import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  WifiOff,
  RefreshCw,
  ServerCrash,
  FileQuestion,
  Lock,
  Clock,
  Home,
} from "lucide-react";

// ============================================================================
// ERROR STATES - Graceful error handling components
// ============================================================================

export type ErrorType =
  | "network"
  | "server"
  | "not_found"
  | "unauthorized"
  | "timeout"
  | "unknown";

interface ErrorConfig {
  icon: typeof AlertTriangle;
  title: string;
  color: string;
  ascii: string[];
}

const ERROR_CONFIG: Record<ErrorType, ErrorConfig> = {
  network: {
    icon: WifiOff,
    title: "Connection Lost",
    color: "#ef4444",
    ascii: [
      "╔═══════════════════╗",
      "║   ╭───╮   ╭───╮   ║",
      "║   │ ╳ │───│ ╳ │   ║",
      "║   ╰───╯   ╰───╯   ║",
      "║        ╳          ║",
      "║    NO SIGNAL      ║",
      "╚═══════════════════╝",
    ],
  },
  server: {
    icon: ServerCrash,
    title: "Server Error",
    color: "#f59e0b",
    ascii: [
      "╔═══════════════════╗",
      "║  ┌─────────────┐  ║",
      "║  │ ▓▓▓ ERROR ▓▓│  ║",
      "║  │ ░░░░░░░░░░░ │  ║",
      "║  │ ░░░░░░░░░░░ │  ║",
      "║  └─────────────┘  ║",
      "╚═══════════════════╝",
    ],
  },
  not_found: {
    icon: FileQuestion,
    title: "Not Found",
    color: "#6b7280",
    ascii: [
      "╔═══════════════════╗",
      "║                   ║",
      "║       ╭───╮       ║",
      "║       │ ? │       ║",
      "║       ╰───╯       ║",
      "║     404 ERROR     ║",
      "╚═══════════════════╝",
    ],
  },
  unauthorized: {
    icon: Lock,
    title: "Access Denied",
    color: "#dc2626",
    ascii: [
      "╔═══════════════════╗",
      "║       ╭───╮       ║",
      "║      ╭╯   ╰╮      ║",
      "║     ╔╧═════╧╗     ║",
      "║     ║ ◉───◉ ║     ║",
      "║     ╚═══════╝     ║",
      "╚═══════════════════╝",
    ],
  },
  timeout: {
    icon: Clock,
    title: "Request Timeout",
    color: "#f59e0b",
    ascii: [
      "╔═══════════════════╗",
      "║      ╭─────╮      ║",
      "║     ╭╯ ╲│  ╰╮     ║",
      "║     │   ●   │     ║",
      "║     ╰╮     ╭╯     ║",
      "║      ╰─────╯      ║",
      "╚═══════════════════╝",
    ],
  },
  unknown: {
    icon: AlertTriangle,
    title: "Something Went Wrong",
    color: "#ef4444",
    ascii: [
      "╔═══════════════════╗",
      "║         ▲         ║",
      "║        ╱ ╲        ║",
      "║       ╱ ! ╲       ║",
      "║      ╱─────╲      ║",
      "║     ERROR          ║",
      "╚═══════════════════╝",
    ],
  },
};

// ============================================================================
// ERROR DISPLAY COMPONENT
// ============================================================================

interface ErrorDisplayProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  showAscii?: boolean;
  className?: string;
}

export function ErrorDisplay({
  type = "unknown",
  title,
  message,
  onRetry,
  onBack,
  showAscii = true,
  className,
}: ErrorDisplayProps) {
  const config = ERROR_CONFIG[type];
  const IconComponent = config.icon;
  const displayTitle = title || config.title;

  return (
    <div className={cn("text-center p-6", className)}>
      {/* ASCII Art */}
      {showAscii && (
        <pre
          className="font-mono text-xs leading-tight mb-4 inline-block"
          style={{ color: config.color }}
        >
          {config.ascii.join("\n")}
        </pre>
      )}

      {/* Icon & Title */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <IconComponent className="w-5 h-5" style={{ color: config.color }} />
        <h3
          className="text-lg font-mono font-bold"
          style={{ color: config.color }}
        >
          {displayTitle}
        </h3>
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-stone-400 mb-4 max-w-md mx-auto">{message}</p>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 font-mono text-sm bg-amber-900/30 border border-amber-700 text-amber-400 hover:bg-amber-900/50 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 font-mono text-sm bg-stone-800 border border-stone-600 text-stone-400 hover:bg-stone-700 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// INLINE ERROR
// ============================================================================

export function InlineError({
  message,
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 bg-red-900/20 border border-red-900/50 text-xs font-mono",
        className
      )}
    >
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <span className="text-red-400 flex-1">{message || "An error occurred"}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-2 py-1 bg-red-900/30 border border-red-700 text-red-400 hover:bg-red-900/50"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ============================================================================
// FULL PAGE ERROR
// ============================================================================

interface FullPageErrorProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
}

export function FullPageError({
  type = "unknown",
  title,
  message,
  onRetry,
  onHome,
}: FullPageErrorProps) {
  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center p-4">
      <ErrorDisplay
        type={type}
        title={title}
        message={message}
        onRetry={onRetry}
        onBack={onHome}
        showAscii={true}
      />
    </div>
  );
}

// ============================================================================
// ERROR BOUNDARY FALLBACK
// ============================================================================

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <pre className="font-mono text-xs leading-tight mb-4 text-red-500">
{`╔════════════════════════════════╗
║    CRITICAL ERROR OCCURRED     ║
╠════════════════════════════════╣
║                                ║
║  The application encountered   ║
║  an unexpected error.          ║
║                                ║
╚════════════════════════════════╝`}
        </pre>

        <div className="bg-stone-900/50 border border-stone-700 p-4 mb-4 text-left">
          <div className="text-[10px] font-mono text-stone-500 mb-1">ERROR DETAILS:</div>
          <code className="text-xs text-red-400 font-mono break-all">
            {error.message}
          </code>
        </div>

        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-2 font-mono text-sm bg-amber-900/30 border border-amber-700 text-amber-400 hover:bg-amber-900/50"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  icon?: typeof AlertTriangle;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: IconComponent = FileQuestion,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <IconComponent className="w-12 h-12 text-stone-600 mx-auto mb-4" />
      <h3 className="text-lg font-mono text-stone-400 mb-2">{title}</h3>
      {message && <p className="text-sm text-stone-500 mb-4">{message}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 font-mono text-sm bg-amber-900/30 border border-amber-700 text-amber-400 hover:bg-amber-900/50"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// UTILITY: Detect error type from error object
// ============================================================================

export function detectErrorType(error: unknown): ErrorType {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection")
    ) {
      return "network";
    }

    if (message.includes("timeout")) {
      return "timeout";
    }

    if (message.includes("401") || message.includes("unauthorized")) {
      return "unauthorized";
    }

    if (message.includes("404") || message.includes("not found")) {
      return "not_found";
    }

    if (
      message.includes("500") ||
      message.includes("server") ||
      message.includes("internal")
    ) {
      return "server";
    }
  }

  return "unknown";
}

// ============================================================================
// DEMO
// ============================================================================

export function ErrorStatesDemo() {
  const errorTypes: ErrorType[] = [
    "network",
    "server",
    "not_found",
    "unauthorized",
    "timeout",
    "unknown",
  ];

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-amber-400 font-mono text-lg">Error States</h2>

      {/* Error displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {errorTypes.map((type) => (
          <div key={type} className="bg-stone-900/50 border border-stone-700 p-4">
            <ErrorDisplay
              type={type}
              message="This is a sample error message explaining what went wrong."
              onRetry={() => console.log("Retry")}
            />
          </div>
        ))}
      </div>

      {/* Inline error */}
      <div>
        <h3 className="text-stone-400 font-mono text-sm mb-4">Inline Error</h3>
        <InlineError
          message="Failed to load character data. Please try again."
          onRetry={() => console.log("Retry")}
        />
      </div>

      {/* Empty state */}
      <div>
        <h3 className="text-stone-400 font-mono text-sm mb-4">Empty State</h3>
        <EmptyState
          title="No Characters Found"
          message="Create your first character to begin your adventure!"
          action={{ label: "Create Character", onClick: () => {} }}
        />
      </div>
    </div>
  );
}
