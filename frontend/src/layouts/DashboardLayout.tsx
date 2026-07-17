import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { SkeletonLoader } from "../components/SkeletonLoader";

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show a full page skeleton loader during auth initialize check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-8 gap-4">
        <SkeletonLoader variant="card" className="max-w-md w-full" />
      </div>
    );
  }

  // Redirect to login if user session does not exist
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50 flex transition-colors duration-200 overflow-x-hidden">
      {/* Sleek Gradient Background Blobs for Linear SaaS effect */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="fixed top-1/2 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none select-none" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:pl-64 min-h-screen relative z-10">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
