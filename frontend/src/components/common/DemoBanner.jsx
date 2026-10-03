import React, { useState } from 'react';
import { AlertCircle, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 whitespace-nowrap">
            CEP Mumbai University
          </span>
          <p className="truncate text-slate-300">
            <strong className="text-white font-medium">B.Sc. CS Semester V Community Engagement Project:</strong> Essential Services Directory. All pre-loaded records are labelled <span className="text-amber-400 font-mono font-semibold">[DEMO DATA]</span> prior to field survey ingestion.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/project-data"
            className="hidden sm:inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 transition underline underline-offset-2"
          >
            Survey Findings
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white transition rounded"
            title="Dismiss notice"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
