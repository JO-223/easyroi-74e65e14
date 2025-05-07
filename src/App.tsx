
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Analytics from "./pages/Analytics";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Network from "./pages/Network";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Development from "./pages/Development";
import DevelopmentDetail from "./pages/DevelopmentDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/admin/AdminRoute";
import InvestorLevels from "./pages/InvestorLevels";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Sitemap from "./pages/Sitemap";
import CookiePolicy from "./pages/CookiePolicy";
import CashflowTracker from "./pages/CashflowTracker"; // Add this import
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
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/properties" element={
                  <RequireAuth>
                    <Properties />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/development" element={
                  <RequireAuth>
                    <Development />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/development/:id" element={
                  <RequireAuth>
                    <DevelopmentDetail />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/analytics" element={
                  <RequireAuth>
                    <Analytics />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/events" element={
                  <RequireAuth>
                    <Events />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/events/:id" element={
                  <RequireAuth>
                    <EventDetail />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/network" element={
                  <RequireAuth>
                    <Network />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/profile" element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/settings" element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                } />
                
                <Route path="/dashboard/investor-levels" element={
                  <InvestorLevels />
                } />
                
                {/* Add the new Cashflow Tracker route */}
                <Route path="/dashboard/cashflow" element={
                  <RequireAuth>
                    <CashflowTracker />
                  </RequireAuth>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <RequireAuth>
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  </RequireAuth>
                } />
                
                {/* Public Routes */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />

                {/* Redirect /properties to /dashboard/properties for backward compatibility */}
                <Route path="/properties" element={<Navigate to="/dashboard/properties" replace />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/property/:id" element={
                  <RequireAuth>
                    <PropertyDetail />
                  </RequireAuth>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
