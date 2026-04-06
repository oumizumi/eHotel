"use client";

import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface CrudTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
}

export function CrudTable<T>({
  columns, data, keyField, onEdit, onDelete, loading,
}: CrudTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-moss-100 p-12 text-center">
        <p className="text-sm text-moss-400">No records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-moss-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-moss-100 bg-moss-25">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 text-xs font-semibold text-moss-600 uppercase tracking-widest"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-moss-600 uppercase tracking-widest">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-moss-50">
            {data.map((row) => (
              <tr key={String(row[keyField])} className="hover:bg-moss-25 transition-colors group">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-sm font-medium text-moss-800">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "—")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-moss-800 text-moss-800 hover:bg-moss-800 hover:text-white transition-colors duration-150"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-150"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Spinner({ size = "md" }: { size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-5 h-5 border-2" : "w-8 h-8 border-[3px]";
  return (
    <div className={`${s} border-moss-100 border-t-moss-800 rounded-full animate-spin`} />
  );
}
