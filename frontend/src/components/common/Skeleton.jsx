import React from 'react';

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-200 rounded"></div>
            <div className="h-3 w-16 bg-slate-100 rounded"></div>
          </div>
        </div>
        <div className="w-16 h-6 rounded-full bg-slate-200"></div>
      </div>
      <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
      <div className="h-3 w-full bg-slate-100 rounded"></div>
      <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      <div className="h-6 w-32 bg-slate-200 rounded"></div>
      <div className="h-8 w-2/3 bg-slate-300 rounded"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 bg-slate-200 rounded-2xl"></div>
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-slate-200 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse">
      <div className="h-8 bg-slate-100 rounded"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-50 rounded flex items-center gap-4 px-4">
          <div className="w-10 h-6 bg-slate-200 rounded"></div>
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-24 bg-slate-100 rounded ml-auto"></div>
        </div>
      ))}
    </div>
  );
}
