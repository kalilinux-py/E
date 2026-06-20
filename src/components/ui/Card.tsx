/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export interface CardProps {
  hoverable?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  key?: string | number;
}

export function Card({
  children,
  hoverable = false,
  className = "",
  onClick,
}: CardProps) {
  let baseStyle = "border border-slate-200/60 rounded-2xl shadow-sm bg-white overflow-hidden transition-all duration-300";
  let hoverStyle = hoverable
    ? "hover:-translate-y-1 hover:shadow-md hover:border-indigo-500/20 cursor-pointer"
    : "";

  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export interface CardChildProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  children,
  className = "",
}: CardChildProps) {
  return (
    <div
      className={`p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: CardChildProps) {
  return (
    <div className={`p-6 flex flex-col gap-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
}: CardChildProps) {
  return (
    <div className={`p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 ${className}`}>
      {children}
    </div>
  );
}
