
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, RouteObject } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import './App.css';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Network from './pages/Network';
import SettingsPage from './pages/SettingsPage';
import PropertyDetails from './pages/PropertyDetails';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import Auth from './pages/Auth';
import { supabase } from './integrations/supabase/client';
import PublicRoute from './components/PublicRoute';
import AdminTester from './pages/admin/AdminTester';
import { SidebarProvider } from './contexts/SidebarContext';
import { LanguageProvider } from './contexts/LanguageContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <NotFound />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <NotFound />,
  },
  {
    path: "/network",
    element: <Network />,
    errorElement: <NotFound />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/property/:id",
    element: <PropertyDetails />,
    errorElement: <NotFound />,
  },
  {
    path: "/messages",
    element: <Messages />,
    errorElement: <NotFound />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
    errorElement: <NotFound />,
  },

  // Admin routes, protected by AdminRoute component
  {
    path: "/admin",
    element: <AdminRoute />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "tester",
        element: <AdminTester />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="easyroi-theme">
      <LanguageProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
