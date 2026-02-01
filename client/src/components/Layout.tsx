import { Navigation } from "./Navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      <Navigation />
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Modern Fullstack Starter</p>
      </footer>
    </div>
  );
}
