
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Analytics from "./pages/Analytics";
import Events from "./pages/Events";
import Network from "./pages/Network";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Initialize language settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('displaySettings');
    if (savedSettings) {
      const { language } = JSON.parse(savedSettings);
      document.documentElement.lang = language;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/properties" element={<Properties />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/events" element={<Events />} />
              <Route path="/dashboard/network" element={<Network />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              {/* Redirect /properties to /dashboard/properties for backward compatibility */}
              <Route path="/properties" element={<Navigate to="/dashboard/properties" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
