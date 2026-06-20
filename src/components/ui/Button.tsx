/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  title?: string;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled = false,
  title,
}: ButtonProps) {
  let baseStyle = "font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95 disabled:opacity-55 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 text-sm";
  
  let variantStyle = "";
  if (variant === "primary") {
    variantStyle = "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/10 hover:shadow-md hover:shadow-indigo-600/20";
  } else if (variant === "secondary") {
    variantStyle = "bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100/80";
  } else if (variant === "outline") {
    variantStyle = "border border-slate-200 text-slate-705 hover:bg-slate-50 hover:text-slate-900";
  } else if (variant === "danger") {
    variantStyle = "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/10 hover:shadow-md";
  } else if (variant === "ghost") {
    variantStyle = "text-slate-600 hover:bg-slate-50";
  }

  return (
    <button
      type={type}
      className={`${baseStyle} ${variantStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
