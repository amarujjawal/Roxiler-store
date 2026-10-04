import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DataTable({ columns, rows, emptyText = 'No records found', onRowClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/20">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              {columns.map((column) => {
                const isSorted = column.sortable && column.active;

                return (
                  <th
                    key={column.key}
                    className={[
                      'px-4 py-3 font-medium',
                      column.sortable ? 'cursor-pointer select-none' : '',
                    ].join(' ')}
                    onClick={column.sortable ? column.onSort : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {column.label}
                      {isSorted && (
                        column.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={row.id ?? index}
                  onClick={() => onRowClick?.(row)}
                  className="border-t border-white/5 transition duration-200 hover:border-teal-400/40 hover:bg-teal-500/5"
                >
                  {columns.map((column) => (
                    <td key={`${row.id ?? index}-${column.key}`} className="px-4 py-3 align-middle">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
