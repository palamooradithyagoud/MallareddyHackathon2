import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      children,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId();

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full py-2.5 px-4 rounded-xl border font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 bg-transparent text-slate-900 dark:text-slate-50 dark:bg-slate-950
              ${
                error
                  ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-brand-500/20"
              }
              ${className}
            `}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-950">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
        </div>
        {error && (
          <span className="text-xs text-rose-500 dark:text-rose-400 font-medium select-none">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
