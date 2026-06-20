/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "purple" | "default";
  children?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  let styleClasses = "px-3 py-1 text-xs font-semibold rounded-full tracking-wide inline-flex items-center gap-1.5 w-fit border-2";

  if (variant === "success") {
    // Green (completed, score >80%)
    styleClasses += " bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (variant === "warning") {
    // Yellow (60-80%, in-progress)
    styleClasses += " bg-amber-50 text-amber-700 border-amber-200";
  } else if (variant === "danger") {
    // Red (<60%, incorrect)
    styleClasses += " bg-rose-50 text-rose-700 border-rose-200";
  } else if (variant === "info") {
    // Blue (All/general info)
    styleClasses += " bg-blue-50 text-blue-700 border-blue-200";
  } else if (variant === "purple") {
    // Purple accent (New test)
    styleClasses += " bg-purple-100 text-indigo-700 border-purple-200";
  } else {
    // Default
    styleClasses += " bg-slate-50 text-slate-700 border-slate-200";
  }

  return (
    <span className={`${styleClasses} ${className}`}>
      {children}
    </span>
  );
}
