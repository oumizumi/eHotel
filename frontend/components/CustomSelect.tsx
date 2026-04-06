"use client";

import { useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface Props {
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "tight";
}

export function CustomSelect({
  value, onChange, options, placeholder = "Select...",
  className = "", disabled = false, variant = "default",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find((o) => String(o.value) === String(value));
  const py = variant === "tight" ? "py-2" : "py-2.5";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`w-full flex items-center justify-between border border-moss-200 rounded-lg px-3 ${py} text-sm bg-white focus:outline-none focus:ring-2 focus:ring-moss-300 focus:border-transparent disabled:bg-moss-50 disabled:cursor-not-allowed transition-colors`}
      >
        <span className={selected ? "text-moss-900" : "text-moss-500"}>
          {selected?.label ?? placeholder}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-moss-400 shrink-0 transition-transform duration-150 ml-2 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-moss-200 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-56 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => { onChange(String(opt.value)); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "bg-moss-800 text-white"
                      : "text-moss-800 hover:bg-moss-800 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
