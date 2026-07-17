import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  User,
  Target,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Bookmark,
  Briefcase,
  AlertCircle,
} from "lucide-react";

import { getDashboard } from "../services/dashboardService";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { SkeletonLoader } from "../components/SkeletonLoader";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Banner Skeleton */}
        <div className="h-40 bg-slate-200 dark:bg-slate-900 rounded-2xl animate-pulse shimmer-effect" />
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
        </div>
        {/* Row 2 Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader variant="card" className="lg:col-span-2" />
          <SkeletonLoader variant="card" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-rose-500/20 bg-rose-500/5 text-center py-8">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-rose-800 dark:text-rose-400">Failed to load dashboard data</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Please check that your backend server is running and database is fully seeded.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
          Retry Connection
        </Button>
      </Card>
    );
  }

  const { stats, recent_activities, saved_jobs, applications, ai_insights, profile_completion } = data;

  const quickActions = [
    { label: "Edit Profile", icon: User, path: "/profile", desc: "Update experience & skills" },
    { label: "Upload Resume", icon: FileText, path: "/resume", desc: "Keep documents updated" },
    { label: "Set Job Goals", icon: Target, path: "/preferences", desc: "Industry & location limits" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-6 md:p-8 shadow-lg shadow-brand-950/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none select-none" />
        
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 1 Live
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight display-font">
            Welcome to your Career Command Center
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-medium">
            Manage your profiles, resume versions, and application metrics seamlessly. Future AI features will plug directly in here.
          </p>
        </div>
      </div>

      {/* 2. STATS GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex flex-col justify-between py-5" glow animate={false}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Completion</span>
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500"><User className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold mt-2 display-font">{stats.profile_completion}</p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-brand-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${profile_completion}%` }}
            />
          </div>
        </Card>

        <Card className="flex flex-col justify-between py-5" glow animate={false}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resume Status</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><FileText className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold mt-2 display-font">{stats.resume_status}</p>
          </div>
          <button 
            onClick={() => navigate("/resume")}
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-4 hover:underline"
          >
            Manage resumes <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        <Card className="flex flex-col justify-between py-5" glow animate={false}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tracked Applications</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Briefcase className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold mt-2 display-font">{stats.applications_count}</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold mt-4 block">1 Active interviewing round</span>
        </Card>

        <Card className="flex flex-col justify-between py-5" glow animate={false}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved Jobs</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><Bookmark className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold mt-2 display-font">{stats.saved_jobs_count}</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold mt-4 block">Ready for match check</span>
        </Card>
      </div>

      {/* 3. ROW SECTION: INSIGHTS & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card className="flex flex-col justify-between h-full" animate={false}>
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-brand-500" />
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 hover:border-brand-500/20 hover:bg-slate-50 dark:border-slate-800/40 dark:hover:bg-slate-900/40 hover:shadow-sm text-left transition-all duration-150 group"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 group-hover:text-brand-500 group-hover:bg-brand-500/5 transition-colors">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{action.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{action.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* AI Insight Placeholders */}
        <Card className="lg:col-span-2" animate={false}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
            <Sparkles className="w-4.5 h-4.5 text-brand-500" />
            AI Career Insights (Placeholder)
          </h3>
          <div className="flex flex-col gap-3">
            {ai_insights.map((insight: any) => (
              <div 
                key={insight.id}
                className={`flex gap-3 p-3.5 rounded-xl border text-sm font-medium ${
                  insight.type === "warning"
                    ? "bg-rose-500/5 border-rose-500/10 text-rose-800 dark:text-rose-300"
                    : insight.type === "tip"
                    ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                    : "bg-blue-500/5 border-blue-500/10 text-blue-800 dark:text-blue-300"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <AlertCircle className={`w-4 h-4 ${
                    insight.type === "warning" ? "text-rose-500" : insight.type === "tip" ? "text-emerald-500" : "text-blue-500"
                  }`} />
                </div>
                <div className="flex-grow">
                  <span className="font-bold uppercase tracking-wider text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded mr-2">
                    {insight.field}
                  </span>
                  {insight.message}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. TRACKERS: JOBS & APPLICATIONS & LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activities */}
        <Card className="h-full" animate={false}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
            <Clock className="w-4.5 h-4.5 text-slate-400" />
            Recent Activity
          </h3>
          <div className="flex flex-col gap-4">
            {recent_activities.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400 font-medium">
                No recent activity recorded.
              </div>
            ) : (
              recent_activities.map((act: any) => (
                <div key={act.id} className="flex gap-3 text-xs leading-relaxed">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-1 ring-4 ring-brand-500/15" />
                    <div className="w-0.5 flex-grow bg-slate-100 dark:bg-slate-800/80 my-1 min-h-[20px]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{act.action}</p>
                    <p className="text-slate-400 font-medium">{act.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                      {new Date(act.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Saved Jobs & Applications placeholder tables */}
        <Card className="lg:col-span-2" animate={false}>
          <div className="border-b border-slate-100 dark:border-slate-800/50 pb-3 mb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-slate-400" />
              Applications & Saved Jobs (Placeholders)
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Job Application Tracker
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/60 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2 font-bold">Company</th>
                      <th className="py-2 font-bold">Role</th>
                      <th className="py-2 font-bold">Applied Date</th>
                      <th className="py-2 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/40 dark:divide-slate-800/20 font-medium text-slate-600 dark:text-slate-300">
                    {applications.map((app: any) => (
                      <tr key={app.id}>
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">{app.company}</td>
                        <td className="py-2.5">{app.title}</td>
                        <td className="py-2.5">{app.applied_date}</td>
                        <td className="py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === "Interviewing"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                              : app.status === "Applied"
                              ? "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Saved Jobs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {saved_jobs.slice(0, 4).map((job: any) => (
                  <div key={job.id} className="p-3 border border-slate-100 dark:border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-700/60 transition-all">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-100">{job.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{job.posted}</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mt-0.5">{job.company} • {job.location}</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 border-t border-slate-100 dark:border-slate-800/40 pt-2 text-[10px] font-bold text-brand-500">
                      <span>{job.salary}</span>
                      <button className="hover:underline flex items-center gap-0.5">Apply <ArrowRight className="w-2.5 h-2.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
