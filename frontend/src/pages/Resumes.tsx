import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Upload,
  Trash2,
  Calendar,
  Layers,
  Eye,
  HardDrive,
  Download,
  Loader2,
} from "lucide-react";

import {
  getResume,
  uploadResume,
  deleteResume,
  getResumeBlobUrl,
  getResumeVersionBlobUrl,
} from "../services/resumeService";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export const Resumes: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch current resume details
  const { data: resume } = useQuery({
    queryKey: ["resume"],
    queryFn: getResume,
    retry: false, // Don't retry if 404
  });

  // Fetch and cache the active PDF blob URL whenever the resume changes
  useEffect(() => {
    const fetchBlob = async () => {
      if (resume) {
        setIsPreviewLoading(true);
        try {
          const url = await getResumeBlobUrl();
          setPreviewUrl(url);
          setSelectedVersionId(null); // Reset version selection to current
        } catch (err) {
          showToast("Failed to render PDF preview.", "error");
        } finally {
          setIsPreviewLoading(false);
        }
      } else {
        setPreviewUrl(null);
      }
    };
    fetchBlob();

    // Cleanup object URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [resume]);

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadResume(file),
    onSuccess: (newData) => {
      queryClient.setQueryData(["resume"], newData);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast(`Resume uploaded successfully!`, "success");
      setIsUploading(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || "Upload failed. Enforce 5MB limit and PDF types.";
      showToast(msg, "error");
      setIsUploading(false);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.setQueryData(["resume"], null);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setPreviewUrl(null);
      setSelectedVersionId(null);
      showToast("Resume deleted successfully.", "info");
    },
    onError: (_err: any) => {
      showToast("Failed to delete resume.", "error");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Perform frontend validation first
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        showToast("Only PDF files are supported.", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size exceeds 5MB.", "error");
        return;
      }

      setIsUploading(true);
      uploadMutation.mutate(file);
    }
  };

  const selectVersion = async (versionId: string) => {
    setIsPreviewLoading(true);
    setSelectedVersionId(versionId);
    try {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = await getResumeVersionBlobUrl(versionId);
      setPreviewUrl(url);
    } catch (err) {
      showToast("Could not retrieve version copy.", "error");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const loadCurrentPreview = async () => {
    if (!resume) return;
    setIsPreviewLoading(true);
    setSelectedVersionId(null);
    try {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = await getResumeBlobUrl();
      setPreviewUrl(url);
    } catch (err) {
      showToast("Failed to fetch resume file.", "error");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isResumeAvailable = !!resume;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      {/* LEFT COLUMN: UPLOADER & VERSIONS */}
      <div className="lg:col-span-2 space-y-6 flex flex-col justify-start">
        {/* Upload card */}
        <Card className="flex flex-col gap-4 text-center" animate={false}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 text-left border-b border-slate-100 dark:border-slate-800/60 pb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Resume Manager
          </h3>

          {!isResumeAvailable ? (
            /* Empty upload state */
            <div
              onClick={triggerUploadClick}
              className="border-2 border-dashed border-slate-200 hover:border-brand-500/50 dark:border-slate-800/80 dark:hover:border-brand-500/50 rounded-2xl p-8 cursor-pointer flex flex-col items-center gap-3 transition-colors group bg-slate-50/20 dark:bg-slate-900/10"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-500/5 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload your Resume</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">PDF format up to 5MB</p>
              </div>
              {isUploading && (
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading file...
                </div>
              )}
            </div>
          ) : (
            /* Active resume status */
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3 p-3.5 border border-slate-100 dark:border-slate-800/60 rounded-2xl bg-slate-50/30 dark:bg-slate-900/20">
                <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="overflow-hidden flex-grow">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate" title={resume.name}>
                    {resume.name}
                  </h4>
                  <div className="flex flex-col gap-1.5 mt-2 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" /> {formatBytes(resume.file_size)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(resume.updated_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  onClick={triggerUploadClick}
                  variant="outline"
                  size="sm"
                  isLoading={isUploading}
                  leftIcon={<Upload className="w-4 h-4" />}
                >
                  Replace
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate()}
                  variant="danger"
                  size="sm"
                  isLoading={deleteMutation.isPending}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Versions card */}
        {isResumeAvailable && resume.versions && resume.versions.length > 0 && (
          <Card className="flex-grow" animate={false}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Version History ({resume.versions.length})
            </h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {/* Active current option */}
              <button
                onClick={loadCurrentPreview}
                className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all ${
                  selectedVersionId === null
                    ? "bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400"
                    : "border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                }`}
              >
                <div>
                  <p className="text-xs font-bold flex items-center gap-1.5">
                    Current Version (v{resume.versions.length})
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Active file details</p>
                </div>
                <Eye className="w-4 h-4 opacity-60" />
              </button>

              {/* Version History Rows */}
              {resume.versions.map((ver) => {
                // If it is the current highest version, we can skip or highlight it
                const isCurrent = ver.version === resume.versions.length;
                if (isCurrent) return null;

                return (
                  <button
                    key={ver.id}
                    onClick={() => selectVersion(ver.id)}
                    className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all ${
                      selectedVersionId === ver.id
                        ? "bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400"
                        : "border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">Version v{ver.version}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        {formatDate(ver.created_at)} • {formatBytes(ver.file_size)}
                      </p>
                    </div>
                    <Eye className="w-4 h-4 opacity-60" />
                  </button>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* RIGHT COLUMN: PREVIEW PANEL */}
      <div className="lg:col-span-3 min-h-[500px] h-[75vh] flex">
        {previewUrl ? (
          <Card className="w-full h-full flex flex-col p-0 overflow-hidden relative" animate={false}>
            {/* Preview Toolbar */}
            <div className="h-12 border-b border-slate-100 dark:border-slate-800/60 px-4 flex items-center justify-between bg-slate-50/40 dark:bg-slate-900/20">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-brand-500" />
                {selectedVersionId ? `Historical PDF Version` : "Current PDF Live"}
              </span>
              <a
                href={previewUrl}
                download={resume ? (selectedVersionId ? `resume_v_snapshot.pdf` : resume.name) : "resume.pdf"}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>

            {/* Preview Frame */}
            <div className="flex-grow relative">
              {isPreviewLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-slate-950/70 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                    <span className="text-xs font-bold text-slate-400">Loading document...</span>
                  </div>
                </div>
              )}
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Resume Preview"
              />
            </div>
          </Card>
        ) : (
          <Card className="w-full h-full flex flex-col justify-center items-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white/10" animate={false}>
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900/65 flex items-center justify-center text-slate-400 mb-4 animate-pulse-slow">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 display-font">
              No Document Active
            </h3>
            <p className="text-sm text-slate-400 font-semibold mt-1 max-w-sm">
              Upload your career resume on the left to activate the live document reader and view version comparisons.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
