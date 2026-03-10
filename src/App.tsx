import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/theme-provider";

import GlobalThemeToggle from "./components/ThemeToggle";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PricingPage from "./pages/PricingPage";
import DashboardPage from "./pages/DashboardPage";
import LinksPage from "./pages/LinksPage";
import AppearancePage from "./pages/AppearancePage";
import QRPage from "./pages/QRPage";
import CardPage from "./pages/CardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import UpgradePage from "./pages/UpgradePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCouponsPage from "./pages/AdminCouponsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Global toggle for landing/auth pages */}
            <GlobalThemeToggle />

            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/:username" element={<PublicProfilePage />} />

              {/* Protected Dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard/links" element={<ProtectedRoute><LinksPage /></ProtectedRoute>} />
              <Route path="/dashboard/appearance" element={<ProtectedRoute><AppearancePage /></ProtectedRoute>} />
              <Route path="/dashboard/qr" element={<ProtectedRoute><QRPage /></ProtectedRoute>} />
              <Route path="/dashboard/card" element={<ProtectedRoute><CardPage /></ProtectedRoute>} />
              <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/coupons" element={<ProtectedRoute adminOnly><AdminCouponsPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;