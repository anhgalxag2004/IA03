import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded text-sm bg-white
            focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors
            ${error ? "border-red-400" : "border-gray-200"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
