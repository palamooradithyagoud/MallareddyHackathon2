import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`w-full py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 bg-transparent text-slate-900 dark:text-slate-50
              ${leftIcon ? "pl-11" : "pl-4"}
              ${rightIcon ? "pr-11" : "pr-4"}
              ${
                error
                  ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-brand-500/20"
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";
