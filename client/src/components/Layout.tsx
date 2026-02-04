import { Navigation } from "./Navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black font-mono">
      <Navigation />
      <main className="pt-12 min-h-[calc(100vh-3rem)]">
        {children}
      </main>
      <footer className="py-4 border-t border-green-900 text-center">
        <div className="text-green-800 text-xs">
          {"═".repeat(30)}
        </div>
        <p className="text-green-700 text-xs mt-2">
          {">"} Idle Raiders v0.1.0 | Terminal Mode Active
        </p>
        <div className="text-green-800 text-xs mt-2">
          {"═".repeat(30)}
        </div>
      </footer>
    </div>
  );
}
