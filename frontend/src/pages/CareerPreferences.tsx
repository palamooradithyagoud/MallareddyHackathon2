import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Target, Save, Plus, X, AlertCircle } from "lucide-react";

import { getPreferences, updatePreferences } from "../services/preferencesService";
import type { CareerPreferencesData } from "../services/preferencesService";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";

const preferencesSchema = z.object({
  preferred_role: z.string().min(1, "Preferred role is required"),
  preferred_industry: z.string().min(1, "Preferred industry is required"),
  preferred_location: z.string().min(1, "Preferred location is required"),
  employment_type: z.string().min(1, "Employment type is required"),
  work_mode: z.string().min(1, "Work mode is required"),
  salary_expectation: z.coerce.number().min(0, "Salary must be a positive number"),
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

export const CareerPreferences: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ["preferences"],
    queryFn: getPreferences,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema) as any,
  });

  // Sync preference data on fetch load
  useEffect(() => {
    if (preferences) {
      reset({
        preferred_role: preferences.preferred_role || "",
        preferred_industry: preferences.preferred_industry || "",
        preferred_location: preferences.preferred_location || "",
        employment_type: preferences.employment_type || "Full-time",
        work_mode: preferences.work_mode || "Remote",
        salary_expectation: preferences.salary_expectation || 0,
      });
      setSkills(preferences.skills_interested_in || []);
    }
  }, [preferences, reset]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: CareerPreferencesData) => updatePreferences(data),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["preferences"], updatedData);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast("Career preferences updated successfully!", "success");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || "Failed to save preferences.";
      showToast(msg, "error");
    },
  });

  const onSubmit = (values: PreferencesForm) => {
    updateMutation.mutate({
      ...values,
      skills_interested_in: skills,
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !skills.includes(cleanSkill)) {
      setSkills((prev) => [...prev, cleanSkill]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-200 dark:bg-slate-900 rounded-2xl animate-pulse shimmer-effect" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2"><Card><div className="h-64 animate-pulse" /></Card></div>
          <div><Card><div className="h-64 animate-pulse" /></Card></div>
        </div>
      </div>
    );
  }

  if (error || !preferences) {
    return (
      <Card className="border-rose-500/20 bg-rose-500/5 text-center py-8">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-rose-800 dark:text-rose-400">Failed to load preferences</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Target fields config form */}
      <Card className="lg:col-span-2 h-fit" animate={true}>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Target className="w-4.5 h-4.5 text-brand-500" />
            Job Criteria
          </h3>
          <Button onClick={handleSubmit(onSubmit)} isLoading={updateMutation.isPending} size="sm" leftIcon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Preferred Role"
            placeholder="e.g. Full Stack Engineer"
            error={errors.preferred_role?.message}
            {...register("preferred_role")}
          />
          <Input
            label="Preferred Industry"
            placeholder="e.g. FinTech, Healthcare"
            error={errors.preferred_industry?.message}
            {...register("preferred_industry")}
          />
          <Input
            label="Preferred Location"
            placeholder="e.g. Remote, San Francisco, CA"
            error={errors.preferred_location?.message}
            {...register("preferred_location")}
          />
          <Input
            label="Yearly Salary Expectation ($)"
            type="number"
            placeholder="e.g. 120000"
            error={errors.salary_expectation?.message}
            {...register("salary_expectation")}
          />
          <Select
            label="Employment Type"
            error={errors.employment_type?.message}
            {...register("employment_type")}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </Select>
          <Select
            label="Work Mode"
            error={errors.work_mode?.message}
            {...register("work_mode")}
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </Select>
        </form>
      </Card>

      {/* Target Skills Chips management */}
      <Card className="h-fit" animate={true}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-5 flex items-center gap-2">
          Skills Interested In
        </h3>

        <div className="space-y-4">
          {/* Add skill row form */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Docker, Go, AWS"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const btn = document.getElementById("add-skill-btn");
                  btn?.click();
                }
              }}
            />
            <Button
              id="add-skill-btn"
              type="button"
              variant="secondary"
              onClick={handleAddSkill}
              className="flex-shrink-0"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          {/* Render Active Chips */}
          {skills.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 font-medium border-2 border-dashed border-slate-100 dark:border-slate-800/40 rounded-xl">
              No target skills defined.
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 rounded-full hover:bg-brand-500/20 text-brand-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
