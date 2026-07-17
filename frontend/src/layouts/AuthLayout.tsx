import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase } from "lucide-react";

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-8">
        <div className="w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Lock authenticated users from returning to login/register
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-center items-center relative overflow-hidden px-4">
      {/* Sleek aesthetic grid & spots */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        {/* App Logo branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/20 mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-50 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent display-font">
            HireMate
          </h2>
          <p className="text-sm font-semibold text-slate-400 mt-1">Your Career Journey, Elevated.</p>
        </div>

        {/* Content Outlet */}
        <Outlet />
      </div>
    </div>
  );
};
