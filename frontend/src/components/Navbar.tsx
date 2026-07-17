import React from "react";
import { useLocation } from "react-router-dom";
import { Sun, Moon, Menu, Bell } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/profile":
        return "My Profile";
      case "/resume":
        return "Resume Manager";
      case "/preferences":
        return "Career Preferences";
      case "/settings":
        return "Settings";
      default:
        return "HireMate";
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full glass-nav bg-white/80 dark:bg-slate-950/75 flex items-center justify-between px-6">
      {/* Mobile toggle & title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900 md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-md font-bold text-slate-800 dark:text-slate-100 display-font">
          {getPageTitle()}
        </h1>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-3">
        {/* Mock Notification Bell */}
        <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-950" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
};
