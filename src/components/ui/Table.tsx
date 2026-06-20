/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export function Table({
  children,
  className = "",
  id,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto border border-slate-200/60 rounded-2xl shadow-xs bg-white">
      <table id={id} className={`w-full text-left border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-slate-50/70 border-b border-slate-100 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y divide-slate-100 ${className}`} {...props}>{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`hover:bg-slate-50/70 transition-colors duration-150 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-6 py-4 text-sm text-slate-700 ${className}`} {...props}>
      {children}
    </td>
  );
}
