import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CharacterSelect from "@/pages/CharacterSelect";
import CharacterCreate from "@/pages/CharacterCreate";
import Game from "@/pages/Game";
import ArtStyleDemo from "@/components/game/ArtStyleDemo";
import { CharacterPortraitDemo } from "@/components/game/CharacterPortrait";
import PortraitGallery from "@/components/game/PortraitGallery";
import DevTest, { DevBadge } from "@/pages/DevTest";
import CharacterSheet from "@/pages/CharacterSheet";
import Inventory from "@/pages/Inventory";
import ZoneSelection from "@/pages/ZoneSelection";
import QuestLog from "@/pages/QuestLog";
import DungeonSelection from "@/pages/DungeonSelection";
import TalentPage from "@/pages/TalentPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <Switch>
        <Route path="/" component={CharacterSelect} />
        <Route path="/create" component={CharacterCreate} />
        <Route path="/game/:characterId" component={Game} />
        <Route path="/styles" component={ArtStyleDemo} />
        <Route path="/portraits" component={CharacterPortraitDemo} />
        <Route path="/gallery" component={PortraitGallery} />
        <Route path="/dev" component={DevTest} />
        <Route path="/character/:id/stats" component={CharacterSheet} />
        <Route path="/character/:id/inventory" component={Inventory} />
        <Route path="/character/:id/zones" component={ZoneSelection} />
        <Route path="/character/:id/quests" component={QuestLog} />
        <Route path="/character/:id/dungeons" component={DungeonSelection} />
        <Route path="/character/:id/talents" component={TalentPage} />
        <Route component={NotFound} />
      </Switch>
      {/* Floating DEV badge - only visible in development */}
      <DevBadge />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Toaster />
        <Router />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
