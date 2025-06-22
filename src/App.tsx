
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SkillDetail from "./pages/SkillDetail";
import ProjectDetail from "./pages/ProjectDetail";
import FeaturedWorkDetail from "./pages/FeaturedWorkDetail";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize theme from localStorage
    const storedTheme = localStorage.getItem("theme");
    
    if (!storedTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      const isDark = storedTheme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
    }
    
    // Apply consistent text color based on theme
    const applyThemeColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        document.documentElement.style.setProperty('--text-color', 'hsl(210, 40%, 98%)');
      } else {
        document.documentElement.style.setProperty('--text-color', 'hsl(222.2, 84%, 4.9%)');
      }
    };
    
    applyThemeColors();
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          applyThemeColors();
        }
      });
    });
    
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/skills/:skillId" element={<SkillDetail />} />
              <Route path="/project/:projectId" element={<ProjectDetail />} />
              <Route path="/featured-work/:workId" element={<FeaturedWorkDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
