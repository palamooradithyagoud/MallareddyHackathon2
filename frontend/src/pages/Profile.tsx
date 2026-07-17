import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Link as LinkIcon,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

import { getProfile, updateProfile } from "../services/profileService";
import type { ProfileData } from "../services/profileService";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { SkeletonLoader } from "../components/SkeletonLoader";

// Form Validation Schema
const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
});

const certificationSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  year: z.coerce.number().min(1950, "Invalid year").max(new Date().getFullYear() + 5),
});

const profileFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone_number: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  college: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  graduation_year: z.coerce.number().optional().nullable(),
  cgpa: z.coerce.number().min(0, "CGPA must be positive").max(10, "CGPA limit is 10").optional().nullable(),
  skills: z.string().optional().nullable(),
  experience: z.array(experienceSchema),
  certifications: z.array(certificationSchema),
  linkedin_url: z.string().url("Invalid URL").or(z.literal("")).optional().nullable(),
  github_url: z.string().url("Invalid URL").or(z.literal("")).optional().nullable(),
  portfolio_url: z.string().url("Invalid URL").or(z.literal("")).optional().nullable(),
  about_me: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "experience" | "certifications" | "links">("personal");

  // Fetch current Profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema) as any,
    defaultValues: {
      full_name: "",
      experience: [],
      certifications: [],
    },
  });

  // Manage dynamic arrays for experiences and certifications
  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  // Sync profile details to Form on mount / load
  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        location: profile.location || "",
        college: profile.college || "",
        degree: profile.degree || "",
        graduation_year: profile.graduation_year || undefined,
        cgpa: profile.cgpa || undefined,
        skills: profile.skills || "",
        experience: profile.experience || [],
        certifications: profile.certifications || [],
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        portfolio_url: profile.portfolio_url || "",
        about_me: profile.about_me || "",
      });
    }
  }, [profile, reset]);

  // Mutation to update profile
  const updateMutation = useMutation({
    mutationFn: (data: ProfileData) => updateProfile(data),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["profile"], updatedData);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || "Failed to update profile details.";
      showToast(msg, "error");
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    // Sanitize dates and nulls
    const sanitized = {
      ...values,
      date_of_birth: values.date_of_birth === "" ? null : values.date_of_birth,
      linkedin_url: values.linkedin_url === "" ? null : values.linkedin_url,
      github_url: values.github_url === "" ? null : values.github_url,
      portfolio_url: values.portfolio_url === "" ? null : values.portfolio_url,
    };
    updateMutation.mutate(sanitized as ProfileData);
  };

  const cancelEdit = () => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        location: profile.location || "",
        college: profile.college || "",
        degree: profile.degree || "",
        graduation_year: profile.graduation_year || undefined,
        cgpa: profile.cgpa || undefined,
        skills: profile.skills || "",
        experience: profile.experience || [],
        certifications: profile.certifications || [],
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        portfolio_url: profile.portfolio_url || "",
        about_me: profile.about_me || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-slate-200 dark:bg-slate-900 rounded-2xl animate-pulse shimmer-effect" />
        <SkeletonLoader variant="card" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Card className="border-rose-500/20 bg-rose-500/5 text-center py-8">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-rose-800 dark:text-rose-400">Failed to load profile details</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "academic", label: "Academics", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "certifications", label: "Certificates", icon: Award },
    { id: "links", label: "Socials & About", icon: LinkIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Widget */}
      <div className="glass-panel border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400 text-xl border border-brand-500/25">
            {profile.full_name ? profile.full_name[0].toUpperCase() : "?"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 display-font">
              {profile.full_name || "Anonymous User"}
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              Profile completion level: <span className="text-brand-500">{profile.completion_percentage}%</span>
            </p>
          </div>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} leftIcon={<Edit2 className="w-4 h-4" />}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={cancelEdit} variant="outline" leftIcon={<X className="w-4 h-4" />}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={updateMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 p-1 bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl md:h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors select-none ${
                  activeTab === tab.id
                    ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Detail Forms */}
        <Card className="md:col-span-3 h-full" animate={false}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. PERSONAL DETAILS TAB */}
            {activeTab === "personal" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 display-font border-b border-slate-100 dark:border-slate-800/50 pb-2">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    disabled={!isEditing}
                    error={errors.full_name?.message}
                    {...register("full_name")}
                  />
                  <Input
                    label="Phone Number"
                    disabled={!isEditing}
                    error={errors.phone_number?.message}
                    {...register("phone_number")}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    disabled={!isEditing}
                    error={errors.date_of_birth?.message}
                    {...register("date_of_birth")}
                  />
                  <Select
                    label="Gender"
                    disabled={!isEditing}
                    error={errors.gender?.message}
                    {...register("gender")}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </Select>
                  <Input
                    label="Location"
                    placeholder="e.g. San Francisco, CA"
                    disabled={!isEditing}
                    error={errors.location?.message}
                    containerClassName="sm:col-span-2"
                    {...register("location")}
                  />
                </div>
              </div>
            )}

            {/* 2. ACADEMIC DETAILS TAB */}
            {activeTab === "academic" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 display-font border-b border-slate-100 dark:border-slate-800/50 pb-2">
                  Academic Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="College / University"
                    placeholder="e.g. Stanford University"
                    disabled={!isEditing}
                    error={errors.college?.message}
                    containerClassName="sm:col-span-2"
                    {...register("college")}
                  />
                  <Input
                    label="Degree"
                    placeholder="e.g. B.S. Computer Science"
                    disabled={!isEditing}
                    error={errors.degree?.message}
                    {...register("degree")}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Graduation Year"
                      type="number"
                      placeholder="e.g. 2024"
                      disabled={!isEditing}
                      error={errors.graduation_year?.message}
                      {...register("graduation_year")}
                    />
                    <Input
                      label="CGPA"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 3.85"
                      disabled={!isEditing}
                      error={errors.cgpa?.message}
                      {...register("cgpa")}
                    />
                  </div>
                  <Input
                    label="Skills Keywords (Comma-separated)"
                    placeholder="React, TypeScript, Python, FastAPI"
                    disabled={!isEditing}
                    error={errors.skills?.message}
                    containerClassName="sm:col-span-2"
                    {...register("skills")}
                  />
                </div>
              </div>
            )}

            {/* 3. EXPERIENCE TAB */}
            {activeTab === "experience" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 display-font">
                    Professional Experience
                  </h3>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendExp({ company: "", role: "", duration: "", description: "" })}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add Role
                    </Button>
                  )}
                </div>

                {expFields.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-400 font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    No professional experience listed. Click 'Add Role' above.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {expFields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="relative p-4 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-3 bg-slate-50/40 dark:bg-slate-900/30"
                      >
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeExp(idx)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                          <Input
                            label="Company Name"
                            disabled={!isEditing}
                            error={errors.experience?.[idx]?.company?.message}
                            {...register(`experience.${idx}.company` as const)}
                          />
                          <Input
                            label="Role Title"
                            disabled={!isEditing}
                            error={errors.experience?.[idx]?.role?.message}
                            {...register(`experience.${idx}.role` as const)}
                          />
                          <Input
                            label="Duration (e.g., Jun 2023 - Present)"
                            disabled={!isEditing}
                            error={errors.experience?.[idx]?.duration?.message}
                            {...register(`experience.${idx}.duration` as const)}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Description
                          </label>
                          <textarea
                            disabled={!isEditing}
                            rows={3}
                            className="w-full py-2 px-3 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-medium rounded-xl bg-transparent focus:outline-none disabled:opacity-50"
                            {...register(`experience.${idx}.description` as const)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. CERTIFICATIONS TAB */}
            {activeTab === "certifications" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 display-font">
                    Certifications & Achievements
                  </h3>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendCert({ name: "", issuer: "", year: new Date().getFullYear() })}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add Certificate
                    </Button>
                  )}
                </div>

                {certFields.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-400 font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    No certifications listed yet. Click 'Add Certificate' above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certFields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="relative p-4 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-3 bg-slate-50/40 dark:bg-slate-900/30"
                      >
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeCert(idx)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <Input
                          label="Certificate Name"
                          disabled={!isEditing}
                          error={errors.certifications?.[idx]?.name?.message}
                          {...register(`certifications.${idx}.name` as const)}
                        />
                        <Input
                          label="Issuer"
                          disabled={!isEditing}
                          error={errors.certifications?.[idx]?.issuer?.message}
                          {...register(`certifications.${idx}.issuer` as const)}
                        />
                        <Input
                          label="Year"
                          type="number"
                          disabled={!isEditing}
                          error={errors.certifications?.[idx]?.year?.message}
                          {...register(`certifications.${idx}.year` as const)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. LINKS & ABOUT TAB */}
            {activeTab === "links" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 display-font border-b border-slate-100 dark:border-slate-800/50 pb-2">
                  Social Links & Biography
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/username"
                      disabled={!isEditing}
                      error={errors.linkedin_url?.message}
                      {...register("linkedin_url")}
                    />
                    <Input
                      label="GitHub URL"
                      placeholder="https://github.com/username"
                      disabled={!isEditing}
                      error={errors.github_url?.message}
                      {...register("github_url")}
                    />
                    <Input
                      label="Portfolio URL"
                      placeholder="https://portfolio.dev"
                      disabled={!isEditing}
                      error={errors.portfolio_url?.message}
                      {...register("portfolio_url")}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      About Me / Cover Summary
                    </label>
                    <textarea
                      disabled={!isEditing}
                      rows={5}
                      className="w-full py-2.5 px-3 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-medium rounded-xl bg-transparent focus:outline-none disabled:opacity-50"
                      placeholder="Tell recruiters about yourself, career ambitions, and focus areas..."
                      {...register("about_me")}
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
