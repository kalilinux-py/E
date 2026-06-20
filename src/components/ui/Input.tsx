/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export interface InputProps {
  label?: string;
  error?: string;
  id?: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  type = "text",
  placeholder,
  maxLength,
  autoFocus,
  disabled,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`border border-slate-200 outline-none rounded-xl p-3 text-slate-800 transition-all duration-200 bg-white/70 backdrop-blur-xs focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/60 disabled:bg-slate-50 disabled:text-slate-400 text-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-150" : ""
        } ${className}`}
      />
      {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
    </div>
  );
}

export interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  options,
  error,
  className = "",
  id,
  value,
  onChange,
  disabled,
}: SelectProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border border-slate-200 outline-none rounded-xl p-3 text-slate-800 transition-all duration-200 bg-white/70 backdrop-blur-xs focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/60 disabled:bg-slate-50 disabled:text-slate-400 text-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-150" : ""
        } ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
    </div>
  );
}
