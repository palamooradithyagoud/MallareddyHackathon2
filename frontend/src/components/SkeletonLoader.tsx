import React from "react";

interface SkeletonLoaderProps {
  variant?: "card" | "list" | "avatar" | "text" | "table";
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "text",
  count = 1,
  className = "",
}) => {
  const baseClasses = "bg-slate-200 dark:bg-slate-800 rounded relative overflow-hidden shimmer-effect";

  if (variant === "avatar") {
    return <div className={`${baseClasses} rounded-full ${className}`} />;
  }

  if (variant === "card") {
    return (
      <div className={`glass-panel border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 flex flex-col gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className={`${baseClasses} w-12 h-12 rounded-full`} />
          <div className="flex flex-col gap-2 flex-grow">
            <div className={`${baseClasses} w-1/3 h-4`} />
            <div className={`${baseClasses} w-1/4 h-3`} />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className={`${baseClasses} w-full h-3`} />
          <div className={`${baseClasses} w-5/6 h-3`} />
          <div className={`${baseClasses} w-2/3 h-3`} />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`w-full flex flex-col gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex justify-between items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800/40">
            <div className={`${baseClasses} w-1/3 h-4`} />
            <div className={`${baseClasses} w-1/4 h-4`} />
            <div className={`${baseClasses} w-16 h-6 rounded-full`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`flex flex-col gap-3 w-full ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={`${baseClasses} w-2.5 h-2.5 rounded-full flex-shrink-0`} />
            <div className="flex flex-col gap-1.5 flex-grow">
              <div className={`${baseClasses} w-1/2 h-3.5`} />
              <div className={`${baseClasses} w-3/4 h-2.5`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`${baseClasses} h-3.5 w-full`} />
      ))}
    </div>
  );
};
