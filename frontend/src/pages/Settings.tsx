import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Settings as SettingsIcon, Save, Trash2, Eye, ShieldAlert, Bell, Languages } from "lucide-react";

import { getSettings, updateSettings, deleteAccount } from "../services/settingsService";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Select } from "../components/Select";
import { Modal } from "../components/Modal";

const settingsSchema = z.object({
  theme: z.string(),
  email_notifications: z.boolean(),
  push_notifications: z.boolean(),
  language: z.string(),
  privacy_profile_public: z.boolean(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export const Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { theme: contextTheme, setTheme: setContextTheme } = useTheme();
  const { logout } = useAuth();
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema) as any,
  });

  const activeTheme = watch("theme");

  // Sync settings when fetched
  useEffect(() => {
    if (settings) {
      reset({
        theme: settings.theme || "dark",
        email_notifications: settings.email_notifications ?? true,
        push_notifications: settings.push_notifications ?? true,
        language: settings.language || "en",
        privacy_profile_public: settings.privacy_profile_public ?? false,
      });
    }
  }, [settings, reset]);

  // Adjust local theme context on watch theme field update
  useEffect(() => {
    if (activeTheme && (activeTheme === "light" || activeTheme === "dark")) {
      if (contextTheme !== activeTheme) {
        setContextTheme(activeTheme);
      }
    }
  }, [activeTheme, contextTheme, setContextTheme]);

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: (data: SettingsForm) => updateSettings(data),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["settings"], updatedData);
      showToast("App settings saved successfully!", "success");
    },
    onError: (_err: any) => {
      showToast("Failed to update application preferences.", "error");
    },
  });

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      showToast("Your account has been deleted successfully. Farewell!", "info");
      setIsDeleteOpen(false);
      // Log out user locally to clear token
      logout();
    },
    onError: (_err: any) => {
      showToast("Could not complete account deletion.", "error");
      setIsDeleting(false);
    },
  });

  const onSubmit = (values: SettingsForm) => {
    updateMutation.mutate(values);
  };

  const handleAccountDelete = () => {
    if (deleteInput !== "DELETE") {
      showToast("Please type 'DELETE' to confirm.", "error");
      return;
    }
    setIsDeleting(true);
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-slate-200 dark:bg-slate-900 rounded-2xl animate-pulse shimmer-effect" />
        <div className="h-32 bg-slate-200 dark:bg-slate-900 rounded-2xl animate-pulse shimmer-effect" />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <Card className="border-rose-500/20 bg-rose-500/5 text-center py-8">
        <h2 className="text-lg font-bold text-rose-800 dark:text-rose-400">Failed to load app settings</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings form container */}
      <Card animate={true}>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <SettingsIcon className="w-4.5 h-4.5 text-brand-500" />
            General Settings
          </h3>
          <Button onClick={handleSubmit(onSubmit)} isLoading={updateMutation.isPending} size="sm" leftIcon={<Save className="w-4 h-4" />}>
            Save Settings
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          {/* Appearance (Theme) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              Appearance
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Dark Theme Button */}
              <button
                type="button"
                onClick={() => setValue("theme", "dark")}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                  activeTheme === "dark"
                    ? "border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-transparent text-slate-500 dark:text-slate-400"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                  {activeTheme === "dark" && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                </div>
                <span className="text-sm font-bold">Dark Mode</span>
              </button>

              {/* Light Theme Button */}
              <button
                type="button"
                onClick={() => setValue("theme", "light")}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                  activeTheme === "light"
                    ? "border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-transparent text-slate-500 dark:text-slate-400"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                  {activeTheme === "light" && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                </div>
                <span className="text-sm font-bold">Light Mode</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/40 my-4" />

          {/* Notifications config */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-slate-400" /> Notifications
            </h4>
            <div className="space-y-3.5">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Notifications</p>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Receive job matches, messages, and profile summaries via email.</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-800 text-brand-600 focus:ring-brand-500"
                  {...register("email_notifications")}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Push Notifications</p>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Receive instant matching dashboard status changes in browser alerts.</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-800 text-brand-600 focus:ring-brand-500"
                  {...register("push_notifications")}
                />
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/40 my-4" />

          {/* Language selection */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-slate-400" /> Regionalization
            </h4>
            <Select
              label="Interface Language"
              containerClassName="max-w-xs"
              {...register("language")}
            >
              <option value="en">English (US)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
            </Select>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/40 my-4" />

          {/* Privacy visibility config */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" /> Privacy
            </h4>
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Public Profile Visibility</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Allow hiring recruiters and external companies to view your summary.</p>
              </div>
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-800 text-brand-600 focus:ring-brand-500"
                {...register("privacy_profile_public")}
              />
            </label>
          </div>
        </form>
      </Card>

      {/* Dangerous/Account removal zone */}
      <Card className="border-rose-500/20 bg-rose-500/5" animate={true}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-400 flex items-center gap-2 display-font">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Danger Zone
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Deleting your account is permanent. All your resumes, profile data, preferences, and logs will be deleted.
            </p>
          </div>
          <Button
            type="button"
            variant="danger"
            onClick={() => setIsDeleteOpen(true)}
            leftIcon={<Trash2 className="w-4.5 h-4.5" />}
          >
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteInput("");
        }}
        title="Confirm Account Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            This action is irreversible. All of your profile files and settings will be wiped out of the servers database instantly.
          </p>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
              Type the word <span className="underline select-all">DELETE</span> below to authorize:
            </p>
          </div>
          <input
            type="text"
            className="w-full py-2.5 px-4 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 rounded-xl bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-50 focus:outline-none"
            placeholder="Type 'DELETE' here"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
          />
          <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteInput("");
              }}
            >
              Go Back
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleAccountDelete}
              disabled={deleteInput !== "DELETE"}
            >
              Permanently Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
