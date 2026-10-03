import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

export default function EmptyState({
  icon: Icon = SearchX,
  title = "No services found",
  description = "We couldn't find any services matching your criteria. Try adjusting your search query or reset your active filters.",
  actionLabel = "Reset Filters",
  onAction
}) {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-500 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-teal-400" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
