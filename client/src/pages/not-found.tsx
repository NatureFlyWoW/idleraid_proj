import { useLocation } from "wouter";
import { TerminalButton } from "@/components/game/TerminalPanel";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-mono">
      {/* ASCII Art 404 */}
      <pre className="text-red-500 text-xs sm:text-sm leading-tight mb-6">
{`╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     ██╗  ██╗ ██████╗ ██╗  ██╗                        ║
║     ██║  ██║██╔═══██╗██║  ██║                        ║
║     ███████║██║   ██║███████║                        ║
║     ╚════██║██║   ██║╚════██║                        ║
║          ██║╚██████╔╝     ██║                        ║
║          ╚═╝ ╚═════╝      ╚═╝                        ║
║                                                       ║
║              PAGE NOT FOUND                          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝`}
      </pre>

      {/* Error Message */}
      <div className="text-center mb-6">
        <p className="text-green-500 text-sm mb-2">
          {">"} Error: The requested page does not exist.
        </p>
        <p className="text-green-700 text-xs">
          Perhaps you forgot to add the route to the router?
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <TerminalButton onClick={() => navigate("/")}>
          [←] Return Home
        </TerminalButton>
        <TerminalButton variant="secondary" onClick={() => window.history.back()}>
          [↩] Go Back
        </TerminalButton>
      </div>

      {/* Footer */}
      <div className="mt-8 text-green-800 text-xs">
        {"─".repeat(40)}
      </div>
    </div>
  );
}
