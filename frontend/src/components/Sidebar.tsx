import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, FileText, Target, Settings, LogOut, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Resume", path: "/resume", icon: FileText },
    { name: "Preferences", path: "/preferences", icon: Target },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 dark:bg-slate-950/60 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 glass-sidebar bg-white dark:bg-slate-950 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-grow">
          {/* Logo Section */}
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100 dark:border-slate-800/40">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-200 bg-clip-text text-transparent display-font">
              HireMate
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow py-6 px-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                    isActive
                      ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/60"
                  }`
                }
              >
                {({ isActive }) => {
                  const Icon = item.icon;
                  return (
                    <>
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? "text-brand-600 dark:text-brand-400"
                            : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                        }`}
                      />
                      {item.name}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/40 flex flex-col gap-2">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400 text-sm">
                {user.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden flex-grow">
                <p className="text-xs font-semibold text-slate-400 truncate">Account</p>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{user.email}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
