import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import Article from "./pages/Article";
import Packd from "./pages/Packd";
import PackdPrivacy from "./pages/packd/Privacy";
import PackdTerms from "./pages/packd/Terms";
import Exoreader from "./pages/exoreader/Exoreader";
import ExoreaderPrivacy from "./pages/exoreader/Privacy";
import ExoreaderTerms from "./pages/exoreader/Terms";
import RavioloLanding from "./pages/raviolo/RavioloLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<Article />} />
          <Route path="/packd" element={<Packd />} />
          <Route path="/packd/privacy" element={<PackdPrivacy />} />
          <Route path="/packd/terms" element={<PackdTerms />} />
          <Route path="/exoreader" element={<Exoreader />} />
          <Route path="/exoreader/privacy" element={<ExoreaderPrivacy />} />
          <Route path="/exoreader/terms" element={<ExoreaderTerms />} />
          <Route path="/raviolo" element={<RavioloLanding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
